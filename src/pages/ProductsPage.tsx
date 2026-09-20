import ProductTable from "@/components/products/ProductTable";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useQueryRequest } from "@/hooks/reactQuery/useQueryRequest";
import { deleteProduct, getProducts } from "@/services/productServices";
import ProductToolbar from "@/components/products/ProductToolbar";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import ProductErrorState from "@/components/products/ProductErrorState";
import ProductEmptyState from "@/components/products/ProductEmptyState";
import ProductPagination from "@/components/products/ProductPagination";
import AddProductDialog from "@/components/products/AddProductDialog";
import type { Product, ProductsResponse } from "@contracts/product.contract";
import EditProductDialog from "@/components/products/EditProductDialog";
import DeleteProductDialog from "@/components/products/DeleteProductDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationRequest } from "@/hooks/reactQuery/useMutationRequest";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

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

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [deletingProduct, setDeletingProduct] =
    useState<Product | null>(null);

  const [searchValue, setSearchValue] = useState(
    () => params.search ?? "",
  );

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

  const queryClient = useQueryClient();

  const {
    mutateAsync: mutateDeleteProduct,
    isPending: isDeleting,
  } = useMutationRequest({
    mutationFn: deleteProduct,

    options: {
      onMutate: async (product) => {
        await queryClient.cancelQueries({
          queryKey: ["products"],
        });

        const previousQueries =
          queryClient.getQueriesData<ProductsResponse>({
            queryKey: ["products"],
          });

        queryClient.setQueriesData<ProductsResponse>(
          {
            queryKey: ["products"],
          },
          (cachedData) => {
            if (!cachedData?.data) {
              return cachedData;
            }

            const exists = cachedData.data.items.some(
              (item) => item.id === product.id,
            );

            if (!exists) {
              return cachedData;
            }

            const total = Math.max(
              cachedData.data.pagination.total - 1,
              0,
            );

            return {
              ...cachedData,
              data: {
                ...cachedData.data,

                items: cachedData.data.items.filter(
                  (item) => item.id !== product.id,
                ),

                pagination: {
                  ...cachedData.data.pagination,
                  total,
                  totalPages: Math.ceil(
                    total /
                    cachedData.data.pagination.pageSize,
                  ),
                },
              },
            };
          },
        );

        return {
          previousQueries,
        };
      },

      onError: (_error, _productId, context) => {
        context?.previousQueries.forEach(
          ([queryKey, previousData]) => {
            queryClient.setQueryData(
              queryKey,
              previousData,
            );
          },
        );

        toast.error("Failed to delete product");
      },

      onSuccess: () => {
        toast.success("Product deleted successfully");
        setDeletingProduct(null);
      },
    },
  });

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
    <><main className="bg-muted/20 min-h-screen">
      <div className="mx-auto max-w-360 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-8 flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Product Management
            </h1>

            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage and organize your product catalog.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
                  onEdit={setEditingProduct}
                  onDelete={setDeletingProduct}
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
      <EditProductDialog
        product={editingProduct}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProduct(null);
          }
        }}
      />
      <DeleteProductDialog
        product={deletingProduct}
        isDeleting={isDeleting}
        onConfirm={(productId) => {
          void mutateDeleteProduct({ id: productId }).catch(() => {
            // handled by onError
          });
        }}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeletingProduct(null);
          }
        }}
      />
    </>
  );
};

export default ProductsPage;
