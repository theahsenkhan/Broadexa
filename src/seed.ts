import { getPayload } from 'payload'
import config from './payload.config'
import { runFullSeed } from './lib/seedSampleContent'

async function seed() {
  const payload = await getPayload({ config })
  await runFullSeed(payload, (msg) => console.log(msg))
  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
