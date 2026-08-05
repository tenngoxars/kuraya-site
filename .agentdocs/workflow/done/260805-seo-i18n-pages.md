# SEO 增强：JSON-LD + robots.txt + 三语静态页

日期：2026-08-05

## 现状分析

- 页面 SEO 基础扎实（canonical/OG/Twitter、语义化 h1-h2、srcset 图片、零第三方脚本），但缺 JSON-LD 结构化数据、robots.txt，且繁/英内容仅 JS 运行时切换、搜索引擎不可见。
- 用户决定：补 JSON-LD + robots.txt，并让繁/英内容可被索引（构建时生成三语静态页）。

## 方案

1. **JSON-LD SoftwareApplication**：进 index.html head，`{{VERSION}}` 占位由 Vite 注入，副本页经键值替换自动翻译 description、单独替换 url/inLanguage。
2. **robots.txt + sitemap.xml**：public/ 静态文件，sitemap 列三语 URL + hreflang。
3. **三语静态页**：`scripts/build-i18n-pages.mjs` 在 `vite build` 后运行——拷贝 `dist/index.html` 生成 `dist/zh-TW/index.html`、`dist/en/index.html`：
   - 键值替换：对目标语言词典按原文长度降序 `replaceAll(原文→译文)`（防子串误伤；函数式替换防 `$` 转义），覆盖 data-i18n / data-i18n-html / data-i18n-aria / head 元数据 / JSON-LD description。
   - 单独处理：`html lang`、canonical、og:url、og:locale、JSON-LD url/inLanguage、相对资源路径 `./assets/` → `../assets/`、`apple-touch-icon.png` → `../apple-touch-icon.png`。
   - 主页 head 加三语 hreflang 块（x-default 指向 `/`）。
4. **package.json**：`build: "vite build && node scripts/build-i18n-pages.mjs"`。

## 关键约束

- i18n.js 词典为纯数据，顶层无浏览器 API，Node 可动态 import。
- 替换必须按原文长度降序（如「影片库」是「影片库位置、待整理目录、播放器」的子串）。
- 副本页保留 data-i18n 属性（运行时语言切换行为不变，爬虫只看静态译文）。

## TODO

- [x] head 加 hreflang + JSON-LD
- [x] robots.txt / sitemap.xml
- [x] 构建脚本
- [x] 构建验证三语页
- [x] 浏览器验证渲染
- [x] 提交推送 + 架构文档
