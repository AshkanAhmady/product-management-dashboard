import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProductPaginationProps {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    disabled: boolean
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const ProductPagination = ({
    page,
    pageSize,
    total,
    totalPages,
    onPageChange,
    onPageSizeChange,
    disabled
}: ProductPaginationProps) => {
    const startItem =
        total === 0 ? 0 : (page - 1) * pageSize + 1;

    const endItem = Math.min(
        page * pageSize,
        total,
    );

    const isFirstPage = page <= 1;
    const isLastPage =
        totalPages === 0 || page >= totalPages;

    return (
        <div className="flex flex-col gap-4 border-t px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-muted-foreground text-sm">
                Showing{" "}
                <span className="text-foreground font-medium">
                    {startItem.toLocaleString()}
                </span>
                {"–"}
                <span className="text-foreground font-medium">
                    {endItem.toLocaleString()}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-medium">
                    {total.toLocaleString()}
                </span>{" "}
                products
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground whitespace-nowrap text-sm">
                        Rows per page
                    </span>

                    <Select
                        value={String(pageSize)}
                        disabled={disabled}
                        onValueChange={(value) =>
                            onPageSizeChange(Number(value))
                        }
                    >
                        <SelectTrigger className="h-9 w-20">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <SelectItem
                                    key={size}
                                    value={String(size)}
                                >
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between gap-2 sm:justify-start">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={disabled || isFirstPage}
                        onClick={() =>
                            onPageChange(page - 1)
                        }
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>

                    <div className="text-muted-foreground min-w-32 text-center text-sm">
                        Page{" "}
                        <span className="text-foreground font-medium">
                            {page.toLocaleString()}
                        </span>{" "}
                        of{" "}
                        <span className="text-foreground font-medium">
                            {totalPages.toLocaleString()}
                        </span>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={disabled || isLastPage}
                        onClick={() =>
                            onPageChange(page + 1)
                        }
                        aria-label="Next page"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductPagination;