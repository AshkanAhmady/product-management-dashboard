import { useSearchParams } from "react-router-dom";
import type {
    GetProductsRequest,
    ProductCategory,
    ProductStatus,
} from "@contracts/product.contract";
import { useCallback } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export const useProductFilters = () => {
    const [searchParams, setSearchParams] =
        useSearchParams();

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

    const updateFilter = useCallback(
        (
            key: "search" | "status" | "category",
            value?: string,
        ) => {
            setSearchParams((currentParams) => {
                const nextParams = new URLSearchParams(
                    currentParams,
                );

                if (value) {
                    nextParams.set(key, value);
                } else {
                    nextParams.delete(key);
                }

                nextParams.set("page", "1");

                return nextParams;
            });
        },
        [setSearchParams],
    );

    const clearFilters = useCallback(() => {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(
                currentParams,
            );

            nextParams.delete("search");
            nextParams.delete("status");
            nextParams.delete("category");

            nextParams.set("page", "1");

            return nextParams;
        });
    }, [setSearchParams]);

    const setSearch = useCallback(
        (value: string) => {
            updateFilter("search", value);
        },
        [updateFilter],
    );

    const setStatus = useCallback(
        (value?: ProductStatus) => {
            updateFilter("status", value);
        },
        [updateFilter],
    );

    const setCategory = useCallback(
        (value?: ProductCategory) => {
            updateFilter("category", value);
        },
        [updateFilter],
    );

    return {
        params,
        setSearch,
        setStatus,
        setCategory,
        clearFilters
    };
};