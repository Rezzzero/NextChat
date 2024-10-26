import { useTheme } from "@/app/hooks/settings/useTheme";

export const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p className="text-lg font-bold">Выбрать тему:</p>
      <div className="flex gap-12">
        <button
          type="button"
          className={`${
            theme === "light"
              ? "text-white bg-filterButtonActive"
              : "text-black bg-filterButton border-2 border-filterButtonBorder"
          } text-lg w-[250px] py-1 my-2 rounded-lg`}
          onClick={() => setTheme("light")}
        >
          Светлая
        </button>
        <button
          type="button"
          className={`${
            theme === "dark"
              ? "text-white bg-filterButtonActive"
              : "text-black bg-filterButton border-2 border-filterButtonBorder"
          } text-lg w-[250px] py-1 my-2 rounded-lg`}
          onClick={() => setTheme("dark")}
        >
          Темная
        </button>
      </div>
    </div>
  );
};
