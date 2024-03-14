export class FindAllReturn<TFilter, TData> {
  filter: Required<TFilter>;
  info: {
    find_count: number;
    total_count: number;
    count_pages: number;
  };
  results: TData[];
}
