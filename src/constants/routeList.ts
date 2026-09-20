import { lazy } from "react";
import { ROUTES } from "@/constants/routes";

const ProductsPage = lazy(
    () => import("@/pages/ProductsPage"),
);

export const routeList = [
    {
        path: ROUTES.PRODUCTS,
        Element: ProductsPage,
    },
];