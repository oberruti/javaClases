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
    // MONGO_URI:
    //   'mongodb+srv://octavioberruti:yIqDm1NuicLVbTOQ@autogestion-alumnos.vicet.mongodb.net/alumnos?retryWrites=true&w=majority',
    // JWT_SECRET: 'INp8IvRIyGMcoVAgFGRA61DdBglwssqwrTzEgz8PSYA',
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
