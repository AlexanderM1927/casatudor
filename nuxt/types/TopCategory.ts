export interface ITopCategory {
  id: number;
  category: {
    id: number;
    name: string;
  };
  image: string;
  urlForRedirect?: string;
}