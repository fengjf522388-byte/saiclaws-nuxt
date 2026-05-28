// nuxt.config.ts — Nuxt 3 配置中心
export default defineNuxtConfig({
  compatibilityDate: '2025-05-28',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@nuxt/content'   // Markdown 内容管理
  ],

  css: ['~/assets/css/main.css'],

  // Nuxt Content 配置
  content: {
    highlight: {
      theme: 'github-dark'
    }
  },

  supabase: {
    url: 'https://lwoqjahqneosnummjlbo.supabase.co',
    key: 'sb_pub…riaf',
    redirect: false
  },

  colorMode: {
    preference: 'dark'
  }
})
