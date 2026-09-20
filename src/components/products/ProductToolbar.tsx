import {
    Search,
    X,
} from "lucide-react";

import {
    PRODUCT_CATEGORIES,
    type ProductCategory,
    type ProductStatus,
} from "@contracts/product.contract";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProductToolbarProps {
    search: string;
    status?: ProductStatus;
    category?: ProductCategory;
    hasFilters: boolean;
    onSearchChange: (value: string) => void;
    onStatusChange: (
        value?: ProductStatus,
    ) => void;
    onCategoryChange: (
        value?: ProductCategory,
    ) => void;
    onClearFilters: () => void;
    actions?: React.ReactNode;
}

const ProductToolbar = ({
    search,
    status,
    category,
    hasFilters,
    onSearchChange,
    onStatusChange,
    onCategoryChange,
    onClearFilters,
    actions
}: ProductToolbarProps) => {

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

                <Input
                    value={search}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    placeholder="Search by name or SKU..."
                    className="h-10 pr-9 pl-9"
                />

                {search && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => onSearchChange("")}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors duration-150"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
                <Select
                    value={status}
                    onValueChange={(value) =>
                        onStatusChange(value as ProductStatus)
                    }
                >
                    <SelectTrigger className="h-10 w-full sm:w-36">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="active">
                            Active
                        </SelectItem>

                        <SelectItem value="inactive">
                            Inactive
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={category}
                    onValueChange={(value) =>
                        onCategoryChange(value as ProductCategory)
                    }
                >
                    <SelectTrigger className="h-10 w-full sm:w-40">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>

                    <SelectContent>
                        {PRODUCT_CATEGORIES.map((item) => (
                            <SelectItem
                                key={item}
                                value={item}
                            >
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {hasFilters && (
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onClearFilters}
                    className="gap-2"
                >
                    <X className="size-4" />
                    Clear
                </Button>
            )}

            {actions}
        </div>
    );
};

export default ProductToolbar;