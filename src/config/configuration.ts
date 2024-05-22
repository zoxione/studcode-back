export default () => ({
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  app_url: process.env.APP_URL || '',
  frontend_url: process.env.FRONTEND_URL || '',
  database: process.env.MONGODB_URL || '',
  token_domain: process.env.TOKEN_DOMAIN || '',
  access_token_name: process.env.ACCESS_TOKEN_NAME || '',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || '',
  jwt_access_expires: process.env.JWT_ACCESS_EXPIRES || '',
  refresh_token_name: process.env.REFRESH_TOKEN_NAME || '',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
  jwt_refresh_expires: process.env.JWT_REFRESH_EXPIRES || '',
  s3_endpoint: process.env.S3_ENDPOINT || '',
  s3_region: process.env.S3_REGION || '',
  s3_access_key_id: process.env.S3_ACCESS_KEY_ID || '',
  s3_secret_access_key: process.env.S3_SECRET_ACCESS_KEY || '',
  s3_bucket_name: process.env.S3_BUCKET_NAME || '',
  upload_url: process.env.UPLOAD_URL || '',
  smtp_host: process.env.SMTP_HOST || '',
  smtp_port: process.env.SMTP_PORT || '',
  smtp_user: process.env.SMTP_USER || '',
  smtp_password: process.env.SMTP_PASSWORD || '',
  smtp_mail: process.env.SMTP_MAIL || '',
});
