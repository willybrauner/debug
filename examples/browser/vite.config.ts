// default vite config

import { defineConfig } from "vite"
const isProd = process.env.NODE_ENV === "production"
console.log("isProd", isProd)
export default defineConfig({
  esbuild: {
    pure: isProd ? ["console.log"] : [],
    //drop: isProd ? ["console"] : [],
  },
})
