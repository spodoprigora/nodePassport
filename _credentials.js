module.exports = {
  cookieSecret: 'здесь находится ваш секрет cookie-файла',
  mongo: {
    development: {
      connectionString: 'connectingString',
    },
    production: {
      connectionString: 'connectingString',
    },
  },
  authProviders: {
    facebook: {
      development: {
        appId: 'your_app_id',
        appSecret: 'your_app_secret',
      },
    },
    google: {
      development: {
        appId: 'your_app_id',
        appSecret: 'your_app_secret',
      },
    },
  },
};
