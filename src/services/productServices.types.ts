import type {
    GetProductsRequest,
    ProductsResponse,
} from "@contracts/product.contract";

export type GetProductsService = (
    params?: GetProductsRequest,
    signal?: AbortSignal,
) => Promise<ProductsResponse>;