import { Skeleton } from "@/components/ui/skeleton";

const PageLoader = () => {
    return (
        <main className="bg-muted/20 min-h-screen">
            <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="mb-8 space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-80 max-w-full" />
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <Skeleton className="h-10 flex-1" />

                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-10 w-full sm:w-36" />
                            <Skeleton className="h-10 w-full sm:w-40" />
                        </div>

                        <Skeleton className="h-10 w-full lg:w-32" />
                    </div>

                    <div className="bg-card overflow-hidden rounded-xl border p-4">
                        <div className="space-y-4">
                            {Array.from({ length: 8 }).map(
                                (_, index) => (
                                    <Skeleton
                                        key={index}
                                        className="h-10 w-full"
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PageLoader;