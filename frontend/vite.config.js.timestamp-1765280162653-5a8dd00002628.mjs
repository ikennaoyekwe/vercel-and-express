// vite.config.js
import { defineConfig } from "file:///E:/Programmer-Codes/React&Express/Express%20Projects/vercel-express/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Programmer-Codes/React&Express/Express%20Projects/vercel-express/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js"
  },
  build: {
    minify: "esbuild",
    esbuild: {
      jsxDev: false
    },
    rollupOptions: {
      treeshake: true
    },
    outDir: "build"
    // Change the output directory to 'build'
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js"
    // or .js
    // you can add more options here
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxQcm9ncmFtbWVyLUNvZGVzXFxcXFJlYWN0JkV4cHJlc3NcXFxcRXhwcmVzcyBQcm9qZWN0c1xcXFx2ZXJjZWwtZXhwcmVzc1xcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcUHJvZ3JhbW1lci1Db2Rlc1xcXFxSZWFjdCZFeHByZXNzXFxcXEV4cHJlc3MgUHJvamVjdHNcXFxcdmVyY2VsLWV4cHJlc3NcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1Byb2dyYW1tZXItQ29kZXMvUmVhY3QmRXhwcmVzcy9FeHByZXNzJTIwUHJvamVjdHMvdmVyY2VsLWV4cHJlc3MvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBjc3M6IHtcbiAgICBwb3N0Y3NzOiAnLi9wb3N0Y3NzLmNvbmZpZy5qcycsXG4gIH0sXG4gIGJ1aWxkOiB7XG5cdCAgbWluaWZ5OiBcImVzYnVpbGRcIixcblx0ICBlc2J1aWxkOiB7XG5cdFx0ICBqc3hEZXY6IGZhbHNlLFxuXHQgIH0sXG5cdCAgcm9sbHVwT3B0aW9uczp7XG5cdFx0ICB0cmVlc2hha2U6IHRydWVcblx0ICB9LFxuICAgIG91dERpcjogJ2J1aWxkJywgLy8gQ2hhbmdlIHRoZSBvdXRwdXQgZGlyZWN0b3J5IHRvICdidWlsZCdcbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogJy4vdGVzdHMvc2V0dXAuanMnLCAvLyBvciAuanNcbiAgICAvLyB5b3UgY2FuIGFkZCBtb3JlIG9wdGlvbnMgaGVyZVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4WixTQUFTLG9CQUFvQjtBQUMzYixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxFQUNYO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsTUFDUixRQUFRO0FBQUEsSUFDVDtBQUFBLElBQ0EsZUFBYztBQUFBLE1BQ2IsV0FBVztBQUFBLElBQ1o7QUFBQSxJQUNDLFFBQVE7QUFBQTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQTtBQUFBO0FBQUEsRUFFZDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
