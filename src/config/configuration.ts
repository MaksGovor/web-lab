export const configuration = () => ({
  port: 8080,
  host: '127.0.0.1',
  swagger: {
    openapi: '3.0.0',
    title: 'Lab-2 API',
    version: '0.1.0',
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Maks Govoruha',
      url: 'https://github.com/MaksGovor',
      email: 'maksgovruha@gmail.com',
    },
  },
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  },
  data: {
    dataFileName: 'meetings.xml',
    dataDirPath: 'data',
  },
});
