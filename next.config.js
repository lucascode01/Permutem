/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
      {
        protocol: 'https',
        hostname: 'lvmiyeudjowgtglwmodz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['lvmiyeudjowgtglwmodz.supabase.co'],
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