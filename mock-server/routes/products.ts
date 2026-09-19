import { Router } from "express";
import { updateProduct } from "@server/controllers/products/updateProduct.controller.ts";
import { deleteProduct } from "@server/controllers/products/deleteProduct.controller.ts";
import { checkSKU } from "@server/controllers/products/checkSku.controller.ts";
import { getProducts } from "@server/controllers/products/getProducts.controller.ts";
import { createProduct } from "@server/controllers/products/createProduct.controller.ts";

export const productsRouter = Router();

productsRouter.get("/check-sku", checkSKU);

productsRouter.get("/", getProducts);

productsRouter.post("/", createProduct);

productsRouter.patch("/:id", updateProduct);

productsRouter.delete("/:id", deleteProduct);