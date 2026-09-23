export default {
  preset: "vercel",
  srcDir: "src",
  rollupConfig: {
    // Supabase client must be bundled into the SSR function for Vercel
    // (was incorrectly marked external, causing ERR_MODULE_NOT_FOUND on Vercel)
    external: [],
  },
};
