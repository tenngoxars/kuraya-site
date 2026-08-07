// KURAYA 蔵屋 首页交互：多语言、复制命令、安装 tab、展卷淡入
import { initLang, applyLang, setLang, onLangChange, t } from './i18n.js';

/* 减少动态偏好：模块级常量，供片库重排与活终端复用 */
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 大图打开时，页面级快捷键（如 / 聚焦搜索）让位给对话框 */
let lbOpen = false;

/* 封面就位后淡入：占位是 CSS 里的 --lqip 模糊底图，避免图片「啪」地跳出来。
   放在最前：起始态 opacity:0 由 .js 触发，这里若被后面任何异常挡住，封面就永远隐形。
   error 也标 loaded，否则加载失败的图同样停在 opacity:0 */
document.querySelectorAll('.lib-cover img').forEach((img) => {
  const done = () => img.classList.add('loaded');
  if (img.complete && img.naturalWidth) done();
  else {
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  }
});

/* 多语言：跟随系统首次选择，手动切换持久化；静态文案经 data-i18n 应用 */
initLang();
applyLang();
document.querySelectorAll('[data-lang]').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

/* 复制区域：反馈「已复制」，1600ms 后复原 */
const live = document.getElementById('copy-live');

document.querySelectorAll('.copy').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panel = document.getElementById(btn.dataset.target);
    const code = panel ? panel.querySelector('pre').innerText : '';
    navigator.clipboard.writeText(code)
      .then(() => {
        btn.textContent = t('copied');
        btn.classList.add('done');
        if (live) live.textContent = t('copied');
        clearTimeout(btn._timer);
        btn._timer = setTimeout(() => {
          btn.textContent = t('copy');
          btn.classList.remove('done');
        }, 1600);
      })
      .catch(() => {
        btn.textContent = t('copy_failed');
        setTimeout(() => {
          btn.textContent = t('copy');
        }, 1600);
      });
  });
});

/* 解压即用：三个平台按钮直接下载 zip（发行物命名见主仓库 release.sh/release.bat）。
   Chromium 用 userAgentData 高熵值取真实架构；Safari/Firefox 兜底 UA（架构取默认）。
   按钮默认中性色，hover/focus 显示金色；检测仅用于识别不支持的架构并提示。
   面板下方提示文案由检测结果决定，随 tab 切换应用（见 applyNote）。 */
const OS_ARCH = { mac: 'mac-arm64', win: 'win-x64', linux: 'linux-x86_64' };
const zipBtns = [...document.querySelectorAll('.zip-btn')];
const instNote = document.getElementById('inst-note');
let zipNoteKey = null;   // 解压即用提示键（检测完成后才有值，存键而非翻译快照）
let zipNoteParams = null;

const applyNote = () => {
  if (!instNote) return;
  const active = document.querySelector('.inst-tab[aria-selected="true"]');
  instNote.innerHTML =
    active && active.id === 'tab-zip' && zipNoteKey
      ? t(zipNoteKey, zipNoteParams)
      : t('inst.note.generic');
};

/* 语言切换后刷新提示文案 */
onLangChange(() => applyNote());

if (zipBtns.length) {
  const detect = async () => {
    const ua = navigator.userAgent;
    let platform = '';
    let arch = '';
    if (navigator.userAgentData) {
      platform = navigator.userAgentData.platform || '';
      try {
        const h = await navigator.userAgentData.getHighEntropyValues(['architecture']);
        arch = (h.architecture || '').toLowerCase();
      } catch {
        /* 拿不到高熵值走 UA 兜底 */
      }
    }
    if (/Mac|iPhone|iPad/.test(ua)) {
      platform = platform || 'macOS';
      arch = arch || 'arm64';
    } else if (/Win/.test(ua)) {
      platform = platform || 'Windows';
      arch = arch || 'x64';
    } else {
      platform = platform || 'Linux';
      arch = arch || 'x86_64';
    }
    return { platform, arch };
  };
  detect().then(({ platform, arch }) => {
    const osArch =
      platform === 'macOS' ? (arch === 'arm64' || arch === 'arm' ? 'mac-arm64' : null)
      : platform === 'Windows' ? 'win-x64'
      : arch === 'x86_64' || arch === 'x86' ? 'linux-x86_64'
      : null;
    if (osArch) {
      zipBtns.forEach((b) => {
        b.href = `https://github.com/tenngoxars/Kuraya/releases/download/v${__KURAYA_VERSION__}/Kuraya-${__KURAYA_VERSION__}-${OS_ARCH[b.dataset.os]}.zip`;
      });
      zipNoteKey = 'inst.note.zip';
    } else {
      zipNoteKey = 'inst.note.unsupported';
      zipNoteParams = { platform };
    }
    applyNote();
  });
}

