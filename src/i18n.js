// KURAYA 蔵屋 官网多语言：简中原文 / 繁中 / 英文。
// 终端与片库相关文案逐条复用主项目 kuraya/i18n_en.py、i18n_zh_tw.py、
// kuraya/web/app.js 的真实翻译，保证「与实际产品一致」。
// 语言规则与主项目一致：非 zh 浏览器 → en；繁体地区 → zh-TW；其余 → zh-CN。
// 手动选择经 localStorage 持久化（键 kuraya-site-lang）。

const TRADITIONAL_CODES = ['zh-tw', 'zh-hk', 'zh-mo', 'zh-hant'];

export const I18N = {
  'zh-CN': {
    'meta.title': 'KURAYA 蔵屋 — JAV 影片刮削与编目工具',
    'meta.desc': 'KURAYA 蔵屋是一款本地优先的 JAV 影片刮削与编目工具。自动整理封面与元数据，生成无需服务器、可离线浏览的私人片库。支持 macOS、Windows 与 Linux，MIT 开源。',
    'og.desc': '让散落的影片各归其位。自动整理封面与元数据，生成可离线浏览的私人片库。',
    skip: '跳到正文',
    'nav.order': '整理',
    'nav.preview': '片库',
    'nav.cli': '命令',
    'nav.install': '安装',
    'nav.aria': '章节导航',
    'lang.aria': '切换语言',
    'hero.lead': '<b>让散落的影片，各归其位。</b><br>自动整理封面与元数据，生成一座可离线浏览的私人片库。',
    'install.aria': '选择安装方式',
    'inst.tab.zip': '解压即用',
    copy: '复制',
    copied: '已复制',
    copy_failed: '复制失败',
    'inst.note.generic': '运行 <span class="mono">Kuraya</span>，选定影片库，整理即可开始。',
    'inst.note.zip': '下载对应版本，解压后双击 <span class="mono">Kuraya</span>。无需安装，即刻运行。',
    'inst.note.unsupported': '当前 <span class="mono">{platform}</span> 暂未提供官方安装包，可到 Releases 查看。',
    'sec.order.no': '壹',
    'vmark.order': '归位',
    'sec.order.title': '从一堆文件，到一座片库',
    'sec.order.lead': '原始文件名各写各的。刮削一次，番号、演员、厂商、封面各就各位。',
    'order.before': '整理前 · 待整理',
    'order.after': '整理后 · 影片库',
    'order.root': '影片库/',
    'sec.preview.no': '貳',
    'sec.cli.no': '叁',
    'vmark.preview': '片藏',
    'vmark.cli': '命令',
    'sec.preview.title': '私人片库',
    'sec.preview.lead': '一座片库，一个文件。无需服务，双击即开。',
    'preview.cap': '封面、演员、番号、厂商与导演井然归档。点开封面，即可播放。',
    'cover.preview': '封面预览',
    'cover.close': '关闭',
    'cover.prev': '上一张',
    'cover.next': '下一张',
    'sec.cli.title': '一次运行，完成整理',
    'sec.cli.lead': '刮削、归档、清理、重建页面，按顺序自动完成。',
    'term.library': '影片库',
    'term.pending': '待整理',
    'term.movies6': '6 部',
    'term.files2': '2 个文件',
    'term.scrape': '刮削入库',
    'term.scrape_desc': '处理待整理目录并归入片库',
    'term.rebuild': '重建页面',
    'term.rebuild_desc': '重新扫描片库并生成 index.html',
    'term.open': '打开片库',
    'term.open_desc': '在浏览器中查看',
    'term.settings': '设置',
    'term.settings_desc': '影片库位置、待整理目录、播放器',
    'term.update': '更新',
    'term.update_desc': '检查并安装新版本',
    'term.quit': '退出',
    'legal.declare': 'KURAYA 仅用于整理用户<b>合法持有</b>的本地影片，不提供、不托管、不分发任何影片内容。',
    'legal.sub': '请遵守所在地区法律，使用责任自负。',
    'foot.top': '回到顶部',
    // 片库预览区（复用 kuraya/web/app.js 键与翻译）
    'stat.movies': '部影片',
    'search.placeholder': '搜索演员 · 番号 · 厂商 · 导演',
    empty: '没有找到匹配的影片',
    clear: '清空',
    'sort.by': '排序方式',
    'sort.date_desc': '发行日期 · 新到旧',
    'sort.date_asc': '发行日期 · 旧到新',
    'sort.added_desc': '入库时间 · 新到旧',
    'chips.all': '全部',
    'dim.actor': '演员',
    'dim.studio': '厂商',
    'dim.director': '导演',
    more: '更多 {n}',
    searchIn: '搜索{dim}',
    noMatch: '没有匹配的{dim}',
    // 活终端（复用 kuraya/i18n_en.py、i18n_zh_tw.py 翻译）
    'launcher.scrape_movies': '刮削影片',
    'launcher.clean_source': '清理源目录',
    'launcher.rebuild_page': '重建片库页面',
    'launcher.fetching': '查询 {number} 的元数据',
    'launcher.probe_cover': '探测封面源',
    'launcher.crop_poster': '裁剪竖版海报',
    'launcher.write_meta': '写入元数据并移动文件',
    'launcher.cover': '封面',
    'launcher.downloaded': '已下载',
    'launcher.crop': '裁剪',
    'launcher.poster': '已生成竖版海报',
    'launcher.metadata': '元数据',
    'launcher.archived': '入库',
    'launcher.removed': '移除 {name}',
    'launcher.page_regenerated': '页面已重新生成，收录',
    'launcher.new_archived': '新入库 {done} 部',
    'launcher.total': '库内共 {total} 部',
    'launcher.elapsed': '耗时 {elapsed}s',
    'launcher.later': '稍后再说',
    'launcher.select_hint': '↑↓ 选择 · 回车 确认 · Esc 跳过',
    'launcher.titles': '部',
  },

  'zh-TW': {
    'meta.title': 'KURAYA 蔵屋 — JAV 影片刮削與編目工具',
    'meta.desc': 'KURAYA 蔵屋是一款本地優先的 JAV 影片刮削與編目工具。自動整理封面與中繼資料，生成無需伺服器、可離線瀏覽的私人片庫。支援 macOS、Windows 與 Linux，採用 MIT 授權。',
    'og.desc': '讓散落的影片各歸其位。自動整理封面與中繼資料，生成可離線瀏覽的私人片庫。',
    skip: '跳到正文',
    'nav.order': '整理',
    'nav.preview': '片庫',
    'nav.cli': '命令',
    'nav.install': '安裝',
    'nav.aria': '章節導航',
    'lang.aria': '切換語言',
    'hero.lead': '<b>讓散落的影片，各歸其位。</b><br>自動整理封面與中繼資料，生成一座可離線瀏覽的私人片庫。',
    'install.aria': '選擇安裝方式',
    'inst.tab.zip': '解壓即用',
    copy: '複製',
    copied: '已複製',
    copy_failed: '複製失敗',
    'inst.note.generic': '執行 <span class="mono">Kuraya</span>，選定影片庫，即可開始整理。',
    'inst.note.zip': '下載對應版本，解壓後雙擊 <span class="mono">Kuraya</span>。無需安裝，即刻執行。',
    'inst.note.unsupported': '目前 <span class="mono">{platform}</span> 暫未提供官方安裝套件，可到 Releases 查看。',
    'sec.order.no': '壹',
    'vmark.order': '歸位',
    'sec.order.title': '從一堆檔案，到一座片庫',
    'sec.order.lead': '原始檔名各寫各的。刮削一次，番號、演員、廠商、封面各就各位。',
    'order.before': '整理前 · 待整理',
    'order.after': '整理後 · 影片庫',
    'order.root': '影片庫/',
    'sec.preview.no': '貳',
    'sec.cli.no': '參',
    'vmark.preview': '片藏',
    'vmark.cli': '命令',
    'sec.preview.title': '私人片庫',
    'sec.preview.lead': '一座片庫，一個檔案。無需服務，雙擊即開。',
    'preview.cap': '封面、演員、番號、廠商與導演井然歸檔。點開封面，即可播放。',
    'cover.preview': '封面預覽',
    'cover.close': '關閉',
    'cover.prev': '上一張',
    'cover.next': '下一張',
    'sec.cli.title': '一次執行，完成整理',
    'sec.cli.lead': '刮削、歸檔、清理、重建頁面，依序自動完成。',
    'term.library': '影片庫',
    'term.pending': '待整理',
    'term.movies6': '6 部',
    'term.files2': '2 個檔案',
    'term.scrape': '刮削入庫',
    'term.scrape_desc': '處理待整理目錄並歸入片庫',
    'term.rebuild': '重建頁面',
    'term.rebuild_desc': '重新掃描片庫並生成 index.html',
    'term.open': '開啟片庫',
    'term.open_desc': '在瀏覽器中查看',
    'term.settings': '設定',
    'term.settings_desc': '影片庫位置、待整理目錄、播放器',
    'term.update': '更新',
    'term.update_desc': '檢查並安裝新版本',
    'term.quit': '退出',
    'legal.declare': 'KURAYA 僅用於整理使用者<b>合法持有</b>的本地影片，不提供、不託管、不分發任何影片內容。',
    'legal.sub': '請遵守所在地區法律，使用責任自負。',
    'foot.top': '回到頂部',
    'stat.movies': '部影片',
    'search.placeholder': '搜尋演員 · 番號 · 廠商 · 導演',
    empty: '沒有找到相符的影片',
    clear: '清空',
    'sort.by': '排序方式',
    'sort.date_desc': '發行日期 · 新到舊',
    'sort.date_asc': '發行日期 · 舊到新',
    'sort.added_desc': '入庫時間 · 新到舊',
    'chips.all': '全部',
    'dim.actor': '演員',
    'dim.studio': '廠商',
    'dim.director': '導演',
    more: '更多 {n}',
    searchIn: '搜尋{dim}',
    noMatch: '沒有相符的{dim}',
    'launcher.scrape_movies': '刮削影片',
    'launcher.clean_source': '清理來源目錄',
    'launcher.rebuild_page': '重建片庫頁面',
    'launcher.fetching': '查詢 {number} 的中繼資料',
    'launcher.probe_cover': '偵測封面來源',
    'launcher.crop_poster': '裁剪直立海報',
    'launcher.write_meta': '寫入中繼資料並移動檔案',
    'launcher.cover': '封面',
    'launcher.downloaded': '已下載',
    'launcher.crop': '裁剪',
    'launcher.poster': '已生成直立海報',
    'launcher.metadata': '中繼資料',
    'launcher.archived': '入庫',
    'launcher.removed': '移除 {name}',
    'launcher.page_regenerated': '頁面已重新生成，收錄',
    'launcher.new_archived': '新入庫 {done} 部',
    'launcher.total': '庫內共 {total} 部',
    'launcher.elapsed': '耗時 {elapsed} 秒',
    'launcher.later': '稍後再說',
    'launcher.select_hint': '↑↓ 選擇 · Enter 確認 · Esc 跳過',
    'launcher.titles': '部',
  },

  en: {
    'meta.title': 'KURAYA 蔵屋 — JAV movie scraper & cataloger',
    'meta.desc': 'KURAYA is a local-first JAV movie scraper and cataloger. Organize covers and metadata automatically into a private offline library with no server required. Available for macOS, Windows, and Linux. MIT licensed.',
    'og.desc': 'Give every film its place. Organize covers and metadata automatically into a private library you can browse offline.',
    skip: 'Skip to content',
    'nav.order': 'Order',
    'nav.preview': 'Library',
    'nav.cli': 'CLI',
    'nav.install': 'Install',
    'nav.aria': 'Section navigation',
    'lang.aria': 'Switch language',
    'hero.lead': '<b>Give every film its place.</b><br>Organize covers and metadata automatically into a private library you can browse offline.',
    'install.aria': 'Choose an installation method',
    'inst.tab.zip': 'Download & run',
    copy: 'Copy',
    copied: 'Copied',
    copy_failed: 'Copy failed',
    'inst.note.generic': 'Run <span class="mono">Kuraya</span>, choose your library, and start organizing.',
    'inst.note.zip': 'Download the build for your platform, unzip it, and double-click <span class="mono">Kuraya</span>. No installation required.',
    'inst.note.unsupported': 'No official package for <span class="mono">{platform}</span> yet — check Releases.',
    'sec.order.no': 'I',
    'vmark.order': 'ORDER',
    'sec.order.title': 'From a pile of files to a library',
    'sec.order.lead': 'Raw filenames follow no rules. One scrape, and the number, performer, studio, and cover all land where they belong.',
    'order.before': 'Before · Pending',
    'order.after': 'After · Library',
    'order.root': 'Library/',
    'sec.preview.no': 'II',
    'sec.cli.no': 'III',
    'vmark.preview': 'LIBRARY',
    'vmark.cli': 'CLI',
    'sec.preview.title': 'Private library',
    'sec.preview.lead': 'One library, one file. No server required — just double-click to open.',
    'preview.cap': 'Covers, performers, catalog numbers, studios, and directors — all in order. Click a cover to play.',
    'cover.preview': 'Cover preview',
    'cover.close': 'Close',
    'cover.prev': 'Previous',
    'cover.next': 'Next',
    'sec.cli.title': 'One run, fully organized',
    'sec.cli.lead': 'Scrape, archive, clean, and rebuild — automatically, in order.',
    'term.library': 'Library',
    'term.pending': 'Pending',
    'term.movies6': '6 titles',
    'term.files2': '2 files',
    'term.scrape': 'Scrape & archive',
    'term.scrape_desc': 'Process the pending folder and archive into the library',
    'term.rebuild': 'Rebuild page',
    'term.rebuild_desc': 'Rescan the library and regenerate index.html',
    'term.open': 'Open library',
    'term.open_desc': 'View in browser',
    'term.settings': 'Settings',
    'term.settings_desc': 'Library, pending folder, player',
    'term.update': 'Update',
    'term.update_desc': 'Check for and install the new version',
    'term.quit': 'Quit',
    'legal.declare': 'KURAYA is only for organizing local movies you <b>legally own</b>. It does not provide, host, or distribute any movie content.',
    'legal.sub': 'Please comply with local laws; use at your own risk.',
    'foot.top': 'Back to top',
    'stat.movies': 'movies',
    'search.placeholder': 'Search actors · numbers · studios · directors',
    empty: 'No matching movies',
    clear: 'Clear',
    'sort.by': 'Sort by',
    'sort.date_desc': 'Release Date · Newest First',
    'sort.date_asc': 'Release Date · Oldest First',
    'sort.added_desc': 'Date Added · Newest First',
    'chips.all': 'All',
    'dim.actor': 'actors',
    'dim.studio': 'studios',
    'dim.director': 'directors',
    more: '{n} more',
    searchIn: 'Search {dim}',
    noMatch: 'No matching {dim}',
    'launcher.scrape_movies': 'Scrape movies',
    'launcher.clean_source': 'Clean the source folder',
    'launcher.rebuild_page': 'Rebuild the library page',
    'launcher.fetching': 'Fetching metadata for {number}',
    'launcher.probe_cover': 'Probing the cover source',
    'launcher.crop_poster': 'Cropping the portrait poster',
    'launcher.write_meta': 'Writing metadata and moving the file',
    'launcher.cover': 'Cover',
    'launcher.downloaded': 'Downloaded',
    'launcher.crop': 'Cropped',
    'launcher.poster': 'Portrait poster generated',
    'launcher.metadata': 'Metadata',
    'launcher.archived': 'Archived',
    'launcher.removed': 'Removed {name}',
    'launcher.page_regenerated': 'Page regenerated:',
    'launcher.new_archived': '{done} newly archived',
    'launcher.total': '{total} titles in the library',
    'launcher.elapsed': 'took {elapsed}s',
    'launcher.later': 'Later',
    'launcher.select_hint': '↑↓ select · Enter confirm · Esc skip',
    'launcher.titles': 'titles',
  },
};

