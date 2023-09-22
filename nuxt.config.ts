export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      title: "Jane",
    },
  },
  runtimeConfig: {
    public: {
      OPEN_AI_ENDPOINT: process.env.OPEN_AI_ENDPOINT,
      OPEN_AI_KEY: process.env.OPEN_AI_KEY,
      PINECONE_KEY: process.env.PINECONE_KEY,
      COHERE_KEY: process.env.COHERE_KEY,
    },
  },
  modules: [
    "~/server/socketio",
    "@nuxtjs/tailwindcss",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore"],
      },
    ],
  ],
  imports: {
    dirs: ["core/**/*.{js,ts}", "modules/**/*.{js,ts}"],
  },
  components: [{ path: "@/interface", pathPrefix: false }],
  plugins: ["@/core/load.ts", "@/core/start.ts"],
  css: ["@/tailwind.css"],

  // important for correct work of importer
  vite: {
    assetsInclude: ["**/*.md"],
    build: {
      minify: false,
    },
  },

  // local build not working with sourcemap
  sourcemap: false,
})
