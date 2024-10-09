import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import {NodeGlobalsPolyfillPlugin} from "@esbuild-plugins/node-globals-polyfill";
import {NodeModulesPolyfillPlugin} from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

export default defineConfig({
    plugins: [sveltekit()],
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
                //@ts-ignore
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                    process: true,
                }),
                //@ts-ignore
                NodeModulesPolyfillPlugin()
            ]
        }
    },
    build: {
        rollupOptions: {
            plugins: [
                //@ts-ignore
                rollupNodePolyFill()
            ]
        }
    }
});