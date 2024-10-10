import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default ({ mode }: any) => {
	process.env = loadEnv(mode, "./");
	let port = Number(process.env.VITE_PORT) || 3000;

	return defineConfig({
		server: {
			port,
		},
		preview: {
			port,
		},
		plugins: [tsconfigPaths(), react()]
	})
}
