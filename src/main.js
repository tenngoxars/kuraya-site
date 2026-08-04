// KURAYA 蔵屋 首页交互：多语言、复制命令、安装 tab、展卷淡入
import { initLang, applyLang, setLang, onLangChange, t } from './i18n.js';

/* 减少动态偏好：模块级常量，供片库重排与活终端复用 */
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 多语言：跟随系统首次选择，手动切换持久化；静态文案经 data-i18n 应用 */
initLang();
applyLang();
document.querySelectorAll('[data-lang]').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

/* 复制区域：反馈「已复制」，1600ms 后复原 */
const live = document.getElementById('copy-live');
const announce = (text) => {
  if (live) live.textContent = text;
};

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      /* 旧浏览器兜底失败按未复制处理 */
    }
    document.body.removeChild(ta);
    ok ? resolve() : reject(new Error('copy failed'));
  });
}

document.querySelectorAll('.copy').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panel = document.getElementById(btn.dataset.target);
    const code = panel ? panel.querySelector('pre').innerText : '';
    copyText(code)
      .then(() => {
        btn.textContent = t('copied');
        btn.classList.add('done');
        announce(t('copied'));
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
const GENERIC_NOTE = () => t('inst.note.generic');
let zipNoteKey = null;   // 解压即用提示键（检测完成后才有值，存键而非翻译快照）
let zipNoteParams = null;

const applyNote = () => {
  if (!instNote) return;
  const active = document.querySelector('.inst-tab[aria-selected="true"]');
  instNote.innerHTML =
    active && active.id === 'tab-zip' && zipNoteKey
      ? t(zipNoteKey, zipNoteParams)
      : GENERIC_NOTE();
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

/* 片库演示区：演员筛选 + 排序下拉（交互与真实片库 kuraya/web 一致） */
const chipBar = document.querySelector('.lib-chips');
const libCards = [...document.querySelectorAll('.lib-card')];
const libCount = document.querySelector('.lib-count');
const libGrid = document.querySelector('.lib-grid');

if (chipBar && libCards.length && libCount && libGrid) {
  const total = parseInt(libCount.textContent.split('/')[1], 10) || libCards.length;
  const searchInput = document.getElementById('search');
  const clearBtn = document.getElementById('clear-btn');
  const emptyEl = document.createElement('div');
  emptyEl.className = 'lib-empty';
  let activeActor = '全部';
  let sortKey = 'date_desc';

  /* 语言切换后同步排序标签与空态文案 */
  onLangChange(() => {
    if (sortLabel) sortLabel.textContent = t(`sort.${sortKey}`);
    if (emptyEl.parentNode) emptyEl.textContent = t('empty');
  });

  /* 重播入场动画：先清零再强制 reflow，按可见顺序错峰 */
  const replayRise = (card, i) => {
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = `rise .55s cubic-bezier(.16,1,.3,1) ${i * 22}ms forwards`;
  };

  /* 搜索词匹配：演员 / 番号 / 厂商（与真实片库 app.js render() 一致） */
  const matchQuery = (card, q) => {
    if (!q) return true;
    const actor = card.querySelector('.lib-actors').innerText.toLowerCase();
    const code = card.querySelector('.lib-code').innerText.toLowerCase();
    const studio = card.querySelector('.lib-sub .studio').innerText.toLowerCase();
    return actor.includes(q) || code.includes(q) || studio.includes(q);
  };

  const renderGrid = () => {
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const visible = libCards.filter((card) => {
      const actor = card.querySelector('.lib-actors').innerText;
      return (activeActor === '全部' || actor === activeActor) && matchQuery(card, q);
    });
    const key = sortKey === 'added_desc' ? 'added' : 'date';
    visible.sort((a, b) =>
      sortKey === 'date_asc'
        ? a.dataset[key].localeCompare(b.dataset[key])
        : b.dataset[key].localeCompare(a.dataset[key])
    );
    libCards.forEach((card) => card.classList.toggle('hidden', !visible.includes(card)));
    visible.forEach((card) => libGrid.appendChild(card)); // 按序移动节点
    /* 空态：无匹配时显示提示行 */
    if (visible.length) {
      emptyEl.remove();
    } else {
      emptyEl.textContent = t('empty');
      libGrid.appendChild(emptyEl);
    }
    if (REDUCE_MOTION) {
      visible.forEach((card) => { card.style.animation = 'none'; });
    } else {
      visible.forEach((card, i) => replayRise(card, i));
    }
    libCount.textContent = `${visible.length} / ${total}`;
    if (clearBtn) clearBtn.classList.toggle('show', searchInput && searchInput.value.length > 0);
  };

  chipBar.addEventListener('click', (e) => {
    const chip = e.target.closest('.lib-chip');
    if (!chip) return;
    chipBar.querySelectorAll('.lib-chip').forEach((c) => {
      const on = c === chip;
      c.classList.toggle('on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    activeActor = chip.childNodes[0].textContent.trim();
    renderGrid();
  });

  /* 排序下拉：自定义面板（原生 select 的弹出列表无法定制） */
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

  /* 搜索：输入过滤 + 清空按钮 + 快捷键（清空语义对齐 app.js resetToHome） */
  const updateClearBtn = () => {
    if (clearBtn) clearBtn.classList.toggle('show', searchInput.value.length > 0);
  };

  const resetToHome = () => {
    searchInput.value = '';
    activeActor = '全部';
    sortKey = 'date_desc';
    const allChip = chipBar.querySelector('.lib-chip[data-i18n="chips.all"]');
    chipBar.querySelectorAll('.lib-chip').forEach((c) => {
      const on = c === allChip;
      c.classList.toggle('on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    sortLabel.textContent = t('sort.date_desc');
    sortOpts.forEach((o) => o.setAttribute('aria-selected', String(o.dataset.value === sortKey)));
    updateClearBtn();
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
    clearBtn.addEventListener('click', resetToHome);
  }
  document.addEventListener('keydown', (e) => {
    if (!searchInput) return;
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

  renderGrid(); // 初始按「发行日期 · 新到旧」渲染，与 label 一致
}

/* 封面大图预览：演示区无影片文件，点击卡片展示封面大图（替代「点封面即播」） */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbClose = document.getElementById('lightbox-close');

if (lightbox && lbImg && lbClose && libGrid) {
  let lastFocused = null;

  const openLb = (src, trigger, alt) => {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lastFocused = trigger;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden'; // 锁背景滚动
    lbClose.focus();
  };

  const closeLb = () => {
    lightbox.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  /* 卡片点击委托：阻止锚点跳转，打开大图 */
  libGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.lib-card');
    if (!card) return;
    e.preventDefault();
    const img = card.querySelector('.lib-cover img');
    const code = card.querySelector('.lib-code');
    if (img) openLb(img.src, card, code ? code.textContent : '');
  });

  lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLb();
  });
}

/* 活终端：进入视口自动循环播放刮削实况（无 JS / 减少动态时保持静态菜单） */
const term = document.querySelector('.term');
if (term && 'IntersectionObserver' in window) {
  const termStatic = term.innerHTML;

  if (!REDUCE_MOTION) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let inView = false;
    let playing = false;

    /* 刮削实况：按真实产品 launcher.py 的 cmd_all 输出重演——
       brand → ①刮削影片（▸ 番号 + spinner 阶段 + 封面/裁剪/元数据/入库树状行）
       → ②清理源目录（移除原文件名）→ ③重建片库页面 → 结尾统计卡片 */
    const RULE = '<span class="rule">' + '─'.repeat(60) + '</span>';
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

    const line = (html, pause = 200) => {
      const p = document.createElement('p');
      p.innerHTML = html;
      term.appendChild(p);
      p.appendChild(cursorEl);
      return sleep(pause);
    };

    /* spinner 状态行：显示一段时间后擦除（真实产品里由正式输出替换） */
    const spinner = (text, ms) => {
      const p = document.createElement('p');
      p.className = 'term-spin';
      p.innerHTML = `     <span class="dim">${text}</span>`;
      term.appendChild(p);
      p.appendChild(cursorEl);
      return sleep(ms).then(() => p.remove());
    };

    /* 树状分步行：connector(├/└) + 7 列标签 + 正文 [+ 右对齐耗时] */
    const branch = (c, label, detail, right = '', pause = 240) => {
      const pad = ' '.repeat(Math.max(1, 7 - label.length));
      const tail = right ? `<span class="dim">${' '.repeat(22)}${right}</span>` : '';
      return line(`     <span class="dim">${c}</span> <span class="dim">${label}${pad}</span>${detail}${tail}`, pause);
    };

    /* 单部影片：▸ 番号 → spinner 阶段 → 封面/裁剪/元数据/入库 */
    const playMovie = async (m) => {
      await line(`   <span class="t1">▸</span> <b>${m.number}</b>` +
        `<span class="dim">${' '.repeat(40)}[${m.index}/${FOUND}]</span>`, 320);
      await spinner(t('launcher.fetching', { number: m.number }), 950);
      await branch('├', t('launcher.cover'), `  <span class="dim">${t('launcher.downloaded')}</span>`);
      await spinner(t('launcher.probe_cover'), 700);
      await branch('├', t('launcher.crop'), `  <span class="dim">${t('launcher.poster')}</span>`);
      await spinner(t('launcher.crop_poster'), 700);
      await spinner(t('launcher.write_meta'), 700);
      await branch('├', t('launcher.metadata'), ` ${m.actor} · ${m.studio} · ${m.release}`);
      await branch('└', t('launcher.archived'), `  ${m.actor}\\${m.number}`, m.elapsed);
    };

    const play = async () => {
      if (playing) return;
      playing = true;
      while (inView) {
        term.innerHTML = '';
        /* $ kuraya 逐字打出，光标跟随 */
        const prompt = document.createElement('p');
        prompt.innerHTML = '<span class="num">$</span> ';
        prompt.appendChild(cursorEl);
        term.appendChild(prompt);
        for (const ch of 'kuraya') {
          if (!inView) break;
          prompt.insertBefore(document.createTextNode(ch), cursorEl);
          await sleep(120);
        }
        if (!inView) break;
        await sleep(320);

        /* ① 品牌头 + 刮削影片 */
        await line('<span class="t1">◈</span>  <b>K U R A Y A</b>   <span class="t1">蔵屋</span>' +
          `<span class="dim">${' '.repeat(30)}v${__KURAYA_VERSION__}</span>`, 380);
        await line(RULE, 150);
        await line('&nbsp;', 180);
        await line(`<span class="blue">①</span> <b>${t('launcher.scrape_movies')}</b>`, 320);
        await line(RULE, 180);
        await line('&nbsp;', 200);
        for (const m of MOVIES) {
          if (!inView) break;
          await playMovie(m);
          await line('&nbsp;', 200);
        }
        if (!inView) break;

        /* ② 清理源目录 */
        await line(`<span class="blue">②</span> <b>${t('launcher.clean_source')}</b>`, 320);
        await line(RULE, 180);
        for (const m of MOVIES) {
          await line(`    <span class="dim">${t('launcher.removed', { name: m.raw })}</span>`, 260);
        }
        await line('&nbsp;', 200);

        /* ③ 重建片库页面 */
        await line(`<span class="blue">③</span> <b>${t('launcher.rebuild_page')}</b>`, 320);
        await line(RULE, 180);
        await line(`    <span class="ok">✓</span> <span class="dim">${t('launcher.page_regenerated')}</span> <b>${TOTAL}</b> <span class="dim">${t('launcher.titles')}</span>`, 320);
        await line('&nbsp;', 200);

        /* 结尾统计卡片：圆角边框，与真实产品 box() 一致 */
        const summary = `${t('launcher.new_archived', { done: FOUND })} · ${t('launcher.total', { total: TOTAL })} · ${t('launcher.elapsed', { elapsed: 18 })}`;
        await line('<span class="ok">  ╭' + '─'.repeat(60) + '╮</span>', 150);
        await line(`<span class="ok">  │</span>${' '.repeat(13)}<span class="ok">${summary}</span>${' '.repeat(13)}<span class="ok">│</span>`, 150);
        await line(`<span class="ok">  │</span>${' '.repeat(17)}<span class="dim">${t('launcher.open_page')}</span>${' '.repeat(17)}<span class="ok">│</span>`, 150);
        await line('<span class="ok">  ╰' + '─'.repeat(60) + '╯</span>', 0);
        if (!inView) break;
        await sleep(3600);
      }
      playing = false;
      if (!inView) {
        term.innerHTML = termStatic;
        applyLang(); /* 静态菜单按当前语言渲染 */
      }
    };

    /* 语言切换：恢复静态菜单并重放当前语言 */
    onLangChange(() => {
      term.innerHTML = termStatic;
      applyLang();
      if (inView) {
        playing = false;
        play();
      }
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
