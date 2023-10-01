import { resolve } from 'path';
import { defineConfig } from 'vite';
import { transform } from 'esbuild';

export default defineConfig({
    // config options
    plugins: [minifyEs()],
    build: {
        target: "modules",
        minify: "esbuild",
        lib: {
            entry: [
                resolve(__dirname, "src/index.ts"),
            ],
            name: "chibiengine",
            fileName: 'chibiengine'
        }
    }
});

function minifyEs() {
    return {
        name: 'minifyEs',
        renderChunk: {
            order: 'post',
            async handler(code, chunk, outputOptions) {
                if (outputOptions.format === 'es') {
                    return await transform(code, { minify: true });
                }
                return code;
            },
        }
    };
}