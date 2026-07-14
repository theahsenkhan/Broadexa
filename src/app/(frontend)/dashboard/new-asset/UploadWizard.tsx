'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Opt = { id: string; name: string }

const GENRES = ['news', 'sports', 'weather', 'election', 'talk', 'other']
const STEPS = ['Basics', 'Pricing', 'Includes', 'Media', 'Review']

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function UploadWizard({ userId, engines, categories }: { userId: string; engines: Opt[]; categories: Opt[] }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0]?.id || '')
  const [engine, setEngine] = useState(engines[0]?.id || '')
  const [engineVersionBuilt, setEngineVersionBuilt] = useState('')
  const [engineVersionMin, setEngineVersionMin] = useState('')
  const [genre, setGenre] = useState<string[]>([])
  const [description, setDescription] = useState('')

  const [isFree, setIsFree] = useState(false)
  const [price, setPrice] = useState('')
  const [exclusiveAvailable, setExclusiveAvailable] = useState(false)
  const [exclusivePrice, setExclusivePrice] = useState('')

  const [includes, setIncludes] = useState<{ item: string; included: boolean }[]>([{ item: '', included: true }])
  const [editableNotes, setEditableNotes] = useState('')
  const [requirements, setRequirements] = useState('')
  const [trackingReady, setTrackingReady] = useState(false)
  const [fileSizeGB, setFileSizeGB] = useState('')

  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [previewVideoUrl, setPreviewVideoUrl] = useState('')
  const [onEngineRecordingUrl, setOnEngineRecordingUrl] = useState('')
  const [packageFile, setPackageFile] = useState<File | null>(null)

  function toggleGenre(g: string) {
    setGenre((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
  }

  function updateInclude(i: number, patch: Partial<{ item: string; included: boolean }>) {
    setIncludes((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)))
  }

  async function uploadGallery(): Promise<string[]> {
    const ids: string[] = []
    for (const file of galleryFiles) {
      const form = new FormData()
      form.append('file', file)
      form.append('alt', title || file.name)
      const res = await fetch('/api/media', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Image upload failed')
      ids.push(data.doc.id)
    }
    return ids
  }

  async function uploadPackage(): Promise<string | undefined> {
    if (!packageFile) return undefined
    const form = new FormData()
    form.append('file', packageFile)
    const res = await fetch('/api/asset-files', { method: 'POST', body: form })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Package upload failed')
    return data.doc.id
  }

  async function submit() {
    setError('')
    setSubmitting(true)
    try {
      if (!title.trim()) throw new Error('Title is required')
      if (!description.trim()) throw new Error('Description is required')
      if (!isFree && !price) throw new Error('Set a price, or mark this asset as free')

      const galleryIds = await uploadGallery()
      const fileId = await uploadPackage()

      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: `${slugify(title)}-${Date.now().toString(36)}`,
          designer: userId,
          category,
          engine,
          engineVersionBuilt,
          engineVersionMin,
          genre,
          description,
          isFree,
          price: isFree ? undefined : Number(price),
          exclusiveAvailable,
          exclusivePrice: exclusiveAvailable ? Number(exclusivePrice) : undefined,
          includes: includes.filter((i) => i.item.trim()),
          editableNotes,
          requirements,
          trackingReady,
          fileSizeGB: fileSizeGB ? Number(fileSizeGB) : undefined,
          gallery: galleryIds,
          previewVideoUrl,
          onEngineRecordingUrl,
          file: fileId,
          status: 'pending',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Could not create listing')

      router.push('/dashboard/assets')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const canNext = () => {
    if (step === 0) return title.trim() && category && engine && engineVersionBuilt.trim() && description.trim()
    if (step === 1) return isFree || Number(price) > 0
    return true
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="steps">
        {STEPS.map((_, i) => (
          <div key={i} className={`step ${i <= step ? 'done' : ''}`} />
        ))}
      </div>
      <div className="field-hint" style={{ marginBottom: 18 }}>Step {step + 1} of {STEPS.length}: {STEPS[step]}</div>

      {error && <div className="form-error">{error}</div>}

      {step === 0 && (
        <>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Evening News — Modular Set" />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Engine</label>
              <select value={engine} onChange={(e) => setEngine(e.target.value)}>
                {engines.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Built in (engine version)</label>
              <input value={engineVersionBuilt} onChange={(e) => setEngineVersionBuilt(e.target.value)} placeholder="e.g. 5.3" />
            </div>
            <div className="field">
              <label>Opens in (lowest version)</label>
              <input value={engineVersionMin} onChange={(e) => setEngineVersionMin(e.target.value)} placeholder="e.g. 5.1" />
            </div>
          </div>
          <div className="field">
            <label>Genre</label>
            <div className="filter-row">
              {GENRES.map((g) => (
                <button type="button" key={g} className={`chip-toggle ${genre.includes(g) ? 'active' : ''}`} onClick={() => toggleGenre(g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the scene, cameras, layers, and what it's built for." />
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="field">
            <label><input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} style={{ width: 'auto', marginRight: 8 }} />This asset is free</label>
          </div>
          {!isFree && (
            <div className="field">
              <label>Price (USD)</label>
              <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
              <span className="field-hint">You keep 80% — Broadexa takes a 20% commission.</span>
            </div>
          )}
          <div className="field">
            <label><input type="checkbox" checked={exclusiveAvailable} onChange={(e) => setExclusiveAvailable(e.target.checked)} style={{ width: 'auto', marginRight: 8 }} />Offer an exclusive buyout</label>
          </div>
          {exclusiveAvailable && (
            <div className="field">
              <label>Exclusive buyout price (USD)</label>
              <input type="number" min={0} value={exclusivePrice} onChange={(e) => setExclusivePrice(e.target.value)} />
              <span className="field-hint">Once sold exclusively, the listing is automatically delisted.</span>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <div className="field">
            <label>What&apos;s included</label>
            {includes.map((row, i) => (
              <div key={i} className="field-row" style={{ marginBottom: 6 }}>
                <input value={row.item} onChange={(e) => updateInclude(i, { item: e.target.value })} placeholder="e.g. Unreal project files" />
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                  <input type="checkbox" checked={row.included} onChange={(e) => updateInclude(i, { included: e.target.checked })} style={{ width: 'auto' }} /> Included
                </label>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" style={{ marginTop: 6 }} onClick={() => setIncludes((p) => [...p, { item: '', included: true }])}>
              + Add item
            </button>
          </div>
          <div className="field">
            <label>What is editable (colours, text, logos…)</label>
            <input value={editableNotes} onChange={(e) => setEditableNotes(e.target.value)} />
          </div>
          <div className="field">
            <label>Needs to run (plugins, tracking, fonts…)</label>
            <input value={requirements} onChange={(e) => setRequirements(e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label><input type="checkbox" checked={trackingReady} onChange={(e) => setTrackingReady(e.target.checked)} style={{ width: 'auto', marginRight: 8 }} />Tracking-ready</label>
            </div>
            <div className="field">
              <label>File size (GB)</label>
              <input type="number" min={0} value={fileSizeGB} onChange={(e) => setFileSizeGB(e.target.value)} />
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="field">
            <label>Preview images</label>
            <div className="dropzone">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
              />
              <p style={{ marginTop: 8 }}>Wide, anchor, detail and AR shots recommended.</p>
            </div>
            {galleryFiles.map((f, i) => (
              <div className="file-row" key={i}><span>{f.name}</span><span>{(f.size / 1024 / 1024).toFixed(1)} MB</span></div>
            ))}
          </div>
          <div className="field">
            <label>Downloadable package</label>
            <div className="dropzone">
              <input type="file" onChange={(e) => setPackageFile(e.target.files?.[0] || null)} />
              <p style={{ marginTop: 8 }}>The actual asset files buyers receive after purchase. Not public — released only on paid orders.</p>
            </div>
            {packageFile && <div className="file-row"><span>{packageFile.name}</span><span>{(packageFile.size / 1024 / 1024).toFixed(1)} MB</span></div>}
          </div>
          <div className="field">
            <label>Preview video URL (Cloudflare Stream)</label>
            <input value={previewVideoUrl} onChange={(e) => setPreviewVideoUrl(e.target.value)} placeholder="https://…" />
          </div>
          <div className="field">
            <label>On-engine recording URL</label>
            <input value={onEngineRecordingUrl} onChange={(e) => setOnEngineRecordingUrl(e.target.value)} placeholder="https://…" />
            <span className="field-hint">Required for the Verified badge — admin checks this against your listing.</span>
          </div>
        </>
      )}

      {step === 4 && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Review</h4>
          <table className="specs">
            <tbody>
              <tr><td>Title</td><td>{title}</td></tr>
              <tr><td>Price</td><td>{isFree ? 'Free' : `$${price || 0}`}</td></tr>
              <tr><td>Exclusive buyout</td><td>{exclusiveAvailable ? `$${exclusivePrice || 0}` : 'Not offered'}</td></tr>
              <tr><td>Genre</td><td>{genre.join(', ') || '—'}</td></tr>
              <tr><td>Images</td><td>{galleryFiles.length}</td></tr>
              <tr><td>Verified badge eligible</td><td>{onEngineRecordingUrl ? 'Yes — recording supplied' : 'No — add a recording'}</td></tr>
            </tbody>
          </table>
          <p className="field-hint">Every listing is reviewed before it goes live. You&apos;ll see it in &quot;My assets&quot; as pending until approved.</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        {step > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)} disabled={submitting}>Back</button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={() => canNext() && setStep((s) => s + 1)} disabled={!canNext()}>
            Next
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={submit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit for review'}
          </button>
        )}
      </div>
    </div>
  )
}
