import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiBearerAuth()
@ApiTags('upload')
@Controller({ path: 'upload', version: '1' })
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // @Post('/')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiOperation({ summary: 'Загрузка файла' })
  // async uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: /(jpeg|jpg|png|webp)$/,
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 5 * 1024 * 1024, // 5 MB in bytes
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return await this.uploadService.upload(file.originalname, file);
  // }
}
