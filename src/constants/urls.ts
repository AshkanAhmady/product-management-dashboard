export const API_URLS = {
    PRODUCTS: {
        LIST: "/products",
        CREATE: "/products",
        CHECK_SKU: "/products/check-sku",
        UPDATE: (id: string) => `/products/${id}`,
        DELETE: (id: string) => `/products/${id}`,
    },
} as const;