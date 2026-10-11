import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const frontendDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    root: frontendDir,
    base: "/static/assets/",

    build: {
        outDir: "../api/static/assets",
        emptyOutDir: true,
        cssCodeSplit: false,

        rolldownOptions: {
            input: fileURLToPath(
                new URL("./src/main.js", import.meta.url)
            ),

            output: {
                entryFileNames: "app.js",
                chunkFileNames: "chunks/[name]-[hash].js",

                assetFileNames: (asset) =>
                    asset.name?.endsWith(".css")
                        ? "app.css"
                        : "media/[name]-[hash][extname]",
            },
        },
    },
});