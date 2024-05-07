import configuration from '../../config/configuration';

const getFilePath = (url: string) => {
  const path = url.split(`/${configuration().s3_bucket_name}/`)[1];
  return path;
};

export { getFilePath };
