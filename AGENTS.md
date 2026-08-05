# KURAYA 蔵屋 官网

影片刮削工具 KURAYA 蔵屋 的产品官网（单页营销站），静态站点，Vite + 原生 HTML/CSS/JS，无框架。

## 常用命令

```bash
npm run dev      # 本地开发（HMR）
npm run build    # 生产构建到 dist/
npm run preview  # 本地预览 dist/ 产物
```

## 验证要求

- 所有变更必须 `npm run build` 通过。
- 涉及页面视觉或交互的变更，须在浏览器中实测（预览产物或 dev server）：确认控制台无报错、封面图片正常加载、tab/复制/淡入交互可用。
- 样式修改后与片库 `kuraya/web/style.css` 的设计令牌保持一致（金系配色、家纹、颗粒质感）。

## 工程约束

- 页面主体结构见 `.agentdocs/index.md` 与 `.agentdocs/frontend/architecture.md`，修改前必读。
- 封面图片放 `public/covers/`，命名 `cover-N.webp`（2:3，900×1350），并一并生成 `cover-N-400.webp` / `cover-N-640.webp` 与内联 LQIP；HTML 中以相对路径引用，`srcset`/`sizes` 见 architecture.md。
- `base: './'` 相对路径构建，页面资源可托管于任意子路径；canonical / OG / Twitter 的 URL 为 `https://kuraya.app/` 绝对地址（社交平台不接受相对 URL）。
- 终端与「乱→齐」区块的对齐缩进一律用 CSS，禁止用空格字符补位——HTML 正常空白折叠会把连续空格压成一个。
