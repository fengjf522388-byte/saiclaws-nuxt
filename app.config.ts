// app.config.ts — Nuxt UI 主题定制
// 参考: https://ui.nuxt.com/getting-started/theme
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',       // 蓝色主色调 — CTA、链接、强调
      secondary: 'amber',    // 金色辅助 — 二级操作、亮点
      neutral: 'slate'       // 深灰中性 — 背景、文字、边框
    }
  }
})
