export default {
  preset: "vercel",
  srcDir: "src",
  rollupConfig: {
    external: ["@supabase/supabase-js"],
  },
};
