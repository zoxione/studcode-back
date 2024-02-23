import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly region: string;
  private readonly endpoint: string;
  private readonly bucket: string;
  private readonly upload_url: string;

  constructor(private readonly configService: ConfigService) {
    this.upload_url = this.configService.getOrThrow('UPLOAD_URL');
    this.region = this.configService.getOrThrow('AWS_REGION');
    this.endpoint = this.configService.getOrThrow('AWS_ENDPOINT');
    this.bucket = this.configService.getOrThrow('AWS_BUCKET_NAME');
    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
      region: this.region,
    });
  }

  async upload(key: string, file: Express.Multer.File) {
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: this.bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
      ContentLength: file.size,
      ContentDisposition: 'inline',
    };
    try {
      const response: PutObjectCommandOutput = await this.s3Client.send(new PutObjectCommand(input));
      if (response.$metadata.httpStatusCode === 200) {
        return `${this.upload_url}/${key}`;
      }
      throw new Error('Image not saved to S3');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
