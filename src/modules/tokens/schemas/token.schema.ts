import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { TokenEvent } from '../types/token-event';
import { TOKEN_EXPIRE_TIME } from '../data/constants';
import { User } from '../../../modules/users/schemas/user.schema';

type TokenDocument = HydratedDocument<Token>;

@Schema()
class Token {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Событие', type: String, enum: TokenEvent })
  @Prop({ type: String, enum: TokenEvent, default: TokenEvent.Default })
  event: string;

  @ApiProperty({ description: 'Пользователь', type: User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  user: User;

  @ApiProperty({ description: 'Контент', type: String })
  @Prop({ type: String, default: '' })
  content: string;

  @ApiProperty({ description: 'Дата истечения (по умолчанию 12 часов)', type: Date })
  @Prop({ type: Date, default: Date.now() + TOKEN_EXPIRE_TIME })
  expires_at: string;
}

const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
TokenSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { Token, TokenDocument, TokenSchema };
