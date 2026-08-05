# 官网前端架构

## 技术栈

- **Vite 8 + 原生 HTML/CSS/JS**（ES Module），无框架、无 UI 库。工程化诉求：本地 HMR 开发、生产构建压缩、`base: './'` 相对路径产物。
- 构建产物 `dist/`（已 gitignore），封面等静态资产经 `public/` 原样拷贝。

## 目录结构

```
index.html          # 页面骨架：meta/OG 标签、内联 SVG favicon、字体门控内联脚本、Google Fonts、data-i18n 标记
src/i18n.js         # 三语词典（简中原文/繁中/英文）+ 语言检测与应用逻辑
src/style.css       # 全部样式（设计令牌 + 各区块），逐字对齐片库 kuraya/web/style.css
src/main.js         # 交互：多语言、复制命令、安装 tab（roving tabindex）、片库复刻区（搜索/chips/排序 + 封面大图 lightbox）、展卷淡入 IO、活终端
public/covers/      # 片库预览封面 cover-1..6.webp（2:3，900x1350，WebP q82）+ -400/-640 响应式变体，HTML 相对路径引用
public/og.jpg       # 社交分享图 1200x630（生成方式见「社交分享图」）
public/apple-touch-icon.png  # iOS 主屏图标 180x180（家纹，与 favicon 同源）
vite.config.js      # base './'；版本注入：{{VERSION}} 占位 + __KURAYA_VERSION__ define
scripts/build-i18n-pages.mjs  # 三语静态页生成：vite build 后跑，产出 dist/zh-TW/ 与 dist/en/
public/robots.txt / sitemap.xml  # 爬虫控制与三语 URL 站点地图
```

## 关键约定

- **多语言（三语）**：官网支持简体中文（默认）/ 繁體中文 / English。语言规则与主项目一致（`i18n.js` 的 `TRADITIONAL_CODES` 与 `kuraya/i18n.py` 相同）：非 zh 浏览器 → en；繁体地区（zh-tw/zh-hk/zh-mo/zh-hant）→ zh-TW；其余 → zh-CN。首次访问跟随 `navigator.language`，手动选择经 localStorage（键 `kuraya-site-lang`）持久化；页眉 `langs` 切换器（简/繁/EN）。静态文案用 `data-i18n`（纯文本）/`data-i18n-html`（含 `<b>` 等）/`data-i18n-placeholder`/`data-i18n-aria` 标记，`applyLang()` 应用；**终端与片库相关文案逐条复用主项目 `kuraya/i18n_en.py`、`i18n_zh_tw.py`、`kuraya/web/app.js` 的真实翻译**（含活终端动画行、统计卡片、静态菜单、片库搜索/排序/统计），保证「与实际产品一致」；新增文案必须三语齐全，禁止只写简体。活终端语言切换时重置为当前语言静态菜单并重放；无 JS 时页面保持简体原文。

- **页面区块**：5 个主区块——Hero（品牌+安装）→ 壹·乱→齐（`#order`）→ 貳·片库预览 → 叁·命令行（活终端）→ 页脚。「是什么」「工作流程」已删除（2026-08 重构：特性融入 hero/终端，避免清单体）；`#order` 是一个视觉对比瞬间（左待整理原始文件名、右归档后目录树），不是特性清单，段号与导航随之改为 壹/貳/叁。叁区只有活终端（命令清册已删——清册与终端动画重复叙述同一件事，删掉后由动画自己讲完）。缩进一律走定宽元素（壹区目录树用 `<i class="g">` 一格一层、终端用 `.in1/.in2`），不能靠空格字符（HTML 正常空白折叠会把连续空格压成一个）。

- **区块纵向节奏**：`.sec` 上下 padding 对称（`96px 24px`）。下边距不能交给「末尾子元素自带的 margin」——子元素 margin-bottom 会塌陷穿出去，且末尾若是带边框的框（壹区目录树），其下边框会与下一区 `border-top` 并成一条线。页脚同理不加 `margin-top`，区块间留白统一由 `.sec` 的 padding-bottom 给出。

