import { Loader2 } from "lucide-react";
import { useThemeContext } from "../theme/ThemeProvider";

export default function CircularLoading() {
  const { primaryColor } = useThemeContext();

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <Loader2
        className="w-12 h-12 animate-spin"
        style={{ color: primaryColor }}
      />
    </div>
  );
}
