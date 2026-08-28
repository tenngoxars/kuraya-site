# 文档索引

## 前端文档
`frontend/architecture.md` - 官网前端架构、目录结构与工程约束，修改任何前端代码时必读

## 全局重要记忆
- 本机存在两个 node：`/opt/homebrew/bin/node`（arm64 v25.5）与 `/usr/local/bin/node`（x64 v22.19，Rosetta）。服务类进程（hub start）可能解析到 x64 版，导致 rolldown 等原生绑定缺失报错；启动 vite 相关服务时显式使用 `/opt/homebrew/bin/node`。
- 官网 `base: './'` 相对路径构建；vite preview 只监听 IPv6 localhost，端口探测用 `localhost` 而非 `127.0.0.1`。
- **发新版流程**：主页版本号单一来源为 `public/version.txt`（构建注入，页面零硬编码）。主仓库发版后：改该文件为新版本号 → 提交推送 → Cloudflare Pages 自动重建生效。详见 `frontend/architecture.md`「版本号（注入机制）」。

## 历史会话沉淀（2026-08-11 批量提炼）

以下条目由 omp 历史会话自动提炼，与上方「全局重要记忆」互补（已按现有条目去重）。

- **官网「私人片库」区是主项目真实片库的复刻**：官网首页片库区对应主仓库 `kuraya/web` 的片库，主项目重构（2026-08-07「列式打包 + 三维筛选」）后官网必须联动同步（涉及 index.html / style.css / main.js / i18n.js / architecture.md 五个文件），否则形态与交互落后于真实产品。
- **片库新版交互形态（复刻基准）**：演员/厂商/导演三维筛选 + pills 总清空 + 「更多 N」折叠面板（chips 宽度实测，窄屏 390px 下自动收进面板）；卡片 sub 行为「厂商 · 导演 · 日期」且无 runtime，演员/厂商/导演全部 meta-link 化（点击筛演）；搜索分隔符归一化（ABC-001 ≡ abc001）、搜索含导演；计数只在筛选激活时显示；排序 added_desc（NEW 角标语义自洽）；无值维度自动隐藏；语言切换时重建筛选行/pills（DIMS label 每次现取，避免固化旧语言）。i18n 三语需与 `kuraya/web/i18n.js` 逐字一致。
- **教训：`stopPropagation()` 挡不住同一元素上后注册的监听器**：meta-link 与 lightbox 的点击监听器都挂在 `libGrid` 上，stopPropagation 只挡冒泡到祖先；修复须在 lightbox 网格监听内显式排除（`if (e.target.closest('.lib-meta-link')) return;`），不依赖事件注册顺序。
- **教训：移植功能必须适配宿主上下文**：从真实版移植的 `setFilter` 含「筛选后滚回页顶」，真实版整页即片库、滚回顶合理，但官网片库区在页面中部，点击筛选会平滑滚走打断浏览——已删除该逻辑。复刻代码不能照搬真实版行为。
- **教训：生成/拼接 JS 后要防标识符污染与数据/元素混淆**：一次同步中 `dirty` 函数被错误写入 `__omp_shell(...)` 调用（构建后 bundle 内 ReferenceError → 模块初始化中断、lightbox/终端全失效），需检查源文件字节与 bundle 一致；另一次 `renderGrid` 可见集合误用 DATA 对象去查 DOM 元素导致卡片全隐藏。
- **片库数据口径（已入 architecture.md）**：6 部影片 / 4 位演员 / 6 个厂商 / 4 位导演（导演：高橋真央×2、藤井玲央×2、白石敬一、佐伯直人）；masthead 统计只剩「部影片」一项（真实版已砍演员/厂商统计）。
- **教训：i18n 同步须三语全量比对**：英文排序下拉曾漏改（旧译 `Release date · new to old` vs 真实版 `Release Date · Newest First / Oldest First、Date Added · Newest First`），中/繁一致但 EN 不一致；同步后应做词典键值全量比对防遗漏。

