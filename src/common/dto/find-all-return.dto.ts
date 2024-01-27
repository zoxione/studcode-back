import { Document } from 'mongoose';

export class FindAllReturnDto {
  stats: {
    page: number;
    limit: number;
    search: string;
    find_count: number;
    total_count: number;
    count_pages: number;
  };
  data: Document[];
}
