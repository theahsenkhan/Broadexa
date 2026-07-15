import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // sharp is a native binary — bundlers that try to trace/inline it (rather
  // than resolve it as a normal runtime dependency) can ship a broken
  // binary or drop it entirely. This is Next's documented escape hatch.
  serverExternalPackages: ['sharp'],
}

export default withPayload(nextConfig)
