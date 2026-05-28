// nuxt.config.ts — Nuxt 3 配置中心
export default defineNuxtConfig({
  compatibilityDate: '2025-05-28',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase'
  ],

  // 引入 Nuxt UI 的 Tailwind 样式
  css: ['~/assets/css/main.css'],

  // Supabase 配置
  supabase: {
    url: 'https://lwoqjahqneosnummjlbo.supabase.co',
    key: 'sb_pub…riaf',
    redirect: false
  },

  // 暗色模式
  colorMode: {
    preference: 'dark'
  }
})
