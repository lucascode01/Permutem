/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ignorar avisos de dependências opcionais
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/ws\/lib\/validation\.js/ },
      { module: /node_modules\/ws\/lib\/buffer-util\.js/ }
    ];
    return config;
  },
};

module.exports = nextConfig; 