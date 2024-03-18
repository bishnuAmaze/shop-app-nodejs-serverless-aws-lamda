export interface IProduct {
  id: string,
  title: string,
  description: string,
  price: number,
  count: number,
}

export interface IProductService {
  getProductById: (id: string) => Promise<IProduct>,
  getProductsList : () => Promise<IProduct[]>,
}