import { faker } from "@faker-js/faker";

import {
    PRODUCT_CATEGORIES,
    PRODUCT_STATUSES,
    type Product,
} from "@contracts/product.contract.js";

const PRODUCT_COUNT = 100_000;

export const products: Product[] = Array.from(
    { length: PRODUCT_COUNT },
    (_, index) => ({
        id: String(index + 1),

        name: faker.commerce.productName(),

        sku: `SKU-${String(index + 1).padStart(6, "0")}`,

        category: faker.helpers.arrayElement(
            PRODUCT_CATEGORIES,
        ),

        status: faker.helpers.arrayElement(
            PRODUCT_STATUSES,
        ),

        price: Number(
            faker.commerce.price({
                min: 10,
                max: 5000,
            }),
        ),

        weight: faker.number.float({
            min: 0.1,
            max: 20,
            fractionDigits: 2,
        }),

        stock: faker.number.int({
            min: 0,
            max: 500,
        }),

        createdAt: faker.date
            .between({
                from: "2024-01-01",
                to: new Date(),
            })
            .toISOString(),
    }),
);