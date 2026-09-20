import type {
    GetProductsRequest,
    Product,
} from "@contracts/product.contract";

export const productMatchesFilters = (
    product: Product,
    params: GetProductsRequest,
) => {
    if (
        params.status &&
        product.status !== params.status
    ) {
        return false;
    }

    if (
        params.category &&
        product.category !== params.category
    ) {
        return false;
    }

    if (params.search) {
        const search =
            params.search.trim().toLowerCase();

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search) ||
            product.sku
                .toLowerCase()
                .includes(search);

        if (!matchesSearch) {
            return false;
        }
    }

    return true;
};