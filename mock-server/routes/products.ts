import { Router } from "express";

import type { ProductsResponse } from "@contracts/product.contract.js";

import { products } from "@server/data/products.js";
import {
    isValidProductCategory,
    isValidProductStatus,
} from "@server/utils/productValidators.js";

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
        return res.status(400).json({
            message: "Invalid status",
        });
    }

    if (
        category &&
        !isValidProductCategory(category)
    ) {
        return res.status(400).json({
            message: "Invalid category",
        });
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
        items,
        pagination: {
            page,
            pageSize,
            total: filteredProducts.length,
            totalPages: Math.ceil(
                filteredProducts.length / pageSize,
            ),
        },
    };

    return res.json(response);
});