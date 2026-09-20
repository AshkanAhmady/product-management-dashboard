import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationRequest } from "@/hooks/reactQuery/useMutationRequest";
import { createProduct } from "@/services/productServices";
import { toast } from "sonner";
import type { ProductFormValues } from "@/schemas/product.schema";

const AddProductDialog = () => {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutationRequest({
        mutationFn: createProduct,
    });

    const handleSubmit = async (
        values: ProductFormValues,
    ) => {
        try {
            await mutateAsync(values);

            await queryClient.invalidateQueries({
                queryKey: ["products"],
            });

            toast.success("Product created successfully");

            setOpen(false);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create product",
            );
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger
                render={
                    <Button className="gap-2">
                        <Plus className="size-4" />
                        Add product
                    </Button>
                }
            />

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add product</DialogTitle>

                    <DialogDescription>
                        Add a new product to your catalog.
                    </DialogDescription>
                </DialogHeader>

                {open && (
                    <ProductForm
                        onSubmit={(values) => {
                            void handleSubmit(values);
                        }}
                        onCancel={() => setOpen(false)}
                        isSubmitting={isPending}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddProductDialog;