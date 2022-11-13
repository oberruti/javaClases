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
    MONGO_URI: '',
    JWT_SECRET: process.env.JWT_SECRET,
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
