import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from '../types/role';
import { Project } from '../../projects/schemas/project.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserFullNameDto } from '../dto/user-full-name.dto';
import { UserLinksDto } from '../dto/user-links.dto';

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

  @ApiProperty({ description: 'Роль', type: String, enum: Role })
  @Prop({ type: String, enum: Role, default: Role.User })
  role: string;

  @ApiProperty({ description: 'Подтверждение почты', type: Boolean })
  @Prop({ type: Boolean, default: false })
  verify_email: boolean;

  @ApiProperty({ description: 'Токен обновления', type: String })
  @Prop({ type: String, default: '' })
  refresh_token: string;

  @ApiProperty({ description: 'ФИО', type: UserFullNameDto })
  @Prop(
    raw({
      surname: { type: String, default: '' },
      name: { type: String, default: '' },
      patronymic: { type: String, default: '' },
    }),
  )
  full_name: {
    surname: string;
    name: string;
    patronymic: string;
  };

  @ApiProperty({ description: 'Ссылка на аватар', type: String })
  @Prop({ type: String, default: '' })
  avatar: string;

  @ApiProperty({ description: 'О себе', type: String })
  @Prop({ type: String, default: '' })
  about: string;

  @ApiProperty({ description: 'Ссылки', type: UserLinksDto })
  @Prop(
    raw({
      github: { type: String, default: '' },
      vkontakte: { type: String, default: '' },
      telegram: { type: String, default: '' },
    }),
  )
  links: {
    github: string;
    vkontakte: string;
    telegram: string;
  };

  @ApiProperty({ description: 'Проекты', type: [Project] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], default: [] })
  projects: Project[];
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 'text' });
UserSchema.index({ email: 'text' });
UserSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { User, UserDocument, UserSchema };
