<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="番茄钟">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="p-6 flex flex-col items-center space-y-6">
        <!-- 模式切换 -->
        <div class="flex gap-2">
          <UButton label="🍅 专注 25min" :variant="mode === 'focus' ? 'solid' : 'outline'" @click="setMode('focus')" :disabled="running" />
          <UButton label="☕ 休息 5min" :variant="mode === 'break' ? 'solid' : 'outline'" @click="setMode('break')" :disabled="running" />
        </div>

        <!-- 计时器圆环 -->
        <div class="relative">
          <svg width="240" height="240" viewBox="0 0 240 240" class="-rotate-90">
            <circle cx="120" cy="120" r="108" fill="none" stroke="var(--ui-border)" stroke-width="8" />
            <circle cx="120" cy="120" r="108" fill="none"
              :stroke="mode === 'focus' ? 'var(--ui-error)' : 'var(--ui-success)'"
              stroke-width="8" stroke-linecap="round"
              :stroke-dasharray="2 * Math.PI * 108"
              :stroke-dashoffset="2 * Math.PI * 108 * (1 - progress)" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-5xl font-bold font-mono">{{ display }}</span>
            <span class="text-sm text-(--ui-text-muted) mt-1">{{ mode === 'focus' ? '专注中' : '休息中' }}</span>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="flex gap-3">
          <UButton :icon="running ? 'i-lucide-pause' : 'i-lucide-play'" :label="running ? '暂停' : '开始'" @click="toggle" size="lg" />
          <UButton icon="i-lucide-rotate-ccw" variant="outline" @click="reset" :disabled="running" />
        </div>

        <!-- 科目选择 -->
        <USelect v-if="mode === 'focus'" v-model="subject" :items="subjectOpts" placeholder="选择科目" class="w-40" />

        <!-- 今日统计 -->
        <UCard class="w-full max-w-xs">
          <div class="flex justify-around text-center">
            <div>
              <div class="text-xl font-bold text-(--ui-primary)">{{ todayCount }}</div>
              <div class="text-xs text-(--ui-text-muted)">番茄数</div>
            </div>
            <div>
              <div class="text-xl font-bold text-(--ui-success)">{{ todayMinutes }}</div>
              <div class="text-xs text-(--ui-text-muted)">分钟</div>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const toast = useToast()
const { fetchTodaySessions, saveSession } = useDatabase()

const mode = ref<'focus' | 'break'>('focus')
const running = ref(false)
const seconds = ref(25 * 60)
const totalSeconds = ref(25 * 60)
const subject = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const subjectOpts = [
  { label: '无科目', value: '' },
  { label: '会计', value: '会计' },
  { label: '税法', value: '税法' },
  { label: '经济法', value: '经济法' },
]

const todayCount = ref(0)
const todayMinutes = ref(0)

const display = computed(() => {
  const m = Math.floor(seconds.value / 60)
  const s = seconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const progress = computed(() => 1 - (seconds.value / totalSeconds.value))

const setMode = (m: 'focus' | 'break') => {
  mode.value = m
  seconds.value = m === 'focus' ? 25 * 60 : 5 * 60
  totalSeconds.value = seconds.value
}

const toggle = () => {
  if (running.value) {
    clearInterval(timer!)
    running.value = false
  } else {
    running.value = true
    timer = setInterval(async () => {
      if (seconds.value <= 1) {
        clearInterval(timer!)
        running.value = false
        if (mode.value === 'focus') {
          const today = new Date().toISOString().slice(0, 10)
          await saveSession({ session_date: today, subject: subject.value || null, duration_minutes: totalSeconds.value / 60, pomodoro_count: 1 })
          await loadToday()
          toast.add({ title: '🍅 番茄钟完成！', color: 'success' })
        }
        setMode(mode.value === 'focus' ? 'break' : 'focus')
      } else {
        seconds.value--
      }
    }, 1000)
  }
}

const reset = () => { setMode(mode.value) }

const loadToday = async () => {
  const sessions = await fetchTodaySessions()
  todayCount.value = sessions.reduce((s: number, r: any) => s + (r.pomodoro_count || 0), 0)
  todayMinutes.value = sessions.reduce((s: number, r: any) => s + (r.duration_minutes || 0), 0)
}

onMounted(() => loadToday())
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>
