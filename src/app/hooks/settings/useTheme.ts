import { useLayoutEffect, useState } from "react";

export const useTheme = () => {
  const isDarkTheme =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const defaultTheme = isDarkTheme ? "dark" : "light";

  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("next-theme") || defaultTheme
      : "light"
  );

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("next-theme", theme);
    }
  }, [theme]);

  return { theme, setTheme };
};
