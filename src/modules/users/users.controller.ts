import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { ParseFilesPipe } from '../../common/validation/parse-files-pipe';
import { AuthUserRequest } from '../auth/types/auth-user-request';
import { FindAllFilterUserDto } from './dto/find-all-filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { FindAllReturnUser } from './types/find-all-return-user';
import { UserFiles } from './types/user-files';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  private readonly fields: (keyof User)[] = ['_id', 'username', 'email'];

  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Query() query: FindAllFilterUserDto): Promise<FindAllReturnUser> {
    return this.usersService.findAll(query);
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Получение пользователя по _id/username/email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOne(@Param('key') key: string): Promise<User> {
    return this.usersService.findOne({ fields: this.fields, fieldValue: key });
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление пользователя по _id/username/email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOne(@Req() req: AuthUserRequest, @Param('key') key: string, @Body() updateDto: UpdateUserDto): Promise<User> {
    const user = await this.usersService.findOne({ fields: this.fields, fieldValue: key });
    if (user._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to update this user');
    }
    return this.usersService.updateOne({ fields: this.fields, fieldValue: key, updateDto: updateDto });
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление пользователя по _id/username/email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOne(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<User> {
    const user = await this.usersService.findOne({ fields: this.fields, fieldValue: key });
    if (user._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to update this user');
    }
    return this.usersService.deleteOne({ fields: this.fields, fieldValue: key });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/uploads')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar_file', maxCount: 1 },
      { name: 'cover_file', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Загрузка файлов пользователя по _id/username/email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async uploadFiles(
    @Req() req: AuthUserRequest,
    @Param('key') key: string,
    @UploadedFiles(
      new ParseFilesPipe(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /(jpeg|jpg|png|webp)$/,
          })
          .addMaxSizeValidator({
            maxSize: 5 * 1024 * 1024, // 5 MB in bytes
          })
          .build({
            fileIsRequired: false,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          }),
      ),
    )
    files: UserFiles,
  ): Promise<User> {
    let user = await this.usersService.findOne({ fields: this.fields, fieldValue: key });
    if (user._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to update this user');
    }
    if (files.length > 0) {
      user = await this.usersService.uploadFiles({ fields: this.fields, fieldValue: key, files: files });
    }
    return user;
  }
}
