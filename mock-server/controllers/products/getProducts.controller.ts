import type { ProductsResponse } from "@contracts/product.contract.js";
import { products } from "@server/data/products.js";
import { isValidProductCategory, isValidProductStatus } from "@server/utils/productValidators.js";
import type { Request, Response } from "express"

export const getProducts = (
    req: Request,
    res: Response
) => {
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
}