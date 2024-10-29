export async function fetchProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: 'GET',
    cache: 'no-store',
  });
  return res.json();
}

export async function fetchProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
  return res.json();
}

export async function placeOrder(productId: string, quantity: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/order`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return { message: data.message, success: res.ok };
}

export async function updateInventory(id: string, quantity: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, quantity }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return { message: data.message, success: res.ok };
}