const STORE_KEY = 'kuraya-site-lang';
let current = 'zh-CN';
const listeners = new Set();

export function t(key, params) {
  const table = I18N[current] || I18N['zh-CN'];
  let s = table[key] !== undefined ? table[key] : (I18N['zh-CN'][key] !== undefined ? I18N['zh-CN'][key] : key);
  if (params) {
    for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, v);
  }
  return s;
}

/* 首次访问跟随浏览器语言；之后记住手动选择 */
export function initLang() {
  let stored = null;
  try {
    stored = localStorage.getItem(STORE_KEY);
  } catch {
    /* 隐私模式等场景忽略 */
  }
  if (stored && I18N[stored]) {
    current = stored;
    return;
  }
  const lang = (navigator.language || '').toLowerCase();
  if (!lang.startsWith('zh')) current = 'en';
  else current = TRADITIONAL_CODES.some((p) => lang.startsWith(p)) ? 'zh-TW' : 'zh-CN';
}

export function setLang(lang) {
  if (!I18N[lang]) return;
  current = lang;
  try {
    localStorage.setItem(STORE_KEY, lang);
  } catch {
    /* 忽略存储失败 */
  }
  applyLang();
  listeners.forEach((fn) => fn());
}

export function onLangChange(fn) {
  listeners.add(fn);
}

/* 把页面静态文案换成当前语言（data-i18n / data-i18n-html / data-i18n-placeholder / data-i18n-aria） */
export function applyLang() {
  document.documentElement.lang = current === 'en' ? 'en' : current;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
  document.title = t('meta.title');
  const setMeta = (sel, val) => {
    const el = document.querySelector(sel);
    if (el && val) el.content = val;
  };
  setMeta('meta[name="description"]', t('meta.desc'));
  setMeta('meta[property="og:title"]', t('meta.title'));
  setMeta('meta[property="og:description"]', t('og.desc'));
  setMeta('meta[name="twitter:title"]', t('meta.title'));
  setMeta('meta[name="twitter:description"]', t('og.desc'));
  setMeta('meta[property="og:locale"]', { 'zh-CN': 'zh_CN', 'zh-TW': 'zh_TW', en: 'en_US' }[current]);
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    const on = btn.dataset.lang === current;
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}
