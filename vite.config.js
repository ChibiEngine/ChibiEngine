import { resolve } from 'path';
import { defineConfig } from 'vite';
import { transform } from 'esbuild';

export default defineConfig({
    // config options
    plugins: [replaceWithGlobalPIXI(), minifyEs()],
    build: {
        target: "modules",
        minify: "esbuild",
        lib: {
            entry: [
                resolve(__dirname, "src/index.ts"),
            ],
            name: "chibiengine",
            fileName: 'chibiengine',
        },
        rollupOptions: {
            external: ["pixi.js"],
            output: {
                globals: {
                    "pixi.js": "PIXI"
                }
            }
        }
    }
});

function replaceWithGlobalPIXI() {
    return {
        name: 'replaceWithGlobalPIXI',
        renderChunk: {
            order: 'post',
            async handler(code, chunk, outputOptions) {
                if (outputOptions.format !== "es") {
                    return code;
                }

                const pattern = /import \{ (.+) } from "pixi\.js";\n/g;

                const matches = code.matchAll(pattern);

                if (!matches) {
                    console.log("no matches");
                    return code;
                }

                console.log("matches", matches);

                for (const match of matches) {
                    console.log("match", match[1]);
                    const imports = match[1].split(',').map(i => i.trim().split(' as '));
                    console.log("imports", imports);
                    let replacement = "const PIXI = window.PIXI;\n";
                    for (const [importName, alias] of imports) {
                        replacement += `const ${alias} = PIXI.${importName};\n`;
                    }
                    code = code.replace(match[0], replacement);
                }

                return code;
            },
        }
    };
}

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