# 官网前端架构

## 技术栈

- **Vite 8 + 原生 HTML/CSS/JS**（ES Module），无框架、无 UI 库。工程化诉求：本地 HMR 开发、生产构建压缩、`base: './'` 相对路径产物。
- 构建产物 `dist/`（已 gitignore），封面等静态资产经 `public/` 原样拷贝。

## 目录结构

```
index.html          # 页面骨架：meta/OG 标签、内联 SVG favicon、Google Fonts、data-i18n 标记
src/i18n.js         # 三语词典（简中原文/繁中/英文）+ 语言检测与应用逻辑
src/style.css       # 全部样式（设计令牌 + 各区块），逐字对齐片库 kuraya/web/style.css
src/main.js         # 交互：多语言、复制命令、安装 tab（roving tabindex）、片库复刻区（搜索/chips/排序 + 封面大图 lightbox）、展卷淡入 IO、活终端
public/covers/      # 片库预览封面 cover-1..6.webp（2:3，900x1350，WebP q82），HTML 相对路径引用
vite.config.js      # base './'；版本注入：{{VERSION}} 占位 + __KURAYA_VERSION__ define
```

## 关键约定

- **多语言（三语）**：官网支持简体中文（默认）/ 繁體中文 / English。语言规则与主项目一致（`i18n.js` 的 `TRADITIONAL_CODES` 与 `kuraya/i18n.py` 相同）：非 zh 浏览器 → en；繁体地区（zh-tw/zh-hk/zh-mo/zh-hant）→ zh-TW；其余 → zh-CN。首次访问跟随 `navigator.language`，手动选择经 localStorage（键 `kuraya-site-lang`）持久化；页眉 `langs` 切换器（简/繁/EN）。静态文案用 `data-i18n`（纯文本）/`data-i18n-html`（含 `<b>` 等）/`data-i18n-placeholder`/`data-i18n-aria` 标记，`applyLang()` 应用；**终端与片库相关文案逐条复用主项目 `kuraya/i18n_en.py`、`i18n_zh_tw.py`、`kuraya/web/app.js` 的真实翻译**（含活终端动画行、统计卡片、静态菜单、片库搜索/排序/统计），保证「与实际产品一致」；新增文案必须三语齐全，禁止只写简体。活终端语言切换时重置为当前语言静态菜单并重放；无 JS 时页面保持简体原文。

