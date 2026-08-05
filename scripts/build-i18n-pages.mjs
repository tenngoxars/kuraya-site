// 三语静态页生成：在 vite build 之后运行（npm run build 已串接）。
// 从 dist/index.html 生成 dist/zh-TW/index.html 与 dist/en/index.html，
// 让繁/英内容以独立 URL 被搜索引擎索引（运行时切换只对 JS 用户可见）。
//
// 替换策略：
// - 键值替换：对目标语言词典按原文长度降序全局替换（「影片库」是「影片库位置…」的
//   子串，必须先长后短），覆盖 data-i18n / data-i18n-html / data-i18n-aria 属性值、
//   head 元数据与 JSON-LD description；用 split/join 而非 replace，避免 $ 转义。
// - 单独处理：html lang、canonical / og:url / JSON-LD url、inLanguage、og:locale、
//   相对资源路径（子目录页 ./assets/ 与 apple-touch-icon.png 要回退一级）。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const { I18N } = await import(path.join(root, 'src', 'i18n.js'));

const LANGS = [
  { code: 'zh-TW', lang: 'zh-TW', ogLocale: 'zh_TW', url: 'https://kuraya.app/zh-TW/' },
  { code: 'en', lang: 'en', ogLocale: 'en_US', url: 'https://kuraya.app/en/' },
];

const srcHtml = readFileSync(path.join(dist, 'index.html'), 'utf8');

for (const l of LANGS) {
  const dict = I18N[l.code];
  if (!dict) throw new Error(`词典缺少 ${l.code}`);

  let html = srcHtml;

  // 键值替换：按原文长度降序，防子串误伤
  const pairs = Object.entries(dict)
    .map(([key, value]) => [I18N['zh-CN'][key], value])
    .filter(([src, dst]) => src && dst && src !== dst)
    .sort((a, b) => b[0].length - a[0].length);
  for (const [src, dst] of pairs) html = html.split(src).join(dst);

  // 语言与结构化元数据
  html = html.replace('<html lang="zh-CN">', `<html lang="${l.lang}">`);
  html = html.replace('rel="canonical" href="https://kuraya.app/"',
                      `rel="canonical" href="${l.url}"`);
  html = html.replace('property="og:url" content="https://kuraya.app/"',
                      `property="og:url" content="${l.url}"`);
  html = html.replace('"url": "https://kuraya.app/"', `"url": "${l.url}"`);
  html = html.replace('"inLanguage": "zh-CN"', `"inLanguage": "${l.lang}"`);
  html = html.replace('property="og:locale" content="zh_CN"',
                      `property="og:locale" content="${l.ogLocale}"`);

  // 子目录页的资源路径回退一级
  html = html.split('src="./assets/').join('src="../assets/');
  html = html.split('href="./assets/').join('href="../assets/');
  html = html.split('href="apple-touch-icon.png"').join('href="../apple-touch-icon.png"');
  html = html.split('src="covers/').join('src="../covers/');
  html = html.split('srcset="covers/').join('srcset="../covers/');

  const outDir = path.join(dist, l.code);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`generated ${l.code}/index.html (${(html.length / 1024).toFixed(1)} KB)`);
}
