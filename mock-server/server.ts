import express from "express";

import { productsRouter } from "@server/routes/products.js";

const app = express();

const PORT = 3001;

app.use(express.json());

app.use("/api/products", productsRouter);

app.listen(PORT, () => {
    console.log(
        `Mock API running on http://localhost:${PORT}`,
    );
});