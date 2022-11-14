module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: false,
      },
      {
        source: '/app',
        destination: '/app/dashboard',
        permanent: false,
      },
      {
        source: '/acc',
        destination: '/acc/login',
        permanent: false,
      },
    ];
  },
  env: {
    NEXTAUTH_URL: 'https://java-clases.vercel.app',
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_AUTH_SECRET_KEY: process.env.NEXT_AUTH_SECRET_KEY,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    BACKEND_URL: process.env.BACKEND_URL,
  },
  //   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //     config.node = {
  //       fs: 'empty',
  //       dns: 'empty',
  //       module: 'empty',
  //       net: 'empty',
  //       tls: 'empty',
  //     };
  //     return config;
  //   },
};
