import type {
    CheckSkuResponse,
    CreateProductRequest,
    CreateProductResponse,
    DeleteProductResponse,
    GetProductsRequest,
    ProductsResponse,
    UpdateProductRequest,
    UpdateProductResponse,
} from "@contracts/product.contract";

export type GetProductsService = (
    params?: GetProductsRequest,
    signal?: AbortSignal,
) => Promise<ProductsResponse>;

export type CheckSkuService = (
    params: {
        sku: string;
    },
    signal?: AbortSignal,
) => Promise<CheckSkuResponse>;

export type CreateProductService = (
    data: CreateProductRequest,
) => Promise<CreateProductResponse>;

export type UpdateProductService = (
    variables: {
        id: string;
        data: UpdateProductRequest;
    },
) => Promise<UpdateProductResponse>;

export type DeleteProductService = (
    variables: {
        id: string;
    },
) => Promise<DeleteProductResponse>;