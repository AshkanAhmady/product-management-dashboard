import express from "express";
import { productsRouter } from "@server/routes/products.js";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { mockDelay } from "./middlewares/mockDelay.ts";
import { mockFailure } from "./middlewares/mockFailure.ts";

const app = express();

const PORT = 3001;

app.use(express.json());

app.use(mockDelay);

app.use(mockFailure);

app.use("/api/products", productsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(
        `Mock API running on http://localhost:${PORT}`,
    );
});