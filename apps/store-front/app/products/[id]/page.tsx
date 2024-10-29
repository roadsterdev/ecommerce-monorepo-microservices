"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";

import { Product } from "@repo/ui/types";
import { fetchProduct, placeOrder } from "@repo/ui/apis";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function loadProduct() {
      const data = await fetchProduct(id);

      setProduct(data);
    }
    
    loadProduct();
  }, [id]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage("");
    setOrderQuantity(parseInt(e.target.value));
  };

  const handleOrder = async () => {
    if (!product) return;
  
    if (orderQuantity > product.inventoryCount) {
      setMessage("Not enough inventory");
      return;
    }
  
    try {
      const result = await placeOrder(id, orderQuantity);
  
      setMessage(result.message);
      if (result.success) {
        setProduct((prev) => {
          if (prev) {
            return {
              ...prev,
              inventoryCount: prev.inventoryCount - orderQuantity,
            };
          }
          return prev;
        });

        router.refresh();
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
        <Link href="/products" className="mb-6">Back to Products</Link>
        <h1 className="text-2xl font-bold mt-1 mb-4">{product.name}</h1>
        <p>Inventory Count: {product.inventoryCount}</p>
        {product.inventoryCount > 0 ? (
          <>
            <div className="my-4 text-sm">
              <label className="block text-gray-700 mb-1">Order Quantity</label>
              <input
                type="number"
                min="1"
                max={product.inventoryCount}
                value={orderQuantity}
                onChange={onChangeHandler}
                className="w-full px-2 py-2 border rounded text-sm"
              />
              {message && <p className=" mt-1 text-red-500">{message}</p>}
            </div>
            <button
              onClick={handleOrder}
              className="bg-blue-500 text-white text-sm py-2 rounded w-full"
            >
              Place Order
            </button>
          </>
        ) : (
          <p className="text-red-500 mt-4">Out of Stock</p>
        )}
      </div>
    </div>
  );
}
