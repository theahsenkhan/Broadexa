import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { AssetFiles } from './collections/AssetFiles'
import { Engines } from './collections/Engines'
import { Categories } from './collections/Categories'
import { Assets } from './collections/Assets'
import { Orders } from './collections/Orders'
import { Projects } from './collections/Projects'
import { Bids } from './collections/Bids'
import { Posts } from './collections/Posts'
import { Jobs } from './collections/Jobs'
import { AwardEntries } from './collections/AwardEntries'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// R2 (Phase 2) is optional — falls back to local disk storage until these are set.
const r2Configured = Boolean(
  process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET,
)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— Broadexa Admin' },
  },
  collections: [Users, Media, AssetFiles, Assets, Engines, Categories, Orders, Projects, Bids, Posts, Jobs, AwardEntries],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Supabase requires SSL; the pg driver won't negotiate it from the
      // connection string alone. Bounded timeout so a bad connection fails
      // fast with a real error instead of hanging until the host platform
      // kills the request.
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    },
    // Payload only auto-pushes schema outside production. In production it
    // runs these on the first successful connect instead.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: r2Configured
    ? [
        s3Storage({
          collections: {
            media: { disableLocalStorage: true },
            'asset-files': { disableLocalStorage: true },
          },
          bucket: process.env.R2_BUCKET as string,
          clientUploads: true,
          config: {
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            },
            forcePathStyle: true,
          },
        }),
      ]
    : [],
})
