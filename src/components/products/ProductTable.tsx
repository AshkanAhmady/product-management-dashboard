import type { Product } from "@contracts/product.contract";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductTableProps {
  products: Product[];
}

const ProductTable = ({ products }: ProductTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.status}</TableCell>
            <TableCell>${product.price.toLocaleString()}</TableCell>
            <TableCell>{product.weight}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              {new Date(product.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
