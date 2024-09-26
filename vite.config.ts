import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default ({ mode }: any) => {
	const env = loadEnv(mode, "./");
	const PORT: any = env?.VITE_PORT;

	return defineConfig({
		server: {
			port: PORT 
		},
		preview : {
			port: PORT
		},
		plugins: [tsconfigPaths(), react()]
	})
}
