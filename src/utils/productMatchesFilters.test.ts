import { describe, expect, it } from "vitest";

import type { Product } from "@contracts/product.contract";

import { productMatchesFilters } from "./productMatchesFilters";

const product: Product = {
    id: "1",
    name: "iPhone 16 Pro",
    sku: "IPHONE-16-PRO",
    category: "Electronics",
    status: "active",
    price: 999,
    weight: 0.2,
    stock: 10,
    createdAt: "2026-01-01T00:00:00.000Z",
};

describe("productMatchesFilters", () => {
    it("matches when there are no filters", () => {
        expect(
            productMatchesFilters(product, {}),
        ).toBe(true);
    });

    it("matches the correct status", () => {
        expect(
            productMatchesFilters(product, {
                status: "active",
            }),
        ).toBe(true);
    });

    it("rejects a different status", () => {
        expect(
            productMatchesFilters(product, {
                status: "inactive",
            }),
        ).toBe(false);
    });

    it("matches the correct category", () => {
        expect(
            productMatchesFilters(product, {
                category: "Electronics",
            }),
        ).toBe(true);
    });

    it("matches search by product name case-insensitively", () => {
        expect(
            productMatchesFilters(product, {
                search: "IPHONE",
            }),
        ).toBe(true);
    });

    it("matches search by SKU case-insensitively", () => {
        expect(
            productMatchesFilters(product, {
                search: "iphone-16",
            }),
        ).toBe(true);
    });

    it("requires all active filters to match", () => {
        expect(
            productMatchesFilters(product, {
                status: "active",
                category: "Books",
                search: "iphone",
            }),
        ).toBe(false);
    });
});