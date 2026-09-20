import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProductErrorStateProps {
    message: string;
    onRetry: () => void;
    isRetrying?: boolean;
}

const ProductErrorState = ({
    message,
    onRetry,
    isRetrying = false,
}: ProductErrorStateProps) => {
    return (
        <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="bg-destructive/10 text-destructive mb-4 flex size-12 items-center justify-center rounded-full">
                <AlertCircle className="size-6" />
            </div>

            <h2 className="text-lg font-semibold">
                Unable to load products
            </h2>

            <p className="text-muted-foreground mt-2 max-w-md text-sm">
                {message}
            </p>

            <Button
                type="button"
                variant="outline"
                onClick={onRetry}
                disabled={isRetrying}
                className="mt-6 gap-2"
            >
                <RefreshCw
                    className={
                        isRetrying
                            ? "size-4 animate-spin"
                            : "size-4"
                    }
                />

                {isRetrying ? "Retrying..." : "Try again"}
            </Button>
        </div>
    );
};

export default ProductErrorState;