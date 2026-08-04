// KURAYA 蔵屋 官网多语言：简中原文 / 繁中 / 英文。
// 终端与片库相关文案逐条复用主项目 kuraya/i18n_en.py、i18n_zh_tw.py、
// kuraya/web/app.js 的真实翻译，保证「与实际产品一致」。
// 语言规则与主项目一致：非 zh 浏览器 → en；繁体地区 → zh-TW；其余 → zh-CN。
// 手动选择经 localStorage 持久化（键 kuraya-site-lang）。

export const TRADITIONAL_CODES = ['zh-tw', 'zh-hk', 'zh-mo', 'zh-hant'];

export const I18N = {
  'zh-CN': {
    'meta.title': 'KURAYA 蔵屋 — 影片刮削与编目工具',
    'meta.desc': 'KURAYA 蔵屋 —— 影片刮削与编目工具：把散落的影片文件整理成带封面与元数据的有序收藏，并生成离线可读的片库页面。macOS / Windows / Linux 一行命令安装，MIT 许可。',
    'og.desc': '将散落的影片文件整理成带封面与元数据的有序收藏，生成离线可读的片库页面。本地优先，MIT 许可。',
    skip: '跳到正文',
    'nav.preview': '片库',
    'nav.cli': '命令',
    'nav.install': '安装',
    'nav.aria': '章节导航',
    'lang.aria': '切换语言',
    'hero.lead': '将散落的影片，整理成一座带封面与元数据的片库，<b>离线也能从容欣赏</b>。',
    'install.aria': '选择安装方式',
    'inst.tab.zip': '解压即用',
    copy: '复制',
    copied: '已复制',
    copy_failed: '复制失败',
    'inst.note.generic': '装好后运行 <span class="mono">Kuraya</span>，按提示选好影片库即可开始。',
    'inst.note.zip': '下载对应平台的 zip，解压后双击 <span class="mono">Kuraya</span> 即可运行，无需安装。',
    'inst.note.unsupported': '当前 <span class="mono">{platform}</span> 暂未提供官方安装包，可到 Releases 查看。',
    'sec.preview.no': '壹',
    'sec.cli.no': '貳',
    'vmark.preview': '片藏',
    'vmark.cli': '命令',
    'sec.preview.title': '本地片库',
    'sec.preview.lead': '一座片库，一个文件。本地保存，双击即开。',
    'preview.cap': '一册离线可读的影片目録，点封面即播。',
    'cover.preview': '封面预览',
    'cover.close': '关闭',
    'sec.cli.title': '命令行速览',
    'sec.cli.lead': '双击 kuraya，剩下的交给它。',
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
    'term.quit': '退出',
    'ledger.full': '完整流程：刮削 → 清理 → 重建页面。',
    'ledger.rebuild': '只重建片库页面。',
    'ledger.dryrun': '预演，不改动任何文件。',
    'ledger.quiet': '精简输出，免交互，适合计划任务。',
    'legal.declare': '本工具仅整理用户<b>已合法持有</b>的本地影片，不提供、不索引、不分发任何内容。',
    'legal.sub': '请遵守所在地区法律，使用责任自负。',
    // 片库预览区（复用 kuraya/web/app.js 键与翻译）
    'stat.movies': '部影片',
    'stat.actress': '位演员',
    'stat.studio': '个厂商',
    'search.placeholder': '搜索演员 · 番号 · 厂商',
    empty: '没有找到匹配的影片',
    clear: '清空',
    'sort.by': '排序方式',
    'sort.date_desc': '发行日期 · 新到旧',
    'sort.date_asc': '发行日期 · 旧到新',
    'sort.added_desc': '入库时间 · 新到旧',
    'chips.all': '全部',
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
    'launcher.open_page': '打开或切回 index.html 查看',
    'launcher.titles': '部',
  },

  'zh-TW': {
    'meta.title': 'KURAYA 蔵屋 — 影片刮削與編目工具',
    'meta.desc': 'KURAYA 蔵屋 —— 影片刮削與編目工具：把散落的影片檔案整理成帶封面與中繼資料的有序收藏，並生成離線可讀的片庫頁面。macOS / Windows / Linux 一行指令安裝，MIT 許可。',
    'og.desc': '將散落的影片檔案整理成帶封面與中繼資料的有序收藏，生成離線可讀的片庫頁面。本地優先，MIT 許可。',
    skip: '跳到正文',
    'nav.preview': '片庫',
    'nav.cli': '命令',
    'nav.install': '安裝',
    'nav.aria': '章節導航',
    'lang.aria': '切換語言',
    'hero.lead': '將散落的影片，整理成一座帶封面與中繼資料的片庫，<b>離線也能從容欣賞</b>。',
    'install.aria': '選擇安裝方式',
    'inst.tab.zip': '解壓即用',
    copy: '複製',
    copied: '已複製',
    copy_failed: '複製失敗',
    'inst.note.generic': '裝好後執行 <span class="mono">Kuraya</span>，按提示選好影片庫即可開始。',
    'inst.note.zip': '下載對應平台的 zip，解壓後雙擊 <span class="mono">Kuraya</span> 即可執行，無需安裝。',
    'inst.note.unsupported': '目前 <span class="mono">{platform}</span> 暫未提供官方安裝套件，可到 Releases 查看。',
    'sec.preview.no': '壹',
    'sec.cli.no': '貳',
    'vmark.preview': '片藏',
    'vmark.cli': '命令',
    'sec.preview.title': '本地片庫',
    'sec.preview.lead': '一座片庫，一個檔案。本地保存，雙擊即開。',
    'preview.cap': '一冊離線可讀的影片目錄，點封面即播。',
    'cover.preview': '封面預覽',
    'cover.close': '關閉',
    'sec.cli.title': '命令列速覽',
    'sec.cli.lead': '雙擊 kuraya，剩下的交給它。',
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
    'term.quit': '退出',
    'ledger.full': '完整流程：刮削 → 清理 → 重建頁面。',
    'ledger.rebuild': '只重建片庫頁面。',
    'ledger.dryrun': '預演，不改動任何檔案。',
    'ledger.quiet': '精簡輸出，免互動，適合排程任務。',
    'legal.declare': '本工具僅整理使用者<b>已合法持有</b>的本地影片，不提供、不索引、不分發任何內容。',
    'legal.sub': '請遵守所在地區法律，使用責任自負。',
    'stat.movies': '部影片',
    'stat.actress': '位演員',
    'stat.studio': '個廠商',
    'search.placeholder': '搜尋演員 · 番號 · 廠商',
    empty: '沒有找到相符的影片',
    clear: '清空',
    'sort.by': '排序方式',
    'sort.date_desc': '發行日期 · 新到舊',
    'sort.date_asc': '發行日期 · 舊到新',
    'sort.added_desc': '入庫時間 · 新到舊',
    'chips.all': '全部',
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
    'launcher.open_page': '開啟或切回 index.html 查看',
    'launcher.titles': '部',
  },

  en: {
    'meta.title': 'KURAYA 蔵屋 — Movie scraper & cataloger',
    'meta.desc': 'KURAYA 蔵屋 — movie scraper & cataloger: organize scattered movie files into an ordered collection with covers and metadata, and generate an offline-readable library page. One-line install on macOS / Windows / Linux. MIT licensed.',
    'og.desc': 'Turn scattered movie files into an ordered collection with covers and metadata, generating an offline-readable library page. Local-first, MIT licensed.',
    skip: 'Skip to content',
    'nav.preview': 'Library',
    'nav.cli': 'CLI',
    'nav.install': 'Install',
    'nav.aria': 'Section navigation',
    'lang.aria': 'Switch language',
    'hero.lead': 'Turn scattered movies into a library of covers and metadata — <b>enjoy it offline</b>.',
    'install.aria': 'Choose an installation method',
    'inst.tab.zip': 'Download & run',
    copy: 'Copy',
    copied: 'Copied',
    copy_failed: 'Copy failed',
    'inst.note.generic': 'Once installed, run <span class="mono">Kuraya</span> and pick your library when prompted.',
    'inst.note.zip': 'Download the zip for your platform, unzip it and double-click <span class="mono">Kuraya</span> — no installation needed.',
    'inst.note.unsupported': 'No official package for <span class="mono">{platform}</span> yet — check Releases.',
    'sec.preview.no': 'I',
    'sec.cli.no': 'II',
    'vmark.preview': 'LIBRARY',
    'vmark.cli': 'CLI',
    'sec.preview.title': 'Local library',
    'sec.preview.lead': 'One library, one file. Stored locally, opens with a double-click.',
    'preview.cap': 'An offline-readable catalog — click a cover to play.',
    'cover.preview': 'Cover preview',
    'cover.close': 'Close',
    'sec.cli.title': 'Command line at a glance',
    'sec.cli.lead': 'Double-click kuraya and let it do the rest.',
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
    'term.quit': 'Quit',
    'ledger.full': 'Full flow: scrape → clean → rebuild.',
    'ledger.rebuild': 'Rebuild the library page only.',
    'ledger.dryrun': 'Preview only — modifies nothing.',
    'ledger.quiet': 'Minimal output, no prompts — for scheduled tasks.',
    'legal.declare': 'This tool only organizes movies you <b>legally own</b>. It does not provide, index, or distribute any content.',
    'legal.sub': 'Please comply with local laws; use at your own risk.',
    'stat.movies': 'movies',
    'stat.actress': 'actresses',
    'stat.studio': 'studios',
    'search.placeholder': 'Search actors · numbers · studios',
    empty: 'No matching movies',
    clear: 'Clear',
    'sort.by': 'Sort by',
    'sort.date_desc': 'Release date · new to old',
    'sort.date_asc': 'Release date · old to new',
    'sort.added_desc': 'Added date · new to old',
    'chips.all': 'All',
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
    'launcher.open_page': 'Open or switch back to index.html',
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
