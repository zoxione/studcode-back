import { Document } from 'mongoose';

export class FindAllReturnDto {
  stats: {
    totalCount: number;
  };
  data: Document[];
}
