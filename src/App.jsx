import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router";

import { router } from "./routes";
import { useThemeContext } from "./components/theme/ThemeProvider";

function App() {
  const { primaryColor } = useThemeContext();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            color: "#000",
            border: "1px solid rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              // primary: "#B38A2D",
              primary: primaryColor,
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
