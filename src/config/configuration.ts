export default () => ({
  node_env: process.env.NODE_ENV?.trim(),
  port: process.env.PORT || 3000,
  database: process.env.MONGODB_URL || '',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || '',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
  jwt_access_expires: process.env.JWT_ACCESS_EXPIRES || '',
  jwt_refresh_expires: process.env.JWT_REFRESH_EXPIRES || '',
});
