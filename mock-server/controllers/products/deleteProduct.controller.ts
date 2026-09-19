import type { DeleteProductResponse } from "@contracts/product.contract.js";
import { products } from "@server/data/products.js";
import type { Request, Response } from "express";

export const deleteProduct = (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  const productIndex = products.findIndex(
    (product) => product.id === id,
  );

  if (productIndex === -1) {
    const response: DeleteProductResponse = {
      data: null,
      message: "Product not found",
    };

    return res.status(404).json(response);
  }

  const [deletedProduct] = products.splice(
    productIndex,
    1,
  );

  const response: DeleteProductResponse = {
    data: deletedProduct,
    message: "Product deleted successfully",
  };

  return res.json(response);
};