- **壹·乱→齐 目录树**：缩进用 `<i class="g">`（定宽 1.55em 的 inline-block，一格一层，`│/├/└` 竖线字符也放进 `i.g`），不用 padding 类。两栏 `align-items:start` 各自然高——「2 个乱文件 → 一整座库」的高度差本身就是叙事，拉等高左框会空出一片；箭头贴左框上沿（`margin-top:56px`）而非垂直居中。左列是真实杂物（`.torrent`、说明 `.txt`，由 `cleanup.py` 清掉，右树不出现）；右树只到番号层（每个目录里有哪些文件由下面活终端逐行演），目录布局与 `media/archive.py` 一致（写死「演员名/番号」），演示口径独立于貳区片库（那是另一座库）。

- **页脚落款**：不挂 `.fade`（页面最底，滚到才触发淡入等于每次都能看见它刚冒出来）。结构自上而下：`foot-mark` 家纹印（与页眉/hero/片库同一枚家纹，链接回 `#top`，`foot.top` 三语，是长页面滚到底的回头路）→ 法律声明 → `foot-rule` 发丝分隔 → `foot-meta` 品牌落款（KURAYA 蔵屋 v 版本 MIT GitHub）——最后一眼是品牌落款，不是免责声明。
- **渐进增强**：`<head>` 内联脚本在 JS 可用时给 `<html>` 加 `.js` 类，动效全部挂在 `.js` 前缀下；无 JS 时内容完整可见。该内联脚本勿移入 main.js（需先于首帧执行）。
- **字体门控**：同一段内联脚本在 `document.fonts.ready`（900ms 兜底）后追加 `.type`。hero 编排的**起始态**挂 `.js`（`opacity:0` 等），**动画**挂 `.js.type`——不门控的话编排会先用回退字体演一遍，字体到位后巨大的「蔵屋」再跳一次。**字体样式表必须保持渲染阻塞**：改成非阻塞加载时 `@font-face` 尚未解析，`document.fonts.ready` 会立刻兑现，门控随即失效。
- **布局单一来源**：页眉总高（含 1px 下边框）由 `--mast-h` 定义，`.mast-in` 取 `calc(var(--mast-h) - 1px)`；hero 整屏高度 `calc(100svh - var(--mast-h))`、片库工具条 `top:var(--mast-h)`、`html` 的 `scroll-padding-top` 全部引用它，禁止再写数字。hero 用 `svh` 而非 `vh`——iOS Safari 的 `100vh` 是大视口高度，地址栏展开时底部会被切掉。
- **设计令牌**：`:root` 中的颜色/字体/缓动变量与片库 `kuraya/web/style.css` 一致（金系、`--gold:#c9a227` 等）。改动样式时保持同步。**唯一有意分歧**：`--faint` 由片库的 `#5f5d5a`（在 `--bg` 上仅 3.04:1）提到 `#7a7875`（4.53:1），因为它承载 9–13px 的页脚法律声明与统计标签，原值不过 WCAG AA；宜同步回主项目。
- **动效注意**：`backdrop-filter` 在元素自身或任何祖先 `opacity < 1` 时不渲染（模糊会延迟到透明度过渡完成后才出现）。带 blur 的元素若需淡入（如封面播放按钮），遮罩层用 opacity 过渡、元素本身用 scale/visibility 过渡。
- **安装 tab**：四个面板（macOS/Windows/Linux/解压即用），`role=tablist/tab/tabpanel`，方向键切换，发丝指示线由 `--tx/--tw` 变量驱动。解压即用面板为**三个平台按钮**（macOS/Windows/Linux，各带内联 SVG icon，无 JS 时指向 Releases 页），点击直接下载对应 zip（`releases/download/v{版本}/Kuraya-{版本}-{os_arch}.zip`，os_arch 取 mac-arm64/win-x64/linux-x86_64，发行物命名见主仓库 `release.sh`/`release.bat`），**自动检测用户平台**：优先 `navigator.userAgentData` 高熵值（`platform` + `architecture`，Chromium），Safari/Firefox 兜底 UA（架构取默认 arm64/x64/x86_64）；按钮默认中性色，hover/focus 显示金色，**无常驻选中态**（点击即下载）；版本号走 `__KURAYA_VERSION__` 注入；**不支持的架构**（如 Intel Mac、ARM Linux）降级为 Releases 页。面板下方 `inst-note` 提示随 tab 切换：选中「解压即用」时替换为解压即用文案（「下载对应平台的 zip，解压后双击 Kuraya 即可运行，无需安装。」；不支持架构时为「当前 {平台} 暂未提供官方安装包，可到 Releases 查看。」），其他 tab 保持通用文案「装好后运行 Kuraya，按提示选好影片库即可开始。」（`applyNote()` + `zipNote` 状态，见 main.js）。
- **片库复刻区**：搜索、演员筛选 chips 与排序下拉的样式、交互均与真实片库 `kuraya/web/`（style.css/app.js）一致——搜索按演员/番号/厂商过滤（`empty`/`clear` 文案复用主项目，`/` 快捷键聚焦、Escape 清空、清空按钮 resetToHome 语义）；自定义面板下拉，非原生 select；排序键 date_desc/date_asc/added_desc，卡片 `data-date`/`data-added` 驱动；无匹配时显示 `.lib-empty` 空态。演示卡片点击展示封面大图（lightbox，见下条；演示区无影片文件，无法真实播放，故以大图替代）。改动复刻区前先对照 kuraya/web 源码，保持同步。演示数据自洽口径：6 部影片 / 4 位演员 / 6 个厂商（chips、stats、计数、终端均一致）。

