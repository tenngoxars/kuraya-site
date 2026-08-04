import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* 版本单一来源：主仓库 kuraya/__init__.py 的 __version__。
   页面与终端一律不得硬编码版本号，统一经此注入。 */
function resolveVersion() {
  if (process.env.KURAYA_VERSION) return process.env.KURAYA_VERSION.trim();
  const repo = process.env.KURAYA_REPO || path.resolve(__dirname, '../Kuraya');
  const init = path.join(repo, 'kuraya', '__init__.py');
  try {
    const src = readFileSync(init, 'utf8');
    const m = src.match(/__version__\s*=\s*['"]([^'"]+)['"]/);
    if (!m) throw new Error(`未在 ${init} 中找到 __version__`);
    return m[1];
  } catch (err) {
    throw new Error(
      `无法确定 KURAYA 产品版本：${err.message}\n` +
        '版本单一来源为主仓库 kuraya/__init__.py。可设 KURAYA_REPO 指向主仓库，或用 KURAYA_VERSION 显式指定。'
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
