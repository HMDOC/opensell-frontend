import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default ({ mode }: any) => {
	const env = loadEnv(mode, "./");
	
	return defineConfig({
		server: {
			port: env?.VITE_PORT as any
		},
		plugins: [tsconfigPaths(), react()]
	})
}
