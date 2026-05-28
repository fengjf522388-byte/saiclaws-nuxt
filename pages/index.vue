<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="工作台">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton icon="i-lucide-refresh-cw" variant="ghost" @click="refresh" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6 p-6">
        <!-- 问候 -->
        <div>
          <h1 class="text-2xl font-bold">{{ greeting }}，飞哥 👋</h1>
          <p class="text-(--ui-text-muted) text-sm mt-1">
            {{ todayStr }} · 已连续学习 <span class="text-(--ui-primary) font-bold">{{ streak }}</span> 天 🔥
          </p>
        </div>

        <!-- 统计卡片 — 来自 /api/stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UCard v-for="card in statCards" :key="card.label">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg" :class="card.bgClass">
                {{ card.icon }}
              </div>
              <div>
                <div class="text-2xl font-bold">{{ card.value }}</div>
                <div class="text-(--ui-text-muted) text-xs">{{ card.label }}</div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- 科目进度 -->
        <UCard>
          <template #header>
            <h2 class="text-sm font-semibold text-(--ui-text-muted) uppercase tracking-wider">📈 科目进度</h2>
          </template>
          <div class="space-y-3">
            <div v-for="s in subjects" :key="s.name">
              <div class="flex justify-between text-sm mb-1">
                <span>{{ s.name }}</span>
                <span class="text-(--ui-text-muted)">{{ s.chapters }}/{{ s.total }} 章 · {{ s.mastery }}%</span>
              </div>
              <UProgress :value="s.pct" :color="s.uicolor" size="sm" />
            </div>
          </div>
        </UCard>

        <!-- 双栏 -->
        <div class="grid lg:grid-cols-2 gap-6">
          <!-- 备忘录 — 来自 /api/memos -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between w-full">
                <h2 class="text-sm font-semibold text-(--ui-text-muted) uppercase tracking-wider">📋 今日备忘录</h2>
                <NuxtLink to="/memos" class="text-xs text-(--ui-primary)">全部 →</NuxtLink>
              </div>
            </template>
            <p v-if="!memos?.length" class="text-(--ui-text-muted) text-sm py-4 text-center">暂无备忘录</p>
            <div v-for="m in memos?.slice(0, 5)" :key="m.id" class="flex items-center gap-3 py-2 border-b border-(--ui-border) last:border-0">
              <UCheckbox :model-value="m.is_done" size="sm" />
              <span class="text-sm flex-1" :class="{ 'line-through text-(--ui-text-muted)': m.is_done }">{{ m.content }}</span>
              <span v-if="m.priority" class="text-[10px] px-1.5 py-0.5 rounded-full"
                :class="m.priority === 'high' ? 'bg-(--ui-error)/10 text-(--ui-error)' : m.priority === 'medium' ? 'bg-(--ui-warning)/10 text-(--ui-warning)' : 'bg-(--ui-border) text-(--ui-text-muted)'">
                {{ m.priority === 'high' ? '高' : m.priority === 'medium' ? '中' : '低' }}
              </span>
            </div>
          </UCard>

          <!-- 日记 — 来自 /api/diary -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between w-full">
                <h2 class="text-sm font-semibold text-(--ui-text-muted) uppercase tracking-wider">📝 最近日记</h2>
                <NuxtLink to="/diary" class="text-xs text-(--ui-primary)">全部 →</NuxtLink>
              </div>
            </template>
            <p v-if="!diaries?.length" class="text-(--ui-text-muted) text-sm py-4 text-center">还没有学习日记</p>
            <div v-for="d in diaries?.slice(0, 5)" :key="d.id" class="flex items-start gap-3 py-2 border-b border-(--ui-border) last:border-0">
              <span class="text-xs text-(--ui-text-muted) w-16 flex-shrink-0">{{ d.entry_date?.slice(5) }}</span>
              <span class="text-sm">{{ d.chapter_name || '未分类' }}</span>
              <span v-if="d.mastery_score" class="text-xs px-1.5 py-0.5 rounded font-bold"
                :class="d.mastery_score >= 80 ? 'bg-(--ui-success)/10 text-(--ui-success)' : d.mastery_score >= 60 ? 'bg-(--ui-warning)/10 text-(--ui-warning)' : 'bg-(--ui-error)/10 text-(--ui-error)'">
                {{ d.mastery_score }}%
              </span>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

// ======== Nuxt 3 最佳实践：useAsyncData — SSR 友好的数据获取 ========

// 统计数据 — 调用服务端 API
const { data: statsData, refresh } = await useAsyncData('dashboard-stats', () =>
  $fetch('/api/stats')
)

// 备忘录
const { data: memos } = await useAsyncData('today-memos', () =>
  $fetch('/api/memos')
)

// 日记
const { data: diaries } = await useAsyncData('recent-diary', () =>
  $fetch('/api/diary')
)

// 打卡天数 — useState 跨组件共享
const streak = useState('streak', () => 0)

// ======== 计算属性 ========
const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 12) return '早上好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const stats = computed(() => statsData.value || { knowledge: 0, diary: 0, todayMemos: 0, srsDue: 0, pomoToday: 0 })

const statCards = computed(() => [
  { icon: '📚', label: '知识库条目', value: stats.value.knowledge, bgClass: 'bg-(--ui-primary)/10' },
  { icon: '📝', label: '学习日记', value: stats.value.diary, bgClass: 'bg-(--ui-secondary)/10' },
  { icon: '📇', label: '待复习闪卡', value: stats.value.srsDue, bgClass: 'bg-(--ui-success)/10' },
  { icon: '🍅', label: '今日番茄', value: stats.value.pomoToday, bgClass: 'bg-(--ui-warning)/10' },
])

const subjects = [
  { name: '会计', chapters: 0, total: 30, pct: 0, mastery: 0, uicolor: 'primary' as const },
  { name: '税法', chapters: 0, total: 14, pct: 0, mastery: 0, uicolor: 'secondary' as const },
  { name: '经济法', chapters: 0, total: 12, pct: 0, mastery: 0, uicolor: 'success' as const },
]
</script>