- **项目定位**：kuraya-site 是 KURAYA 蔵屋（JAV 刮削编目工具）的官网落地页——Vite 8 + 原生 JS/CSS 静态站，无运行时网络请求；结构为 `index.html` + `src/{style.css,main.js,i18n.js}` + `public/{covers/,version.txt}`，`vite.config.js` 用 `base: './'` 支持任意子路径托管。
- **仓库拓扑**：kuraya-site（`github.com/tenngoxars/kuraya-site`，public）是纯前端；主仓库 Kuraya（`github.com/tenngoxars/Kuraya`，本地 `/Users/tenngo/Documents/Kuraya/`）是 Python CLI + 生成片库的 web 模板（`kuraya/web/`）；个人主页 zychweb（`tenngoxars/zychweb`）是 Next.js + i18n 项目。
- **版本号单一来源机制**：最终形态是 `public/version.txt` 一个文件，构建时注入页面 5 处展示位（mast/hero-meta/静态终端/页脚 + 动画品牌头）；`KURAYA_VERSION` 环境变量可临时覆盖；version.txt 缺失时构建明确报错、绝不静默兜底。发版流程：改 version.txt → 提交推送 → CF Pages 自动重建。曾先实现「构建时读主仓库 `__init__.py` + workflow 联动」，用户嫌复杂全部撤销——用户倾向简单手动方式。
- **Cloudflare Pages 部署**：框架预设选「无（None）」（面板里没有 Vite 预设），构建命令 `npm run build`，输出目录 `dist`，Node 版本必须指定 22（vite 8 要求 ≥22.12）；云端无主仓库目录，版本只能来自 version.txt。
- **三语 i18n 机制**：`src/i18n.js` 约 90 键 × 3 语言，语言规则与主项目一致——非 zh → 英文、`zh-tw/zh-hk/zh-mo/zh-hant` → 繁体、其余 → 简体；首访跟随 `navigator.language`，手动选择 localStorage 持久化，页眉「简/繁/EN」切换器；HTML 43 处 `data-i18n`（含 -html/-placeholder/-aria），无 JS 时保留简体原文。终端/片库文案必须逐条复用主项目 `i18n_en.py`/`i18n_zh_tw.py`/`web/app.js` 的真实翻译；新文案必须三语齐全（曾因漏 `nav.aria` 键被 code review 抓出硬违规）。
- **SEO 三语静态页**：构建脚本 `scripts/build-i18n-pages.mjs` 额外生成 `/zh-TW/` 与 `/en/` 静态副本页（简中在 `/`），三页 hreflang（含 x-default）互指、各自 canonical/og:url/og:locale/翻译版 JSON-LD（SoftwareApplication schema，`softwareVersion` 走版本注入）；robots.txt + sitemap.xml（xhtml:link hreflang）；GA4 `G-1PREHY3TEE` 放 head 且副本页自动继承。副本页坑：相对路径 `covers/...` 在子目录页 404，需构建脚本补回退；键值替换按长度降序。
- **文案风格偏好（重要）**：用户要的「高逼格」= 现代高级感（短句、意象、克制、留白、现代汉语），不是文言文——曾把全站改成「之/乃/既毕」被明确否决（"我说的是高逼格，不是文言文"）。达标句例：「一座片库，一个文件。本地保存，双击即开。」「将散落的影片，整理成一座带封面与元数据的片库——离线，也能从容翻阅。」术语「目録/片藏」是产品语言不算文言。
- **品牌语域**：日式蔵屋美学——家纹（金圆环菱格/海鼠壁纹样）、竖排雅称+实称对照区块标题（壹·片藏/貳·解題…）、终端品牌头 `◈ K U R A Y A 蔵屋 vX.Y.Z`；KURAYA=蔵屋（`kuraya/__init__.py` 定义 `NAME='KURAYA'`/`KANJI='蔵屋'`，意象=收存的库房之家，tagline「一座片库，一个文件」全链自洽）。
- **演示数据自洽约束**：片库复刻区所有数字口径必须一致（6 卡/4 演员/6 厂商贯通统计栏、chips 计数、计数栏、终端示意、筛选结果）；chips 与卡片一一对应、每个出现过的演员都要有 chip（曾漏朝霧遥、口径 100→6 被用户连续抓出）；总数由 JS 从 HTML 自动解析避免硬编码漂移。
- **虚构番号体系**：演示数据用虚构番号避免撞真实片商——前缀=厂商名罗马音前四字母（SEIS=星霜 seishou、SHID=紫電 shiden…），数字=发行月日；演员诗意日式名（花菱雫/月見桜/雪村凛/朝霧遥，保留一人多部结构），厂商 6 个不重复（星霜舍/紫電堂/白夜社/青嵐舎/紅葉館/藤花舎）。
- **活终端动画**：逐行重演主仓库 `launcher.py` 的 `cmd_all` 真实输出——品牌头→①刮削影片 `▸ 番号 [1/2]`+spinner→树状行（├ 封面 已下载…）→②清理源目录→③重建片库页面→圆角统计卡片 `box()`→刮削完的 `offer_open_library` 选择器（`▸ 打开片库 / · 稍后再说 / ↑↓ 选择 · 回车 确认 · Esc 跳过`）；spinner 用 CSS content keyframes 转圈帧（对应产品 Spinner.FRAMES）；`prefers-reduced-motion` 下保持静态、未进视口显示静态菜单。主项目流程/输出变化时必须对照同步（曾因流程是编的与实际产品不一致被指出）。
- **backdrop-filter 坑**：元素自身或祖先 `opacity < 1` 时 backdrop blur 不渲染——播放按钮淡入导致模糊延迟；拆层解决：渐变遮罩走 `::before` opacity 淡入、按钮自身 opacity 恒 1 改用 `scale` 出现（transform 不影响 blur）。已记入架构文档防复发。
- **终端滚动跟随竞态**：`.term` 的 `scroll-behavior: smooth` 与逐行 `follow()` 的 `atBottom()` 判定竞态（平滑动画进行中读不到底，后续行停止跟随，选择器落在视口外）——程序化滚动必须临时改 `scrollBehavior:'auto'` 瞬时到位；手动滚动仍保留平滑。
- **CSS 定宽列坑**：`min-width` 只对 flex item 生效——缩进类包在行内 `<span>` 里时定宽列失效、label 与 desc 紧贴；选择器行的缩进类要放在 `<p>` 上、子元素平铺成 flex item。
- **安装区设计**：4 个 tab（macOS/Windows/Linux/解压即用）；解压即用面板是三平台按钮+内联 SVG icon（无 JS 降级到 Releases 页），直链 `Kuraya-{version}-{os_arch}.zip`（mac-arm64/win-x64/linux-x86_64，与主仓库 release.sh/updater.py 命名一致）；平台检测 `navigator.userAgentData` 高熵架构 + UA 兜底（Safari/Firefox 无 API，架构判断无法 100%）；不支持架构（Intel Mac/ARM Linux）降级 Releases 页+提示「当前 macOS 暂未提供官方安装包」；按钮默认中性、仅 hover/focus 金色（常驻高亮曾被用户当 bug）；inst-note 文案随 tab 切换状态化；`.copy` 与下载按钮类隔离避免被复制逻辑捕获。
- **片库复刻区交互**：必须与真实片库 `kuraya/web` 同步——自定义下拉 `.select-wrap`（原生 select 弹出列表无法定制）、chips 演员筛选、搜索（演员/番号/厂商匹配 + 空态 + 清空按钮 + `/` 聚焦 + Escape）、排序（`data-date`/`data-added`，初始即按 label 排序渲染）、rise 动画重播错峰 22ms、lightbox 封面大图（演示区无影片文件，「点封面即播」行为改为大图预览；role=dialog + aria-modal + 焦点还原 + 滚动锁，img 不写空 src 由 JS 赋值）。改此区先对照主仓库源码。
- **封面资源**：`cover-N.webp`（900×1350、WebP q82、6 张共约 1.2MB，曾从 11MB PNG 优化 -89%）；曾修 404 bug（HTML 引用 `cover-N.png` 而实际文件是 `N.png`）。
- **本地双 Node 坑**：`/usr/local/bin/node` 是 x64 v22.19（Rosetta）、`/opt/homebrew/bin/node` 是 arm64 v25——后台服务解析到 x64 版会报 `@rolldown/binding-darwin-arm64` 缺失；显式用 arm64 路径启动。另 vite 只绑 IPv6（`::1`）会让 hub 的 127.0.0.1 readiness 探测误报失败（服务实际正常）。
- **服务启动纪律**：起服务前先查是否已有同项目进程并直接复用（曾因 5173 被用户自己的 dev server 占用而另开 5174，被批评"为什么要再开一个"）；`omp.browser.headless` 是 harness 基础设施不要停；`layout-check`(4190) 等 preview 类服务是遗留任务产物。
- **提交纪律教训**：曾 `git add -A` 把用户工作区未提交的改动（lightbox 换片、响应式封面等 16 文件）和远程定时任务自动提交的「同步安装脚本」一并带进提交——提交前先检查工作区状态与远程。
- **主仓库代码教训**：`kuraya uninstall` 用 `if app.exists(): rmtree(...)` 导致 CI（路径不存在）短路、测试失败——`ignore_errors=True` 本就容忍不存在，去掉冗余 exists() 判断；测试不能依赖真实文件系统状态（本地 mac 有 `~/Applications/Kuraya.app` 所以本地过、CI 挂）。
- **文档体系**：`.agentdocs/frontend/architecture.md` 是前端规格与工程约束权威来源（AGENTS.md 指认），code review 以它为 spec 基准、AGENTS.md 要求变更必须过构建；任务文档走 `.agentdocs/workflow/`（完成移入 done/）。
- **omp 视觉模型配置**：`inspect_image` 按 `@vision → @default → 当前模型` 顺序自动选模型，视觉模型须声明图片输入。**（2026-08-11 更新：qwen-api provider 已删除，以下历史信息仅供追溯）** 曾配 `modelRoles.vision = qwen-api/qwen3.8-max`（阿里 Token Plan 套餐，主模型保持 `deepseek/deepseek-v4-flash`）；Token Plan 端点 `https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1`，key 为 `sk-sp-` 前缀；qwen3.8-max 实测支持图片输入（`/v1/models` 列表不可靠，曾据列表误判套餐无 VL 模型）。当前 vision 用 `google/gemini-3-flash-preview`。
- **omp 自定义 provider 写法**：`~/.omp/agent/models.yml` 配 providers（baseUrl/apiKey/`api: openai-completions`/models + `input:[text,image]`/contextWindow/maxTokens）；apiKey 值先按环境变量名解析再当字面量；`modelRoles` 是 record 类型需整对象设置。限制：omp 的 `generate_image` 只支持 OpenAI/Codex/Antigravity/xAI/OpenRouter/Gemini 六家（自定义 OpenAI 兼容端点接不进）、`tts` 只支持本地 Kokoro/xAI——Token Plan 的 wan2.7-image 只能走 bash 封装。
- **omp-wan 生图脚本（历史方案，2026-08-11 已弃用）**：曾封装 wan2.7-image 文生图（`QWEN_WAN_MODEL` 可换 `wan2.7-image-pro`，超时放宽 180s），key 从环境变量 `QWEN_TOKEN_PLAN_KEY` 读（已写入 `~/.zshrc` 与 `~/.config/fish/config.fish`）。**当前生图主方案已改为 KIEAI**：`~/.omp/agent/tools/kieai-image.ts` 自定义工具（GPT Image 2，异步任务式 createTask + recordInfo 轮询，结果 URL 20 分钟有效需立即下载，图生图上传走 kieai.redpandaai.co），key 在 `~/.omp/agent/.env` 的 `KIEAI_API_KEY`；生成后可调 `inspect_image`（当前 vision=gemini-3-flash-preview）做生成→质检闭环。
- **模型定价知识**：DeepSeek V4 明显比 OpenAI 便宜（v4-flash 输出 ¥2/1M vs GPT-5.6 Luna $1.2≈¥8.6；缓存命中输入 ¥0.02 vs $0.02）；Luna 隐藏成本：提示 >27.2 万 token 时整次请求 2x 输入/1.5x 输出、cache write 按 1.25x 输入费率；DeepSeek 官方预告近期大幅涨价（幅度未定——约 3 倍时输出侧打平、4-5 倍后 Luna 多数场景占优），选型以官方定价页实时为准。
- **个人主页 zychweb 现状**：项目列表在 `src/lib/projects.ts`；首页精选 4 个（KURAYA 蔵屋第一 → PicPak → WeMD → Imago，`featured` 控制数量），Lowfade 已从两处展示移除（git 历史可恢复）；页脚版权已简化为「© 2026 Zych」（删掉 "用 Opus、Codex 和 Gemini 制作"）；Linux 图标用 simple-icons 标准 Tux（CC0）。
