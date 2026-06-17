import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const defaultThemeContext = {
  primaryColor: "#B38A2D",
  secondaryColor: "#E1BE5D",
  fontFamily: "Inter, sans-serif",
  theme: "dark", // or 'light'
  setPrimaryColor: () => {},
  setSecondaryColor: () => {},
  setFontFamily: () => {},
  setTheme: () => {},
};

const ThemeContext = createContext(defaultThemeContext);

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState("#B38A2D");
  const [secondaryColor, setSecondaryColor] = useState("#E1BE5D");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [theme, setTheme] = useState("dark");

  // Load saved preferences
  useEffect(() => {
    const savedPrimary = localStorage.getItem("primaryColor");
    const savedSecondary = localStorage.getItem("secondaryColor");
    const savedFont = localStorage.getItem("fontFamily");
    const savedTheme = localStorage.getItem("theme");

    if (savedPrimary) setPrimaryColor(savedPrimary);
    if (savedSecondary) setSecondaryColor(savedSecondary);
    if (savedFont) setFontFamily(savedFont);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Apply theme + vars
  useEffect(() => {
    const root = document.documentElement;

    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("secondaryColor", secondaryColor);
    localStorage.setItem("fontFamily", fontFamily);
    localStorage.setItem("theme", theme);

    root.style.setProperty("--primary-color", primaryColor);
    root.style.setProperty("--secondary-color", secondaryColor);
    root.style.setProperty("--font-family", fontFamily);

    // Apply theme class to root
    document.documentElement.setAttribute("data-theme", theme);
  }, [primaryColor, secondaryColor, fontFamily, theme]);

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        secondaryColor,
        fontFamily,
        setPrimaryColor,
        setSecondaryColor,
        setFontFamily,
      }}
    >
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="font-sans" style={{ fontFamily }}>
          {children}
        </div>
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}