- **卡片语义与封面加载**：演示卡片是 `<button aria-haspopup="dialog">` 而非 `<a href="#preview">`——它的动作是开对话框不是导航，用锚点会在状态栏显示假 URL、中键新标签打开也无意义。hover 与 `:focus-visible` 走同一组样式，键盘用户拿到同一份反馈。封面走 `srcset` 400/640/900 + `sizes`（桌面渲染约 260px、移动端约 158px，直上 900w 是三倍过采样；400w 这一档是按移动端 158px×DPR2=316 定的，用 320w 会差 4px 被浏览器跳过、白白回落到 640w），`.lib-cover` 的 `--lqip` 是内联的 16px 模糊底图，图片 `load` 后由 JS 加 `.loaded` 淡入（`error` 也加，否则失败的图会永远停在 `opacity:0`）。新增封面时三个尺寸与 LQIP 一并生成。

- **封面大图 lightbox**：`cover.preview`/`cover.close`/`cover.prev`/`cover.next` 文案三语。方向键 / 左右按钮 / 横向滑动换片，Esc / 遮罩 / 下滑关闭；打开时 `body > header,main,footer` 设 `inert`（同时也是焦点陷阱），另留 Tab 兜底给不支持 `inert` 的浏览器。**换片顺序必须查 DOM**（`libGrid.querySelectorAll('.lib-card:not(.hidden)')`）——排序是把节点搬位置，模块级的 `libCards` 永远是初始顺序，用它算出的序号和眼前看到的对不上。打开时先挂 `img.currentSrc`（已缓存的响应式小图，瞬时可见）再异步换 `img.src` 原图。
- **活终端**：命令区终端默认静态菜单（无 JS 降级）；进入视口由 IntersectionObserver 触发循环播放刮削实况（`$ kuraya` 打字 + 逐行输出）。动画脚本按真实产品 `kuraya/launcher.py` 的 `cmd_all` 输出逐行重演：brand → ①刮削影片（`▸ 番号 [i/n]` + spinner 阶段行 + `├ 封面 已下载`/`├ 裁剪 已生成竖版海报`/`├ 元数据 演员·厂商·日期`/`└ 入库 演员\番号 Ns` 树状行）→ ②清理源目录（`移除 原文件名`）→ ③重建片库页面（`✓ 页面已重新生成，收录 N 部`）→ 结尾统计卡片（`╭─╮ 新入库…·库内共…·耗时… ╰─╯`）。演示数据与片库演示自洽（6 部影片、2 个待整理、SEIS/SHID 番号、星霜舍/紫電堂）；改动终端脚本前先对照 `launcher.py`（`launcher.py` 的 `branch`/`section`/`box`/`spinner` 组件），保持与产品输出一致。状态色：`──` 灰、`①` 蓝、`✓` 与卡片绿，映射 `launcher.py` 的 ANSI 色。离开视口恢复静态；`prefers-reduced-motion` 保持静态。
  **排版一律走 CSS，禁止用空格字符补位**：`.term p` 是 flex 行，缩进用 `.in1/.in2`，列宽用 `.c`（树状标签）/`.c-menu`（菜单项名，按最长的英文项定宽，三语才对齐），右对齐用 `.r`（`margin-left:auto`），分隔线用 `.rule` 的 `::before` 边框，结尾统计卡片用 `.term-box` 的真边框。原来的 `' '.repeat(n)` 在 HTML 里会被空白折叠压成一个空格，列对齐根本不成立；固定 60 字符的分隔线在窄屏也必然溢出。`$ kuraya` 的命令要单独包一个 `<span class="cmd">`——裸文本节点会并成匿名 flex 项，行首空格被折叠掉，`$` 与命令就贴上了。

  **窗口是定高的**：`.term` 高度锁成 `--term-lines` 行（桌面 13 / 窄屏 11，`line-height:2` 故每行 2em），输出靠 `term.scrollTop` 在窗口内跟随。终端本来就是固定大小的窗口，输出该往上滚而不是把整页越撑越长——不锁高的话播完一轮页面会长出 500 多 px，下面的内容一直在动。跟随前先判 `atBottom()`，用户自己往回滚时不抢滚动位置。

  **spinner 行必须就地覆盖，不能删了再新增**：产品里 spinner 是被正式输出用 `\r` 原地改写的。这里用 `spinLine` 记住当前 spinner 的 `<p>`，下一条输出（含连续的下一个 spinner）复用同一个节点，容器行数只增不减。改回「remove 再 append」会让高度一减一增，每个阶段画面都上下弹一次。

  **并发与代际**：`running` 保证同时只有一个循环；`runId` 是「代」，语言切换时 +1 并 `wake()` 叫醒当前那一觉，在跑的那轮下次醒来即退场，并由它自己的退出路径按新语言重开。三条铁律：
  ① 循环退出后必须重新判一次 `inView` 并重启——它是在某个 `await` 里读到 `inView=false` 才退出的，而这期间可能又转回可见，那次 IO 回调被 `running` 挡掉了，不重启终端会永远停在半截输出上（原实现就有这个卡死）。
  ② `onLangChange` 在 `running` 时**绝不能直接改 `term.innerHTML`**：旧循环还在往里写，两边会打架，而且它手上的 `spinLine` 会指向脱离文档的节点，之后的输出全丢。
  ③ 代际判定要下沉到写入口（`put`/`line`/`spinner` 的 `stale()`），不能只靠循环里那几个 `alive()` 检查点——两点之间还有十几行输出，只在检查点判会让旧循环继续用旧语言写，屏幕上两种语言混在一起。
