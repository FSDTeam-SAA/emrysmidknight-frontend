import type { ThemeMode } from "@/components/providers/ThemeProvider";
import { RadioOption } from "./Controls";

type PreferencesProps = {
  theme: ThemeMode;
  onChangeTheme: (value: ThemeMode) => void;
};

export default function Preferences({ theme, onChangeTheme }: PreferencesProps) {
  const handleChange = (value: string) => {
    if (value === "light" || value === "dark") {
      onChangeTheme(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-white/5 shadow-md rounded-xl px-6 py-5 transition">
        
        <p className="text-xl font-medium text-[color:var(--text-primary)] mb-4">
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
