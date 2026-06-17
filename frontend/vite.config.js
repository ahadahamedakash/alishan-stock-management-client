/* eslint-disable no-undef */

import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core framework vendors
          "react-vendor": ["react", "react-dom"],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          "router-vendor": ["react-router", "react-router-dom"],

          // Heavy library vendors (lazy loaded)
          "pdf-vendor": ["@react-pdf/renderer"],
          "charts-vendor": ["recharts"],
          "date-picker-vendor": ["react-day-picker"],

          // UI component vendors
          "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu",
                        "@radix-ui/react-label", "@radix-ui/react-popover",
                        "@radix-ui/react-scroll-area", "@radix-ui/react-select",
                        "@radix-ui/react-slot", "@radix-ui/react-tabs"],

          // Utility vendors
          "utils-vendor": ["lucide-react", "clsx", "class-variance-authority",
                          "tailwind-merge", "date-fns"],
        },
      },
    },
  },

  // build: {
  //   chunkSizeWarningLimit: 500,
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes("components/analytics")) return "charts";
  //         if (
  //           id.includes("components/invoice") ||
  //           id.includes("pages/invoice/invoicePDF")
  //         )
  //           return "pdf";

  //         if (id.includes("node_modules/react")) return "react";
  //         if (id.includes("node_modules/@reduxjs")) return "redux";
  //         if (id.includes("node_modules/react-router-dom")) return "router";
  //         if (id.includes("node_modules/@react-pdf")) return "pdf-vendor";
  //         if (id.includes("node_modules/recharts")) return "charts-vendor";
  //         if (id.includes("node_modules/lucide-react")) return "icons";
  //       },
  //     },
  //   },
  // },

  // build: {
  //   chunkSizeWarningLimit: 500,
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         // 🌐 Core vendors
  //         if (id.includes("node_modules")) {
  //           if (id.includes("react-pdf")) return "pdf-vendor";
  //           if (id.includes("recharts")) return "charts-vendor";
  //           if (id.includes("lucide-react")) return "icons";
  //           if (id.includes("react-router-dom")) return "router";
  //           if (id.includes("@reduxjs/toolkit") || id.includes("react-redux"))
  //             return "redux";
  //           if (id.includes("react")) return "react";
  //         }

  //         // 🧩 Chunk by page features
  //         if (id.includes("src/pages/invoice")) return "invoice";
  //         if (id.includes("src/pages/analytics")) return "analytics";
  //         if (id.includes("src/pages/employee")) return "employee";
  //         if (id.includes("src/pages/customer")) return "customer";
  //         if (id.includes("src/pages/stock")) return "stock";
  //         if (id.includes("src/pages/expense")) return "expense";

  //         // 📦 Split major heavy reusable components
  //         if (id.includes("src/components/analytics"))
  //           return "analytics-components";
  //         if (id.includes("src/components/invoice"))
  //           return "invoice-components";

  //         return undefined; // default fallback
  //       },
  //     },
  //   },
  // },
});
