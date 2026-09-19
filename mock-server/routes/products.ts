import { Router } from "express";
import type { CheckSkuResponse, CreateProductRequest, CreateProductResponse, Product, ProductsResponse } from "@contracts/product.contract.js";
import { products } from "@server/data/products.js";
import {
    isValidProductCategory,
    isValidProductStatus,
} from "@server/utils/productValidators.js";
import { randomUUID } from "node:crypto";
import { createProductSchema } from "@server/schemas/product.schema.ts";

export const productsRouter = Router();

productsRouter.get("/", (req, res) => {
    const page = Math.max(
        Number(req.query.page) || 1,
        1,
    );

    const pageSize = Math.min(
        Math.max(Number(req.query.pageSize) || 20, 1),
        100,
    );

    const search =
        typeof req.query.search === "string"
            ? req.query.search.trim().toLowerCase()
            : "";

    const status =
        typeof req.query.status === "string"
            ? req.query.status
            : undefined;

    const category =
        typeof req.query.category === "string"
            ? req.query.category
            : undefined;

    if (status && !isValidProductStatus(status)) {
        const response: ProductsResponse = {
            data: null,
            message: "Invalid status",
        };

        return res.status(400).json(response);
    }

    if (
        category &&
        !isValidProductCategory(category)
    ) {
        const response: ProductsResponse = {
            data: null,
            message: "Invalid category",
        };

        return res.status(400).json(response);
    }

    let filteredProducts = products;

    if (search) {
        filteredProducts = filteredProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(search) ||
                product.sku.toLowerCase().includes(search),
        );
    }

    if (status) {
        filteredProducts = filteredProducts.filter(
            (product) => product.status === status,
        );
    }

    if (category) {
        filteredProducts = filteredProducts.filter(
            (product) => product.category === category,
        );
    }

    const start = (page - 1) * pageSize;

    const items = filteredProducts.slice(
        start,
        start + pageSize,
    );

    const response: ProductsResponse = {
        data: {
            items,
            pagination: {
                page,
                pageSize,
                total: filteredProducts.length,
                totalPages: Math.ceil(
                    filteredProducts.length / pageSize,
                ),
            },
        },
        message: "Products retrieved successfully",
    };

    return res.json(response);
});

productsRouter.post("/", (req, res) => {
    const {
        name,
        sku,
        category,
        status,
        price,
        weight,
        stock,
    } = req.body as Partial<CreateProductRequest>;

    const result = createProductSchema.safeParse(
        req.body,
    );

    if (!result.success) {
        const response: CreateProductResponse = {
            data: null,
            message:
                result.error.issues[0]?.message ??
                "Invalid product data",
        };

        return res.status(400).json(response);
    }


    const skuExists = products.some(
        (product) =>
            product.sku.toLowerCase() ===
            sku.toLowerCase(),
    );

    if (skuExists) {
        const response: CreateProductResponse = {
            data: null,
            message: "SKU already exists",
        };

        return res.status(409).json(response);
    }

    const product: Product = {
        id: randomUUID(),
        name: name.trim(),
        sku: sku.trim(),
        category,
        status,
        price,
        weight,
        stock,
        createdAt: new Date().toISOString(),
    };

    products.unshift(product);

    const response: CreateProductResponse = {
        data: product,
        message: "Product created successfully",
    };

    return res.status(201).json(response);
});

productsRouter.get("/check-sku", (req, res) => {
    const sku =
        typeof req.query.sku === "string"
            ? req.query.sku.trim()
            : "";

    if (!sku) {
        const response: CheckSkuResponse = {
            data: null,
            message: "SKU is required",
        };

        return res.status(400).json(response);
    }

    const exists = products.some(
        (product) =>
            product.sku.toLowerCase() ===
            sku.toLowerCase(),
    );

    const response: CheckSkuResponse = {
        data: {
            available: !exists,
        },
        message: exists
            ? "SKU already exists"
            : "SKU is available",
    };

    return res.json(response);
});