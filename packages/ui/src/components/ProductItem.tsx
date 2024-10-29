import Link from "next/link";
import {Product} from '../types';

export const ProductItem = ({ product }: { product: Product }) => {
  return (
    <Link key={product.id} href={`/products/${product.id}`}>
      <div className="block py-2 px-4 bg-white shadow-md rounded hover:shadow-lg transition">
        <h2 className="text-md font-semibold">{product.name}</h2>
        <p className="text-md">Inventory: {product.inventoryCount}</p>
      </div>
    </Link>
  );
};
