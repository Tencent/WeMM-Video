/* ==========================================================================
   WeMM-Video — Complete Paper Evaluation Dataset (arXiv:2611.26409)
   Strictly organized by the 5 evaluation sections and exact dimensions from
   main.tex:
     1. Omni-Modal Video Evaluation (33 benchmarks · 5 dimensions)
     2. Silent Video Evaluation (32 benchmarks · 7 dimensions)
     3. Audio Evaluation (18 benchmarks · 5 dimensions)
     4. Image Evaluation (28 benchmarks · 7 dimensions)
     5. Text Evaluation (12 benchmarks · 5 dimensions)
   Total: 123 benchmarks, 100% verbatim from Tables 1–7.
   ========================================================================== */

window.WEMM_EVAL_DATA = {
  sections: [
    /* ======================================================================
       1. OMNI-MODAL VIDEO EVALUATION (Tables 1 & 2 · 33 Benchmarks)
       ====================================================================== */
    {
      id: "omni_video",
      count: 33,
      label: { en: "Omni-Modal Video", zh: "全模态视频" },
      title: { en: "Omni-Modal Video Evaluation", zh: "全模态音画视频评测" },
      summary: {
        en: "33 joint audio-visual benchmarks across 5 paper dimensions. WeMM-Video-35B-A3B sets open-source SOTA, outperforming Seed2.0-Mini-0428 and Qwen3.5-Omni-Flash on 16/17 general audio-visual benchmarks.",
        zh: "覆盖论文全部 5 大维度共 33 项音画联合基准。WeMM-Video-35B-A3B 刷新开源 SOTA，在 17 项通用音画基准中分别于 16 项上超越 Seed2.0-Mini-0428 与 Qwen3.5-Omni-Flash。"
      },
      hasScaleFilter: true,
      models: [
        { key: "gemini", name: "Gemini-3.0-Flash", short: "Gemini-3.0-Flash", group: "closed", tier: "flagship", ref: true },
        { key: "seed", name: "Seed2.0-Mini-0428", short: "Seed2.0-Mini", group: "closed", tier: "flagship" },
        { key: "qwen35_omni", name: "Qwen3.5-Omni-Flash", short: "Qwen3.5-Omni", group: "closed", tier: "flagship" },
        { key: "wemm35_inst", name: "WeMM-Video-35B-A3B (Instruct)", short: "WeMM-35B (Inst)", group: "ours-sub", tier: "flagship" },
        { key: "wemm35_think", name: "WeMM-Video-35B-A3B (Thinking)", short: "WeMM-35B (Think)", group: "ours", tier: "flagship" },
        { key: "qwen3_omni", name: "Qwen3-Omni-30B-A3B-Instruct", short: "Qwen3-Omni-30B", group: "open", tier: "compact" },
        { key: "minicpm", name: "MiniCPM-o 4.5-9B", short: "MiniCPM-o 4.5", group: "open", tier: "compact" },
        { key: "wemm2", name: "WeMM-Video-2B (Thinking)", short: "WeMM-2B", group: "ours-sub", tier: "compact" },
        { key: "wemm4", name: "WeMM-Video-4B (Thinking)", short: "WeMM-4B", group: "ours-sub", tier: "compact" },
        { key: "wemm9", name: "WeMM-Video-9B (Thinking)", short: "WeMM-9B", group: "ours", tier: "compact" }
      ],
      tableGroups: [
        {
          id: "flagship",
          label: { en: "35B-A3B vs Proprietary", zh: "35B-A3B 对比闭源" },
          modelKeys: ["gemini", "seed", "qwen35_omni", "wemm35_inst", "wemm35_think"]
        },
        {
          id: "compact",
          label: { en: "2B / 4B / 9B vs Open-Source", zh: "2B / 4B / 9B 对比开源" },
          modelKeys: ["qwen3_omni", "minicpm", "wemm2", "wemm4", "wemm9"]
        }
      ],
      footnotes: {
        en: "Notes: AVHBench & SVHalluc report sample-wise accuracy. HarmonySet is judged by GPT-4o (0–10 scale). ODU-Bench reports AV | AO. SocialOmni reports Who | When | How (QGold). video-SALMONN 2 testset reports total error rate (lower is better ↓). DVD-Bench (En) reports speaker accuracy. OmniCap-IF reports CSR | ISR.",
        zh: "注：AVHBench 与 SVHalluc 汇报样本级准确率；HarmonySet 为 GPT-4o 评分（0–10 制）；ODU-Bench 汇报 AV | AO；SocialOmni 汇报 Who | When | How (QGold)；video-SALMONN 2 测试集汇报总错误率（越低越好 ↓）；DVD-Bench (En) 汇报说话人准确率；OmniCap-IF 汇报 CSR | ISR。"
      },
      dimensions: [
        {
          id: "av_general",
          label: { en: "General Audio-Visual Understanding", zh: "通用音画理解" },
          benchmarks: [
            {
              id: "videomme_av",
              name: "Video-MME (w/ audio)",
              scores: { gemini: 88.6, seed: 83.6, qwen35_omni: 79.3, wemm35_inst: 84.2, wemm35_think: 86.4, qwen3_omni: 77.3, minicpm: 69.2, wemm2: 72.4, wemm4: 83.9, wemm9: 85.1 }
            },
            {
              id: "videomme2_av",
              name: "Video-MME-v2 (w/ audio)",
              scores: { gemini: 63.2, seed: 51.7, qwen35_omni: 36.6, wemm35_inst: 47.5, wemm35_think: 54.9, qwen3_omni: 36.3, minicpm: 28.1, wemm2: 37.7, wemm4: 48.1, wemm9: 51.6 }
            },
            {
              id: "dailyomni",
              name: "Daily-Omni",
              scores: { gemini: 82.4, seed: 82.5, qwen35_omni: 81.8, wemm35_inst: 81.5, wemm35_think: 83.4, qwen3_omni: 70.7, minicpm: 80.2, wemm2: 76.5, wemm4: 82.5, wemm9: 83.6 }
            },
            {
              id: "worldsense",
              name: "WorldSense",
              scores: { gemini: 63.8, seed: 61.3, qwen35_omni: 57.9, wemm35_inst: 59.6, wemm35_think: 62.7, qwen3_omni: 54.0, minicpm: 55.7, wemm2: 52.4, wemm4: 60.3, wemm9: 63.4 }
            },
            {
              id: "avut_human",
              name: "AVUT Human",
              scores: { gemini: 86.4, seed: 83.0, qwen35_omni: 81.4, wemm35_inst: 83.6, wemm35_think: 85.9, qwen3_omni: 74.2, minicpm: 78.6, wemm2: 80.2, wemm4: 84.3, wemm9: 85.8 }
            },
            {
              id: "av_speaker",
              name: "AV-SpeakerBench",
              scores: { gemini: 75.9, seed: 68.5, qwen35_omni: 65.2, wemm35_inst: 66.5, wemm35_think: 72.6, qwen3_omni: 50.4, minicpm: 56.7, wemm2: 56.2, wemm4: 68.6, wemm9: 71.1 }
            },
            {
              id: "video_holmes",
              name: "Video-Holmes",
              scores: { gemini: 71.2, seed: 62.1, qwen35_omni: 61.7, wemm35_inst: 63.2, wemm35_think: 63.4, qwen3_omni: 57.6, minicpm: 64.3, wemm2: 48.8, wemm4: 58.8, wemm9: 61.3 }
            },
            {
              id: "omnivideobench",
              name: "OmniVideoBench",
              scores: { gemini: 63.3, seed: 51.3, qwen35_omni: 43.7, wemm35_inst: 48.6, wemm35_think: 55.3, qwen3_omni: 45.4, minicpm: 37.2, wemm2: 39.2, wemm4: 49.7, wemm9: 52.8 }
            },
            {
              id: "rivabench",
              name: "RivaBench",
              scores: { gemini: 72.3, seed: 68.3, qwen35_omni: 68.5, wemm35_inst: 67.9, wemm35_think: 70.8, qwen3_omni: 69.6, minicpm: 68.7, wemm2: 63.8, wemm4: 69.6, wemm9: 70.1 }
            },
            {
              id: "lvomnibench",
              name: "LVOmniBench",
              scores: { gemini: 59.8, seed: 49.7, qwen35_omni: 43.7, wemm35_inst: 50.3, wemm35_think: 52.6, qwen3_omni: 42.7, minicpm: 37.0, wemm2: 40.2, wemm4: 48.1, wemm9: 51.0 }
            },
            {
              id: "futureomni",
              name: "FutureOmni",
              scores: { gemini: 65.3, seed: 52.2, qwen35_omni: 55.4, wemm35_inst: 58.4, wemm35_think: 56.2, qwen3_omni: 55.1, minicpm: 56.1, wemm2: 45.2, wemm4: 50.9, wemm9: 53.7 }
            },
            {
              id: "jointavbench",
              name: "JointAVBench",
              scores: { gemini: 68.4, seed: 64.7, qwen35_omni: 69.0, wemm35_inst: 67.4, wemm35_think: 65.9, qwen3_omni: 64.6, minicpm: 60.0, wemm2: 60.3, wemm4: 65.1, wemm9: 64.6 }
            },
            {
              id: "scivideobench",
              name: "SciVideoBench",
              scores: { gemini: 75.2, seed: 60.1, qwen35_omni: 51.3, wemm35_inst: 57.8, wemm35_think: 69.4, qwen3_omni: 49.9, minicpm: 32.7, wemm2: 39.6, wemm4: 59.2, wemm9: 64.2 }
            },
            {
              id: "mmou",
              name: "MMOU (test-mini)",
              scores: { gemini: 84.7, seed: 65.8, qwen35_omni: 69.9, wemm35_inst: 71.4, wemm35_think: 74.5, qwen3_omni: 60.5, minicpm: 40.9, wemm2: 45.7, wemm4: 63.3, wemm9: 71.7 }
            },
            {
              id: "omnicompass_av",
              name: "OmniCompass-AV",
              scores: { gemini: 50.8, seed: 47.9, qwen35_omni: 39.5, wemm35_inst: 41.5, wemm35_think: 46.3, qwen3_omni: 28.7, minicpm: 21.5, wemm2: 29.1, wemm4: 40.7, wemm9: 42.7 }
            },
            {
              id: "evaomni",
              name: "EvaOmni",
              scores: { gemini: 66.4, seed: 54.3, qwen35_omni: 30.4, wemm35_inst: 48.8, wemm35_think: 57.8, qwen3_omni: 26.1, minicpm: 21.2, wemm2: 32.8, wemm4: 46.5, wemm9: 50.7 }
            },
            {
              id: "omnireasoning",
              name: "OmniReasoningBench",
              scores: { gemini: 52.4, seed: 42.9, qwen35_omni: 37.2, wemm35_inst: 44.3, wemm35_think: 45.4, qwen3_omni: 24.1, minicpm: 16.3, wemm2: 27.6, wemm4: 39.5, wemm9: 43.9 }
            }
          ]
        },
        {
          id: "av_hallucination",
          label: { en: "Audio-Visual Hallucination", zh: "音画幻觉判别" },
          benchmarks: [
            {
              id: "avhbench",
              name: "AVHBench Judgement",
              scores: { gemini: 78.5, seed: 75.8, qwen35_omni: 77.5, wemm35_inst: 80.3, wemm35_think: 80.0, qwen3_omni: 74.5, minicpm: 79.2, wemm2: 74.3, wemm4: 75.4, wemm9: 80.0 }
            },
            {
              id: "svhalluc",
              name: "SVHalluc",
              scores: { gemini: 86.4, seed: 75.4, qwen35_omni: 63.6, wemm35_inst: 75.3, wemm35_think: 80.3, qwen3_omni: 65.2, minicpm: 68.9, wemm2: 73.9, wemm4: 80.2, wemm9: 86.8 }
            }
          ]
        },
        {
          id: "av_music",
          label: { en: "Video-Music Understanding", zh: "视频音乐理解" },
          benchmarks: [
            {
              id: "music_avqa",
              name: "MUSIC-AVQA",
              scores: { gemini: 76.2, seed: 74.2, qwen35_omni: 82.1, wemm35_inst: 79.6, wemm35_think: 79.5, qwen3_omni: 71.0, minicpm: 71.6, wemm2: 75.4, wemm4: 78.0, wemm9: 79.3 }
            },
            {
              id: "harmonyset",
              name: "HarmonySet",
              scale: 10,
              decimals: 2,
              metricNote: "0–10 GPT-4o score",
              excludeFromAvg: true,
              scores: { gemini: 5.73, seed: 5.74, qwen35_omni: 5.48, wemm35_inst: 5.63, wemm35_think: 5.97, qwen3_omni: 5.15, minicpm: 5.55, wemm2: 6.02, wemm4: 5.94, wemm9: 5.98 }
            }
          ]
        },
        {
          id: "av_interaction",
          label: { en: "Audio-Visual Interaction", zh: "音画交互理解" },
          benchmarks: [
            {
              id: "qualcomm_ivd",
              name: "Qualcomm IVD",
              scores: { gemini: 72.2, seed: 70.0, qwen35_omni: 66.3, wemm35_inst: 70.2, wemm35_think: 72.3, qwen3_omni: 64.6, minicpm: 43.0, wemm2: 62.3, wemm4: 69.9, wemm9: 70.3 }
            },
            {
              id: "omnivchat",
              name: "OmniVChat",
              scores: { gemini: 54.5, seed: 49.8, qwen35_omni: 36.9, wemm35_inst: 44.8, wemm35_think: 48.9, qwen3_omni: 46.5, minicpm: 30.4, wemm2: 33.1, wemm4: 44.3, wemm9: 49.5 }
            },
            {
              id: "odubench",
              name: "ODU-Bench (AV | AO)",
              metricNote: "Bar: Avg of AV & AO · Table: AV | AO",
              multi: ["AV", "AO"],
              scores: { gemini: [72.2, 72.5], seed: [69.8, 73.6], qwen35_omni: [64.4, 70.4], wemm35_inst: [74.2, 78.9], wemm35_think: [72.5, 77.8], qwen3_omni: [57.9, 65.5], minicpm: [47.8, 58.4], wemm2: [56.5, 62.1], wemm4: [70.2, 73.1], wemm9: [72.6, 75.6] }
            },
            {
              id: "oinbench",
              name: "O-IN-Bench",
              scores: { gemini: 53.3, seed: 49.4, qwen35_omni: 34.2, wemm35_inst: 38.4, wemm35_think: 49.0, qwen3_omni: 35.7, minicpm: 29.3, wemm2: 32.4, wemm4: 42.0, wemm9: 44.1 }
            },
            {
              id: "socialomni",
              name: "SocialOmni (Who | When | How)",
              metricNote: "Bar: Avg of Who/When/How · Table: Who | When | How",
              multi: ["Who", "When", "How"],
              scores: { gemini: [90.2, 79.5, 87.9], seed: [89.1, 49.0, 90.0], qwen35_omni: [87.4, 67.0, 43.6], wemm35_inst: [90.6, 43.5, 74.8], wemm35_think: [90.5, 62.0, 85.2], qwen3_omni: [74.7, 58.0, 44.5], minicpm: [83.9, 39.5, 67.4], wemm2: [82.0, 41.0, 44.5], wemm4: [90.9, 57.5, 80.3], wemm9: [90.6, 59.5, 84.4] }
            }
          ]
        },
        {
          id: "av_captioning",
          label: { en: "Audio-Visual Captioning", zh: "音画细粒度描述" },
          benchmarks: [
            {
              id: "omnicloze",
              name: "Omni-Cloze",
              scores: { gemini: 34.3, seed: 39.9, qwen35_omni: 41.8, wemm35_inst: 44.2, wemm35_think: 42.6, qwen3_omni: 27.0, minicpm: 27.1, wemm2: 38.4, wemm4: 40.1, wemm9: 41.5 }
            },
            {
              id: "videosalmonn2",
              name: "video-SALMONN 2 testset",
              lowerIsBetter: true,
              excludeFromAvg: true,
              metricNote: "Total Error Rate (Lower is better ↓)",
              scores: { gemini: 37.7, seed: 32.7, qwen35_omni: 28.0, wemm35_inst: 27.5, wemm35_think: 28.3, qwen3_omni: 27.9, minicpm: 50.6, wemm2: 34.3, wemm4: 30.4, wemm9: 30.9 }
            },
            {
              id: "ugcvideocap",
              name: "UGCVideoCap",
              scores: { gemini: 71.0, seed: 74.8, qwen35_omni: 70.5, wemm35_inst: 75.1, wemm35_think: 74.9, qwen3_omni: 70.8, minicpm: 56.9, wemm2: 72.2, wemm4: 75.1, wemm9: 74.4 }
            },
            {
              id: "dvdbench",
              name: "DVD-Bench (En)",
              scores: { gemini: 81.2, seed: 75.3, qwen35_omni: 72.5, wemm35_inst: 76.2, wemm35_think: 79.1, qwen3_omni: 67.8, minicpm: 64.9, wemm2: 73.6, wemm4: 78.5, wemm9: 78.3 }
            },
            {
              id: "omnicap_if",
              name: "OmniCap-IF (CSR | ISR)",
              metricNote: "Bar: Avg of CSR & ISR · Table: CSR | ISR",
              multi: ["CSR", "ISR"],
              scores: { gemini: [83.2, 31.1], seed: [75.1, 16.8], qwen35_omni: [65.6, 9.2], wemm35_inst: [74.8, 16.9], wemm35_think: [79.1, 23.6], qwen3_omni: [62.7, 7.2], minicpm: [64.7, 9.3], wemm2: [63.3, 6.8], wemm4: [73.2, 14.0], wemm9: [76.7, 20.0] }
            },
            {
              id: "dailyomni_capqa",
              name: "DailyOmni (Caption-Based QA)",
              scores: { gemini: 51.8, seed: 50.9, qwen35_omni: 44.0, wemm35_inst: 51.9, wemm35_think: 62.2, qwen3_omni: 19.4, minicpm: 26.6, wemm2: 51.1, wemm4: 58.6, wemm9: 59.7 }
            },
            {
              id: "worldsense_capqa",
              name: "WorldSense (Caption-Based QA)",
              scores: { gemini: 32.4, seed: 28.5, qwen35_omni: 26.0, wemm35_inst: 32.3, wemm35_think: 36.6, qwen3_omni: 14.6, minicpm: 16.6, wemm2: 29.6, wemm4: 34.6, wemm9: 34.1 }
            }
          ]
        }
      ]
    },

    /* ======================================================================
       2. SILENT VIDEO EVALUATION (Tables 3 & 4 · 32 Benchmarks)
       ====================================================================== */
    {
      id: "silent_video",
      count: 32,
      label: { en: "Silent Video", zh: "纯视觉视频" },
      title: { en: "Silent Video Evaluation", zh: "纯视觉视频理解评测" },
      summary: {
        en: "32 silent video benchmarks across 7 dimensions. WeMM-Video preserves strong visual-temporal perception without acoustic interference, clearly outperforming Qwen3.5-Omni-Flash and matching its Qwen3.6-35B-A3B / Qwen3.5-9B backbones.",
        zh: "覆盖论文全部 7 大维度共 32 项纯视觉视频基准。融入音频模态后未造成视觉退化，显著领先 Qwen3.5-Omni-Flash，并与强视觉底座 Qwen3.6-35B-A3B、Qwen3.5-9B 保持齐平甚至更优。"
      },
      hasScaleFilter: true,
      models: [
        { key: "gemini", name: "Gemini-3.0-Flash", short: "Gemini-3.0-Flash", group: "closed", tier: "flagship", ref: true },
        { key: "seed", name: "Seed2.0-Mini-0428", short: "Seed2.0-Mini", group: "closed", tier: "flagship" },
        { key: "qwen35_omni", name: "Qwen3.5-Omni-Flash", short: "Qwen3.5-Omni", group: "closed", tier: "flagship" },
        { key: "qwen36_35b", name: "Qwen3.6-35B-A3B", short: "Qwen3.6-35B", group: "open", tier: "flagship" },
        { key: "wemm35_inst", name: "WeMM-Video-35B-A3B (Instruct)", short: "WeMM-35B (Inst)", group: "ours-sub", tier: "flagship" },
        { key: "wemm35_think", name: "WeMM-Video-35B-A3B (Thinking)", short: "WeMM-35B (Think)", group: "ours", tier: "flagship" },
        { key: "qwen3_omni", name: "Qwen3-Omni-30B-A3B-Instruct", short: "Qwen3-Omni-30B", group: "open", tier: "compact" },
        { key: "qwen35_9b", name: "Qwen3.5-9B", short: "Qwen3.5-9B", group: "open", tier: "compact" },
        { key: "minicpm", name: "MiniCPM-o 4.5-9B", short: "MiniCPM-o 4.5", group: "open", tier: "compact" },
        { key: "wemm2", name: "WeMM-Video-2B (Thinking)", short: "WeMM-2B", group: "ours-sub", tier: "compact" },
        { key: "wemm4", name: "WeMM-Video-4B (Thinking)", short: "WeMM-4B", group: "ours-sub", tier: "compact" },
        { key: "wemm9", name: "WeMM-Video-9B (Thinking)", short: "WeMM-9B", group: "ours", tier: "compact" }
      ],
      tableGroups: [
        {
          id: "flagship",
          label: { en: "35B-A3B vs Baselines", zh: "35B-A3B 对比主流基线" },
          modelKeys: ["gemini", "seed", "qwen35_omni", "qwen36_35b", "wemm35_inst", "wemm35_think"]
        },
        {
          id: "compact",
          label: { en: "2B / 4B / 9B vs Open-Source", zh: "2B / 4B / 9B 对比开源" },
          modelKeys: ["qwen3_omni", "qwen35_9b", "minicpm", "wemm2", "wemm4", "wemm9"]
        }
      ],
      footnotes: {
        en: "Notes: Video-IFBench reports TCSR | TISR. VidHalluc reports average across BQA, MCQ, TSH, STH. MMBench-Video is on a 0–3 scale. TemporalBench reports overall MBA. F-16-NBA reports accuracy. TimeLens reports mean IoU.",
        zh: "注：Video-IFBench 汇报 TCSR | TISR；VidHalluc 为四项子任务均分；MMBench-Video 为 0–3 分制；TemporalBench 汇报总体 MBA；F-16-NBA 汇报准确率；TimeLens 汇报平均 IoU。"
      },
      dimensions: [
        {
          id: "sv_general",
          label: { en: "General Video Understanding", zh: "通用视频理解" },
          benchmarks: [
            { id: "sv_videomme", name: "Video-MME", scores: { gemini: 86.4, seed: 78.1, qwen35_omni: 77.0, qwen36_35b: 82.5, wemm35_inst: 78.0, wemm35_think: 80.4, qwen3_omni: 70.5, qwen35_9b: 78.4, minicpm: 70.4, wemm2: 67.6, wemm4: 75.7, wemm9: 78.5 } },
            { id: "sv_videomme2", name: "Video-MME-v2", scores: { gemini: 55.6, seed: 44.4, qwen35_omni: 33.7, qwen36_35b: 45.3, wemm35_inst: 39.8, wemm35_think: 45.2, qwen3_omni: 29.7, qwen35_9b: 42.4, minicpm: 26.8, wemm2: 32.8, wemm4: 39.5, wemm9: 40.6 } },
            { id: "sv_mvbench", name: "MVBench", scores: { gemini: 70.0, seed: 73.4, qwen35_omni: 70.8, qwen36_35b: 74.6, wemm35_inst: 72.8, wemm35_think: 73.1, qwen3_omni: 68.8, qwen35_9b: 74.4, minicpm: 63.4, wemm2: 64.6, wemm4: 70.0, wemm9: 71.4 } },
            { id: "sv_videommmu", name: "Video-MMMU", scores: { gemini: 86.9, seed: 81.0, qwen35_omni: 64.0, qwen36_35b: 83.7, wemm35_inst: 80.8, wemm35_think: 83.6, qwen3_omni: 54.7, qwen35_9b: 78.9, minicpm: 52.9, wemm2: 65.1, wemm4: 79.6, wemm9: 79.2 } },
            { id: "sv_videoocr", name: "MME-VideoOCR", scores: { gemini: 81.5, seed: 80.5, qwen35_omni: 70.5, qwen36_35b: 75.8, wemm35_inst: 73.3, wemm35_think: 78.4, qwen3_omni: 67.7, qwen35_9b: 75.9, minicpm: 55.4, wemm2: 67.7, wemm4: 75.0, wemm9: 77.3 } },
            { id: "sv_tempcompass", name: "TempCompass", scores: { gemini: 88.1, seed: 85.9, qwen35_omni: 78.1, qwen36_35b: 83.7, wemm35_inst: 82.4, wemm35_think: 84.3, qwen3_omni: 76.5, qwen35_9b: 82.8, minicpm: 74.4, wemm2: 78.5, wemm4: 84.9, wemm9: 84.8 } },
            { id: "sv_nextqa", name: "NExT-QA", scores: { gemini: 83.0, seed: 83.9, qwen35_omni: 84.1, qwen36_35b: 84.3, wemm35_inst: 85.7, wemm35_think: 84.6, qwen3_omni: 84.8, qwen35_9b: 81.9, minicpm: 80.2, wemm2: 76.6, wemm4: 81.6, wemm9: 83.1 } },
            { id: "sv_tomato", name: "TOMATO", scores: { gemini: 45.9, seed: 53.8, qwen35_omni: 28.2, qwen36_35b: 51.4, wemm35_inst: 46.4, wemm35_think: 52.5, qwen3_omni: 35.2, qwen35_9b: 45.0, minicpm: 29.4, wemm2: 34.4, wemm4: 47.9, wemm9: 48.5 } },
            {
              id: "sv_videoif",
              name: "Video-IFBench (TCSR | TISR)",
              metricNote: "Bar: Avg of TCSR & TISR · Table: TCSR | TISR",
              multi: ["TCSR", "TISR"],
              scores: { gemini: [72.2, 49.5], seed: [56.5, 28.9], qwen35_omni: [53.6, 26.6], qwen36_35b: [51.2, 34.1], wemm35_inst: [50.8, 24.7], wemm35_think: [57.8, 31.8], qwen3_omni: [44.3, 18.0], qwen35_9b: [56.0, 32.2], minicpm: [23.2, 10.4], wemm2: [33.1, 13.5], wemm4: [48.5, 22.2], wemm9: [52.8, 26.1] }
            },
            { id: "sv_vidhalluc", name: "VidHalluc", scores: { gemini: 80.0, seed: 76.7, qwen35_omni: 76.1, qwen36_35b: 84.0, wemm35_inst: 80.2, wemm35_think: 84.1, qwen3_omni: 76.2, qwen35_9b: 81.9, minicpm: 75.2, wemm2: 77.5, wemm4: 82.5, wemm9: 83.0 } },
            { id: "sv_videovista", name: "VideoVista", scores: { gemini: 83.2, seed: 81.8, qwen35_omni: 84.1, qwen36_35b: 83.1, wemm35_inst: 84.5, wemm35_think: 83.5, qwen3_omni: 83.7, qwen35_9b: 84.7, minicpm: 82.5, wemm2: 78.8, wemm4: 81.2, wemm9: 82.2 } },
            { id: "sv_mmvu", name: "MMVU", scores: { gemini: 77.1, seed: 70.5, qwen35_omni: 62.7, qwen36_35b: 74.7, wemm35_inst: 68.5, wemm35_think: 74.4, qwen3_omni: 62.9, qwen35_9b: 69.6, minicpm: 59.2, wemm2: 50.8, wemm4: 64.9, wemm9: 70.2 } },
            { id: "sv_videoindex", name: "Video-Index", scores: { gemini: 58.8, seed: 38.3, qwen35_omni: 24.3, qwen36_35b: 38.1, wemm35_inst: 27.5, wemm35_think: 37.9, qwen3_omni: 19.6, qwen35_9b: 34.2, minicpm: 11.7, wemm2: 18.3, wemm4: 30.5, wemm9: 34.6 } },
            { id: "sv_perception", name: "Perception Test", scores: { gemini: 78.9, seed: 81.1, qwen35_omni: 74.1, qwen36_35b: 79.8, wemm35_inst: 77.9, wemm35_think: 80.4, qwen3_omni: 75.3, qwen35_9b: 77.5, minicpm: 67.8, wemm2: 71.2, wemm4: 76.5, wemm9: 78.0 } },
            { id: "sv_timeblind", name: "TimeBlind", scores: { gemini: 77.9, seed: 80.6, qwen35_omni: 67.8, qwen36_35b: 77.0, wemm35_inst: 73.8, wemm35_think: 78.0, qwen3_omni: 66.6, qwen35_9b: 76.6, minicpm: 60.5, wemm2: 67.5, wemm4: 75.2, wemm9: 76.4 } },
            { id: "sv_logical", name: "Video-MME-Logical", scores: { gemini: 31.5, seed: 28.9, qwen35_omni: 19.7, qwen36_35b: 27.5, wemm35_inst: 25.1, wemm35_think: 26.0, qwen3_omni: 15.9, qwen35_9b: 24.1, minicpm: 14.7, wemm2: 18.7, wemm4: 21.7, wemm9: 21.8 } }
          ]
        },
        {
          id: "sv_long",
          label: { en: "Long Video Understanding", zh: "长视频理解" },
          benchmarks: [
            { id: "sv_mlvu", name: "MLVU", scores: { gemini: 87.9, seed: 81.6, qwen35_omni: 81.9, qwen36_35b: 86.2, wemm35_inst: 80.8, wemm35_think: 85.3, qwen3_omni: 75.2, qwen35_9b: 84.4, minicpm: 76.5, wemm2: 74.4, wemm4: 80.4, wemm9: 82.4 } },
            { id: "sv_lvbench", name: "LVBench", scores: { gemini: 73.8, seed: 63.4, qwen35_omni: 65.7, qwen36_35b: 71.4, wemm35_inst: 68.7, wemm35_think: 71.6, qwen3_omni: 50.2, qwen35_9b: 70.0, minicpm: 50.9, wemm2: 55.8, wemm4: 65.3, wemm9: 68.2 } },
            { id: "sv_longvideobench", name: "LongVideoBench", scores: { gemini: 77.4, seed: 74.4, qwen35_omni: 66.9, qwen36_35b: 76.7, wemm35_inst: 74.0, wemm35_think: 76.6, qwen3_omni: 63.5, qwen35_9b: 74.8, minicpm: 66.0, wemm2: 66.0, wemm4: 74.8, wemm9: 74.7 } },
            { id: "sv_egoschema", name: "EgoSchema", scores: { gemini: 64.8, seed: 78.4, qwen35_omni: 70.0, qwen36_35b: 77.2, wemm35_inst: 76.0, wemm35_think: 74.2, qwen3_omni: 66.4, qwen35_9b: 74.4, minicpm: 60.4, wemm2: 66.4, wemm4: 74.2, wemm9: 73.6 } },
            { id: "sv_mmbenchvideo", name: "MMBench-Video", scale: 3, decimals: 2, metricNote: "0–3 scale", excludeFromAvg: true, scores: { gemini: 2.56, seed: 2.48, qwen35_omni: 2.06, qwen36_35b: 2.49, wemm35_inst: 2.43, wemm35_think: 2.50, qwen3_omni: 2.13, qwen35_9b: 2.16, minicpm: 2.20, wemm2: 2.20, wemm4: 2.38, wemm9: 2.44 } }
          ]
        },
        {
          id: "sv_finegrained",
          label: { en: "Fine-grained Perception", zh: "细粒度动作与时序感知" },
          benchmarks: [
            { id: "sv_motionbench", name: "MotionBench", scores: { gemini: 65.0, seed: 68.4, qwen35_omni: 61.7, qwen36_35b: 66.1, wemm35_inst: 67.1, wemm35_think: 65.7, qwen3_omni: 61.9, qwen35_9b: 63.3, minicpm: 61.4, wemm2: 58.0, wemm4: 63.4, wemm9: 64.0 } },
            { id: "sv_temporalbench", name: "TemporalBench", scores: { gemini: 50.9, seed: 44.9, qwen35_omni: 30.6, qwen36_35b: 43.3, wemm35_inst: 39.0, wemm35_think: 45.9, qwen3_omni: 34.7, qwen35_9b: 39.5, minicpm: 23.9, wemm2: 29.0, wemm4: 38.3, wemm9: 40.9 } },
            { id: "sv_f16nba", name: "F-16-NBA", scores: { gemini: 90.1, seed: 94.8, qwen35_omni: 87.3, qwen36_35b: 82.8, wemm35_inst: 89.0, wemm35_think: 89.9, qwen3_omni: 74.0, qwen35_9b: 75.8, minicpm: 77.1, wemm2: 61.4, wemm4: 87.0, wemm9: 88.7 } }
          ]
        },
        {
          id: "sv_grounding",
          label: { en: "Temporal Grounding", zh: "时序定位" },
          benchmarks: [
            { id: "sv_tl_charades", name: "TimeLens-Charades", scores: { gemini: 58.8, seed: 56.9, qwen35_omni: 40.8, qwen36_35b: 47.4, wemm35_inst: 54.7, wemm35_think: 54.8, qwen3_omni: 45.5, qwen35_9b: 50.6, minicpm: 29.0, wemm2: 49.7, wemm4: 54.9, wemm9: 52.3 } },
            { id: "sv_tl_anet", name: "TimeLens-ActivityNet", scores: { gemini: 47.1, seed: 56.2, qwen35_omni: 30.3, qwen36_35b: 53.9, wemm35_inst: 58.9, wemm35_think: 56.4, qwen3_omni: 38.2, qwen35_9b: 52.2, minicpm: 15.8, wemm2: 43.3, wemm4: 55.3, wemm9: 55.3 } },
            { id: "sv_tl_qvh", name: "TimeLens-QVHighlights", scores: { gemini: 68.2, seed: 68.5, qwen35_omni: 37.3, qwen36_35b: 66.8, wemm35_inst: 68.4, wemm35_think: 69.0, qwen3_omni: 47.5, qwen35_9b: 64.3, minicpm: 12.9, wemm2: 48.7, wemm4: 66.0, wemm9: 66.8 } }
          ]
        },
        {
          id: "sv_spatial",
          label: { en: "Spatial Understanding", zh: "空间理解" },
          benchmarks: [
            { id: "sv_pai", name: "PAI-Bench-U", scores: { gemini: 65.8, seed: 67.7, qwen35_omni: 51.5, qwen36_35b: 65.3, wemm35_inst: 62.5, wemm35_think: 65.5, qwen3_omni: 59.2, qwen35_9b: 63.4, minicpm: 48.4, wemm2: 52.9, wemm4: 62.7, wemm9: 64.8 } },
            { id: "sv_mmsi", name: "MMSI-Video-Bench", scores: { gemini: 43.2, seed: 34.1, qwen35_omni: 29.5, qwen36_35b: 32.7, wemm35_inst: 31.1, wemm35_think: 35.6, qwen3_omni: 29.5, qwen35_9b: 31.2, minicpm: 27.3, wemm2: 26.3, wemm4: 32.0, wemm9: 32.4 } },
            { id: "sv_vsibench", name: "VSI-Bench", scores: { gemini: 53.3, seed: 49.4, qwen35_omni: 55.2, qwen36_35b: 56.1, wemm35_inst: 62.7, wemm35_think: 57.2, qwen3_omni: 55.7, qwen35_9b: 58.3, minicpm: 44.0, wemm2: 44.1, wemm4: 51.1, wemm9: 54.5 } }
          ]
        },
        {
          id: "sv_streaming",
          label: { en: "Streaming Video", zh: "流式视频理解" },
          benchmarks: [
            { id: "sv_ovobench", name: "OVO-Bench", scores: { gemini: 69.3, seed: 70.6, qwen35_omni: 55.7, qwen36_35b: 61.0, wemm35_inst: 63.1, wemm35_think: 63.9, qwen3_omni: 60.0, qwen35_9b: 60.8, minicpm: 56.4, wemm2: 57.2, wemm4: 61.6, wemm9: 63.3 } }
          ]
        },
        {
          id: "sv_multivideo",
          label: { en: "Multi-Video", zh: "多视频理解" },
          benchmarks: [
            { id: "sv_crossvid", name: "CrossVid", scores: { gemini: 53.2, seed: 49.9, qwen35_omni: 40.4, qwen36_35b: 45.2, wemm35_inst: 45.0, wemm35_think: 50.2, qwen3_omni: 32.4, qwen35_9b: 37.8, minicpm: 33.1, wemm2: 31.8, wemm4: 39.9, wemm9: 45.2 } }
          ]
        }
      ]
    },

    /* ======================================================================
       3. AUDIO EVALUATION (Table 5 · 18 Benchmarks)
       ====================================================================== */
    {
      id: "audio",
      count: 18,
      label: { en: "Audio", zh: "音频与语音" },
      title: { en: "Audio Evaluation", zh: "独立音频与语音评测" },
      summary: {
        en: "18 standalone audio benchmarks across 5 paper dimensions. WeMM-Video achieves open-source SOTA on general audio understanding (MMAU-Pro, MMAR, MMSU) and leads all baselines on voice interaction & spoken instruction following.",
        zh: "覆盖论文全部 5 大维度共 18 项独立音频基准。在通用音频理解（MMAU-Pro、MMAR、MMSU）达到开源领先，并在语音交互与口语指令跟随基准上全面领跑对比模型。"
      },
      hasScaleFilter: false,
      models: [
        { key: "qwen35_omni", name: "Qwen3.5-Omni-Flash", short: "Qwen3.5-Omni", group: "closed" },
        { key: "qwen3_omni", name: "Qwen3-Omni-30B-A3B-Instruct", short: "Qwen3-Omni-30B", group: "open" },
        { key: "minicpm", name: "MiniCPM-o 4.5-9B", short: "MiniCPM-o 4.5", group: "open" },
        { key: "wemm2", name: "WeMM-Video-2B (Instruct)", short: "WeMM-2B", group: "ours-sub" },
        { key: "wemm4", name: "WeMM-Video-4B (Instruct)", short: "WeMM-4B", group: "ours-sub" },
        { key: "wemm9", name: "WeMM-Video-9B (Instruct)", short: "WeMM-9B", group: "ours-sub" },
        { key: "wemm35", name: "WeMM-Video-35B-A3B (Instruct)", short: "WeMM-35B", group: "ours" }
      ],
      tableGroups: [
        {
          id: "all",
          label: { en: "Table 5 · Standalone Audio Benchmarks", zh: "表 5 · 独立音频评测全表" },
          modelKeys: ["qwen35_omni", "qwen3_omni", "minicpm", "wemm2", "wemm4", "wemm9", "wemm35"]
        }
      ],
      footnotes: {
        en: "Notes: GigaSpeech, VoxPopuli, and LibriSpeech (test-clean | test-other) report WER (lower is better ↓). WenetSpeech (net | meeting), MIR-1K, and Opencpop report CER (lower is better ↓). Audio MultiChallenge reports average pass rate.",
        zh: "注：GigaSpeech、VoxPopuli 与 LibriSpeech（test-clean | test-other）汇报 WER（越低越好 ↓）；WenetSpeech（net | meeting）、MIR-1K 与 Opencpop 汇报 CER（越低越好 ↓）；Audio MultiChallenge 汇报平均通过率。"
      },
      dimensions: [
        {
          id: "aud_general",
          label: { en: "General Audio Understanding", zh: "通用音频理解" },
          benchmarks: [
            { id: "aud_mmau", name: "MMAU", scores: { qwen35_omni: 80.4, qwen3_omni: 77.5, minicpm: 76.9, wemm2: 72.4, wemm4: 75.2, wemm9: 77.0, wemm35: 78.0 } },
            { id: "aud_mmaupro", name: "MMAU-Pro", scores: { qwen35_omni: 64.8, qwen3_omni: 60.2, minicpm: 62.7, wemm2: 62.9, wemm4: 68.1, wemm9: 70.9, wemm35: 70.6 } },
            { id: "aud_mmar", name: "MMAR", scores: { qwen35_omni: 74.0, qwen3_omni: 73.2, minicpm: 66.3, wemm2: 56.9, wemm4: 67.3, wemm9: 72.8, wemm35: 73.6 } },
            { id: "aud_mmsu", name: "MMSU", scores: { qwen35_omni: 72.2, qwen3_omni: 69.0, minicpm: 67.4, wemm2: 65.6, wemm4: 72.6, wemm9: 76.8, wemm35: 76.0 } },
            { id: "aud_dcase", name: "DCase 2025 AQA", scores: { qwen35_omni: 67.2, qwen3_omni: 62.6, minicpm: 65.9, wemm2: 58.6, wemm4: 64.9, wemm9: 66.7, wemm35: 67.2 } }
          ]
        },
        {
          id: "aud_music",
          label: { en: "Music Understanding", zh: "音乐理解" },
          benchmarks: [
            { id: "aud_mucho", name: "RUL-MuchoMusic", scores: { qwen35_omni: 60.5, qwen3_omni: 52.0, minicpm: 43.9, wemm2: 46.8, wemm4: 55.4, wemm9: 57.2, wemm35: 57.4 } },
            { id: "aud_hummus", name: "HumMusQA", scores: { qwen35_omni: 69.6, qwen3_omni: 65.9, minicpm: 56.6, wemm2: 55.9, wemm4: 66.6, wemm9: 65.3, wemm35: 70.0 } },
            { id: "aud_must", name: "MusTBench", scores: { qwen35_omni: 42.2, qwen3_omni: 32.4, minicpm: 24.0, wemm2: 33.9, wemm4: 41.8, wemm9: 42.0, wemm35: 46.6 } }
          ]
        },
        {
          id: "aud_asr",
          label: { en: "Speech Recognition (WER/CER ↓)", zh: "语音识别（越低越好 ↓）" },
          benchmarks: [
            { id: "aud_gigaspeech", name: "GigaSpeech", lowerIsBetter: true, metricNote: "WER (Lower is better ↓)", scores: { qwen35_omni: 9.2, qwen3_omni: 8.7, minicpm: 10.1, wemm2: 9.1, wemm4: 8.6, wemm9: 8.5, wemm35: 8.6 } },
            { id: "aud_voxpopuli", name: "VoxPopuli", lowerIsBetter: true, metricNote: "WER (Lower is better ↓)", scores: { qwen35_omni: 5.7, qwen3_omni: 6.4, minicpm: 8.5, wemm2: 6.7, wemm4: 5.7, wemm9: 5.6, wemm35: 5.7 } },
            { id: "aud_librispeech", name: "LibriSpeech (clean | other)", lowerIsBetter: true, multi: ["clean", "other"], metricNote: "WER (Lower is better ↓) · Bar: Avg of clean & other", scores: { qwen35_omni: [1.3, 2.4], qwen3_omni: [1.2, 2.5], minicpm: [1.4, 2.8], wemm2: [2.3, 4.7], wemm4: [1.7, 3.5], wemm9: [1.5, 3.1], wemm35: [1.6, 3.4] } },
            { id: "aud_wenetspeech", name: "WenetSpeech (net | meeting)", lowerIsBetter: true, multi: ["net", "meeting"], metricNote: "CER (Lower is better ↓) · Bar: Avg of net & meeting", scores: { qwen35_omni: [4.4, 5.5], qwen3_omni: [4.7, 5.9], minicpm: [5.9, 5.7], wemm2: [6.4, 7.7], wemm4: [5.8, 6.9], wemm9: [5.4, 6.8], wemm35: [5.7, 6.8] } }
          ]
        },
        {
          id: "aud_lyrics",
          label: { en: "Lyrics Recognition (CER ↓)", zh: "歌词识别（越低越好 ↓）" },
          benchmarks: [
            { id: "aud_mir1k", name: "MIR-1K (vocal)", lowerIsBetter: true, metricNote: "CER (Lower is better ↓)", scores: { qwen35_omni: 4.9, qwen3_omni: 5.9, minicpm: 25.9, wemm2: 9.7, wemm4: 8.3, wemm9: 8.1, wemm35: 7.9 } },
            { id: "aud_opencpop", name: "Opencpop", lowerIsBetter: true, metricNote: "CER (Lower is better ↓)", scores: { qwen35_omni: 1.1, qwen3_omni: 1.5, minicpm: 23.0, wemm2: 3.1, wemm4: 2.6, wemm9: 2.8, wemm35: 2.4 } }
          ]
        },
        {
          id: "aud_voice",
          label: { en: "Voice Interaction", zh: "语音交互与口语指令" },
          benchmarks: [
            { id: "aud_voicebench", name: "VoiceBench", scores: { qwen35_omni: 87.8, qwen3_omni: 85.5, minicpm: 68.3, wemm2: 66.5, wemm4: 83.0, wemm9: 89.0, wemm35: 88.4 } },
            { id: "aud_ifevalaudio", name: "IFEval-Audio", scores: { qwen35_omni: 58.2, qwen3_omni: 57.9, minicpm: 52.1, wemm2: 44.3, wemm4: 56.1, wemm9: 59.6, wemm35: 63.6 } },
            { id: "aud_speechifeval", name: "Speech-IFEval", scores: { qwen35_omni: 88.2, qwen3_omni: 77.6, minicpm: 64.8, wemm2: 94.1, wemm4: 91.7, wemm9: 95.7, wemm35: 96.5 } },
            { id: "aud_audiomc", name: "Audio MultiChallenge", scores: { qwen35_omni: 58.2, qwen3_omni: 52.2, minicpm: 45.4, wemm2: 37.7, wemm4: 54.9, wemm9: 59.2, wemm35: 62.0 } }
          ]
        }
      ]
    },

    /* ======================================================================
       4. IMAGE EVALUATION (Table 6 · 28 Benchmarks)
       ====================================================================== */
    {
      id: "image",
      count: 28,
      label: { en: "Image", zh: "图像理解" },
      title: { en: "Image Evaluation", zh: "静态图像理解评测" },
      summary: {
        en: "28 image benchmarks across 7 dimensions. WeMM-Video-35B-A3B and 9B comprehensively outperform Qwen3.5-Omni-Flash while preserving (and often improving upon) their Qwen3.6-35B-A3B and Qwen3.5-9B backbones.",
        zh: "覆盖论文全部 7 大维度共 28 项静态图像基准。WeMM-Video-35B-A3B 与 9B 全面超越 Qwen3.5-Omni-Flash，完整保留并在多项榜单超越 Qwen3.6-35B-A3B 与 Qwen3.5-9B 视觉底座能力。"
      },
      hasScaleFilter: false,
      models: [
        { key: "qwen35_omni", name: "Qwen3.5-Omni-Flash", short: "Qwen3.5-Omni", group: "closed" },
        { key: "qwen36_35b", name: "Qwen3.6-35B-A3B", short: "Qwen3.6-35B", group: "open" },
        { key: "qwen35_9b", name: "Qwen3.5-9B", short: "Qwen3.5-9B", group: "open" },
        { key: "wemm2", name: "WeMM-Video-2B (Thinking)", short: "WeMM-2B", group: "ours-sub" },
        { key: "wemm4", name: "WeMM-Video-4B (Thinking)", short: "WeMM-4B", group: "ours-sub" },
        { key: "wemm9", name: "WeMM-Video-9B (Thinking)", short: "WeMM-9B", group: "ours-sub" },
        { key: "wemm35", name: "WeMM-Video-35B-A3B (Thinking)", short: "WeMM-35B", group: "ours" }
      ],
      tableGroups: [
        {
          id: "all",
          label: { en: "Table 6 · Static Image Understanding Benchmarks", zh: "表 6 · 静态图像评测全表" },
          modelKeys: ["qwen35_omni", "qwen36_35b", "qwen35_9b", "wemm2", "wemm4", "wemm9", "wemm35"]
        }
      ],
      footnotes: {
        en: "",
        zh: ""
      },
      dimensions: [
        {
          id: "img_stem",
          label: { en: "STEM / Puzzle", zh: "STEM 与逻辑推理" },
          benchmarks: [
            { id: "img_mmmu", name: "MMMU", scores: { qwen35_omni: 76.9, qwen36_35b: 81.7, qwen35_9b: 78.4, wemm2: 61.2, wemm4: 78.4, wemm9: 78.9, wemm35: 81.1 } },
            { id: "img_mmmupro", name: "MMMU-Pro", scores: { qwen35_omni: 68.2, qwen36_35b: 75.3, qwen35_9b: 70.1, wemm2: 49.4, wemm4: 64.7, wemm9: 69.4, wemm35: 72.9 } },
            { id: "img_mathvision", name: "MathVision", scores: { qwen35_omni: 65.4, qwen36_35b: 80.4, qwen35_9b: 78.9, wemm2: 49.2, wemm4: 73.3, wemm9: 76.0, wemm35: 79.6 } },
            { id: "img_mathvista", name: "MathVista (mini)", scores: { qwen35_omni: 82.9, qwen36_35b: 86.4, qwen35_9b: 85.7, wemm2: 78.8, wemm4: 85.2, wemm9: 86.1, wemm35: 86.6 } },
            { id: "img_dynamath", name: "DynaMath", scores: { qwen35_omni: 79.3, qwen36_35b: 82.8, qwen35_9b: 83.6, wemm2: 73.4, wemm4: 81.8, wemm9: 82.2, wemm35: 81.5 } },
            { id: "img_zerobench", name: "ZEROBench", scores: { qwen35_omni: 1.0, qwen36_35b: 5.6, qwen35_9b: 3.0, wemm2: 0.4, wemm4: 0.8, wemm9: 2.0, wemm35: 3.8 } },
            { id: "img_zerobench_sub", name: "ZEROBench_sub", scores: { qwen35_omni: 26.0, qwen36_35b: 34.4, qwen35_9b: 31.1, wemm2: 21.0, wemm4: 25.8, wemm9: 30.5, wemm35: 34.1 } },
            { id: "img_visualpuzzles", name: "VisualPuzzles", scores: { qwen35_omni: 44.9, qwen36_35b: 58.1, qwen35_9b: 55.1, wemm2: 39.6, wemm4: 53.4, wemm9: 56.8, wemm35: 60.1 } }
          ]
        },
        {
          id: "img_vqa",
          label: { en: "General VQA", zh: "通用视觉问答" },
          benchmarks: [
            { id: "img_realworldqa", name: "RealWorldQA", scores: { qwen35_omni: 77.5, qwen36_35b: 85.3, qwen35_9b: 80.3, wemm2: 73.6, wemm4: 80.1, wemm9: 80.3, wemm35: 83.4 } },
            { id: "img_mmstar", name: "MMStar", scores: { qwen35_omni: 75.7, qwen36_35b: 80.7, qwen35_9b: 79.7, wemm2: 71.8, wemm4: 76.4, wemm9: 77.9, wemm35: 79.8 } },
            { id: "img_mmbench_en", name: "MMBench_EN-DEV-v1.1", scores: { qwen35_omni: 88.8, qwen36_35b: 92.8, qwen35_9b: 90.1, wemm2: 83.1, wemm4: 88.9, wemm9: 89.9, wemm35: 90.9 } },
            { id: "img_mmbench_cn", name: "MMBench_CN-DEV-v1.1", scores: { qwen35_omni: 81.7, qwen36_35b: 88.9, qwen35_9b: 86.7, wemm2: 80.1, wemm4: 88.2, wemm9: 88.9, wemm35: 89.2 } },
            { id: "img_simplevqa", name: "SimpleVQA", scores: { qwen35_omni: 54.4, qwen36_35b: 58.9, qwen35_9b: 51.2, wemm2: 45.9, wemm4: 51.9, wemm9: 55.4, wemm35: 62.0 } },
            { id: "img_worldvqa", name: "WorldVQA", scores: { qwen35_omni: 13.6, qwen36_35b: 19.9, qwen35_9b: 15.7, wemm2: 14.1, wemm4: 20.3, wemm9: 23.6, wemm35: 28.6 } }
          ]
        },
        {
          id: "img_doc",
          label: { en: "Text / Doc", zh: "文字与文档理解" },
          benchmarks: [
            { id: "img_charxiv", name: "CharXiv RQ", scores: { qwen35_omni: 64.4, qwen36_35b: 78.0, qwen35_9b: 73.0, wemm2: 62.0, wemm4: 70.3, wemm9: 73.6, wemm35: 75.7 } },
            { id: "img_ccocr", name: "CC-OCR", scores: { qwen35_omni: 80.8, qwen36_35b: 81.9, qwen35_9b: 79.3, wemm2: 79.8, wemm4: 82.9, wemm9: 84.7, wemm35: 84.2 } },
            { id: "img_ai2d", name: "AI2D_TEST", scores: { qwen35_omni: 89.0, qwen36_35b: 92.7, qwen35_9b: 90.2, wemm2: 83.2, wemm4: 88.4, wemm9: 89.6, wemm35: 90.6 } },
            { id: "img_mmlongdoc", name: "MMLongBench-Doc", scores: { qwen35_omni: 53.6, qwen36_35b: 61.2, qwen35_9b: 57.7, wemm2: 42.8, wemm4: 55.5, wemm9: 56.1, wemm35: 60.2 } },
            { id: "img_ocrbench", name: "OCRBench", scores: { qwen35_omni: 89.1, qwen36_35b: 87.9, qwen35_9b: 89.2, wemm2: 81.8, wemm4: 85.7, wemm9: 89.6, wemm35: 90.2 } },
            { id: "img_docvqa", name: "DocVQA", scores: { qwen35_omni: 95.3, qwen36_35b: 97.3, qwen35_9b: 97.2, wemm2: 95.1, wemm4: 96.5, wemm9: 97.5, wemm35: 97.5 } }
          ]
        },
        {
          id: "img_spatial",
          label: { en: "Spatial", zh: "空间理解" },
          benchmarks: [
            { id: "img_erqa", name: "ERQA", scores: { qwen35_omni: 50.0, qwen36_35b: 59.8, qwen35_9b: 55.5, wemm2: 43.8, wemm4: 53.0, wemm9: 54.5, wemm35: 61.8 } },
            { id: "img_refcoco", name: "RefCOCO (avg)", scores: { qwen35_omni: 92.6, qwen36_35b: 92.0, qwen35_9b: 89.7, wemm2: 63.7, wemm4: 86.3, wemm9: 89.0, wemm35: 89.5 } },
            { id: "img_embspatial", name: "EmbSpatialBench", scores: { qwen35_omni: 82.7, qwen36_35b: 84.3, qwen35_9b: 83.0, wemm2: 79.0, wemm4: 83.3, wemm9: 82.8, wemm35: 83.9 } },
            { id: "img_cvbench", name: "CV-Bench", scores: { qwen35_omni: 86.6, qwen36_35b: 87.8, qwen35_9b: 87.2, wemm2: 84.2, wemm4: 88.6, wemm9: 88.6, wemm35: 89.2 } }
          ]
        },
        {
          id: "img_multi",
          label: { en: "Multi-Image", zh: "多图理解" },
          benchmarks: [
            { id: "img_mihbench", name: "MIHBench", scores: { qwen35_omni: 61.8, qwen36_35b: 81.3, qwen35_9b: 81.8, wemm2: 80.8, wemm4: 81.5, wemm9: 82.9, wemm35: 83.1 } }
          ]
        },
        {
          id: "img_counting",
          label: { en: "Counting", zh: "目标计数" },
          benchmarks: [
            { id: "img_countbench", name: "CountBench", scores: { qwen35_omni: 88.2, qwen36_35b: 96.3, qwen35_9b: 97.2, wemm2: 83.9, wemm4: 93.3, wemm9: 94.3, wemm35: 96.3 } },
            { id: "img_tallyqa", name: "TallyQA", scores: { qwen35_omni: 81.2, qwen36_35b: 79.8, qwen35_9b: 79.8, wemm2: 78.8, wemm4: 80.4, wemm9: 81.5, wemm35: 80.7 } }
          ]
        },
        {
          id: "img_if",
          label: { en: "Instruction-Following", zh: "指令跟随" },
          benchmarks: [
            { id: "img_mmifeval", name: "MMIFEval", scores: { qwen35_omni: 67.0, qwen36_35b: 81.1, qwen35_9b: 79.5, wemm2: 58.8, wemm4: 74.6, wemm9: 80.8, wemm35: 81.4 } }
          ]
        }
      ]
    },

    /* ======================================================================
       5. TEXT EVALUATION (Table 7 · 12 Benchmarks)
       ====================================================================== */
    {
      id: "text",
      count: 12,
      label: { en: "Text", zh: "纯文本能力" },
      title: { en: "Text Evaluation", zh: "纯文本基础能力评测" },
      summary: {
        en: "12 pure text benchmarks across 5 paper dimensions. Omni-modal training preserves base language intelligence and further improves instruction following (IFEval, IFBench, CFBench) and long-context reasoning.",
        zh: "覆盖论文全部 5 大维度共 12 项纯文本基准。全模态训练无损保留语言底座能力，并在指令跟随（IFEval、IFBench、CFBench）与长文本推理上实现进一步提升。"
      },
      hasScaleFilter: false,
      models: [
        { key: "qwen35_omni", name: "Qwen3.5-Omni-Flash", short: "Qwen3.5-Omni", group: "closed" },
        { key: "qwen36_35b", name: "Qwen3.6-35B-A3B", short: "Qwen3.6-35B", group: "open" },
        { key: "qwen35_9b", name: "Qwen3.5-9B", short: "Qwen3.5-9B", group: "open" },
        { key: "wemm2", name: "WeMM-Video-2B (Thinking)", short: "WeMM-2B", group: "ours-sub" },
        { key: "wemm4", name: "WeMM-Video-4B (Thinking)", short: "WeMM-4B", group: "ours-sub" },
        { key: "wemm9", name: "WeMM-Video-9B (Thinking)", short: "WeMM-9B", group: "ours-sub" },
        { key: "wemm35", name: "WeMM-Video-35B-A3B (Thinking)", short: "WeMM-35B", group: "ours" }
      ],
      tableGroups: [
        {
          id: "all",
          label: { en: "Table 7 · Pure Text Benchmarks", zh: "表 7 · 纯文本评测全表" },
          modelKeys: ["qwen35_omni", "qwen36_35b", "qwen35_9b", "wemm2", "wemm4", "wemm9", "wemm35"]
        }
      ],
      footnotes: {
        en: "",
        zh: ""
      },
      dimensions: [
        {
          id: "txt_knowledge",
          label: { en: "Knowledge", zh: "通用知识" },
          benchmarks: [
            { id: "txt_mmlupro", name: "MMLU-Pro", scores: { qwen35_omni: 79.9, qwen36_35b: 85.2, qwen35_9b: 82.5, wemm2: 63.7, wemm4: 78.3, wemm9: 81.6, wemm35: 84.7 } },
            { id: "txt_mmluredux", name: "MMLU-Redux", scores: { qwen35_omni: 90.0, qwen36_35b: 93.3, qwen35_9b: 91.1, wemm2: 75.7, wemm4: 88.7, wemm9: 90.5, wemm35: 93.7 } },
            { id: "txt_supergpqa", name: "SuperGPQA", scores: { qwen35_omni: 54.9, qwen36_35b: 64.7, qwen35_9b: 58.2, wemm2: 36.3, wemm4: 52.4, wemm9: 56.7, wemm35: 63.4 } },
            { id: "txt_ceval", name: "C-Eval", scores: { qwen35_omni: 86.0, qwen36_35b: 90.0, qwen35_9b: 88.2, wemm2: 72.0, wemm4: 84.8, wemm9: 87.6, wemm35: 90.4 } }
          ]
        },
        {
          id: "txt_if",
          label: { en: "Instruction-Following", zh: "指令跟随" },
          benchmarks: [
            { id: "txt_ifeval", name: "IFEval", scores: { qwen35_omni: 85.2, qwen36_35b: 90.9, qwen35_9b: 91.5, wemm2: 84.3, wemm4: 91.3, wemm9: 93.2, wemm35: 93.2 } },
            { id: "txt_ifbench", name: "IFBench", scores: { qwen35_omni: 38.4, qwen36_35b: 63.7, qwen35_9b: 64.5, wemm2: 45.3, wemm4: 63.7, wemm9: 70.7, wemm35: 70.7 } },
            { id: "txt_cfbench", name: "CFBench", scores: { qwen35_omni: 83.4, qwen36_35b: 87.3, qwen35_9b: 85.3, wemm2: 77.6, wemm4: 86.0, wemm9: 86.9, wemm35: 87.7 } }
          ]
        },
        {
          id: "txt_long",
          label: { en: "Long Context", zh: "长文本理解" },
          benchmarks: [
            { id: "txt_aalcr", name: "AA-LCR", scores: { qwen35_omni: 46.0, qwen36_35b: 60.0, qwen35_9b: 63.0, wemm2: 14.0, wemm4: 56.0, wemm9: 59.0, wemm35: 64.0 } },
            { id: "txt_longbench2", name: "LongBench v2", scores: { qwen35_omni: 46.4, qwen36_35b: 59.6, qwen35_9b: 55.2, wemm2: 33.8, wemm4: 53.5, wemm9: 54.7, wemm35: 58.1 } }
          ]
        },
        {
          id: "txt_stem",
          label: { en: "STEM", zh: "科学问答" },
          benchmarks: [
            { id: "txt_gpqa", name: "GPQA", scores: { qwen35_omni: 76.4, qwen36_35b: 86.0, qwen35_9b: 81.7, wemm2: 56.1, wemm4: 73.2, wemm9: 77.8, wemm35: 83.8 } }
          ]
        },
        {
          id: "txt_reasoning",
          label: { en: "Reasoning", zh: "数学与推理" },
          benchmarks: [
            { id: "txt_hmmt", name: "HMMT Nov 25", scores: { qwen35_omni: 59.0, qwen36_35b: 89.1, qwen35_9b: 82.9, wemm2: 26.7, wemm4: 75.8, wemm9: 75.0, wemm35: 90.0 } },
            { id: "txt_imo", name: "IMOAnswerBench", scores: { qwen35_omni: 51.5, qwen36_35b: 78.9, qwen35_9b: 67.8, wemm2: 22.5, wemm4: 58.8, wemm9: 62.8, wemm35: 74.8 } }
          ]
        }
      ]
    }
  ]
};
