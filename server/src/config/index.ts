export default () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  mongodbURI: process.env.MONGODB_URI,
  authSecret: process.env.AUTH_SECRET,
  isDevelopment: process.env.NODE_ENV = 'development',
  isStaging: process.env.NODE_ENV = 'staging',
  isProduction: process.env.NODE_ENV = 'production',
});