/* 手引 tab：roving tabindex + 左右键切换 + 发丝指示线滑动 */
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const list = document.getElementById('inst-tabs');

if (tabs.length && list) {
  const moveIndicator = (i) => {
    const btn = tabs[i];
    const lr = list.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    list.style.setProperty('--tx', `${br.left - lr.left + list.scrollLeft}px`);
    list.style.setProperty('--tw', `${br.width}px`);
  };

  const activate = (i, focus) => {
    tabs.forEach((t, j) => {
      const on = j === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, j) => p.classList.toggle('active', j === i));
    moveIndicator(i);
    applyNote();
    if (focus) tabs[i].focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(i, false));
    tab.addEventListener('keydown', (e) => {
      let n;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      if (n !== undefined) {
        e.preventDefault();
        activate(n, true);
      }
    });
  });

  window.addEventListener('resize', () => {
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    if (i >= 0) moveIndicator(i);
  });

  moveIndicator(0);
}

/* 展卷支撑态：区块进入视口时淡入（IO 不可用时全部可见） */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade').forEach((el) => io.observe(el));
}

/* 片库演示区：三维筛选（演员/厂商/导演）+ 排序下拉 + pills（交互与真实片库 kuraya/web 一致）。
   维度计数、搜索归一化、chips 宽度自适应与 pills 逻辑移植自真实版 app.js + filters.js */
const chipBar = document.getElementById('lib-chips');
const libCards = [...document.querySelectorAll('.lib-card')];
const libCount = document.querySelector('.lib-count');
const libGrid = document.querySelector('.lib-grid');
const pillsEl = document.getElementById('lib-pills');

