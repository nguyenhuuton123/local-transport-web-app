/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true, // turn off it when develop to check syntax
    },
    eslint: {
        ignoreDuringBuilds: true, // turn off it when develop to check syntax
    },
}
export default nextConfig;