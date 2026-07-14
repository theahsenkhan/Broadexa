import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

// Private deliverables (the actual downloadable package). Unlike Media (public previews),
// reads are gated to admins, the uploading designer, and buyers with a paid order for the
// asset this file is attached to — Payload enforces this on every file request, including
// direct R2-backed reads, so a purchase link can't be shared around.
export const AssetFiles: CollectionConfig = {
  slug: 'asset-files',
  admin: { useAsTitle: 'filename', group: 'Marketplace' },
  upload: { staticDir: 'asset-files' },
  access: {
    read: async ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (!req.user) return false

      const owned = await req.payload.find({
        collection: 'assets',
        where: { designer: { equals: req.user.id } },
        limit: 100,
        depth: 0,
      })
      const ownedFileIds = owned.docs.map((a: any) => a.file).filter(Boolean)

      const paidOrders = await req.payload.find({
        collection: 'orders',
        where: {
          buyer: { equals: req.user.id },
          status: { in: ['paid', 'delivered'] },
        },
        limit: 100,
        depth: 1,
      })
      const purchasedFileIds = paidOrders.docs
        .map((o: any) => (typeof o.asset === 'object' ? o.asset?.file : null))
        .filter(Boolean)

      const fileIds = [...new Set([...ownedFileIds, ...purchasedFileIds])]
      if (fileIds.length === 0) return false
      return { id: { in: fileIds } }
    },
    create: ({ req }) => req.user?.role === 'designer' || req.user?.role === 'admin',
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [],
}
