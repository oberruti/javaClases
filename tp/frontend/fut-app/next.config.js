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
    NEXTAUTH_URL: 'http://localhost:3000',
    MONGO_URI:
      'mongodb+srv://octacai:okta1983@database.zkmkf.mongodb.net/Database?retryWrites=true&w=majority',
    JWT_SECRET: 'INp8IvRIyGMcoVAgFGRA61DdBglwssqwrTzEgz8PSYA',
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
