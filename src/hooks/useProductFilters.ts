import { useSearchParams } from "react-router-dom";

import type {
    GetProductsRequest,
    ProductCategory,
    ProductStatus,
} from "@contracts/product.contract";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export const useProductFilters = () => {
    const [searchParams] = useSearchParams();

    const rawPage = Number(searchParams.get("page"));
    const rawPageSize = Number(
        searchParams.get("pageSize"),
    );

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const params: GetProductsRequest = {
        page:
            Number.isInteger(rawPage) && rawPage > 0
                ? rawPage
                : DEFAULT_PAGE,

        pageSize:
            Number.isInteger(rawPageSize) &&
                rawPageSize > 0 &&
                rawPageSize <= 100
                ? rawPageSize
                : DEFAULT_PAGE_SIZE,

        ...(search && {
            search,
        }),

        ...(status && {
            status: status as ProductStatus,
        }),

        ...(category && {
            category: category as ProductCategory,
        }),
    };

    return params;
};