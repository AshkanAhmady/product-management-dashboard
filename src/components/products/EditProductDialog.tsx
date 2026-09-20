import type { GetProductsRequest, Product, ProductsResponse } from "@contracts/product.contract";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import ProductForm from "./ProductForm";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMutationRequest } from "@/hooks/reactQuery/useMutationRequest";
import { updateProduct } from "@/services/productServices";
import type { ProductFormValues } from "@/schemas/product.schema";
import { productMatchesFilters } from "@/utils/productMatchesFilters";

interface EditProductDialogProps {
    product: Product | null;
    onOpenChange: (open: boolean) => void;
}

const EditProductDialog = ({ product, onOpenChange }: EditProductDialogProps) => {
    const open = Boolean(product);
    const queryClient = useQueryClient();

    const {
        mutateAsync,
        isPending,
    } = useMutationRequest({
        mutationFn: updateProduct,

        options: {
            onMutate: async ({ id, data }) => {
                await queryClient.cancelQueries({
                    queryKey: ["products"],
                });

                // Snapshot all currently cached product queries
                // so we can restore them if PATCH fails.
                const previousQueries =
                    queryClient.getQueriesData<ProductsResponse>({
                        queryKey: ["products"],
                    });

                previousQueries.forEach(
                    ([queryKey, cachedData]) => {
                        if (!cachedData?.data) {
                            return;
                        }

                        const existingProduct =
                            cachedData.data.items.find(
                                (item) => item.id === id,
                            );

                        // This product is not present on this cached page.
                        if (!existingProduct) {
                            return;
                        }

                        const params =
                            (queryKey[1] ?? {}) as GetProductsRequest;

                        const updatedProduct: Product = {
                            ...existingProduct,
                            ...data,
                        };

                        const stillMatchesFilters =
                            productMatchesFilters(
                                updatedProduct,
                                params,
                            );

                        // Product still belongs to this cached result.
                        if (stillMatchesFilters) {
                            queryClient.setQueryData<ProductsResponse>(
                                queryKey,
                                {
                                    ...cachedData,
                                    data: {
                                        ...cachedData.data,
                                        items: cachedData.data.items.map(
                                            (item) =>
                                                item.id === id
                                                    ? updatedProduct
                                                    : item,
                                        ),
                                    },
                                },
                            );

                            return;
                        }

                        // Product no longer matches this query's filters,
                        // so remove it from this cached result.
                        const total = Math.max(
                            cachedData.data.pagination.total - 1,
                            0,
                        );

                        queryClient.setQueryData<ProductsResponse>(
                            queryKey,
                            {
                                ...cachedData,
                                data: {
                                    ...cachedData.data,

                                    items: cachedData.data.items.filter(
                                        (item) => item.id !== id,
                                    ),

                                    pagination: {
                                        ...cachedData.data.pagination,
                                        total,
                                        totalPages: Math.ceil(
                                            total /
                                            cachedData.data.pagination.pageSize,
                                        ),
                                    },
                                },
                            },
                        );
                    },
                );

                return {
                    previousQueries,
                };
            },

            onError: (
                _error,
                _variables,
                context,
            ) => {
                // Restore every cache snapshot modified in onMutate.
                context?.previousQueries.forEach(
                    ([queryKey, previousData]) => {
                        queryClient.setQueryData(
                            queryKey,
                            previousData,
                        );
                    },
                );

                toast.error(
                    "Failed to update product",
                );
            },

            onSuccess: (response) => {
                const updatedProduct = response.data;

                if (!updatedProduct) {
                    return;
                }

                queryClient.setQueriesData<ProductsResponse>(
                    {
                        queryKey: ["products"],
                    },
                    (cachedData) => {
                        if (!cachedData?.data) {
                            return cachedData;
                        }

                        const productExists =
                            cachedData.data.items.some(
                                (item) =>
                                    item.id === updatedProduct.id,
                            );

                        if (!productExists) {
                            return cachedData;
                        }

                        return {
                            ...cachedData,
                            data: {
                                ...cachedData.data,

                                items: cachedData.data.items.map(
                                    (item) =>
                                        item.id === updatedProduct.id
                                            ? updatedProduct
                                            : item,
                                ),
                            },
                        };
                    },
                );

                toast.success(
                    "Product updated successfully",
                );

                onOpenChange(false);
            },
        },
    });

    const handleSubmit = async (
        values: ProductFormValues,
    ) => {
        if (!product) {
            return;
        }

        try {
            await mutateAsync({
                id: product.id,
                data: values,
            });
        } catch {
            // handled by mutation onError
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit product</DialogTitle>

                    <DialogDescription>
                        Update the product information.
                    </DialogDescription>
                </DialogHeader>

                {product && (
                    <ProductForm
                        product={product}
                        isSubmitting={isPending}
                        onSubmit={(values) => {
                            void handleSubmit(values);
                        }}
                        onCancel={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditProductDialog;