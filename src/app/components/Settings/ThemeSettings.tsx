import { useEffect, useState } from "react";
import { useTheme } from "@/app/hooks/settings/useTheme";

export const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (theme) {
      setLoaded(true);
    }
  }, [theme]);

  if (!loaded) {
    return null;
  }

  const lightButtonClass =
    theme === "light"
      ? "text-white bg-filterButtonActive"
      : "text-black bg-filterButton border-1 md:border-2 border-filterButtonBorder";

  const darkButtonClass =
    theme === "dark"
      ? "text-white bg-filterButtonActive"
      : "text-black bg-filterButton border-1 md:border-2 border-filterButtonBorder";

  return (
    <div>
      <p className="text-sm md:text-lg font-bold">Выбрать тему:</p>
      <div className="flex gap-4 md:gap-12">
        <button
          type="button"
          className={`${lightButtonClass} text-sm md:text-lg w-[180px] md:w-[250px] py-1 my-2 rounded-lg`}
          onClick={() => setTheme("light")}
        >
          Светлая
        </button>
        <button
          type="button"
          className={`${darkButtonClass} text-sm md:text-lg w-[180px] md:w-[250px] py-1 my-2 rounded-lg`}
          onClick={() => setTheme("dark")}
        >
          Темная
        </button>
      </div>
    </div>
  );
};
