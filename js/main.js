/* ==========================================================================
   WeMM-Video — Main Interactive Controller (v4)
   - Zero-flicker scroll reveal & nav state
   - Complete 5-Section, 123-Benchmark Interactive Explorer + Full Paper Tables
   - Official Overview Figures Toggle, Lightbox, BibTeX Copy, Demo Gallery
   ========================================================================== */

(function () {
  const STORAGE_KEY = "wemm_video_lang";
  let currentLang = "en";

  /* Evaluation Explorer State */
  let activeSectionId = "omni_video";
  let activeDimId = "av_general";
  let activeBenchId = "__avg__";
  let activeViewMode = "visual"; // "visual" | "table"
  let activeScaleFilter = "all"; // "all" | "flagship" | "compact"
  let activeTableGroupId = "flagship";
  let tableSearchQuery = "";

  /* Demo Page State */
  let activeDemoId = "";
  let activeDemoTrack = "all"; // "all" | "en" | "zh"

  function detectInitialLang() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang === "en" || urlLang === "zh") return urlLang;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "zh") return saved;
    } catch (_) {}
    return "en";
  }

  function t(key) {
    const dict = window.WEMM_I18N && window.WEMM_I18N[currentLang];
    if (dict && key in dict) return dict[key];
    return (window.WEMM_I18N && window.WEMM_I18N.en && window.WEMM_I18N.en[key]) || key;
  }

  function applyLang(lang) {
    currentLang = lang === "zh" ? "zh" : "en";
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (_) {}

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = t(key);
      if (val !== undefined) el.setAttribute("placeholder", val);
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
    });

    renderEvalExplorer();
    renderDemos();
  }

  /* ---------- Sticky Nav, Scroll-Spy & Mobile Menu ---------- */
  function initNav() {
    const nav = document.getElementById("site-nav");
    const navLinks = document.getElementById("nav-links");

    // Lightweight scroll-spy for hash links on index.html
    const sectionAnchors = navLinks
      ? Array.from(navLinks.querySelectorAll('a[href^="#"]'))
          .map((link) => {
            const id = link.getAttribute("href").slice(1);
            const target = id ? document.getElementById(id) : null;
            return target ? { link, target } : null;
          })
          .filter(Boolean)
      : [];

    const updateNav = () => {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 36);
      if (sectionAnchors.length) {
        const scrollPos = window.scrollY + 140;
        let current = null;
        for (const item of sectionAnchors) {
          if (item.target.getBoundingClientRect().top + window.scrollY <= scrollPos) {
            current = item.link;
          }
        }
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
          current = sectionAnchors[sectionAnchors.length - 1].link;
        }
        sectionAnchors.forEach(({ link }) => {
          link.classList.toggle("active", link === current);
        });
      }
    };

    window.addEventListener("scroll", updateNav, { passive: true });
    updateNav();

    const menuBtn = document.getElementById("mobile-menu-btn");
    if (menuBtn && navLinks) {
      menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
      navLinks.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => navLinks.classList.remove("open"));
      });
    }
  }

  /* ---------- Zero-Flicker Scroll Reveal ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -24px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ==========================================================================
     Complete Paper Evaluation Explorer (All 5 Sections · 123 Benchmarks)
     ========================================================================== */
  function numericScore(val) {
    if (typeof val === "number") return val;
    if (Array.isArray(val) && val.length > 0) {
      return val.reduce((a, b) => a + b, 0) / val.length;
    }
    return null;
  }

  function formatCellValue(val, decimals) {
    const d = typeof decimals === "number" ? decimals : 1;
    if (typeof val === "number") return val.toFixed(d);
    if (Array.isArray(val)) return val.map((v) => v.toFixed(d)).join(" | ");
    return "—";
  }

  function buildDimensionBenchmarks(section, dim) {
    const eligible = dim.benchmarks.filter((b) => !b.excludeFromAvg);
    if (eligible.length < 2) return dim.benchmarks;

    const allLower = eligible.every((b) => b.lowerIsBetter);
    const allHigher = eligible.every((b) => !b.lowerIsBetter);
    if (!allLower && !allHigher) return dim.benchmarks;

    const avgScores = {};
    section.models.forEach((m) => {
      const vals = eligible.map((b) => numericScore(b.scores[m.key])).filter((v) => v !== null);
      if (vals.length === eligible.length) {
        avgScores[m.key] = vals.reduce((a, c) => a + c, 0) / vals.length;
      }
    });

    const avgBench = {
      id: "__avg__",
      isAvg: true,
      lowerIsBetter: allLower,
      name: currentLang === "zh" ? "平均分" : "Average",
      metricNote: allLower
        ? currentLang === "zh"
          ? "越低越好 ↓"
          : "Lower is better ↓"
        : "",
      scores: avgScores
    };

    return [avgBench, ...dim.benchmarks];
  }

  function renderEvalExplorer() {
    const root = document.getElementById("eval-explorer-root");
    if (!root || !window.WEMM_EVAL_DATA) return;

    const sections = window.WEMM_EVAL_DATA.sections;
    const section = sections.find((s) => s.id === activeSectionId) || sections[0];
    activeSectionId = section.id;

    let dim = section.dimensions.find((d) => d.id === activeDimId);
    if (!dim) {
      dim = section.dimensions[0];
      activeDimId = dim.id;
    }

    if (!section.tableGroups.some((g) => g.id === activeTableGroupId)) {
      activeTableGroupId = section.tableGroups[0].id;
    }

    const sectionTabsEl = document.getElementById("eval-section-tabs");
    const viewSwitchEl = document.getElementById("eval-view-switch");
    const scaleRowEl = document.getElementById("eval-scale-row");
    const scaleBarEl = document.getElementById("eval-scale-bar");
    const visualPaneEl = document.getElementById("eval-visual-pane");
    const tablePaneEl = document.getElementById("eval-table-pane");

    // 1. Render 5 Modality Tabs
    sectionTabsEl.innerHTML = sections
      .map(
        (s) => `
          <button type="button" class="section-tab ${s.id === activeSectionId ? "active" : ""}" data-sec-id="${s.id}">
            ${s.label[currentLang]}
          </button>
        `
      )
      .join("");

    sectionTabsEl.querySelectorAll("[data-sec-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSectionId = btn.getAttribute("data-sec-id");
        const nextSec = sections.find((s) => s.id === activeSectionId);
        activeDimId = nextSec.dimensions[0].id;
        activeBenchId = "__avg__";
        activeScaleFilter = "all";
        activeTableGroupId = nextSec.tableGroups[0].id;
        tableSearchQuery = "";
        renderEvalExplorer();
      });
    });

    // 2. Render View Mode Switch (Chart | Table)
    viewSwitchEl.innerHTML = `
      <button type="button" class="view-mode-btn ${activeViewMode === "visual" ? "active" : ""}" data-view="visual">${t("view_visual")}</button>
      <button type="button" class="view-mode-btn ${activeViewMode === "table" ? "active" : ""}" data-view="table">${t("view_table")}</button>
    `;
    viewSwitchEl.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeViewMode = btn.getAttribute("data-view");
        renderEvalExplorer();
      });
    });

    // 3. Scale Filter (only shown when applicable)
    const showScale = activeViewMode === "visual" && section.hasScaleFilter;
    if (scaleRowEl) scaleRowEl.style.display = showScale ? "flex" : "none";
    if (scaleBarEl) {
      if (showScale) {
        scaleBarEl.style.display = "inline-flex";
        scaleBarEl.innerHTML = `
          <button type="button" class="scale-btn ${activeScaleFilter === "all" ? "active" : ""}" data-scale="all">${t("scale_all")}</button>
          <button type="button" class="scale-btn ${activeScaleFilter === "flagship" ? "active" : ""}" data-scale="flagship">${t("scale_flagship")}</button>
          <button type="button" class="scale-btn ${activeScaleFilter === "compact" ? "active" : ""}" data-scale="compact">${t("scale_compact")}</button>
        `;
        scaleBarEl.querySelectorAll("[data-scale]").forEach((btn) => {
          btn.addEventListener("click", () => {
            activeScaleFilter = btn.getAttribute("data-scale");
            renderEvalExplorer();
          });
        });
      } else {
        scaleBarEl.style.display = "none";
      }
    }

    // 4. Render Active View
    if (activeViewMode === "visual") {
      visualPaneEl.style.display = "block";
      tablePaneEl.style.display = "none";
      renderVisualPane(section, dim);
    } else {
      visualPaneEl.style.display = "none";
      tablePaneEl.style.display = "block";
      renderFullTablePane(section);
    }
  }

  function renderVisualPane(section, dim) {
    const dimsEl = document.getElementById("eval-dim-pills");
    const chipsEl = document.getElementById("eval-bench-chips");
    const metricNoteEl = document.getElementById("eval-metric-note");
    const barsEl = document.getElementById("eval-bars-stage");

    // Dimension pills
    dimsEl.innerHTML = section.dimensions
      .map(
        (d) => `
          <button type="button" class="dim-pill ${d.id === activeDimId ? "active" : ""}" data-dim-id="${d.id}">
            ${d.label[currentLang]}
          </button>
        `
      )
      .join("");

    dimsEl.querySelectorAll("[data-dim-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeDimId = btn.getAttribute("data-dim-id");
        activeBenchId = "__avg__";
        renderEvalExplorer();
      });
    });

    // Benchmark chips (including Dimension Avg when valid)
    const benches = buildDimensionBenchmarks(section, dim);
    let bench = benches.find((b) => b.id === activeBenchId);
    if (!bench) {
      bench = benches[0];
      activeBenchId = bench.id;
    }

    chipsEl.innerHTML = benches
      .map(
        (b) => `
          <button type="button" class="bench-chip ${b.isAvg ? "is-avg" : ""} ${b.id === activeBenchId ? "active" : ""}" data-bench-id="${b.id}">
            ${b.name}
          </button>
        `
      )
      .join("");

    chipsEl.querySelectorAll("[data-bench-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeBenchId = btn.getAttribute("data-bench-id");
        renderEvalExplorer();
      });
    });

    // Metric note / direction badge
    if (metricNoteEl) {
      if (bench.metricNote) {
        metricNoteEl.style.display = "inline-flex";
        metricNoteEl.textContent = bench.metricNote;
      } else {
        metricNoteEl.style.display = "none";
      }
    }

    // Filter models by scale scope if applicable
    const filteredModels = section.models.filter((m) => {
      if (!section.hasScaleFilter || activeScaleFilter === "all") return true;
      return m.tier === activeScaleFilter;
    });

    const lowerBetter = Boolean(bench.lowerIsBetter);
    const rows = filteredModels
      .map((m) => {
        const raw = bench.scores[m.key];
        const num = numericScore(raw);
        return { ...m, raw, score: num };
      })
      .filter((r) => typeof r.score === "number")
      .sort((a, b) => (lowerBetter ? a.score - b.score : b.score - a.score));

    const maxScore = Math.max(...rows.map((r) => r.score), 1);
    const scaleCap = bench.scale || (maxScore <= 10 ? maxScore * 1.15 : Math.min(100, Math.ceil(maxScore / 10) * 10 + 5));
    const decimals = typeof bench.decimals === "number" ? bench.decimals : 1;

    barsEl.innerHTML = rows
      .map((r, idx) => {
        const pct = Math.min(100, Math.max(6, (r.score / scaleCap) * 100)).toFixed(1);
        const isOurs = r.group === "ours" || r.group === "ours-sub";
        const tagClass = isOurs ? "tag-ours" : r.group === "closed" ? "tag-closed" : "tag-open";
        const tagLabel = isOurs ? t("tag_ours") : r.group === "closed" ? t("tag_closed") : t("tag_open");

        const multiDetail =
          Array.isArray(r.raw) && bench.multi
            ? `<span class="bar-subval">${r.raw.map((v) => v.toFixed(decimals)).join(" | ")}</span>`
            : "";

        return `
          <div class="bar-row">
            <div class="bar-rank ${idx === 0 ? "top1" : ""}">#${idx + 1}</div>
            <div class="bar-model ${isOurs ? "ours" : ""}" title="${r.name}">
              <span class="bar-model-name">${r.name}</span>
              <span class="model-tag ${tagClass}">${tagLabel}</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill ${r.group}" data-model="${r.name}" style="width: ${pct}%"></div>
            </div>
            <div class="bar-score ${isOurs ? "ours" : ""}">
              ${r.score.toFixed(decimals)}
              ${multiDetail}
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderFullTablePane(section) {
    const groupTabsEl = document.getElementById("eval-table-groups");
    const searchEl = document.getElementById("eval-table-search");
    const containerEl = document.getElementById("eval-table-container");
    const footnotesEl = document.getElementById("eval-table-footnotes");

    const group = section.tableGroups.find((g) => g.id === activeTableGroupId) || section.tableGroups[0];
    activeTableGroupId = group.id;

    // Table group selector (only shown when section has multiple tables)
    if (section.tableGroups.length > 1) {
      groupTabsEl.style.display = "flex";
      groupTabsEl.innerHTML = section.tableGroups
        .map(
          (g) => `
            <button type="button" class="table-group-btn ${g.id === activeTableGroupId ? "active" : ""}" data-tgroup="${g.id}">
              ${g.label[currentLang]}
            </button>
          `
        )
        .join("");

      groupTabsEl.querySelectorAll("[data-tgroup]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeTableGroupId = btn.getAttribute("data-tgroup");
          renderFullTablePane(section);
        });
      });
    } else {
      groupTabsEl.style.display = "none";
      groupTabsEl.innerHTML = "";
    }

    if (searchEl) {
      searchEl.value = tableSearchQuery;
      searchEl.oninput = (e) => {
        tableSearchQuery = e.target.value.trim().toLowerCase();
        renderTableHTML(section, group, containerEl);
      };
    }

    renderTableHTML(section, group, containerEl);

    if (footnotesEl) {
      const fnText = section.footnotes ? section.footnotes[currentLang] : "";
      footnotesEl.textContent = fnText;
      footnotesEl.style.display = fnText ? "block" : "none";
    }
  }

  function renderTableHTML(section, group, containerEl) {
    const cols = group.modelKeys
      .map((k) => section.models.find((m) => m.key === k))
      .filter(Boolean);

    const headCells = cols
      .map((m) => {
        const cls = m.ref ? "col-ref" : m.group === "ours" || m.group === "ours-sub" ? "col-ours" : "";
        return `<th class="${cls}" title="${m.name}">${m.short}</th>`;
      })
      .join("");

    let bodyRows = "";
    const q = tableSearchQuery;

    section.dimensions.forEach((dim) => {
      const matched = dim.benchmarks.filter((b) => {
        if (!q) return true;
        return (
          b.name.toLowerCase().includes(q) ||
          dim.label.en.toLowerCase().includes(q) ||
          dim.label.zh.toLowerCase().includes(q)
        );
      });
      if (!matched.length) return;

      bodyRows += `
        <tr class="dim-divider">
          <td colspan="${cols.length + 1}">${dim.label[currentLang]}</td>
        </tr>
      `;

      matched.forEach((b) => {
        // Compute best score excluding shaded reference column (matches LaTeX bolding!)
        const nonRefCols = cols.filter((c) => !c.ref);
        const lowerBetter = Boolean(b.lowerIsBetter);
        const vals = nonRefCols.map((c) => numericScore(b.scores[c.key])).filter((v) => v !== null);
        const bestVal = vals.length ? (lowerBetter ? Math.min(...vals) : Math.max(...vals)) : null;

        const cells = cols
          .map((c) => {
            const raw = b.scores[c.key];
            const num = numericScore(raw);
            const isOurs = c.group === "ours" || c.group === "ours-sub";
            const isBest = !c.ref && bestVal !== null && num !== null && Math.abs(num - bestVal) < 1e-6;
            const clsList = [];
            if (c.ref) clsList.push("col-ref");
            else if (isOurs) clsList.push("col-ours");
            if (isBest) clsList.push(isOurs ? "cell-best" : "cell-best-nonours");
            return `<td class="${clsList.join(" ")}">${formatCellValue(raw, b.decimals)}</td>`;
          })
          .join("");

        const dirBadge = lowerBetter ? " ↓" : "";
        bodyRows += `
          <tr>
            <td class="col-bench">${b.name}${dirBadge}</td>
            ${cells}
          </tr>
        `;
      });
    });

    if (!bodyRows) {
      bodyRows = `<tr><td colspan="${cols.length + 1}" style="padding:24px;color:var(--ink-muted);">No matching benchmarks found.</td></tr>`;
    }

    containerEl.innerHTML = `
      <table class="paper-table">
        <thead>
          <tr>
            <th class="col-bench">Benchmark</th>
            ${headCells}
          </tr>
        </thead>
        <tbody>${bodyRows}</tbody>
      </table>
    `;
  }

  /* ---------- Official Overview Figures Toggle ---------- */
  function initOfficialChartsToggle() {
    const btns = document.querySelectorAll("[data-chart-target]");
    const boxes = document.querySelectorAll("[data-chart-box]");
    if (!btns.length) return;
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-chart-target");
        btns.forEach((b) => b.classList.toggle("active", b === btn));
        boxes.forEach((box) =>
          box.classList.toggle("active", box.getAttribute("data-chart-box") === target)
        );
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("lightbox-close");
    if (!lightbox || !lightboxImg) return;

    document.querySelectorAll("[data-zoom-src]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        lightboxImg.src = trigger.getAttribute("data-zoom-src");
        lightboxImg.alt = trigger.getAttribute("data-zoom-alt") || "";
        lightbox.classList.add("open");
      });
    });

    const close = () => lightbox.classList.remove("open");
    if (closeBtn) closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- BibTeX Copy ---------- */
  function initCopyBibtex() {
    const btn = document.getElementById("copy-bibtex-btn");
    const code = document.getElementById("bibtex-code");
    if (!btn || !code) return;

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent.trim());
      } catch (_) {
        const ta = document.createElement("textarea");
        ta.value = code.textContent.trim();
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      btn.textContent = t("copied_btn");
      setTimeout(() => {
        btn.textContent = t("copy_btn");
      }, 1800);
    });
  }

  /* ---------- Demos Page (Auto-Loads demos/manifest.json + case.md + video.mp4) ---------- */
  let loadedDemos = [];
  let demosLoaded = false;

  async function loadDemosFromFolder() {
    const container = document.getElementById("demo-list");
    if (!container) return;

    try {
      const res = await fetch("demos/manifest.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("manifest not found");
      const ids = await res.json();
      if (!Array.isArray(ids)) throw new Error("invalid manifest");

      const cases = await Promise.all(
        ids.map(async (folderId) => {
          const mdRes = await fetch(`demos/${folderId}/case.md`, { cache: "no-cache" });
          if (!mdRes.ok) return null;
          const mdText = await mdRes.text();
          const parsed = window.WEMM_MD ? window.WEMM_MD.parseCaseMarkdown(mdText) : { meta: {} };
          const meta = parsed.meta || {};
          const videoFile = meta.video || "video.mp4";
          const posterFile = meta.poster || "";
          const candidateVideoSrc = `demos/${folderId}/${videoFile}`;
          let resolvedVideoSrc = "";
          try {
            const vRes = await fetch(candidateVideoSrc, { method: "HEAD", cache: "no-cache" });
            if (vRes.ok) resolvedVideoSrc = candidateVideoSrc;
          } catch (_) {}

          return {
            id: folderId,
            model: meta.model || "WeMM-Video-35B-A3B",
            duration: meta.duration || "00:00",
            videoSrc: resolvedVideoSrc,
            posterSrc: posterFile ? `demos/${folderId}/${posterFile}` : "",
            en: parsed.en,
            zh: parsed.zh
          };
        })
      );

      loadedDemos = cases.filter((c) => c && (c.en || c.zh));
      demosLoaded = true;
    } catch (_) {
      // Graceful fallback when opened directly via file:// (CORS blocks fetch)
      if (Array.isArray(window.WEMM_DEMOS)) {
        loadedDemos = window.WEMM_DEMOS;
      }
      demosLoaded = true;
    }

    renderDemos();
  }

  function initDemoTrackSwitch() {
    const btns = document.querySelectorAll("[data-demo-track]");
    if (!btns.length) return;
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeDemoTrack = btn.getAttribute("data-demo-track");
        renderDemos();
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderMarkdown(md) {
    if (!md) return "";
    if (window.WEMM_MD && typeof window.WEMM_MD.render === "function") {
      return window.WEMM_MD.render(md);
    }
    return `<p>${escapeHtml(md)}</p>`;
  }

  function buildPlaceholderHtml(demo, idxLabel) {
    return `
      <div class="demo-placeholder">
        <div class="demo-play-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
        </div>
        <div class="demo-placeholder-title">${t("demo_slot_title")}</div>
      </div>
    `;
  }

  function renderDemos() {
    const container = document.getElementById("demo-list");
    if (!container || !demosLoaded) return;

    const enDemos = loadedDemos.filter((d) => Boolean(d.en));
    const zhDemos = loadedDemos.filter((d) => Boolean(d.zh));
    const preferZh = currentLang === "zh";
    const allDemos = loadedDemos;

    document.querySelectorAll("[data-demo-track]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-demo-track") === activeDemoTrack);
    });

    const items =
      activeDemoTrack === "en" ? enDemos : activeDemoTrack === "zh" ? zhDemos : allDemos;

    if (!items.length) {
      container.innerHTML = `<div class="story-block" style="text-align:center;color:var(--ink-muted);">${t("demo_empty")}</div>`;
      return;
    }

    const caseTabs = document.getElementById("demo-case-tabs");
    let visibleItems = items;
    if (caseTabs) {
      if (!items.some((demo) => demo.id === activeDemoId)) activeDemoId = items[0].id;
      caseTabs.innerHTML = items.map((demo) => {
        const track = activeDemoTrack === "zh" ? demo.zh : activeDemoTrack === "en" ? demo.en : preferZh ? (demo.zh || demo.en) : (demo.en || demo.zh);
        return `<button type="button" class="demo-track-btn ${demo.id === activeDemoId ? "active" : ""}" data-demo-case="${escapeHtml(demo.id)}" aria-pressed="${demo.id === activeDemoId}">${escapeHtml(track.title || demo.id)}</button>`;
      }).join("");
      caseTabs.querySelectorAll("[data-demo-case]").forEach((button) => {
        button.addEventListener("click", () => {
          activeDemoId = button.getAttribute("data-demo-case");
          renderDemos();
        });
      });
      visibleItems = items.filter((demo) => demo.id === activeDemoId);
    }

    container.innerHTML = visibleItems
      .map((demo) => {
        const idxLabel = demo.id.replace(/^demo-/, "example-");
        const resolvedMode =
          activeDemoTrack === "zh"
            ? "zh"
            : activeDemoTrack === "en"
            ? "en"
            : preferZh
            ? demo.zh
              ? "zh"
              : "en"
            : demo.en
            ? "en"
            : "zh";
        const track = resolvedMode === "zh" ? demo.zh : demo.en;
        const title = track.title || demo.id;
        const promptMd = track.prompt || "";
        const thinkingMd = track.thinking || "";
        const answerMd = track.answer || "";

        const mediaHtml = demo.videoSrc
          ? `<video controls playsinline preload="metadata" data-fallback-id="${escapeHtml(demo.id)}" data-idx-label="${escapeHtml(idxLabel)}" ${demo.posterSrc ? `poster="${escapeHtml(demo.posterSrc)}"` : ""} src="${escapeHtml(demo.videoSrc)}"></video>`
          : buildPlaceholderHtml(demo, idxLabel);

        const hasThinking = Boolean(thinkingMd.trim());
        const thinkingBtnHtml = hasThinking
          ? `<button type="button" class="demo-thinking-toggle" data-toggle-thinking="${escapeHtml(demo.id)}" aria-expanded="false">
              <span class="demo-thinking-chevron">▸</span>
              <span>${t("demo_trace_label")}</span>
            </button>`
          : "";

        const thinkingPanelHtml = hasThinking
          ? `<div class="demo-thinking-box" data-thinking-panel="${escapeHtml(demo.id)}" hidden>
              <div class="demo-thinking-content demo-scroll-pane md-body">${renderMarkdown(thinkingMd)}</div>
            </div>`
          : "";

        const modeBadgeHtml = `<span class="demo-tag">${resolvedMode === "zh" ? "中文" : "English"}</span>`;

        const durationHtml =
          demo.duration && demo.duration !== "00:00"
            ? `<div class="demo-video-meta"><span>${escapeHtml(demo.duration)}</span></div>`
            : "";

        return `
          <article class="demo-card">
            <div class="demo-video-col">
              <div class="demo-card-top">
                <span class="demo-index">${escapeHtml(idxLabel)}</span>
                <div class="demo-tags">${modeBadgeHtml}</div>
              </div>
              <div class="demo-player-frame" data-player-for="${escapeHtml(demo.id)}">${mediaHtml}</div>
              ${durationHtml}
            </div>
            <div class="demo-io-col">
              <h3 class="demo-title">${escapeHtml(title)}</h3>
              <div class="demo-prompt-box">
                <div class="demo-label">${t("demo_prompt")}</div>
                <div class="demo-prompt-text md-body">${renderMarkdown(promptMd)}</div>
              </div>
              <div class="demo-mode-bar">
                <span class="demo-model-badge">${escapeHtml(demo.model)}</span>
                ${thinkingBtnHtml}
              </div>
              ${thinkingPanelHtml}
              <div class="demo-answer-box">
                <div class="demo-answer-label">${t("demo_answer_label")}</div>
                <div class="demo-answer-body demo-scroll-pane md-body">${renderMarkdown(answerMd)}</div>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    // Wire up inline Thought Process toggle buttons
    container.querySelectorAll("[data-toggle-thinking]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-toggle-thinking");
        const panel = container.querySelector(`[data-thinking-panel="${id}"]`);
        if (!panel) return;
        const willOpen = panel.hidden;
        panel.hidden = !willOpen;
        btn.classList.toggle("open", willOpen);
        btn.setAttribute("aria-expanded", String(willOpen));
      });
    });

    // Automatically show clean slot placeholder if video.mp4 is not uploaded yet
    container.querySelectorAll("video[data-fallback-id]").forEach((videoEl) => {
      const id = videoEl.getAttribute("data-fallback-id");
      const idxLabel = videoEl.getAttribute("data-idx-label") || "Demo";
      const demo = loadedDemos.find((d) => d.id === id);
      if (!demo) return;
      videoEl.addEventListener("error", () => {
        const frame = container.querySelector(`.demo-player-frame[data-player-for="${id}"]`);
        if (frame) frame.innerHTML = buildPlaceholderHtml(demo, idxLabel);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    initLightbox();
    initCopyBibtex();
    initDemoTrackSwitch();

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.getAttribute("data-lang")));
    });

    applyLang(detectInitialLang());
    loadDemosFromFolder();
  });
})();
