export class FilterProductDto {
  name?: string;
  fromDate?: string;
  toDate?: string;
  inStock?: 'true' | 'false';
  sortBy?: string;
  order?: 'asc' | 'desc';
}
