import adapter from "@sveltejs/adapter-auto";
import preprocessReact from "svelte-preprocess-react/preprocessReact";

import { sveltePreprocess } from "svelte-preprocess";

/** @type {import("@sveltejs/kit").Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [
        sveltePreprocess({
            postcss: true
        }),
        preprocessReact()
    ],

    kit: {
        adapter: adapter()
    },
};

export default config;
