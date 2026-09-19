import type {
    Product,
    UpdateProductResponse,
} from "@contracts/product.contract.js";
import { products } from "@server/data/products.js";
import {
    createProductSchema,
    updateProductSchema,
} from "@server/schemas/product.schema.js";
import type { Request, Response } from "express";

export const updateProduct = (
    req: Request,
    res: Response,
) => {
    const { id } = req.params;

    const productIndex = products.findIndex(
        (product) => product.id === id,
    );

    if (productIndex === -1) {
        const response: UpdateProductResponse = {
            data: null,
            message: "Product not found",
        };

        return res.status(404).json(response);
    }

    const result = updateProductSchema.safeParse(
        req.body,
    );

    if (!result.success) {
        const response: UpdateProductResponse = {
            data: null,
            message:
                result.error.issues[0]?.message ??
                "Invalid product data",
        };

        return res.status(400).json(response);
    }

    if (result.data.sku) {
        const skuExists = products.some(
            (product) =>
                product.id !== id &&
                product.sku.toLowerCase() ===
                result.data.sku!.toLowerCase(),
        );

        if (skuExists) {
            const response: UpdateProductResponse = {
                data: null,
                message: "SKU already exists",
            };

            return res.status(409).json(response);
        }
    }

    const currentProduct = products[productIndex];

    const updatedProduct: Product = {
        ...currentProduct,
        ...result.data,
    };

    const finalValidation =
        createProductSchema.safeParse({
            name: updatedProduct.name,
            sku: updatedProduct.sku,
            category: updatedProduct.category,
            status: updatedProduct.status,
            price: updatedProduct.price,
            weight: updatedProduct.weight,
            stock: updatedProduct.stock,
        });

    if (!finalValidation.success) {
        const response: UpdateProductResponse = {
            data: null,
            message:
                finalValidation.error.issues[0]?.message ??
                "Invalid product data",
        };

        return res.status(400).json(response);
    }

    products[productIndex] = updatedProduct;

    const response: UpdateProductResponse = {
        data: updatedProduct,
        message: "Product updated successfully",
    };

    return res.json(response);
};