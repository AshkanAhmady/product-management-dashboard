import type { ApiResponse } from "./api.contract.js";

export const PRODUCT_CATEGORIES = [
    "Electronics",
    "Clothing",
    "Home",
    "Books",
    "Sports",
] as const;

export const PRODUCT_STATUSES = [
    "active",
    "inactive",
] as const;

export type ProductCategory =
    (typeof PRODUCT_CATEGORIES)[number];

export type ProductStatus =
    (typeof PRODUCT_STATUSES)[number];

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: ProductCategory;
    status: ProductStatus;
    price: number;
    weight: number;
    stock: number;
    createdAt: string;
}

export interface CheckSkuResponseData {
    available: boolean;
}

export type CheckSkuResponse =
    ApiResponse<CheckSkuResponseData>;

export interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}

export interface GetProductsRequest {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: ProductStatus;
    category?: ProductCategory;
}

export type ProductsResponse =
    ApiResponse<PaginatedResponse<Product>>;

export interface CreateProductRequest {
    name: string;
    sku: string;
    category: ProductCategory;
    status: ProductStatus;
    price: number;
    weight: number;
    stock: number;
}

export type CreateProductResponse = ApiResponse<Product>;