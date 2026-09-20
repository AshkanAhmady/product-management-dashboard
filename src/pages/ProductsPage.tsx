import { useQueryRequest } from "@/hooks/reactQuery/useQueryRequest";
import { getProducts } from "@/services/productServices";

const ProductsPage = () => {
  const { data, isLoading, isError, error } = useQueryRequest({
    queryKey: ["products"],
    queryFn: getProducts,
    data: {
      page: 1,
      pageSize: 20,
    },
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
