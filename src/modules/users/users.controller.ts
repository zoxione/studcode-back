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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { FindAllFilterUserDto } from './dto/find-all-filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { FindAllReturnUser } from './types/find-all-return-user';
import { UsersService } from './users.service';
import { AuthUserRequest } from '../auth/types/auth-user-request';
import { UserFiles } from './types/user-files';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ParseFilesPipe } from 'src/common/validation/parse-files-pipe';
import { Project } from '../projects/schemas/project.schema';

@ApiBearerAuth()
@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Query() query: FindAllFilterUserDto): Promise<FindAllReturnUser> {
    return this.usersService.findAll(query);
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Получение пользователя по ID/username/email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('key') key: string): Promise<User> {
    let foundUser = await this.usersService.findOne('_id', key, { throw: false });
    if (!foundUser) {
      foundUser = await this.usersService.findOne('username', key, { throw: false });
    }
    if (!foundUser) {
      foundUser = await this.usersService.findOne('email', key, { throw: true });
    }
    return foundUser;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление пользователя по ID/username/email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOneById(
    @Req() req: AuthUserRequest,
    @Param('key') key: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<User> {
    if (req.user.sub !== key && req.user.username !== key && req.user.email !== key) {
      throw new UnauthorizedException('You are not allowed to update this user');
    }
    let updatedUser = await this.usersService.updateOne('_id', key, updateDto, { throw: false });
    if (!updatedUser) {
      updatedUser = await this.usersService.updateOne('username', key, updateDto, { throw: false });
    }
    if (!updatedUser) {
      updatedUser = await this.usersService.updateOne('email', key, updateDto, { throw: true });
    }
    return updatedUser;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/uploads')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar_file', maxCount: 1 }]))
  @ApiOperation({ summary: 'Загрузка файлов ' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
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
    let user = await this.usersService.findOne('_id', key);
    if (req.user.sub !== key && req.user.username !== key && req.user.email !== key) {
      throw new UnauthorizedException('You are not allowed to upload files this user');
    }
    if (files.length > 0) {
      user = await this.usersService.uploadFiles(user._id, files);
    }
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление пользователя по ID/username/email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<User> {
    if (req.user.sub !== key && req.user.username !== key && req.user.email !== key) {
      throw new UnauthorizedException('You are not allowed to update this user');
    }
    let deletedUser = await this.usersService.deleteOne('_id', key, { throw: false });
    if (!deletedUser) {
      deletedUser = await this.usersService.deleteOne('username', key, { throw: false });
    }
    if (!deletedUser) {
      deletedUser = await this.usersService.deleteOne('email', key, { throw: true });
    }
    return deletedUser;
  }
}
