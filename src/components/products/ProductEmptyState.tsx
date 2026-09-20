import {
    PackageOpen,
    RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProductEmptyStateProps {
    hasFilters?: boolean;
    onClearFilters?: () => void;
}

const ProductEmptyState = ({
    hasFilters = false,
    onClearFilters,
}: ProductEmptyStateProps) => {
    return (
        <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="bg-muted text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-full">
                <PackageOpen className="size-6" />
            </div>

            <h2 className="text-lg font-semibold">
                {hasFilters
                    ? "No matching products"
                    : "No products yet"}
            </h2>

            <p className="text-muted-foreground mt-2 max-w-md text-sm">
                {hasFilters
                    ? "No products match your current search or filters. Try adjusting or clearing them."
                    : "There are no products to display yet. Add your first product to get started."}
            </p>

            {hasFilters && onClearFilters && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClearFilters}
                    className="mt-6 gap-2"
                >
                    <RotateCcw className="size-4" />
                    Clear filters
                </Button>
            )}
        </div>
    );
};

export default ProductEmptyState;