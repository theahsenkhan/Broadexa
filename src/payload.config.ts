import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— Broadexa Admin' },
  },
  collections: [Users, Media, Assets, Engines, Categories, Orders, Projects, Bids, Posts, Jobs, AwardEntries],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  sharp,
})
