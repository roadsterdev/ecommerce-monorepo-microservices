import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { products } from "../models/schema";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allProducts = await db.select().from(products).orderBy(products.name);

    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then((result) => result[0]);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProductInventory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: productId } = req.params;
  const { quantity } = req.body;

  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then((result) => result[0]);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }


    await db
      .update(products)
      .set({ inventoryCount: quantity })
      .where(eq(products.id, productId))
      .execute();

    res.json({ message: "Inventory updated", quantity });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then((result) => result[0]);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }

    if (quantity > product.inventoryCount) {
      res.status(400).json({ error: "Not enough inventory" });
    }

    await db
      .update(products)
      .set({ inventoryCount: product.inventoryCount - quantity })
      .where(eq(products.id, productId))
      .execute();

    res.json({ message: "Order placed",  });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};