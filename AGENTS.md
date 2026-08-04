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
- 封面图片放 `public/covers/`，命名 `cover-N.png`（2:3），HTML 中直接以相对路径引用。
- 部署地址未定，`base: './'` 相对路径构建，可托管于任意子路径；`<link rel="canonical">` 与 `og:url` 为占位，上线前替换为绝对 URL（canonical 上的 `vite-ignore` 防止 Vite 误将其当作资源处理，勿删）。
