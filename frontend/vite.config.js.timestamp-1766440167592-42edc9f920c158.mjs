// vite.config.js
import { defineConfig } from "file:///C:/Users/arash/Projects/Programmer-Codes/vercel-express/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/arash/Projects/Programmer-Codes/vercel-express/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhcmFzaFxcXFxQcm9qZWN0c1xcXFxQcm9ncmFtbWVyLUNvZGVzXFxcXHZlcmNlbC1leHByZXNzXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhcmFzaFxcXFxQcm9qZWN0c1xcXFxQcm9ncmFtbWVyLUNvZGVzXFxcXHZlcmNlbC1leHByZXNzXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hcmFzaC9Qcm9qZWN0cy9Qcm9ncmFtbWVyLUNvZGVzL3ZlcmNlbC1leHByZXNzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczogJy4vcG9zdGNzcy5jb25maWcuanMnLFxuICB9LFxuICBidWlsZDoge1xuXHQgIG1pbmlmeTogXCJlc2J1aWxkXCIsXG5cdCAgZXNidWlsZDoge1xuXHRcdCAganN4RGV2OiBmYWxzZSxcblx0ICB9LFxuXHQgIHJvbGx1cE9wdGlvbnM6e1xuXHRcdCAgdHJlZXNoYWtlOiB0cnVlXG5cdCAgfSxcbiAgICBvdXREaXI6ICdidWlsZCcsIC8vIENoYW5nZSB0aGUgb3V0cHV0IGRpcmVjdG9yeSB0byAnYnVpbGQnXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6ICcuL3Rlc3RzL3NldHVwLmpzJywgLy8gb3IgLmpzXG4gICAgLy8geW91IGNhbiBhZGQgbW9yZSBvcHRpb25zIGhlcmVcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1ksU0FBUyxvQkFBb0I7QUFDN1osT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsRUFDWDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sUUFBUTtBQUFBLElBQ1IsU0FBUztBQUFBLE1BQ1IsUUFBUTtBQUFBLElBQ1Q7QUFBQSxJQUNBLGVBQWM7QUFBQSxNQUNiLFdBQVc7QUFBQSxJQUNaO0FBQUEsSUFDQyxRQUFRO0FBQUE7QUFBQSxFQUNWO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZO0FBQUE7QUFBQTtBQUFBLEVBRWQ7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
