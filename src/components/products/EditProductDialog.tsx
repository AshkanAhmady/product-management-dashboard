import type { Product, ProductsResponse } from "@contracts/product.contract";

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

                const previousQueries =
                    queryClient.getQueriesData<ProductsResponse>({
                        queryKey: ["products"],
                    });

                queryClient.setQueriesData<ProductsResponse>(
                    {
                        queryKey: ["products"],
                    },
                    (oldData) => {
                        if (!oldData?.data) {
                            return oldData;
                        }

                        return {
                            ...oldData,
                            data: {
                                ...oldData.data,
                                items: oldData.data.items.map((item) =>
                                    item.id === id
                                        ? {
                                            ...item,
                                            ...data,
                                        }
                                        : item,
                                ),
                            },
                        };
                    },
                );

                return {
                    previousQueries,
                };
            },

            onError: (_error, _variables, context) => {
                context?.previousQueries.forEach(
                    ([queryKey, previousData]) => {
                        queryClient.setQueryData(
                            queryKey,
                            previousData,
                        );
                    },
                );

                toast.error("Failed to update product");
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
                    (oldData) => {
                        if (!oldData?.data) {
                            return oldData;
                        }

                        return {
                            ...oldData,
                            data: {
                                ...oldData.data,
                                items: oldData.data.items.map((item) =>
                                    item.id === updatedProduct.id
                                        ? updatedProduct
                                        : item,
                                ),
                            },
                        };
                    },
                );

                toast.success("Product updated successfully");

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