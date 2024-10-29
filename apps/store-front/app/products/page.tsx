import { fetchProducts } from "@repo/ui/apis";
import { ProductList } from "@repo/ui/components";
import { Product } from "@repo/ui/types";

export default async function ProductPage() {
  const products: Product[] = await fetchProducts();

  return (
    <main>
      <ProductList products={products} />
    </main>
  );
}
