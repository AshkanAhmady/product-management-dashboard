import express from "express";
import type { ProductsResponse } from "../shared/contracts/product.contract.js";
import { products } from "./data/products.js";

const app = express();

const PORT = 3001;

app.use(express.json());

app.get("/api/products", (req, res) => {
    const page = Math.max(
        Number(req.query.page) || 1,
        1,
    );

    const pageSize = Math.min(
        Math.max(Number(req.query.pageSize) || 20, 1),
        100,
    );

    const start = (page - 1) * pageSize;

    const items = products.slice(
        start,
        start + pageSize,
    );

    const response: ProductsResponse = {
        items,
        pagination: {
            page,
            pageSize,
            total: products.length,
            totalPages: Math.ceil(
                products.length / pageSize,
            ),
        },
    };

    res.json(response);
});

app.listen(PORT, () => {
    console.log(
        `Mock API running on http://localhost:${PORT}`,
    );
});