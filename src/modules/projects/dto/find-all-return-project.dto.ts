import { Document } from 'mongoose';

export class FindAllReturnProjectDto {
  stats: {
    page: number;
    limit: number;
    search: string;
    time_frame: string;
    find_count: number;
    total_count: number;
    count_pages: number;
  };
  data: Document[];
}
