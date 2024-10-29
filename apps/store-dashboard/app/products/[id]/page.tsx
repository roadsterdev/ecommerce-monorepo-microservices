"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchProduct, updateInventory } from "@repo/ui/apis";
import { Product } from "@repo/ui/types";

export default function InventoryUpdatePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(product?.inventoryCount || 0);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function loadProduct() {
      const data = await fetchProduct(id);

      setProduct(data);
      setQuantity(data.inventoryCount);
    }
    
    loadProduct();
  }, [id]);

  const handleUpdate = async () => {
    if (!product) return;

    try {
      const result = await updateInventory(product.id, quantity);
      setMessage(result.message);

      if (result.success) {
        setProduct((prev) => {
          if (prev) {
            return {
              ...prev,
              inventoryCount: quantity,
            };
          }
          return prev;
        });

        setQuantity(quantity);
        router.refresh();
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="p-6 bg-white shadow-md rounded">
        <Link href="/products" className="mb-6">Back to Products</Link>
        <h2 className="text-2xl font-bold mt-1 mb-4">{product?.name}</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Quantity Adjustment</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Quantity"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Update Inventory
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
