/* ==========================================================================
   WeMM-Video — Fallback Demo Data (Used ONLY if demos.html is opened via
   file:// where browser CORS blocks fetch('demos/manifest.json')).
   On GitHub Pages or local HTTP server, demos/manifest.json + case.md are
   loaded automatically.
   ========================================================================== */

window.WEMM_DEMOS = [
  {
    id: "demo-01",
    model: "WeMM-Video-35B-A3B",
    duration: "00:00",
    videoSrc: "",
    posterSrc: "",
    en: {
      title: "Joint Audio-Visual Reasoning",
      prompt: "*[Placeholder]* Put your **Markdown prompt** in `demos/demo-01/case.md`.",
      thinking: "*[Placeholder]* Step-by-step grounded reasoning will appear here in muted gray.",
      answer: "*[Placeholder]* Add `demos/demo-01/video.mp4` and edit `demos/demo-01/case.md`."
    },
    zh: {
      title: "音画联合推理",
      prompt: "*[占位提示词]* 请编辑 `demos/demo-01/case.md` 填写 **Markdown 提示词**。",
      thinking: "*[占位思考过程]* 模型思维链过程将以柔和冷灰色展示于此。",
      answer: "*[占位最终回复]* 将视频放入 `demos/demo-01/video.mp4` 并编辑 `demos/demo-01/case.md`。"
    }
  },
  {
    id: "demo-04",
    model: "WeMM-Video-35B-A3B",
    duration: "00:00",
    videoSrc: "",
    posterSrc: "",
    en: null,
    zh: {
      title: "直播带货与短剧音画同步（仅中文社区案例示例）",
      prompt: "*[占位提示词 · 仅中文社区展示]* 主播提到的优惠对应哪款商品？",
      thinking: "*[占位思考过程]* 仅填写 `(ZH)` 区块时，该案例仅出现在中文社区演示中。",
      answer: "*[占位最终回复]* 编辑 `demos/demo-04/case.md` 即可自动更新。"
    }
  },
  {
    id: "demo-05",
    model: "WeMM-Video-35B-A3B",
    duration: "00:00",
    videoSrc: "",
    posterSrc: "",
    en: {
      title: "Long-Horizon Audio-Visual Narrative (EN-Only Example)",
      prompt: "*[Placeholder · English-Only Case]* Summarize key events and audio clues.",
      thinking: "*[Placeholder]* Only `(EN)` sections defined, so this case only appears under English Demos.",
      answer: "*[Placeholder]* Edit `demos/demo-05/case.md` to populate."
    },
    zh: null
  }
];
