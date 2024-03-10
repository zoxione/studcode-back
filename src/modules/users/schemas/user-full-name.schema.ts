import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
class UserFullName {
  @ApiProperty({ description: 'Фамилия', type: String })
  @Prop({ type: String, default: '' })
  surname: string;

  @ApiProperty({ description: 'Имя', type: String })
  @Prop({ type: String, default: '' })
  name: string;

  @ApiProperty({ description: 'Отчество', type: String })
  @Prop({ type: String, default: '' })
  patronymic: string;
}

const UserFullNameSchema = SchemaFactory.createForClass(UserFullName);
export { UserFullName, UserFullNameSchema };
