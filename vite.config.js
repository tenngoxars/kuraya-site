import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* 版本单一来源：仓库内 public/version.txt。页面与终端一律不得硬编码版本号，
   发版时手动更新该文件即可，构建/开发统一经此注入（KURAYA_VERSION 可临时覆盖）。 */
function resolveVersion() {
  if (process.env.KURAYA_VERSION) return process.env.KURAYA_VERSION.trim();
  const file = path.resolve(__dirname, 'public', 'version.txt');
  try {
    const v = readFileSync(file, 'utf8').trim();
    if (!v) throw new Error('public/version.txt 为空');
    return v;
  } catch (err) {
    throw new Error(
      `无法确定 KURAYA 产品版本：${err.message}\n` +
        '版本单一来源为 public/version.txt，发版时手动更新该文件。' +
        '或用 KURAYA_VERSION 显式指定。'
    );
  }
}

const version = resolveVersion();

export default defineConfig({
  // 部署地址未定：相对路径保证任意子路径（如 GitHub Pages）均可直接托管
  base: './',
  // JS 侧（src/main.js）经 __KURAYA_VERSION__ 取版本
  define: { __KURAYA_VERSION__: JSON.stringify(version) },
  plugins: [
    {
      name: 'kuraya-version-inject',
      // HTML 侧经 {{VERSION}} 占位注入（dev 与 build 均生效）
      transformIndexHtml(html) {
        return html.replaceAll('{{VERSION}}', version);
      },
    },
  ],
});
