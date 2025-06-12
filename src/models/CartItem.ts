import { Product } from "~/models/Product";

export type CartItem = {
  productId?: string;
  product: Product;
  count: number;
};