if (chipBar && libCards.length && libCount && libGrid && pillsEl) {
  const searchInput = document.getElementById('search');
  const clearBtn = document.getElementById('clear-btn');
  const emptyEl = document.createElement('div');
  emptyEl.className = 'lib-empty';

  /* 演示数据收集：卡片 DOM 是唯一数据源（排序搬节点、换片查 DOM，见 lightbox） */
  const DATA = libCards.map((card) => ({
    card,
    code: card.querySelector('.lib-code').innerText,
    actors: card.querySelector('.lib-actors').innerText.split('、').map((s) => s.trim()).filter(Boolean),
    studio: card.querySelector('.lib-sub .studio').innerText || '',
    director: (card.querySelector('.lib-sub .director') || { innerText: '' }).innerText || '',
    date: card.dataset.date || '',
    added: card.dataset.added || '',
  }));

  /* 三个筛选维度统一计算计数后再过滤：没有任何值的维度不出现，
     避免「导演 0」这种点开也是空的按钮（与真实版一致） */
  const ALL_DIMS = [
    { key: 'actor', labelKey: 'dim.actor', of: (it) => it.actors },
    { key: 'studio', labelKey: 'dim.studio', of: (it) => (it.studio ? [it.studio] : []) },
    { key: 'director', labelKey: 'dim.director', of: (it) => (it.director ? [it.director] : []) },
  ];
  for (const dim of ALL_DIMS) {
    const counts = new Map();
    DATA.forEach((it) => dim.of(it).forEach((v) => counts.set(v, (counts.get(v) || 0) + 1)));
    dim.values = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ja'));
  }
  const DIMS = ALL_DIMS.filter((d) => d.values.length > 0);

  let activeDim = 'actor';
  const active = { actor: null, studio: null, director: null };
  let sortKey = 'date_desc';

  /* 搜索分隔符归一化（与真实版同一套规则）：ABC-001 ≡ abc001；
     空 sq（纯分隔符查询）必须跳过归一化分支，否则 includes("") 恒真 */
  const SEPARATORS = /[\s\-_.·・]/g;
  const squash = (s) => s.replace(SEPARATORS, '');
  DATA.forEach((it) => {
    it._fields = [it.code, it.actors.join('、'), it.studio, it.director].map((f) => f.toLowerCase());
    it._squashed = it._fields.map(squash);
  });

  const sortData = (list) => {
    const arr = [...list];
    if (sortKey === 'date_asc') arr.sort((a, b) => a.date.localeCompare(b.date));
    else if (sortKey === 'added_desc') arr.sort((a, b) => b.added.localeCompare(a.added));
    else arr.sort((a, b) => b.date.localeCompare(a.date));
    return arr;
  };

  const visibleList = () => {
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let list = DATA;
    for (const dim of DIMS) {
      const v = active[dim.key];
      if (v) list = list.filter((it) => dim.of(it).includes(v));
    }
    if (q) {
      const qs = squash(q);
      list = list.filter((it) =>
        it._fields.some((f) => f.includes(q)) ||
        (qs && it._squashed.some((f) => f.includes(qs))));
    }
    return sortData(list);
  };

  const dirty = () =>
    !!searchInput?.value.trim() || DIMS.some((d) => active[d.key]) || sortKey !== 'date_desc';

  /* 重播入场动画：先清零再强制 reflow，按可见顺序错峰 */
  const replayRise = (card, i) => {
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = `rise .55s cubic-bezier(.16,1,.3,1) ${i * 22}ms forwards`;
  };

  const renderGrid = () => {
    const visible = visibleList();
    const visibleSet = new Set(visible.map((it) => it.card));
    libCards.forEach((card) => card.classList.toggle('hidden', !visibleSet.has(card)));
    visible.forEach((it) => libGrid.appendChild(it.card)); // 按序移动节点
    /* 空态：无匹配时显示提示行 */
    if (visible.length) emptyEl.remove();
    else {
      emptyEl.textContent = t('empty');
      libGrid.appendChild(emptyEl);
    }
    if (REDUCE_MOTION) {
      visible.forEach((it) => { it.card.style.animation = 'none'; });
    } else {
      visible.forEach((it, i) => replayRise(it.card, i));
    }
    /* 计数只在有筛选/搜索/排序变化时显示（与真实版一致，干净状态不打扰） */
    libCount.textContent = dirty() ? `${visible.length} / ${DATA.length}` : '';
    updateClearBtn();
  };

  /* 筛选行：维度切换 + 宽度自适应 chips + 更多面板（移植自真实版 filters.js buildChips） */
  const MORE_RESERVE = 118;

  const closeMore = () => {
    chipBar.querySelectorAll('.lib-more-wrap.open').forEach((w) => w.classList.remove('open'));
  };

  const moreEl = (dim, rest) => {
    const wrap = document.createElement('div');
    wrap.className = 'lib-more-wrap';
    wrap.innerHTML = `
      <button class="lib-chip more" type="button">${t('more', { n: rest.length })} ▾</button>
      <div class="lib-more-panel">
        <input class="lib-more-search" type="text" placeholder="${t('searchIn', { dim: t(dim.labelKey) })}">
        <div class="lib-more-list"></div>
      </div>`;
    const btn = wrap.querySelector('.more');
    const box = wrap.querySelector('.lib-more-search');
    const list = wrap.querySelector('.lib-more-list');

    const fill = () => {
      const q = box.value.trim().toLowerCase();
      // 与主搜索同一套规则：分隔符归一化后匹配；空 sq 必须跳过归一化分支
      const qs = squash(q);
      const base = q ? dim.values : rest;
      const hits = base.filter(([n]) =>
        n.toLowerCase().includes(q) || (qs && squash(n.toLowerCase()).includes(qs)));
      list.innerHTML = '';
      if (!hits.length) {
        list.innerHTML = `<div class="lib-more-empty">${t('noMatch', { dim: t(dim.labelKey) })}</div>`;
        return;
      }
      for (const [name, n] of hits) {
        const o = document.createElement('button');
        o.className = 'lib-more-opt';
        o.innerHTML = `<span>${name}</span><span class="n">${n}</span>`;
        o.onclick = () => { setFilter(dim.key, name); closeMore(); };
        list.appendChild(o);
      }
    };

    btn.onclick = (e) => {
      e.stopPropagation();
      const open = wrap.classList.toggle('open');
      if (!open) return;
      box.value = '';
      fill();
      void wrap.offsetHeight;
      box.focus();
    };
    box.oninput = fill;
    box.onkeydown = (e) => {
      if (e.key === 'Escape') { closeMore(); btn.focus(); }
    };
    wrap.onclick = (e) => e.stopPropagation();
    return wrap;
  };

  const buildChips = () => {
    // 预留给「更多 N ▾」按钮的宽度余量，chips 溢出即收进面板
    if (!DIMS.length) { chipBar.innerHTML = ''; return; }
    const dim = DIMS.find((d) => d.key === activeDim);
    chipBar.innerHTML = '';

    const dims = document.createElement('div');
    dims.className = 'lib-dims';
    for (const d of DIMS) {
      const b = document.createElement('button');
      b.className = 'lib-dim' + (d.key === activeDim ? ' on' : '');
      b.textContent = t(d.labelKey);
      const c = document.createElement('span');
      c.className = 'c';
      c.textContent = d.values.length;
      b.appendChild(c);
      b.onclick = () => { activeDim = d.key; buildChips(); };
      dims.appendChild(b);
    }
    chipBar.appendChild(dims);
    const rule = document.createElement('span');
    rule.className = 'lib-dim-rule';
    chipBar.appendChild(rule);

    const cur = active[dim.key];
    const all = document.createElement('button');
    all.className = 'lib-chip' + (cur === null ? ' on' : '');
    all.textContent = t('chips.all');
    all.onclick = () => setFilter(dim.key, null);
    chipBar.appendChild(all);

    const chip = ([name, n]) => {
      const b = document.createElement('button');
      b.className = 'lib-chip' + (cur === name ? ' on' : '');
      b.textContent = name;
      const c = document.createElement('span');
      c.className = 'n';
      c.textContent = n;
      b.appendChild(c);
      b.onclick = () => setFilter(dim.key, name);
      return b;
    };

    const padRight = parseFloat(getComputedStyle(chipBar).paddingRight);
    const hardEdge = chipBar.getBoundingClientRect().right - padRight;
    const softEdge = hardEdge - MORE_RESERVE;

    let shown = 0;
    for (const [i, entry] of dim.values.entries()) {
      const b = chip(entry);
      chipBar.appendChild(b);
      const edge = i === dim.values.length - 1 ? hardEdge : softEdge;
      if (b.getBoundingClientRect().right > edge) { b.remove(); break; }
      shown++;
    }
    const rest = dim.values.slice(shown);
    if (rest.length) chipBar.appendChild(moreEl(dim, rest));
  };

  /* 已激活筛选 pills + 总清空（有筛选才显示，与真实版 filters.js buildPills 一致） */
  const buildPills = () => {
    pillsEl.innerHTML = '';
    for (const dim of DIMS) {
      const v = active[dim.key];
      if (!v) continue;
      const b = document.createElement('button');
      b.className = 'lib-pill';
      b.innerHTML = `<span class="k">${t(dim.labelKey)}</span>${v}<span class="x">×</span>`;
      b.onclick = () => setFilter(dim.key, null);
      pillsEl.appendChild(b);
    }
    if (dirty()) {
      const r = document.createElement('button');
      r.className = 'lib-reset';
      r.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>${t('clear')}`;
      r.onclick = resetAll;
      pillsEl.appendChild(r);
    }
  };

  const setFilter = (key, value) => {
    active[key] = active[key] === value ? null : value;
    buildChips();
    buildPills();
    renderGrid();
    /* 真实版筛选后滚回页顶（整页就是片库）；官网片库区在页面中部，
       滚动会打断浏览，保持当前位置不动 */
  };

  /* 排序下拉：自定义面板（原生 select 的弹出列表无法定制，与真实版一致） */
  const sortWrap = document.getElementById('sort-wrap');
  const sortBtn = document.getElementById('sort-btn');
  const sortLabel = document.getElementById('sort-label');
  const sortOpts = [...document.querySelectorAll('#sort-menu .select-opt')];

  const closeSort = () => {
    sortWrap.classList.remove('open');
    sortBtn.setAttribute('aria-expanded', 'false');
  };
  const openSort = () => {
    sortWrap.classList.add('open');
    sortBtn.setAttribute('aria-expanded', 'true');
    (sortOpts.find((o) => o.dataset.value === sortKey) || sortOpts[0]).focus();
  };
  const setSort = (key) => {
    sortKey = key;
    sortLabel.textContent = t(`sort.${key}`);
    sortOpts.forEach((o) => o.setAttribute('aria-selected', String(o.dataset.value === key)));
    closeSort();
    buildPills();
    renderGrid();
  };

  sortBtn.addEventListener('click', () => {
    sortWrap.classList.contains('open') ? closeSort() : openSort();
  });
  sortBtn.addEventListener('keydown', (e) => {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      openSort();
    }
  });
  sortOpts.forEach((opt, i) => {
    opt.addEventListener('click', () => setSort(opt.dataset.value));
    opt.addEventListener('keydown', (e) => {
      const next = (i + sortOpts.length + (e.key === 'ArrowUp' ? -1 : 1)) % sortOpts.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        sortOpts[next].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSort(opt.dataset.value);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeSort();
        sortBtn.focus();
      }
    });
  });
  document.addEventListener('click', (e) => {
    if (!sortWrap.contains(e.target)) closeSort();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sortWrap.classList.contains('open')) {
      closeSort();
      sortBtn.focus();
    }
  });

  /* 搜索：输入过滤 + 清空按钮 + 快捷键（清空语义对齐真实版 resetAll） */
  const updateClearBtn = () => {
    if (clearBtn) clearBtn.classList.toggle('show', !!searchInput && searchInput.value.length > 0);
  };

  const resetAll = () => {
    searchInput.value = '';
    DIMS.forEach((d) => { active[d.key] = null; });
    sortKey = 'date_desc';
    sortLabel.textContent = t('sort.date_desc');
    sortOpts.forEach((o) => o.setAttribute('aria-selected', String(o.dataset.value === sortKey)));
    updateClearBtn();
    buildChips();
    buildPills();
    renderGrid();
    searchInput.focus();
  };

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      updateClearBtn();
      renderGrid();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', resetAll);
  }
  document.addEventListener('keydown', (e) => {
    if (!searchInput || lbOpen) return;
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      searchInput.blur();
      updateClearBtn();
      renderGrid();
    }
  });

  /* 卡片内元数据（演员/厂商/导演）可点击筛选；stopPropagation 挡住开 lightbox 的网格监听 */
  libGrid.addEventListener('click', (e) => {
    const link = e.target.closest('.lib-meta-link');
    if (link) {
      e.preventDefault();
      e.stopPropagation();
      setFilter(link.dataset.dim, link.dataset.val);
    }
  });

  /* 语言切换：排序标签、空态、筛选行与 pills 一并按新语言重建 */
  onLangChange(() => {
    if (sortLabel) sortLabel.textContent = t(`sort.${sortKey}`);
    if (emptyEl.parentNode) emptyEl.textContent = t('empty');
    buildChips();
    buildPills();
  });

  buildChips();
  buildPills();
  renderGrid(); // 初始按「发行日期 · 新到旧」渲染，与 label 一致
}

/* 封面大图预览：演示区无影片文件，点击卡片展示封面大图（替代「点封面即播」）。
   方向键 / 左右按钮 / 横向滑动换片，Esc / 遮罩 / 下滑关闭；
   打开时背景三块设 inert（同时也是焦点陷阱），另留 Tab 兜底给不支持 inert 的浏览器 */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbClose = document.getElementById('lightbox-close');
const lbPrev = document.getElementById('lightbox-prev');
const lbNext = document.getElementById('lightbox-next');
const lbCount = document.getElementById('lightbox-count');

if (lightbox && lbImg && lbClose && lbPrev && lbNext && libGrid) {
  const BG = [...document.querySelectorAll('body > header, body > main, body > footer')];
  let lastFocused = null;
  let index = -1;

  /* 换片顺序＝屏幕上的先后。必须查 DOM：排序是把节点搬位置，
     模块级的 libCards 永远是初始顺序，用它算出的序号和眼前看到的对不上 */
  const visibleCards = () => [...libGrid.querySelectorAll('.lib-card:not(.hidden)')];

  const show = (cards, i) => {
    const card = cards[i];
    const img = card.querySelector('.lib-cover img');
    const code = card.querySelector('.lib-code');
    index = i;
    /* 先挂已缓存的响应式小图（瞬时可见），再异步换成原图，点开时不用干等一次网络 */
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = code ? code.textContent : '';
    const full = img.src;
    if (full !== lbImg.src) {
      const hi = new Image();
      const swap = () => {
        if (index === i) lbImg.src = full;
      };
      hi.src = full;
      hi.decode().then(swap).catch(() => {});
    }
    if (lbCount) lbCount.textContent = `${i + 1} / ${cards.length}`;
    lbPrev.hidden = lbNext.hidden = cards.length < 2;
  };

  const step = (d) => {
    const cards = visibleCards();
    if (cards.length < 2 || index < 0) return;
    show(cards, (index + d + cards.length) % cards.length);
  };

  const openLb = (card) => {
    const cards = visibleCards();
    const i = cards.indexOf(card);
    if (i < 0) return;
    lastFocused = card;
    lbOpen = true;
    lightbox.hidden = false;
    show(cards, i);
    BG.forEach((el) => el.setAttribute('inert', ''));
    document.body.style.overflow = 'hidden'; // 锁背景滚动
    requestAnimationFrame(() => lightbox.classList.add('open')); // 下一帧再加，过渡才有起点
    lbClose.focus();
  };

  const closeLb = () => {
    lbOpen = false;
    lightbox.classList.remove('open');
    BG.forEach((el) => el.removeAttribute('inert'));
    document.body.style.overflow = '';
    const done = () => {
      lightbox.hidden = true;
      lbImg.removeAttribute('src'); // 不写 src=''：那会被解析成页面地址再发一次请求
      index = -1;
    };
    if (REDUCE_MOTION) done();
    else setTimeout(done, 280); // 与 .lightbox 的 opacity 过渡时长一致
    if (lastFocused) lastFocused.focus();
  };

  libGrid.addEventListener('click', (e) => {
    /* meta-link（演员/厂商/导演）由筛选委托处理，不能在这里触发大图；
       stopPropagation 只挡冒泡，同一元素上后注册的监听器仍会执行，必须显式排除 */
    if (e.target.closest('.lib-meta-link')) return;
    const card = e.target.closest('.lib-card');
    if (card) openLb(card);
  });
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', (e) => {
    if (!lbOpen) return; // 淡出的那 280ms 里 hidden 还是 false，用 lbOpen 才准
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLb();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
  });

  /* 触摸：横滑换片，下滑关闭 */
  let sx = 0;
  let sy = 0;
  let swiping = false;
  lightbox.addEventListener('touchstart', (e) => {
    swiping = e.touches.length === 1;
    if (!swiping) return;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (!swiping) return;
    swiping = false;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    else if (dy > 70 && Math.abs(dy) > Math.abs(dx)) closeLb();
  }, { passive: true });
}

/* 活终端：进入视口自动循环播放刮削实况（无 JS / 减少动态时保持静态菜单） */
const term = document.querySelector('.term');
if (term && 'IntersectionObserver' in window) {
  const termStatic = term.innerHTML;

  if (!REDUCE_MOTION) {
    /* 可唤醒的 sleep：语言切换时把当前这一觉叫醒，循环立刻走到 alive() 判定并换语言重开，
       否则最长要等 3.6s 才反应过来 */
    let wake = null;
    const sleep = (ms) =>
      new Promise((r) => {
        const done = () => {
          wake = null;
          r();
        };
        const id = setTimeout(done, ms);
        wake = () => {
          clearTimeout(id);
          done();
        };
      });
    let inView = false;
    let running = false;

    /* 刮削实况：按真实产品 launcher.py 的 cmd_all 输出重演——
       brand → ①刮削影片（▸ 番号 + spinner 阶段 + 封面/裁剪/元数据/入库树状行）
       → ②清理源目录（移除原文件名）→ ③重建片库页面 → 结尾统计卡片。
       排版全部交给 CSS：HTML 的空白折叠会把 " ".repeat(n) 压成一个空格，
       字符补位的列对齐根本不成立；固定 60 字符的分隔线在窄屏也必然溢出。
       缩进用 .in1/.in2，列宽用 .c/.c-menu，右对齐用 .r，分隔线与结尾卡片用边框画。 */
    const MOVIES = [
      {
        number: 'SEIS-0314', index: 1, raw: '花菱雫.SEIS-0314.1080p.XXX.mkv',
        actor: '花菱雫', studio: '星霜舍', release: '2026-03-14', elapsed: '3.2s',
      },
      {
        number: 'SHID-0108', index: 2, raw: '月見桜_SHID-0108_最终修正版.mkv',
        actor: '月見桜', studio: '紫電堂', release: '2026-01-08', elapsed: '2.8s',
      },
    ];
    const FOUND = MOVIES.length; // 待整理文件数
    const TOTAL = 6;             // 库内总数，与片库演示一致

    const cursorEl = document.createElement('span');
    cursorEl.className = 'term-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');

    /* 终端高度是定死的（见 .term 的 --term-lines），输出靠内部滚动跟随，
       页面不会被越写越长。用户自己往回滚时不抢走滚动位置 */
    const atBottom = () => term.scrollHeight - term.scrollTop - term.clientHeight < 40;
    /* 必须瞬时到位：.term 开着 scroll-behavior:smooth，直接设 scrollTop 会触发平滑动画，
       滚动还没追上来时下一个 atBottom() 已经判成「用户滚上去了」，后续行全部停止跟随，
       动画结尾（统计卡片/选择器）就落在视口外。手动滚动仍保留 smooth */
    const follow = () => {
      term.style.scrollBehavior = 'auto';
      term.scrollTop = term.scrollHeight;
      term.style.scrollBehavior = '';
    };

    /* 当前 spinner 行。下一条输出「就地覆盖」它而不是删掉再新增——
       删增会让容器高度一减一增，画面每个阶段都上下弹一次 */
    let spinLine = null;

    /* runId 是「代」：语言切换时 +1，在跑的那一轮下次醒来就自行退出，
       不会出现两个循环同时往一个终端里写。activeId 是当前有权写终端的那一代——
       循环级的 alive() 只在几个检查点判定，两点之间还有十几行输出，不在写入口
       再拦一道的话，语言切换后旧循环会继续用旧语言往下写，屏幕上两种语言混在一起 */
    let runId = 0;
    let activeId = 0;
    const stale = () => activeId !== runId;

    const put = (html, cls) => {
      if (stale()) return document.createElement('p'); // 游离节点：调用方照常能用，但不进文档
      const p = spinLine || document.createElement('p');
      const fresh = !spinLine;
      spinLine = null;
      p.className = cls;
      p.innerHTML = html;
      if (fresh) term.appendChild(p);
      p.appendChild(cursorEl);
      return p;
    };

    /* 一行输出：cls 落在 <p> 上（缩进/分隔线），html 是行内内容。
       被接管后立即兑现（不再等 pause），旧循环几个微任务内就能跑到检查点退场 */
    const line = (html, pause = 200, cls = '') => {
      if (stale()) return Promise.resolve();
      const stick = atBottom();
      put(html, cls);
      if (stick) follow();
      return sleep(pause);
    };
    const rule = (pause = 160) => line('', pause, 'rule');
    const blank = (pause = 200) => line('', pause);

    /* spinner 状态行：产品里由正式输出原地改写（\r），这里同样复用同一个 <p>。
       连着两个 spinner 时也复用，所以容器高度只增不减 */
    const spinner = (text, ms) => {
      if (stale()) return Promise.resolve();
      const stick = atBottom();
      spinLine = put(`<span class="dim">${text}</span>`, 'term-spin in2');
      if (stick) follow();
      return sleep(ms);
    };

    /* 树状分步行：connector(├/└) + 标签列 + 正文 [+ 右对齐耗时] */
    const branch = (c, label, detail, right = '', pause = 240) =>
      line(
        `<span class="dim">${c}</span><span class="dim c">${label}</span>${detail}` +
          (right ? `<span class="dim r">${right}</span>` : ''),
        pause,
        'in2'
      );

    /* 单部影片：▸ 番号 → spinner 阶段 → 封面/裁剪/元数据/入库 */
    const playMovie = async (m) => {
      await line(`<span class="t1">▸</span><b>${m.number}</b><span class="dim r">[${m.index}/${FOUND}]</span>`, 320, 'in1');
      await spinner(t('launcher.fetching', { number: m.number }), 950);
      await branch('├', t('launcher.cover'), `<span class="dim">${t('launcher.downloaded')}</span>`);
      await spinner(t('launcher.probe_cover'), 700);
      await branch('├', t('launcher.crop'), `<span class="dim">${t('launcher.poster')}</span>`);
      await spinner(t('launcher.crop_poster'), 700);
      await spinner(t('launcher.write_meta'), 700);
      await branch('├', t('launcher.metadata'), `<span>${m.actor} · ${m.studio} · ${m.release}</span>`);
      await branch('└', t('launcher.archived'), `<span>${m.actor}\\${m.number}</span>`, m.elapsed);
    };

    const play = async () => {
      if (running) return;
      running = true;
      const id = ++runId;
      activeId = id;
      const alive = () => inView && id === runId;
      while (alive()) {
        term.innerHTML = '';
        term.scrollTop = 0;
        spinLine = null; // innerHTML 清空后旧引用已脱离文档，不能再复用
        /* $ kuraya 逐字打出，光标跟随。命令单独包一个 span：
           行是 flex，裸文本节点会并成匿名项，行首空格被折叠掉，$ 与命令就贴上了 */
        const prompt = put('<span class="num">$</span><span class="cmd"></span>', '');
        const cmd = prompt.querySelector('.cmd');
        for (const ch of 'kuraya') {
          if (!alive()) break;
          cmd.append(ch);
          await sleep(120);
        }
        if (!alive()) break;
        await sleep(320);

        /* ① 品牌头 + 刮削影片 */
        await line('<span class="t1">◈</span><b class="t2">K U R A Y A</b><span class="kanji">蔵屋</span>' +
          `<span class="dim r">v${__KURAYA_VERSION__}</span>`, 380);
        await rule(150);
        await blank(180);
        await line(`<span class="blue">①</span><b>${t('launcher.scrape_movies')}</b>`, 320);
        await rule(180);
        await blank(200);
        for (const m of MOVIES) {
          if (!alive()) break;
          await playMovie(m);
          await blank(200);
        }
        if (!alive()) break;

        /* ② 清理源目录 */
        await line(`<span class="blue">②</span><b>${t('launcher.clean_source')}</b>`, 320);
        await rule(180);
        for (const m of MOVIES) {
          await line(`<span class="dim">${t('launcher.removed', { name: m.raw })}</span>`, 260, 'in1');
        }
        await blank(200);

        /* ③ 重建片库页面 */
        await line(`<span class="blue">③</span><b>${t('launcher.rebuild_page')}</b>`, 320);
        await rule(180);
        await line(
          `<span class="ok">✓</span><span><span class="dim">${t('launcher.page_regenerated')}</span> <b>${TOTAL}</b> <span class="dim">${t('launcher.titles')}</span></span>`,
          320,
          'in1'
        );
        await blank(200);

        /* 结尾统计卡片：真实产品 box() 用 ╭─╮ 画框，这里用真边框，窄屏不会被字符宽度撑破 */
        const summary = `${t('launcher.new_archived', { done: FOUND })} · ${t('launcher.total', { total: TOTAL })} · ${t('launcher.elapsed', { elapsed: 18 })}`;
        if (!stale()) {
          const stick = atBottom();
          const box = document.createElement('div');
          box.className = 'term-box';
          box.innerHTML = `<p>${summary}</p>`;
          term.appendChild(box);
          if (stick) follow();
        }
        await line('', 0); // 光标落到卡片之后

        /* 刮削完成后选择是否直接打开片库（对应产品 launcher.py 的 offer_open_library 选择器，
           默认选中第一项，动画里静态展示两行选项 + 提示行，不真正交互）。
           缩进类 in1 落在 <p> 上（与 branch 一致），子元素平铺成 flex item，
           定宽列 .opt 才对 desc 生效——包进行内 span 里 min-width 会失效 */
        await line(
          `<span class="sel">▸</span><span class="opt">${t('term.open')}</span><span class="dim">${t('term.open_desc')}</span>`,
          260,
          'in1'
        );
        await line(
          `<span class="dim">·</span><span class="opt">${t('launcher.later')}</span>`,
          200,
          'in1'
        );
        await line(`<span class="dim">${t('launcher.select_hint')}</span>`, 300, 'in1');
        if (!alive()) break;
        await sleep(3800);
      }
      running = false;
      /* 循环是在某个 await 里读到 inView=false（或被新一代接管）才退出的，这期间它可能
         又转回可见——那次 IO 回调被 running 挡掉了，不在这里重启就会永远停在半截输出上 */
      if (inView) {
        play();
        return;
      }
      term.innerHTML = termStatic;
      term.scrollTop = 0;
      applyLang(); /* 静态菜单按当前语言渲染 */
    };

    /* 语言切换：只换代号并叫醒当前这一觉，剩下的交给在跑的那轮自己收尾——
       它退出时会按新语言重开（可见）或还原静态菜单（不可见）。
       这里绝不能直接改 term.innerHTML：旧循环还在往里写，两边会打架，
       而且它手上的 spinLine 会指向已脱离文档的节点，之后的输出全丢 */
    onLangChange(() => {
      runId += 1;
      if (running) {
        if (wake) wake();
        return;
      }
      term.innerHTML = termStatic;
      term.scrollTop = 0;
      applyLang();
      if (inView) play();
    });

    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          inView = e.isIntersecting;
          if (inView) play();
        });
      },
      { threshold: 0.4 }
    ).observe(term);
  }
}
