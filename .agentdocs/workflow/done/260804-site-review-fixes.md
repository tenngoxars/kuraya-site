# 官网审查修复（260804）

## 背景

对工作区未提交更改（单文件静态站 → Vite 8 工程重构）做双轴 code review（Standards / Spec），发现若干问题，本次逐项修复。

审查固定点：HEAD `5a85ca2`（工作区更改）。规范来源：`.agentdocs/frontend/architecture.md`；标准来源：根 `AGENTS.md` + architecture.md 工程约束 + Fowler smells 基线。

## 发现与处理

| # | 问题 | 级别 | 处理 |
|---|---|---|---|
| 1 | `nav.aria` 键三语全缺（aria-label 变字面量，重构新引入回归） | 硬违规 | 三个词典补 `nav.aria` |
| 2 | `getLang()` 死代码导出，全仓零引用 | 硬违规 | 删除 |
| 3 | 片库搜索过滤缺失（仅占位 input） | 规格缺失（旧版遗留） | 实现，对齐 `kuraya/web/app.js` |
| 4 | skip 链接未做 i18n（词典 `skip` 键空置） | 规格缺失（旧版遗留） | 补 `data-i18n="skip"` |
| 5 | 「点封面即播」文案与 `href="#preview"` 不符 | 行为不符（旧版遗留） | 保留文案；演示卡片点击改展示封面大图（lightbox） |
| 6 | `prefers-reduced-motion` matchMedia 重复两处 | smell（轻微） | 提模块级常量 `REDUCE_MOTION` |
| 7 | ledger 命令清单疑似遗留 | 判断项 | 保留（静态 CLI 参考，规格未要求删除） |

## 改动清单

- `src/i18n.js`：新增 `nav.aria` / `empty` / `clear` / `cover.preview` / `cover.close` 键（三语齐全，empty/clear 文案复用主项目 app.js 原词）；删除 `getLang()`。
- `index.html`：skip 链接补 `data-i18n`；搜索区补清空按钮（`#clear-btn`，`data-i18n-aria="clear"`）；body 末尾新增 lightbox 容器（dialog + 关闭按钮 + 大图）。
- `src/main.js`：模块级 `REDUCE_MOTION` 常量；片库复刻区实现搜索过滤（演员/番号/厂商，与 chips/排序叠加）、空态 `.lib-empty`、清空按钮 resetToHome 语义、`/` 与 Escape 快捷键；lightbox 交互（点击卡片 → 大图、Escape/遮罩/按钮关闭、焦点还原、背景滚动锁）。
- `src/style.css`：`.clear-btn` / `.lib-empty` / lightbox 样式，逐项对齐真实片库 style.css。
- `.agentdocs/frontend/architecture.md`：片库复刻区条款与目录结构更新。

## TODO

- [x] i18n 词典补键与删死代码
- [x] index.html：skip / 清空按钮 / lightbox 容器
- [x] main.js：REDUCE_MOTION / 搜索 / lightbox
- [x] style.css：clear-btn / lib-empty / lightbox
- [x] architecture.md 更新
- [x] 验证：三语键完整性、生产构建、浏览器实测
