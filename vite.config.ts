import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import {NodeGlobalsPolyfillPlugin} from "@esbuild-plugins/node-globals-polyfill";
import {NodeModulesPolyfillPlugin} from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
    plugins: [sveltekit()],
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: "globalThis",
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                }),
                NodeModulesPolyfillPlugin(),
            ],
        },
    },
});