- **版本号（注入机制）**：页面与终端展示的产品版本（mast/hero-meta/静态终端/页脚/动画头部共 5 处）**一律不得硬编码**。单一来源为仓库内 `public/version.txt`，发版时手动更新该文件，构建/开发时经 `vite.config.js` 注入：HTML 侧用 `{{VERSION}}` 占位（`transformIndexHtml` 替换），JS 侧（main.js 动画品牌头）用 `define` 常量 `__KURAYA_VERSION__`。`KURAYA_VERSION` 环境变量可临时覆盖。`version.txt` 缺失/为空时构建直接报错（不静默兜底假版本）。新增版本号展示位必须走注入，禁止手写。**发新版流程（主仓库发版后）**：① 改 `public/version.txt` 为新版本号（如 `0.6.0`）→ ② 提交推送 → Cloudflare Pages 检测到推送自动重新构建 → 页面 5 处版本号全部更新。
- **展卷动画**：`.fade` 区块由 IntersectionObserver 加 `.in`，起始 `opacity:0`、时长 `.75s`，节标题内部（`.sec-no`→`.sec-title`→`.sec-lead`）再错峰。起始值不要回到 `.2`、时长不要拉回 `1.4s`——半透明加长过渡在快速滚动时整页像没加载完。`prefers-reduced-motion` 下全部降级为立即可见。

