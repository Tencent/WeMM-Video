/* ==========================================================================
   WeMM-Video — Lightweight Safe Markdown Parser (Zero External Dependencies)
   Supports headings, bold/italic/strikethrough, inline & fenced code,
   ordered & unordered lists, blockquotes, tables, links, and paragraphs.
   ========================================================================== */

window.WEMM_MD = (function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatInline(raw) {
    let text = escapeHtml(raw);

    // Protect inline code spans first
    const codeTokens = [];
    text = text.replace(/`([^`]+)`/g, (_, code) => {
      const idx = codeTokens.length;
      codeTokens.push(`<code>${code}</code>`);
      return `\u0000CODE${idx}\u0000`;
    });

    // Links [label](https://...)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Bold + Italic
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    // Italic
    text = text.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
    // Strikethrough
    text = text.replace(/~~([^~]+)~~/g, "<del>$1</del>");

    // Restore inline code tokens
    text = text.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => codeTokens[Number(i)]);
    return text;
  }

  function renderTable(lines) {
    if (lines.length < 2) return "";
    const splitRow = (line) =>
      line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());

    const headers = splitRow(lines[0]);
    const rows = lines.slice(2).map(splitRow);

    const thead = `<thead><tr>${headers.map((h) => `<th>${formatInline(h)}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${rows
      .map((r) => `<tr>${headers.map((_, idx) => `<td>${formatInline(r[idx] || "")}</td>`).join("")}</tr>`)
      .join("")}</tbody>`;
    return `<div class="md-table-wrap"><table class="md-table">${thead}${tbody}</table></div>`;
  }

  function render(markdown) {
    if (!markdown || !String(markdown).trim()) return "";
    const src = String(markdown).replace(/\r\n?/g, "\n").trim();
    const lines = src.split("\n");
    const out = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Blank line
      if (!line.trim()) {
        i++;
        continue;
      }

      // Fenced code block
      const fenceMatch = line.match(/^```([\w-]*)\s*$/);
      if (fenceMatch) {
        const lang = escapeHtml(fenceMatch[1] || "");
        const buf = [];
        i++;
        while (i < lines.length && !lines[i].match(/^```\s*$/)) {
          buf.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        out.push(`<pre class="md-code-block"><code${lang ? ` data-lang="${lang}"` : ""}>${escapeHtml(buf.join("\n"))}</code></pre>`);
        continue;
      }

      // Horizontal rule
      if (/^\s*(?:---|\*\*\*|___)\s*$/.test(line)) {
        out.push("<hr />");
        i++;
        continue;
      }

      // Heading (# .. ####)
      const hMatch = line.match(/^(#{1,4})\s+(.+)$/);
      if (hMatch) {
        const level = Math.min(4, hMatch[1].length + 2); // map # -> h3..h6 inside cards
        out.push(`<h${level} class="md-heading">${formatInline(hMatch[2].trim())}</h${level}>`);
        i++;
        continue;
      }

      // Table (header row + separator row like |---|---|)
      if (
        line.includes("|") &&
        i + 1 < lines.length &&
        /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[i + 1])
      ) {
        const tblLines = [line, lines[i + 1]];
        i += 2;
        while (i < lines.length && lines[i].trim() && lines[i].includes("|")) {
          tblLines.push(lines[i]);
          i++;
        }
        out.push(renderTable(tblLines));
        continue;
      }

      // Blockquote
      if (/^\s*>\s?/.test(line)) {
        const qLines = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          qLines.push(lines[i].replace(/^\s*>\s?/, ""));
          i++;
        }
        out.push(`<blockquote>${render(qLines.join("\n"))}</blockquote>`);
        continue;
      }

      // Unordered list
      if (/^\s*[-*+]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
          i++;
        }
        out.push(`<ul>${items.map((it) => `<li>${formatInline(it)}</li>`).join("")}</ul>`);
        continue;
      }

      // Ordered list
      if (/^\s*\d+\.\s+/.test(line)) {
        const start = Number(line.match(/^\s*(\d+)\./)[1]);
        const items = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
          i++;
        }
        out.push(`<ol start="${start}">${items.map((it) => `<li>${formatInline(it)}</li>`).join("")}</ol>`);
        continue;
      }

      // Paragraph (accumulate until blank line or block starter)
      const pLines = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^```/.test(lines[i]) &&
        !/^#{1,4}\s+/.test(lines[i]) &&
        !/^\s*>\s?/.test(lines[i]) &&
        !/^\s*[-*+]\s+/.test(lines[i]) &&
        !/^\s*\d+\.\s+/.test(lines[i]) &&
        !/^\s*(?:---|\*\*\*|___)\s*$/.test(lines[i])
      ) {
        pLines.push(lines[i]);
        i++;
      }
      out.push(`<p>${pLines.map((l) => formatInline(l)).join("<br />")}</p>`);
    }

    return out.join("\n");
  }

  /* Parse YAML-like frontmatter + ## Section blocks from a demo case.md file */
  function parseCaseMarkdown(rawText) {
    const src = String(rawText || "").replace(/\r\n?/g, "\n");
    const meta = {};
    let body = src;

    const fmMatch = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (fmMatch) {
      fmMatch[1].split("\n").forEach((line) => {
        const m = line.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
        if (m) {
          let val = m[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          meta[m[1].trim()] = val;
        }
      });
      body = fmMatch[2];
    }

    // Split by top-level "## Heading" sections
    const sections = {};
    let currentKey = null;
    const lines = body.split("\n");
    lines.forEach((line) => {
      const secMatch = line.match(/^##\s+(.+?)\s*$/);
      if (secMatch) {
        currentKey = secMatch[1].trim().toLowerCase();
        sections[currentKey] = [];
      } else if (currentKey) {
        sections[currentKey].push(line);
      }
    });

    const getSec = (...keys) => {
      for (const k of keys) {
        if (sections[k] && sections[k].join("\n").trim()) {
          return sections[k].join("\n").trim();
        }
      }
      return "";
    };

    const promptEn = getSec("prompt (en)", "prompt_en", "prompt");
    const thinkingEn = getSec("thinking (en)", "thinking_en", "thinking");
    const answerEn = getSec("answer (en)", "answer_en", "answer", "response");

    const promptZh = getSec("prompt (zh)", "prompt_zh", "提示词");
    const thinkingZh = getSec("thinking (zh)", "thinking_zh", "思考过程");
    const answerZh = getSec("answer (zh)", "answer_zh", "最终回复", "回复");

    const hasEn = Boolean(promptEn || thinkingEn || answerEn);
    const hasZh = Boolean(promptZh || thinkingZh || answerZh);

    return {
      meta,
      en: hasEn
        ? {
            title: meta.title || meta.title_en || "",
            tag: meta.tag || meta.audio_tag || "",
            prompt: promptEn,
            thinking: thinkingEn,
            answer: answerEn
          }
        : null,
      zh: hasZh
        ? {
            title: meta.title_zh || meta.title || "",
            tag: meta.tag_zh || meta.audio_tag_zh || meta.tag || meta.audio_tag || "",
            prompt: promptZh,
            thinking: thinkingZh,
            answer: answerZh
          }
        : null
    };
  }

  return { render, parseCaseMarkdown };
})();
