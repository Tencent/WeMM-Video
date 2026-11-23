/* ==========================================================================
   WeMM-Video — Bilingual Localization (EN default / ZH)
   ========================================================================== */

window.WEMM_I18N = {
  en: {
    hero_paper_title: "Pushing the Frontiers of Open-Source Omni-Modal Video Understanding",
    params_35b: "35B (3B active MoE)",
    params_9b: "9B Dense",
    params_4b: "4B Dense",
    params_2b: "2B Dense",
    nav_home: "Home",
    nav_cap: "Capabilities",
    nav_arch: "Architecture",
    nav_data: "Data",
    nav_bench: "Evaluation",
    nav_models: "Models",
    nav_demos: "Examples",

    hero_org_tencent: "WeChat Vision, Tencent Inc.",
    hero_org_tsinghua: "Tsinghua University",
    hero_sub:
      "An open-source bilingual omni-modal foundation model family for joint audio-visual video understanding and reasoning.",
    cta_paper: "Paper",
    cta_github: "GitHub",
    cta_hf: "Hugging Face",
    cta_demos: "Examples",
    scroll_cue: "Scroll",

    /* Section 1: Capabilities */
    cap_eyebrow: "Capabilities",
    cap_title: "Capabilities",
    cap_desc:
      "Real-world video meaning lives in the interplay between visuals, speech, and sound.",

    story_1_title: "When frames alone miss the plot",
    story_1_desc:
      "In short dramas and films, a twist often arrives through an off-screen voice, a sudden sound effect, or a shift in the soundtrack while the camera stays on one character's reaction.",
    story_2_title: "When audio and vision stay in sync",
    story_2_desc:
      "In live commerce, sports, and everyday scenes, rapid cuts unfold alongside spoken commentary—understanding what is happening requires aligning sight and sound on the same timeline.",

    cap_1_title: "Audio-Visual Video Understanding",
    cap_1_desc:
      "Jointly understands dynamic scenes, spoken dialogue, speaker identity, and ambient sounds.",
    cap_2_title: "Cross-Modal Video Reasoning",
    cap_2_desc:
      "Connects visual and acoustic cues across timestamps for causal and narrative reasoning.",
    cap_3_title: "Audio, Speech & Music",
    cap_3_desc:
      "Natively handles speech recognition, acoustic event perception, voice interaction, and music.",
    cap_4_title: "Image & Text Understanding",
    cap_4_desc:
      "Preserves strong vision-language, document OCR, spatial grounding, and text reasoning.",
    click_enlarge: "Enlarge",

    /* Section 2: Architecture */
    arch_eyebrow: "Architecture",
    arch_title: "Architecture",
    arch_desc:
      "Processes text, images, audio, and video in a single autoregressive model, interleaving visual frames and continuous acoustic tokens along explicit timestamps.",
    arch_pdf: "Download PDF ↗",
    arch_p1_title: "Vision Backbone",
    arch_p1_desc:
      "Built on Qwen3.5 (2B / 4B / 9B) and Qwen3.6 (35B-A3B), retaining native visual encoders for image and video perception.",
    arch_p2_title: "Audio Encoder & Alignment",
    arch_p2_desc:
      "Pairs a Whisper-based audio encoder with a window-level Q-Former to compress continuous soundtracks into audio tokens.",
    arch_p3_title: "Chronological Interleaving",
    arch_p3_desc:
      "Interleaves video frames and audio tokens with textual timestamps so the LLM reasons natively over synchronized sight and sound.",

    /* Section 3: Training Data */
    data_eyebrow: "Training Data",
    data_title: "Training Data",
    data_desc:
      "1.2T training tokens led by joint audio-visual data (45.4%), spanning video, audio, image, and text tasks.",
    data_fig1_caption: "Modality Distribution",
    data_fig2_caption: "Task Distribution",
    data_n1_title: "Dual-Track Video Captioning",
    data_n1_desc:
      "Combines action-dense silent videos (sports, gaming, dance) with native audio-visual videos (films, short dramas, live commerce).",
    data_n2_title: "Audio & Cross-Media Data",
    data_n2_desc:
      "Covers large-scale ASR, music, acoustic events, and cross-media tasks like video comparison and video-music matching.",
    data_n3_title: "Progressive Training Pipeline",
    data_n3_desc:
      "Three-stage pre-training (acoustic alignment, omni-modal injection, long-context scaling) followed by OPD, MrDPO, and RL.",

    /* Section 4: Benchmarks */
    bench_eyebrow: "Benchmarks",
    bench_title: "Evaluation",
    bench_desc:
      "WeMM-Video-35B-A3B sets open-source SOTA on omni-modal video and audio benchmarks while preserving strong silent video, image, and text performance.",
    glance_title: "Performance at a Glance",
    glance_video_tag: "Omni-Modal Video",
    glance_audio_tag: "Audio & Voice",
    explorer_title: "Detailed Results",
    view_visual: "Chart",
    view_table: "Table",
    scale_all: "All Models",
    scale_flagship: "Flagship & Proprietary",
    scale_compact: "2B–9B & Open-Source",
    search_bench: "Search benchmarks...",
    legend_ours: "WeMM-Video",
    legend_closed: "Proprietary",
    legend_open: "Open-Source",
    tag_ours: "Ours",
    tag_closed: "Closed",
    tag_open: "Open",

    /* Section 5: Models */
    models_eyebrow: "Models",
    models_title: "Models",
    models_desc: "Weights, inference code, and evaluation recipes on GitHub and Hugging Face.",
    col_model: "Model",
    col_base: "Backbone",
    col_active: "Parameters",
    col_scenario: "Use Case",
    col_link: "Weights",
    m_35b_use: "Flagship MoE · Best omni-modal reasoning",
    m_9b_use: "High-accuracy single-GPU deployment",
    m_4b_use: "Compact edge & mobile inference",
    m_2b_use: "Ultra-lightweight on-device model",
    badge_flagship: "Flagship",

    /* Demo Portal */
    portal_eyebrow: "Demos",
    portal_title: "Watch WeMM-Video in action.",
    portal_desc:
      "Real-world clips showcasing joint audio-visual reasoning, dialogue attribution, and sound perception.",
    portal_cta: "Explore Demos →",

    /* Citation */
    cite_eyebrow: "Citation",
    cite_title: "Citation",
    copy_btn: "Copy BibTeX",
    copied_btn: "Copied ✓",

    /* Footer */
    footer_left: "WeMM-Video · WeChat Vision, Tencent Inc. & Tsinghua University · Apache-2.0",

    /* Demos Page */
    demos_eyebrow: "Demos",
    demos_title: "Examples",
    demos_desc:
      "Real-world audio-visual clips demonstrating joint perception across video frames, dialogue, and soundtracks.",
    demo_track_all: "All",
    demo_track_en: "English",
    demo_track_zh: "中文",
    demo_empty: "No demos available yet.",
    demo_prompt: "Prompt",
    demo_trace_label: "Thought Process",
    demo_answer_label: "Final Response",
    demo_slot_title: "Video Coming Soon"
  },

  zh: {
    hero_paper_title: "推进开源全模态视频理解的前沿",
    params_35b: "35B（3B 激活参数，混合专家架构）",
    params_9b: "9B 稠密模型",
    params_4b: "4B 稠密模型",
    params_2b: "2B 稠密模型",
    nav_home: "首页",
    nav_cap: "核心能力",
    nav_arch: "模型架构",
    nav_data: "训练数据",
    nav_bench: "评测结果",
    nav_models: "开源模型",
    nav_demos: "示例",

    hero_org_tencent: "腾讯微信视觉",
    hero_org_tsinghua: "清华大学",
    hero_sub:
      "面向真实世界音画联合理解与跨模态推理的开源中英双语全模态基础模型家族。",
    cta_paper: "技术报告",
    cta_github: "GitHub",
    cta_hf: "Hugging Face",
    cta_demos: "示例",
    scroll_cue: "向下浏览",

    /* Section 1: Capabilities */
    cap_eyebrow: "核心能力",
    cap_title: "核心能力",
    cap_desc:
      "真实视频中的关键信息，往往藏在画面、对话与环境声的同步交织里。",

    story_1_title: "只看画面，往往会错过剧情",
    story_1_desc:
      "在短剧和影视片段中，镜头常停留在人物表情上，而画外音说出反转、门突然关上或配乐骤停——只有结合声音与语气才能看懂完整剧情。",
    story_2_title: "音画需要在同一时间轴对齐",
    story_2_desc:
      "在直播带货、体育赛事与日常视频中，镜头切换与口播讲解同步进行，需要沿着统一时间线联合理解动态画面、人声语义与环境音效。",

    cap_1_title: "音画全模态视频理解",
    cap_1_desc:
      "同步理解动态画面、口语对话、说话人身份与复杂环境音效。",
    cap_2_title: "跨模态视频推理",
    cap_2_desc:
      "跨时间点关联视觉与声学线索，完成因果推导与复杂剧情问答。",
    cap_3_title: "音频、语音与音乐理解",
    cap_3_desc:
      "原生支持语音识别、声学事件感知、语音交互与音乐理解。",
    cap_4_title: "图像与纯文本理解",
    cap_4_desc:
      "完整保留强大的图文多模态、文档 OCR、空间定位与通用文本推理能力。",
    click_enlarge: "放大查看",

    /* Section 2: Architecture */
    arch_eyebrow: "模型架构",
    arch_title: "模型架构",
    arch_desc:
      "在单一自回归框架内统一处理文本、图像、音频与视频，借助显式时间戳将视频帧与声学 Token 沿时间轴精准交织。",
    arch_pdf: "下载 PDF ↗",
    arch_p1_title: "视觉底座",
    arch_p1_desc:
      "基于 Qwen3.5（2B / 4B / 9B）与 Qwen3.6（35B-A3B），保留原生视觉编码能力。",
    arch_p2_title: "音频编码与对齐",
    arch_p2_desc:
      "通过 Whisper 音频编码器与窗口级 Q-Former，将连续音轨压缩为紧凑的声学 Token。",
    arch_p3_title: "时序交织",
    arch_p3_desc:
      "配合文本时间戳按时间顺序交织音视频 Token，让模型原生实现音画同步理解与推理。",

    /* Section 3: Training Data */
    data_eyebrow: "训练数据",
    data_title: "训练数据",
    data_desc:
      "1.2T 高质量多模态训练语料，音画联合数据占比最高（45.4%），全面覆盖视频、音频、图像与文本任务。",
    data_fig1_caption: "模态分布",
    data_fig2_caption: "任务分布",
    data_n1_title: "双轨视频描述语料",
    data_n1_desc:
      "融合高动态静音视频（体育、游戏、舞蹈）与原生音画视频（影视、短剧、直播带货）。",
    data_n2_title: "音频与跨媒体数据",
    data_n2_desc:
      "覆盖大规模 ASR、音乐、通用音频及多视频对比、音画匹配等跨媒体任务。",
    data_n3_title: "渐进式训练流程",
    data_n3_desc:
      "三阶段预训练（声学对齐、全模态注入、长上下文扩展）结合 OPD、MrDPO 与强化学习。",

    /* Section 4: Benchmarks */
    bench_eyebrow: "评测结果",
    bench_title: "评测结果",
    bench_desc:
      "WeMM-Video-35B-A3B 刷新开源全模态视频理解 SOTA 并在音频基准领先，同时保持出色的纯视觉视频、图像与纯文本能力。",
    glance_title: "核心评测速览",
    glance_video_tag: "全模态视频",
    glance_audio_tag: "音频与语音",
    explorer_title: "详细评测数据",
    view_visual: "图表对比",
    view_table: "数据表",
    scale_all: "全部模型",
    scale_flagship: "旗舰与闭源",
    scale_compact: "2B–9B 与开源",
    search_bench: "搜索榜单...",
    legend_ours: "WeMM-Video",
    legend_closed: "闭源模型",
    legend_open: "开源模型",
    tag_ours: "本模型",
    tag_closed: "闭源",
    tag_open: "开源",

    /* Section 5: Models */
    models_eyebrow: "开源模型",
    models_title: "开源模型",
    models_desc: "模型权重、推理代码与评测方案已在 GitHub 与 Hugging Face 开源。",
    col_model: "模型名称",
    col_base: "基座模型",
    col_active: "参数规模",
    col_scenario: "适用场景",
    col_link: "模型权重",
    m_35b_use: "旗舰 MoE · 最强全模态推理",
    m_9b_use: "高性能单卡部署首选",
    m_4b_use: "端侧与移动端轻量推理",
    m_2b_use: "超轻量终端音画模型",
    badge_flagship: "旗舰",

    /* Demo Portal */
    portal_eyebrow: "视频演示",
    portal_title: "观看 WeMM-Video 真实视频演示。",
    portal_desc:
      "直观体验音画联合推理、说话人归因以及音乐与环境声理解案例。",
    portal_cta: "查看视频演示 →",

    /* Citation */
    cite_eyebrow: "引用文献",
    cite_title: "引用文献",
    copy_btn: "复制 BibTeX",
    copied_btn: "已复制 ✓",

    /* Footer */
    footer_left: "WeMM-Video · 腾讯微信视觉团队 & 清华大学 · Apache-2.0",

    /* Demos Page */
    demos_eyebrow: "视频演示",
    demos_title: "示例",
    demos_desc:
      "精选真实世界音画视频案例，展示画面、对话与音轨的联合理解与推理效果。",
    demo_track_all: "全部",
    demo_track_en: "English",
    demo_track_zh: "中文",
    demo_empty: "暂无演示案例。",
    demo_prompt: "用户提问",
    demo_trace_label: "思考过程",
    demo_answer_label: "最终回复",
    demo_slot_title: "演示视频即将上线"
  }
};
