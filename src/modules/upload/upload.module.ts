import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  // imports: [
  //   ThrottlerModule.forRootAsync({
  //     imports: [ConfigModule],
  //     inject: [ConfigService],
  //     useFactory: (config: ConfigService) => [
  //       {
  //         ttl: seconds(config.getOrThrow('UPLOAD_RATE_TTL')),
  //         limit: config.getOrThrow('UPLOAD_RATE_LIMIT'),
  //       },
  //     ],
  //   }),
  // ],
  controllers: [UploadController],
  providers: [
    UploadService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
  exports: [UploadService],
})
export class UploadModule {}
