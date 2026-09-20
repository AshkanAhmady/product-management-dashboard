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

  return (
    <div>
      <h1>Products</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ProductsPage;
