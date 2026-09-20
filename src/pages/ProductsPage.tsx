import ProductTable from "@/components/products/ProductTable";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useQueryRequest } from "@/hooks/reactQuery/useQueryRequest";
import { getProducts } from "@/services/productServices";

const ProductsPage = () => {
  const params = useProductFilters();

  const { data, isLoading, isError, error } = useQueryRequest({
    queryKey: ["products", params],
    queryFn: getProducts,
    data: params,
  });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const products = data?.data?.items ?? [];

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Products</h1>

          <p className="text-muted-foreground">Manage your products</p>
        </div>

        <ProductTable products={products} />
      </div>
    </main>
  );
};

export default ProductsPage;