- **页面区块**：4 个主区块——Hero（品牌+安装）→ 壹·片库预览 → 貳·命令行（活终端）→ 页脚。「是什么」「工作流程」已删除（2026-08 重构：特性融入 hero/终端，避免清单体）。
- **渐进增强**：`<head>` 内联脚本在 JS 可用时给 `<html>` 加 `.js` 类，动效全部挂在 `.js` 前缀下；无 JS 时内容完整可见。该内联脚本勿移入 main.js（需先于首帧执行）。
- **设计令牌**：`:root` 中的颜色/字体/缓动变量与片库 `kuraya/web/style.css` 一致（金系、`--gold:#c9a227` 等）。改动样式时保持同步。
- **安装 tab**：四个面板（macOS/Windows/Linux/解压即用），`role=tablist/tab/tabpanel`，方向键切换，发丝指示线由 `--tx/--tw` 变量驱动。解压即用面板为**三个平台按钮**（macOS/Windows/Linux，各带内联 SVG icon，无 JS 时指向 Releases 页），点击直接下载对应 zip（`releases/download/v{版本}/Kuraya-{版本}-{os_arch}.zip`，os_arch 取 mac-arm64/win-x64/linux-x86_64，发行物命名见主仓库 `release.sh`/`release.bat`），**自动检测用户平台**：优先 `navigator.userAgentData` 高熵值（`platform` + `architecture`，Chromium），Safari/Firefox 兜底 UA（架构取默认 arm64/x64/x86_64）；按钮默认中性色，hover/focus 显示金色，**无常驻选中态**（点击即下载）；版本号走 `__KURAYA_VERSION__` 注入；**不支持的架构**（如 Intel Mac、ARM Linux）降级为 Releases 页。面板下方 `inst-note` 提示随 tab 切换：选中「解压即用」时替换为解压即用文案（「下载对应平台的 zip，解压后双击 Kuraya 即可运行，无需安装。」；不支持架构时为「当前 {平台} 暂未提供官方安装包，可到 Releases 查看。」），其他 tab 保持通用文案「装好后运行 Kuraya，按提示选好影片库即可开始。」（`applyNote()` + `zipNote` 状态，见 main.js）。
- **片库复刻区**：搜索、演员筛选 chips 与排序下拉的样式、交互均与真实片库 `kuraya/web/`（style.css/app.js）一致——搜索按演员/番号/厂商过滤（`empty`/`clear` 文案复用主项目，`/` 快捷键聚焦、Escape 清空、清空按钮 resetToHome 语义）；自定义面板下拉，非原生 select；排序键 date_desc/date_asc/added_desc，卡片 `data-date`/`data-added` 驱动；无匹配时显示 `.lib-empty` 空态。演示卡片点击展示封面大图（lightbox，`cover.preview`/`cover.close` 文案三语；演示区无影片文件，无法真实播放，故以大图替代）。改动复刻区前先对照 kuraya/web 源码，保持同步。演示数据自洽口径：6 部影片 / 4 位演员 / 6 个厂商（chips、stats、计数、终端均一致）。
- **活终端**：命令区终端默认静态菜单（无 JS 降级）；进入视口由 IntersectionObserver 触发循环播放刮削实况（`$ kuraya` 打字 + 逐行输出）。动画脚本按真实产品 `kuraya/launcher.py` 的 `cmd_all` 输出逐行重演：brand → ①刮削影片（`▸ 番号 [i/n]` + spinner 阶段行 + `├ 封面 已下载`/`├ 裁剪 已生成竖版海报`/`├ 元数据 演员·厂商·日期`/`└ 入库 演员\番号 Ns` 树状行）→ ②清理源目录（`移除 原文件名`）→ ③重建片库页面（`✓ 页面已重新生成，收录 N 部`）→ 结尾统计卡片（`╭─╮ 新入库…·库内共…·耗时… ╰─╯`）。演示数据与片库演示自洽（6 部影片、2 个待整理、SEIS/SHID 番号、星霜舍/紫電堂）；改动终端脚本前先对照 `launcher.py`（`launcher.py` 的 `branch`/`section`/`box`/`spinner` 组件），保持与产品输出一致。状态色：`──` 灰、`①` 蓝、`✓` 与卡片绿，映射 `launcher.py` 的 ANSI 色。离开视口恢复静态；`prefers-reduced-motion` 保持静态。
- **版本号（注入机制）**：页面与终端展示的产品版本（mast/hero-meta/静态终端/页脚/动画头部共 5 处）**一律不得硬编码**。单一来源为仓库内 `public/version.txt`，发版时手动更新该文件，构建/开发时经 `vite.config.js` 注入：HTML 侧用 `{{VERSION}}` 占位（`transformIndexHtml` 替换），JS 侧（main.js 动画品牌头）用 `define` 常量 `__KURAYA_VERSION__`。`KURAYA_VERSION` 环境变量可临时覆盖。`version.txt` 缺失/为空时构建直接报错（不静默兜底假版本）。新增版本号展示位必须走注入，禁止手写。**发新版流程（主仓库发版后）**：① 改 `public/version.txt` 为新版本号（如 `0.6.0`）→ ② 提交推送 → Cloudflare Pages 检测到推送自动重新构建 → 页面 5 处版本号全部更新。
- **展卷动画**：`.fade` 区块由 IntersectionObserver 加 `.in`；`prefers-reduced-motion` 下全部降级为立即可见。
- **文案语域**：现代高级感方向——白话、克制、短句、有留白与意象（如「一座片库，一个文件」）；**不用文言虚词**（之/乃/既毕/择定/宜于等）；保留产品术语（kuraya、nfo、番号、刮削）与功能信息；法律声明保持清晰直白；终端示意与片库复刻区为「真实产物」，文案勿改。
- **部署**：canonical/og:url 为占位（部署地址未定），上线前替换绝对 URL；canonical 保留 `vite-ignore` 属性防止 Vite 把 `index.html` 当资源复制出多余产物。

## 本机环境注意事项

- 机器上有 arm64 node（v25.5，`/opt/homebrew/bin/node`）与 x64 node（v22.19，`/usr/local/bin/node`）。系统服务/后台进程可能解析到 x64 版，运行 vite（rolldown 原生绑定）会报 "Cannot find native binding"。前台 shell 无此问题。
- `vite preview` 只监听 IPv6，健康检查应探测 `localhost` 而非 `127.0.0.1`。
