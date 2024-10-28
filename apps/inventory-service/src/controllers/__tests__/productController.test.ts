import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import {
  getProducts,
  getProductById,
  updateProductInventory,
} from "../productController";
import { db } from "../../db";
import { products } from "../../models/schema";

jest.mock("../../db");

describe("Product Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    res = {
      json: jsonMock,
      status: statusMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("should return all products", async () => {
      const mockProducts = [
        { id: "1", name: "Product 1", inventoryCount: 10 },
        { id: "2", name: "Product 2", inventoryCount: 20 },
      ];

      const fromMock = jest.fn().mockResolvedValue(mockProducts);
      const selectMock = jest.fn().mockReturnValue({ from: fromMock });
      (db.select as jest.Mock).mockImplementation(selectMock);

      await getProducts(req as Request, res as Response);

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(products);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      const fromMock = jest.fn().mockRejectedValue(error);
      const selectMock = jest.fn().mockReturnValue({ from: fromMock });
      (db.select as jest.Mock).mockImplementation(selectMock);

      await getProducts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("getProductById", () => {
    it("should return a product when found", async () => {
      const mockProduct = { id: "1", name: "Product 1", inventoryCount: 10 };
      req.params = { id: "1" };

      const whereMock = jest.fn().mockResolvedValue([mockProduct]);
      const fromMock = jest.fn().mockReturnValue({ where: whereMock });
      const selectMock = jest.fn().mockReturnValue({ from: fromMock });
      (db.select as jest.Mock).mockImplementation(selectMock);

      await getProductById(req as Request, res as Response);

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(products);
      expect(whereMock).toHaveBeenCalledWith(eq(products.id, "1"));
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should return 404 when product is not found", async () => {
      req.params = { id: "1" };

      const whereMock = jest.fn().mockResolvedValue([]);
      const fromMock = jest.fn().mockReturnValue({ where: whereMock });
      const selectMock = jest.fn().mockReturnValue({ from: fromMock });
      (db.select as jest.Mock).mockImplementation(selectMock);

      await getProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Product not found" });
    });

    it("should handle errors", async () => {
      req.params = { id: "1" };

      const error = new Error("Database error");
      const whereMock = jest.fn().mockRejectedValue(error);
      const fromMock = jest.fn().mockReturnValue({ where: whereMock });
      const selectMock = jest.fn().mockReturnValue({ from: fromMock });
      (db.select as jest.Mock).mockImplementation(selectMock);

      await getProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("updateProductInventory", () => {
    it("should update inventory when enough inventory exists", async () => {
      const productId = "1";
      const quantity = 5;
      const mockProduct = {
        id: productId,
        name: "Product 1",
        inventoryCount: 10,
      };
      req.params = { id: productId };
      req.body = { quantity };

      const whereSelectMock = jest.fn().mockResolvedValue([mockProduct]);
      const fromSelectMock = jest
        .fn()
        .mockReturnValue({ where: whereSelectMock });
      const selectMock = jest.fn().mockReturnValue({ from: fromSelectMock });
      (db.select as jest.Mock).mockImplementation(selectMock);

      const executeMock = jest.fn().mockResolvedValue(undefined);
      const whereUpdateMock = jest
        .fn()
        .mockReturnValue({ execute: executeMock });
      const setMock = jest.fn().mockReturnValue({ where: whereUpdateMock });
      const updateMock = jest.fn().mockReturnValue({ set: setMock });
      (db.update as jest.Mock).mockImplementation(updateMock);

      await updateProductInventory(req as Request, res as Response);

      expect(db.select).toHaveBeenCalled();
      expect(fromSelectMock).toHaveBeenCalledWith(products);
      expect(whereSelectMock).toHaveBeenCalledWith(eq(products.id, productId));

      expect(db.update).toHaveBeenCalledWith(products);
      expect(setMock).toHaveBeenCalledWith({
        inventoryCount: mockProduct.inventoryCount - quantity,
      });
      expect(whereUpdateMock).toHaveBeenCalledWith(eq(products.id, productId));

      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory updated",
        newCount: mockProduct.inventoryCount - quantity,
      });
    });

    it("should return 400 when not enough inventory", async () => {
      const productId = "1";
      const quantity = 15;
      const mockProduct = {
        id: productId,
        name: "Product 1",
        inventoryCount: 10,
      };
      req.params = { id: productId };
      req.body = { quantity };

      const whereSelectMock = jest.fn().mockResolvedValue([mockProduct]);
      const fromSelectMock = jest
        .fn()
        .mockReturnValue({ where: whereSelectMock });
      const selectMock = jest.fn().mockReturnValue({ from: fromSelectMock });
      (db.select as jest.Mock).mockImplementation(selectMock);

      await updateProductInventory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Not enough inventory" });
    });

    it("should return 404 when product not found", async () => {
      const productId = "1";
      const quantity = 5;
      req.params = { id: productId };
      req.body = { quantity };

      const whereSelectMock = jest.fn().mockResolvedValue([]);
      const fromSelectMock = jest
        .fn()
        .mockReturnValue({ where: whereSelectMock });
      const selectMock = jest.fn().mockReturnValue({ from: fromSelectMock });
      (db.select as jest.Mock).mockImplementation(selectMock);

      await updateProductInventory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Product not found" });
    });

    it("should handle errors", async () => {
      const productId = "1";
      const quantity = 5;
      req.params = { id: productId };
      req.body = { quantity };

      const error = new Error("Database error");
      const whereSelectMock = jest.fn().mockRejectedValue(error);
      const fromSelectMock = jest
        .fn()
        .mockReturnValue({ where: whereSelectMock });
      const selectMock = jest.fn().mockReturnValue({ from: fromSelectMock });
      (db.select as jest.Mock).mockImplementation(selectMock);

      await updateProductInventory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});
