/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Strict Mode to prevent WebSocket disconnections during development
  // Strict Mode causes double mounting/unmounting which closes WebSocket connections
  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
}

module.exports = nextConfig
