import {defineConfig} from "vitest/config"
import {neonTesting} from "neon-testing/vite"
import {sveltekit} from "@sveltejs/kit/vite"

export default defineConfig({
    test: {
        environment: 'jsdom'
    },
    plugins: [neonTesting(), sveltekit()],
});