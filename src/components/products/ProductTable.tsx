import type { Product } from "@contracts/product.contract";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
}

const SKELETON_ROWS = 8;

const ProductTable = ({
  products,
  isLoading = false,
  onEdit
}: ProductTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>

          <TableHead className="hidden md:table-cell">
            Category
          </TableHead>

          <TableHead>Status</TableHead>

          <TableHead className="hidden sm:table-cell">
            Price
          </TableHead>

          <TableHead className="hidden lg:table-cell">
            Weight
          </TableHead>

          <TableHead className="hidden md:table-cell">
            Stock
          </TableHead>

          <TableHead className="hidden xl:table-cell">
            Created At
          </TableHead>
          <TableHead className="w-12">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading
          ? Array.from({ length: SKELETON_ROWS }).map(
            (_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-14" />
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-12" />
                </TableCell>

                <TableCell className="hidden xl:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto size-8" />
                </TableCell>

              </TableRow>
            ),
          )
          : products.map((product) => (
            <TableRow
              key={product.id}
              className="transition-colors duration-150"
            >
              <TableCell className="font-medium">
                {product.name}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {product.sku}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                {product.category}
              </TableCell>

              <TableCell>
                {product.status}
              </TableCell>

              <TableCell className="hidden sm:table-cell">
                ${product.price.toLocaleString()}
              </TableCell>

              <TableCell className="hidden lg:table-cell">
                {product.weight}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                {product.stock}
              </TableCell>

              <TableCell className="text-muted-foreground hidden xl:table-cell">
                {new Date(
                  product.createdAt,
                ).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${product.name}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(product)}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;