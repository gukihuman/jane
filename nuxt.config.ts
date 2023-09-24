export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      title: "Jane",
    },
  },
  runtimeConfig: {
    public: {
      OPENAI_ENDPOINT: process.env.OPENAI_ENDPOINT,
      OPENAI_KEY: process.env.OPENAI_KEY,
      PINECONE_ENDPOINT: process.env.PINECONE_ENDPOINT,
      PINECONE_KEY: process.env.PINECONE_KEY,
      COHERE_ENDPOINT: process.env.COHERE_ENDPOINT,
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
