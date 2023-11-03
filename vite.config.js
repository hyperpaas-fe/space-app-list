import pkg from "./package.json";
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import terser from "@rollup/plugin-terser";
import mkcert from "vite-plugin-mkcert";

const PKG_NAME_SPACE = (() => {
  const { name, version = "0.0.1" } = pkg || {};
  if (!name) {
    throw new Error("pkg name is required");
  }
  const componentName = name.split("/").pop();
  const _version = version.replace(/\./g, "-");
  return [componentName, _version].join("-");
})();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    ROOT_ELEMENT: JSON.stringify(PKG_NAME_SPACE),
  },
  plugins: [react(), mkcert()],
  build: {
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-dom/client",
        "moment",
        "antd",
        "@hp-view/request",
        "@hp-view/theme",
        "@icon-park/react"
      ],
      output: {
        globals: {
          antd: "antd",
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
          moment: "moment",
        },
        plugins: [
          terser({
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          }),
        ],
      },
    },
    lib: {
      entry: "./src/index",
      name: `${pkg.name}@${pkg.version.replace(/\./g, "_")}`,
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        globalVars: {
          ROOT_ELEMENT: `.${PKG_NAME_SPACE}`,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "localhost.hyperpaas-inc.com",
    https: true,
    proxy: {
      "/rest": {
        target: "https://dev.hyperpaas-inc.com/",
        changeOrigin: true,
      },
    },
  },
});
