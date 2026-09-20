import ProductTable from "@/components/products/ProductTable";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useQueryRequest } from "@/hooks/reactQuery/useQueryRequest";
import { getProducts } from "@/services/productServices";
import ProductToolbar from "@/components/products/ProductToolbar";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import ProductErrorState from "@/components/products/ProductErrorState";
import ProductEmptyState from "@/components/products/ProductEmptyState";
import ProductPagination from "@/components/products/ProductPagination";
import AddProductDialog from "@/components/products/AddProductDialog";

const ProductsPage = () => {
  const {
    params,
    setSearch,
    setStatus,
    setCategory,
    setPage,
    setPageSize,
    clearFilters
  } = useProductFilters();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isPlaceholderData
  } = useQueryRequest({
    queryKey: ["products", params],
    queryFn: getProducts,
    data: params,
    options: {
      placeholderData: (previousData) => previousData,
    },
  });

  const [searchValue, setSearchValue] = useState(
    () => params.search ?? "",
  );

  const debouncedSearch = useDebounce(
    searchValue,
    400,
  );

  useEffect(() => {
    const normalizedSearch =
      debouncedSearch.trim();

    if (normalizedSearch === (params.search ?? "")) {
      return;
    }

    setSearch(normalizedSearch);
  }, [
    debouncedSearch,
    params.search,
    setSearch,
  ]);

  const products = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  const hasFilters = Boolean(
    params.search ||
    params.status ||
    params.category,
  );

  const handleClearFilters = () => {
    setSearchValue("");
    clearFilters();
  };

  return (
    <main className="bg-muted/20 min-h-screen">
      <div className="mx-auto max-w-360 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Product Management
            </h1>

            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage and organize your product catalog.
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <ProductToolbar
            search={searchValue}
            status={params.status}
            category={params.category}
            hasFilters={hasFilters}
            onSearchChange={setSearchValue}
            onStatusChange={setStatus}
            onCategoryChange={setCategory}
            onClearFilters={handleClearFilters}
            actions={<AddProductDialog />}
          />

          <div className="bg-card relative overflow-hidden rounded-xl border">
            {isFetching && !isLoading && (
              <div className="bg-primary/10 absolute inset-x-0 top-0 z-20 h-0.5 overflow-hidden">
                <div className="bg-primary animate-loading-progress h-full w-1/3 rounded-full" />
              </div>
            )}

            {isError ? (
              <ProductErrorState
                message={error.message}
                onRetry={() => void refetch()}
                isRetrying={isFetching}
              />
            ) : !isLoading && products.length === 0 ? (
              <ProductEmptyState
                hasFilters={hasFilters}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <div
                className={
                  isPlaceholderData
                    ? "opacity-75 transition-opacity duration-200"
                    : "opacity-100 transition-opacity duration-200"
                }
              >
                <ProductTable
                  products={products}
                  isLoading={isLoading}
                />

                {!isLoading && pagination && (
                  <ProductPagination
                    page={pagination.page}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    disabled={isPlaceholderData}
                  />
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductsPage;