- **移动端页眉**：导航在窄屏必须保留（原来 `≤760px` 整个 `display:none`，安装入口在手机上彻底消失）。让位顺序是：`≤820px` 收起版本号（hero-meta 与页脚各有一处，页眉可省）→ `≤470px` 把词标 `.brand-name` 做成视觉隐藏（保留无障碍名，不能用 `display:none`），只留家纹。

- **社交分享图**：`public/og.jpg`（1200×630）用站点自身的调色与字体渲染后截图导出，`og:image` / `twitter:image` 走绝对 URL，`twitter:card` 为 `summary_large_image`。改动 hero 视觉时一并重出，否则分享预览会和站点脱节。
- **SEO 与三语静态页**：构建（`npm run build`）在 `vite build` 后由 `scripts/build-i18n-pages.mjs` 生成 `dist/zh-TW/index.html` 与 `dist/en/index.html`，让繁/英内容以独立 URL 被搜索引擎索引（运行时切换只对 JS 用户可见）。主页 head 带三语 `hreflang`（`x-default` 指向 `/`）、`robots.txt` 与 `sitemap.xml`（public/，URL 写死 `https://kuraya.app/`），以及 `SoftwareApplication` JSON-LD（`{{VERSION}}` 占位注入版本）。**脚本三条铁律**：① 键值替换按原文长度降序（「影片库」是「影片库位置…」的子串，必须先长后短），用 `split/join` 而非 `replace` 防 `$` 转义；② 副本页的相对资源（`./assets/`、`apple-touch-icon.png`、`covers/` 含 `srcset`）必须回退一级为 `../`，漏一条就是整页图片 404；③ 单独替换 `html lang`、canonical / `og:url` / JSON-LD `url` 与 `inLanguage`、`og:locale`。新增页面文案时必须三语词条齐全（词典是脚本的翻译来源），并重新构建验证副本页无简体残留。
- **文案语域**：现代高级感方向——白话、克制、短句、有留白与意象（如「一座片库，一个文件」）；**不用文言虚词**（之/乃/既毕/择定/宜于等）；保留产品术语（kuraya、nfo、番号、刮削）与功能信息；法律声明保持清晰直白；终端示意与片库复刻区为「真实产物」，文案勿改。
- **部署**：canonical / `og:url` / `og:image` / `twitter:image` 均为 `https://kuraya.app/` 绝对 URL（域名由页内安装命令 `https://kuraya.app/install.sh` 佐证）。原先 canonical 上的 `vite-ignore` 是给相对占位值 `index.html` 挡 Vite 资源解析用的，改成绝对 URL 后已不需要，勿再加回。构建仍是 `base: './'`，页面资源可托管于任意子路径。

## 本机环境注意事项

- 机器上有 arm64 node（v25.5，`/opt/homebrew/bin/node`）与 x64 node（v22.19，`/usr/local/bin/node`）。系统服务/后台进程可能解析到 x64 版，运行 vite（rolldown 原生绑定）会报 "Cannot find native binding"。前台 shell 无此问题。
- `vite preview` 只监听 IPv6，健康检查应探测 `localhost` 而非 `127.0.0.1`。
