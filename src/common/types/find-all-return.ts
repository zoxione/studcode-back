import { Document } from 'mongoose';

export class FindAllReturn<TFilter, TDocument extends Document> {
  filter: Required<TFilter>;
  info: {
    find_count: number;
    total_count: number;
    count_pages: number;
  };
  results: TDocument[];
}
