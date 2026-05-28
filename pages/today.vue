<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="今日">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="p-6 space-y-6">
        <!-- 问候 + 打卡 -->
        <div>
          <h1 class="text-2xl font-bold">{{ greeting }}，飞哥 👋</h1>
          <p class="text-(--ui-text-muted) text-sm mt-1">
            {{ todayStr }} · 已连续 <span class="text-(--ui-primary) font-bold">{{ streak }}</span> 天学习 🔥
          </p>
        </div>

        <!-- 三大指标 -->
        <div class="grid grid-cols-3 gap-4">
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-(--ui-primary)">{{ srsDue }}</div>
              <div class="text-xs text-(--ui-text-muted) mt-1">待复习闪卡</div>
            </div>
          </UCard>
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-(--ui-success)">{{ pomoCount }}</div>
              <div class="text-xs text-(--ui-text-muted) mt-1">今日番茄 🍅</div>
            </div>
          </UCard>
          <UCard>
            <div class="text-center">
              <div class="text-3xl font-bold text-(--ui-secondary)">{{ studyMinutes }}</div>
              <div class="text-xs text-(--ui-text-muted) mt-1">今日学习(分钟)</div>
            </div>
          </UCard>
        </div>

        <!-- 学习目标进度 -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between w-full">
              <h2 class="text-sm font-semibold text-(--ui-text-muted) uppercase tracking-wider">🎯 今日学习目标</h2>
              <div class="flex items-center gap-2">
                <span class="text-xs text-(--ui-text-muted)">{{ studyMinutes }}/{{ dailyGoal }} 分钟</span>
                <UPopover>
                  <UButton icon="i-lucide-settings" variant="ghost" size="xs" />
                  <template #content>
                    <div class="p-3 space-y-2">
                      <p class="text-xs text-(--ui-text-muted)">每日目标（分钟）</p>
                      <div class="flex gap-2">
                        <UInput v-model.number="goalInput" type="number" size="xs" class="w-20" />
                        <UButton label="保存" size="xs" @click="saveGoal" />
                      </div>
                    </div>
                  </template>
                </UPopover>
              </div>
            </div>
          </template>
          <UProgress :value="Math.min(100, studyMinutes / dailyGoal * 100)" color="primary" size="lg" />
        </UCard>

        <!-- 闪卡复习队列 + 今日备忘 -->
        <div class="grid lg:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between w-full">
                <h2 class="text-sm font-semibold text-(--ui-text-muted) uppercase tracking-wider">📇 待复习闪卡</h2>
                <NuxtLink to="/flashcards" class="text-xs text-(--ui-primary)">去复习 →</NuxtLink>
              </div>
            </template>
            <p v-if="!dueCards.length" class="text-(--ui-text-muted) text-sm py-4 text-center">🎉 全部搞定！</p>
            <div v-for="fc in dueCards.slice(0, 5)" :key="fc.id" class="flex items-center gap-2 py-2 border-b border-(--ui-border) last:border-0">
              <span class="text-sm flex-1 truncate">{{ fc.question }}</span>
              <UBadge v-if="fc.subject" size="xs" variant="soft">{{ fc.subject }}</UBadge>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center justify-between w-full">
                <h2 class="text-sm font-semibold text-(--ui-text-muted) uppercase tracking-wider">📋 今日备忘</h2>
                <UButton icon="i-lucide-plus" variant="ghost" size="xs" @click="quickAddMemo" />
              </div>
            </template>
            <p v-if="!memos.length" class="text-(--ui-text-muted) text-sm py-4 text-center">暂无备忘</p>
            <div v-for="m in memos" :key="m.id" class="flex items-center gap-2 py-2 border-b border-(--ui-border) last:border-0">
              <UCheckbox :model-value="m.is_done" size="sm" @change="toggleMemoItem(m)" />
              <span class="text-sm flex-1" :class="{ 'line-through text-(--ui-text-muted)': m.is_done }">{{ m.content }}</span>
            </div>
          </UCard>
        </div>

        <!-- 快捷操作 -->
        <div class="flex gap-3">
          <UButton icon="i-lucide-play" label="开始复习闪卡" @click="navigateTo('/flashcards')" />
          <UButton icon="i-lucide-timer" label="开始番茄钟" variant="outline" @click="navigateTo('/pomodoro')" />
          <UButton icon="i-lucide-book-open" label="写学习日记" variant="outline" @click="navigateTo('/diary')" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const toast = useToast()
const { fetchTodayMemos, fetchDueFlashcards, fetchTodaySessions, fetchStreak, toggleMemo, saveMemo } = useDatabase()

const memos = ref<any[]>([])
const dueCards = ref<any[]>([])
const pomoCount = ref(0)
const studyMinutes = ref(0)
const srsDue = ref(0)
const streak = ref(0)
const dailyGoal = ref(120)
const goalInput = ref(120)

const todayStr = computed(() => { const d = new Date(); return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日` })
const greeting = computed(() => { const h = new Date().getHours(); if (h < 6) return '夜深了'; if (h < 12) return '早上好'; if (h < 18) return '下午好'; return '晚上好' })

const saveGoal = () => { dailyGoal.value = goalInput.value; localStorage.setItem('saiclaws_daily_goal', String(goalInput.value)); toast.add({ title: '目标已保存', color: 'success' }) }
const quickAddMemo = () => navigateTo('/memos')
const toggleMemoItem = async (m: any) => { await toggleMemo(m.id, m.is_done); m.is_done = !m.is_done }

onMounted(async () => {
  dailyGoal.value = parseInt(localStorage.getItem('saiclaws_daily_goal') || '120')
  goalInput.value = dailyGoal.value
  try {
    memos.value = await fetchTodayMemos()
    dueCards.value = await fetchDueFlashcards()
    srsDue.value = dueCards.value.length
    const sessions = await fetchTodaySessions()
    pomoCount.value = sessions.reduce((s: number, r: any) => s + (r.pomodoro_count || 0), 0)
    studyMinutes.value = sessions.reduce((s: number, r: any) => s + (r.duration_minutes || 0), 0)
    streak.value = await fetchStreak()
  } catch (e: any) { console.error(e) }
})
</script>
