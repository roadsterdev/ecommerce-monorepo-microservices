import { Product } from "../types";
import { ProductItem } from "./ProductItem";

export const ProductList = ({ products }: { products: Product[] }) => {
  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center border-b border-gray-200">Products</h1>
      <div className="flex flex-col gap-2 py-2">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
