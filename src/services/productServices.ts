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
import { apiCaller } from "@/api/apiCaller";
import { API_URLS } from "@/constants/urls";
import type {
    CheckSkuService,
    CreateProductService,
    DeleteProductService,
    GetProductsService,
    UpdateProductService,
} from "./productServices.types";

export const getProducts: GetProductsService = (params, signal) =>
    apiCaller<ProductsResponse, never, GetProductsRequest>(API_URLS.PRODUCTS.LIST, {
        params,
        signal,
    });

export const checkSku: CheckSkuService = (params, signal) =>
    apiCaller<CheckSkuResponse, never, { sku: string }>(API_URLS.PRODUCTS.CHECK_SKU, {
        params,
        signal,
    });

export const createProduct: CreateProductService = (data, signal) =>
    apiCaller<CreateProductResponse, CreateProductRequest>(API_URLS.PRODUCTS.CREATE, {
        method: "POST",
        data,
        signal,
    });

export const updateProduct: UpdateProductService = ({ id, data }, signal) =>
    apiCaller<UpdateProductResponse, UpdateProductRequest>(API_URLS.PRODUCTS.UPDATE(id), {
        method: "PATCH",
        data,
        signal,
    });

export const deleteProduct: DeleteProductService = ({ id }, signal) =>
    apiCaller<DeleteProductResponse>(
        API_URLS.PRODUCTS.DELETE(id),
        {
            method: "DELETE",
            signal,
        },
    );