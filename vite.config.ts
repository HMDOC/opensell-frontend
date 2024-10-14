import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default ({ mode }: any) => {
  process.env = loadEnv(mode, "./");
  const port = Number(process.env.VITE_PORT) || 3000;
  const https = Boolean(process.env.VITE_HTTPS);

  return defineConfig({
    server: {
      port,
    },
    preview: {
      port,
    },
    plugins: [tsconfigPaths(), react(), https ? basicSsl() : null],
  });
};
