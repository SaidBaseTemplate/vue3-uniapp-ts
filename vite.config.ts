import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    // 配置别名
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
