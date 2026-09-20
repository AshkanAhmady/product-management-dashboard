import type {
    GetProductsRequest,
    ProductsResponse,
} from "@contracts/product.contract";

import { apiCaller } from "@/api/apiCaller";
import type { GetProductsService } from "./productServices.types";
import { API_URLS } from "@/constants/urls";

export const getProducts: GetProductsService = (
    params,
    signal,
) =>
    apiCaller<ProductsResponse, never, GetProductsRequest>(API_URLS.PRODUCTS.LIST, {
        params,
        signal,
    });