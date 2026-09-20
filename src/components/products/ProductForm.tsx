import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";

import type {
    Product,
    ProductCategory,
    ProductStatus,
} from "@contracts/product.contract";
import {
    PRODUCT_CATEGORIES,
    PRODUCT_STATUSES,
} from "@contracts/product.contract";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    productFormSchema,
    type ProductFormValues,
} from "@/schemas/product.schema";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryRequest } from "@/hooks/reactQuery/useQueryRequest";
import { checkSku } from "@/services/productServices";
import { useEffect } from "react";

interface ProductFormProps {
    product?: Product;
    isSubmitting?: boolean;
    onSubmit: (values: ProductFormValues) => void;
    onCancel?: () => void;
}

const ProductForm = ({
    product,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: ProductFormProps) => {
    const isEditMode = Boolean(product);

    const {
        register,
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),

        defaultValues: {
            name: product?.name ?? "",
            sku: product?.sku ?? "",
            category: product?.category,
            status: product?.status ?? "active",
            price: product?.price ?? 0,
            weight: product?.weight ?? 0,
            stock: product?.stock ?? 0,
        },
    });

    const sku = useWatch({
        control,
        name: "sku",
    });

    const debouncedSku = useDebounce(
        sku?.trim(),
        400,
    );

    const {
        data: skuAvailability,
        isFetching: isCheckingSku,
    } = useQueryRequest({
        queryKey: ["products", "check-sku", debouncedSku],
        queryFn: checkSku,
        data: { sku: debouncedSku },
        options: {
            enabled: debouncedSku.length >= 3,
            retry: false,
        },
    });

    const normalizedSku = sku?.trim() ?? "";

    const isCurrentSku =
        normalizedSku === debouncedSku;

    useEffect(() => {
        if (
            !debouncedSku ||
            debouncedSku.length < 3 ||
            !isCurrentSku
        ) {
            return;
        }

        const isAvailable =
            skuAvailability?.data?.available;

        if (isAvailable === false) {
            setError("sku", {
                type: "server",
                message: "This SKU is already in use",
            });

            return;
        }

        if (
            isAvailable === true &&
            errors.sku?.type === "server"
        ) {
            clearErrors("sku");
        }
    }, [
        debouncedSku,
        isCurrentSku,
        skuAvailability,
        setError,
        clearErrors,
        errors.sku?.type,
    ]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
        >
            <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <Field
                    data-invalid={Boolean(errors.name)}
                    className="sm:col-span-2"
                >
                    <FieldLabel htmlFor="product-name">
                        Product name
                    </FieldLabel>

                    <Input
                        id="product-name"
                        placeholder="e.g. Wireless Headphones"
                        autoComplete="off"
                        aria-invalid={Boolean(errors.name)}
                        {...register("name")}
                    />

                    <FieldError>
                        {errors.name?.message}
                    </FieldError>
                </Field>

                <Field
                    data-invalid={Boolean(errors.sku)}
                    className="sm:col-span-2"
                >
                    <FieldLabel htmlFor="product-sku">
                        SKU
                    </FieldLabel>

                    <Input
                        id="product-sku"
                        placeholder="e.g. WH-1000XM"
                        autoComplete="off"
                        aria-invalid={Boolean(errors.sku)}
                        {...register("sku")}
                    />
                    {isCheckingSku && debouncedSku.length >= 3 && (
                        <FieldDescription>
                            Checking SKU availability...
                        </FieldDescription>
                    )}
                    {!isCheckingSku &&
                        debouncedSku.length >= 3 &&
                        skuAvailability?.data?.available === true &&
                        !errors.sku && (
                            <FieldDescription className="text-emerald-600 dark:text-emerald-400">
                                SKU is available.
                            </FieldDescription>
                        )}
                    <FieldError>
                        {errors.sku?.message}
                    </FieldError>
                </Field>

                <Controller
                    control={control}
                    name="category"
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Category</FieldLabel>

                            <Select
                                value={field.value}
                                onValueChange={(value) =>
                                    field.onChange(
                                        value as ProductCategory,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-invalid={fieldState.invalid}
                                >
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>

                                <SelectContent>
                                    {PRODUCT_CATEGORIES.map(
                                        (category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>

                            <FieldError>
                                {fieldState.error?.message}
                            </FieldError>
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="status"
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Status</FieldLabel>

                            <Select
                                value={field.value}
                                onValueChange={(value) =>
                                    field.onChange(
                                        value as ProductStatus,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-invalid={fieldState.invalid}
                                >
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>

                                <SelectContent>
                                    {PRODUCT_STATUSES.map(
                                        (status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status === "active"
                                                    ? "Active"
                                                    : "Inactive"}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>

                            <FieldError>
                                {fieldState.error?.message}
                            </FieldError>
                        </Field>
                    )}
                />

                <Field
                    data-invalid={Boolean(errors.price)}
                >
                    <FieldLabel htmlFor="product-price">
                        Price
                    </FieldLabel>

                    <Input
                        id="product-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        aria-invalid={Boolean(errors.price)}
                        {...register("price", {
                            valueAsNumber: true,
                        })}
                    />

                    <FieldError>
                        {errors.price?.message}
                    </FieldError>
                </Field>

                <Field
                    data-invalid={Boolean(errors.weight)}
                >
                    <FieldLabel htmlFor="product-weight">
                        Weight
                    </FieldLabel>

                    <Input
                        id="product-weight"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        aria-invalid={Boolean(errors.weight)}
                        {...register("weight", {
                            valueAsNumber: true,
                        })}
                    />

                    <FieldDescription>
                        Must be greater than 0 for Electronics.
                    </FieldDescription>

                    <FieldError>
                        {errors.weight?.message}
                    </FieldError>
                </Field>

                <Field
                    data-invalid={Boolean(errors.stock)}
                >
                    <FieldLabel htmlFor="product-stock">
                        Stock
                    </FieldLabel>

                    <Input
                        id="product-stock"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        aria-invalid={Boolean(errors.stock)}
                        {...register("stock", {
                            valueAsNumber: true,
                        })}
                    />

                    <FieldError>
                        {errors.stock?.message}
                    </FieldError>
                </Field>
            </FieldGroup>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        isCheckingSku ||
                        errors.sku?.type === "server"
                    }
                >
                    {isSubmitting && (
                        <Loader2 className="size-4 animate-spin" />
                    )}

                    {isEditMode
                        ? "Save changes"
                        : "Add product"}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;