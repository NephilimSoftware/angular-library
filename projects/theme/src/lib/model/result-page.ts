export interface ResultPage<TItem> {
  items?: TItem[];
  pagesCount?: number;
  pageNumber?: number;
  count?: number;
}
