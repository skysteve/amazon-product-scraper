export interface IProduct {
  id: string; // the ASIN
  category?: string;
  dimensions?: string;
  deleted: boolean;
  title?: string;
  rank?: string[];
}
