import {
    describe,
    expect,
    it,
} from "vitest";

import { productFormSchema } from "./product.schema";

const validProduct = {
    name: "Wireless Headphones",
    sku: "WH-001",
    category: "Electronics" as const,
    status: "active" as const,
    price: 249.99,
    weight: 0.5,
    stock: 10,
};

describe("productFormSchema", () => {
    it("accepts a valid product", () => {
        const result =
            productFormSchema.safeParse(validProduct);

        expect(result.success).toBe(true);
    });

    it("rejects an electronics product with zero weight", () => {
        const result =
            productFormSchema.safeParse({
                ...validProduct,
                weight: 0,
            });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(
                result.error.flatten().fieldErrors.weight,
            ).toContain(
                "Electronics products must have a weight greater than 0",
            );
        }
    });

    it("allows zero weight for non-electronics products", () => {
        const result =
            productFormSchema.safeParse({
                ...validProduct,
                category: "Books",
                weight: 0,
            });

        expect(result.success).toBe(true);
    });

    it("rejects negative price", () => {
        const result =
            productFormSchema.safeParse({
                ...validProduct,
                price: -1,
            });

        expect(result.success).toBe(false);
    });

    it("rejects negative stock", () => {
        const result =
            productFormSchema.safeParse({
                ...validProduct,
                stock: -1,
            });

        expect(result.success).toBe(false);
    });

    it("rejects non-integer stock", () => {
        const result =
            productFormSchema.safeParse({
                ...validProduct,
                stock: 2.5,
            });

        expect(result.success).toBe(false);
    });

    it("rejects a SKU shorter than 3 characters", () => {
        const result =
            productFormSchema.safeParse({
                ...validProduct,
                sku: "AB",
            });

        expect(result.success).toBe(false);
    });
});