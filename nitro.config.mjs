export default {
  preset: "node-server",
  srcDir: "src",
  rollupConfig: {
    external: ["@supabase/supabase-js"],
  },
};
