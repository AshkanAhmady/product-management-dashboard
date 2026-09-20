import { useSearchParams } from "react-router-dom";
import type {
    GetProductsRequest,
    ProductCategory,
    ProductStatus,
} from "@contracts/product.contract";
import { useCallback, useEffect } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export const useProductFilters = () => {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    const rawPage = Number(pageParam);
    const rawPageSize = Number(pageSizeParam);

    const page =
        Number.isInteger(rawPage) && rawPage > 0
            ? rawPage
            : DEFAULT_PAGE;

    const pageSize =
        Number.isInteger(rawPageSize) &&
            rawPageSize > 0 &&
            rawPageSize <= 100
            ? rawPageSize
            : DEFAULT_PAGE_SIZE;

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const params: GetProductsRequest = {
        page,
        pageSize,

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

    useEffect(() => {
        const isPageValid =
            pageParam !== null &&
            Number.isInteger(rawPage) &&
            rawPage > 0;

        const isPageSizeValid =
            pageSizeParam !== null &&
            Number.isInteger(rawPageSize) &&
            rawPageSize > 0 &&
            rawPageSize <= 100;

        if (isPageValid && isPageSizeValid) {
            return;
        }

        const nextParams = new URLSearchParams(
            searchParams,
        );

        if (!isPageValid) {
            nextParams.set(
                "page",
                String(DEFAULT_PAGE),
            );
        }

        if (!isPageSizeValid) {
            nextParams.set(
                "pageSize",
                String(DEFAULT_PAGE_SIZE),
            );
        }

        setSearchParams(nextParams, {
            replace: true,
        });
    }, [
        pageParam,
        pageSizeParam,
        rawPage,
        rawPageSize,
        searchParams,
        setSearchParams,
    ]);

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

    const setPage = useCallback(
        (page: number) => {
            setSearchParams((currentParams) => {
                const nextParams = new URLSearchParams(
                    currentParams,
                );

                nextParams.set("page", String(page));

                return nextParams;
            });
        },
        [setSearchParams],
    );

    const setPageSize = useCallback(
        (pageSize: number) => {
            setSearchParams((currentParams) => {
                const nextParams = new URLSearchParams(
                    currentParams,
                );

                nextParams.set(
                    "pageSize",
                    String(pageSize),
                );

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

    return {
        params,
        setSearch,
        setStatus,
        setCategory,
        setPage,
        setPageSize,
        clearFilters
    };
};