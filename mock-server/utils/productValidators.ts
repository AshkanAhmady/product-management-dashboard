import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  type ProductCategory,
  type ProductStatus,
} from "@contracts/product.contract.js";

export const isValidProductStatus = (
  value: string,
): value is ProductStatus =>
  PRODUCT_STATUSES.some(
    (status) => status === value,
  );

export const isValidProductCategory = (
  value: string,
): value is ProductCategory =>
  PRODUCT_CATEGORIES.some(
    (category) => category === value,
  );