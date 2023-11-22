import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from '../../../common/types/role';
import { Award } from '../../awards/schemas/award.schema';
import { Project } from '../../projects/schemas/project.schema';

type UserDocument = HydratedDocument<User>;

@Schema()
class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, unique: true, required: true })
  username: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: string;

  @Prop({ type: String, default: '' })
  refresh_token: string;

  @Prop(
    raw({
      last: { type: String, default: '' },
      first: { type: String, default: '' },
      middle: { type: String, default: '' },
    }),
  )
  name: {
    last: string;
    first: string;
    middle: string;
  };

  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: String, default: '' })
  about: string;

  @Prop(
    raw({
      github: { type: String, default: '' },
      vkontakte: { type: String, default: '' },
      telegram: { type: String, default: '' },
    }),
  )
  link: {
    github: string;
    vkontakte: string;
    telegram: string;
  };

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Award' }], default: [] })
  awards: Award[];

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
