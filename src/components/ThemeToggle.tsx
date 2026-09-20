import {
    Laptop,
    Moon,
    Sun,
} from "lucide-react";

import { useTheme } from "@/app/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ThemeToggle = () => {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Change theme"
                    >
                        <Sun className="size-4 dark:hidden" />
                        <Moon className="hidden size-4 dark:block" />
                    </Button>
                }
            />

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                >
                    <Sun className="size-4" />
                    Light
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                >
                    <Moon className="size-4" />
                    Dark
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                >
                    <Laptop className="size-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeToggle;