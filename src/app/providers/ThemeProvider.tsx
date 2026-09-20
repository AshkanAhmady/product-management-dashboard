/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeProviderContext =
    createContext<ThemeProviderState | undefined>(
        undefined,
    );

export const ThemeProvider = ({
    children,
    defaultTheme = "system",
    storageKey = "product-dashboard-theme",
}: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem(
            storageKey,
        ) as Theme | null;

        return storedTheme ?? defaultTheme;
    });

    useEffect(() => {
        const root = document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
    };

    return (
        <ThemeProviderContext.Provider
            value={{ theme, setTheme }}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (!context) {
        throw new Error(
            "useTheme must be used within a ThemeProvider",
        );
    }

    return context;
};