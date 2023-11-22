import { Document } from 'mongoose';

export class FindAllReturnDto {
  stats: {
    total_count: number;
    time_frame?: string;
  };
  data: Document[];
}
