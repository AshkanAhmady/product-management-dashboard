import { z } from "zod";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
} from "@contracts/product.contract";

export const productFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required")
      .min(
        2,
        "Product name must be at least 2 characters",
      )
      .max(
        100,
        "Product name must be at most 100 characters",
      ),

    sku: z
      .string()
      .trim()
      .min(1, "SKU is required")
      .min(
        3,
        "SKU must be at least 3 characters",
      )
      .max(
        50,
        "SKU must be at most 50 characters",
      ),

    category: z.enum(PRODUCT_CATEGORIES, {
      error: "Category is required",
    }),

    status: z.enum(PRODUCT_STATUSES, {
      error: "Status is required",
    }),

    price: z
      .number({
        error: "Price is required",
      })
      .min(0, "Price cannot be negative"),

    weight: z
      .number({
        error: "Weight is required",
      })
      .min(0, "Weight cannot be negative"),

    stock: z
      .number({
        error: "Stock is required",
      })
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative"),
  })
  .superRefine((data, ctx) => {
    if (
      data.category === "Electronics" &&
      data.weight <= 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["weight"],
        message:
          "Electronics products must have a weight greater than 0",
      });
    }
  });

export type ProductFormValues = z.infer<
  typeof productFormSchema
>;