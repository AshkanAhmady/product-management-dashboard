import type { Product } from "@contracts/product.contract";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteProductDialogProps {
    product: Product | null;
    isDeleting?: boolean;
    onConfirm: (productId: string) => void;
    onOpenChange: (open: boolean) => void;
}

const DeleteProductDialog = ({
    product,
    isDeleting = false,
    onConfirm,
    onOpenChange,
}: DeleteProductDialogProps) => (


    <AlertDialog
        open={Boolean(product)}
        onOpenChange={onOpenChange}
    >
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Delete product?
                </AlertDialogTitle>

                <AlertDialogDescription>
                    This will permanently delete{" "}
                    <strong>{product?.name}</strong>. This action
                    cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                </AlertDialogCancel>

                <Button
                    variant="destructive"
                    disabled={isDeleting || !product}
                    onClick={() => {
                        if (product) {
                            onConfirm(product.id);
                        }
                    }}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default DeleteProductDialog;