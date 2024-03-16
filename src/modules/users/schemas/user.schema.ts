import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Link, LinkSchema } from '../../../common/schemas/link.schema';
import { UserRole } from '../types/user-role';
import { UserFullName, UserFullNameSchema } from './user-full-name.schema';

type UserDocument = HydratedDocument<User>;

@Schema()
class User {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Имя пользователя', type: String })
  @Prop({ type: String, unique: true, required: true })
  username: string;

  @ApiProperty({ description: 'Электронная почта', type: String })
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @ApiProperty({ description: 'Пароль', type: String })
  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty({ description: 'Роль', type: String, enum: UserRole })
  @Prop({ type: String, enum: UserRole, default: UserRole.User })
  role: string;

  @ApiProperty({ description: 'Подтверждение почты', type: Boolean })
  @Prop({ type: Boolean, default: false })
  verify_email: boolean;

  @ApiProperty({ description: 'Токен обновления', type: String })
  @Prop({ type: String, default: '' })
  refresh_token: string;

  @ApiProperty({ description: 'ФИО', type: UserFullName })
  @Prop({ type: UserFullNameSchema, default: null })
  full_name: UserFullName;

  @ApiProperty({ description: 'Ссылка на аватар', type: String })
  @Prop({ type: String, default: '' })
  avatar: string;

  @ApiProperty({ description: 'О себе', type: String })
  @Prop({ type: String, default: '' })
  about: string;

  @ApiProperty({ description: 'Ссылки', type: [Link] })
  @Prop({ type: [LinkSchema], default: [] })
  links: Link[];
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 'text' });
UserSchema.index({ email: 'text' });
UserSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { User, UserDocument, UserSchema };
