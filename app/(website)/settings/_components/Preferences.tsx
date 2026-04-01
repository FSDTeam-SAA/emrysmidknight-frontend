import type { ThemeMode } from "@/components/providers/ThemeProvider";
import { RadioOption } from "./Controls";

type PreferencesProps = {
  theme: ThemeMode;
  onChangeTheme: (value: ThemeMode) => void;
};

export default function Preferences({
  theme,
  onChangeTheme,
}: PreferencesProps) {
  const handleChange = (value: string) => {
    if (value === "light" || value === "dark") {
      onChangeTheme(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-white px-4 py-4 shadow-md transition dark:bg-white/5 sm:px-6 sm:py-5">
        <p className="mb-4 text-lg font-medium text-[color:var(--text-primary)] sm:text-xl">
          Theme
        </p>

        <div className="flex flex-col gap-3">
          <RadioOption
            label="Dark Mode"
            value="dark"
            selected={theme}
            onChange={handleChange}
          />

          <RadioOption
            label="Light Mode"
            value="light"
            selected={theme}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}