<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="闪卡复习">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="新建" variant="outline" @click="showAddModal = true" class="mr-2" />
          <UButton icon="i-lucide-play" label="开始复习" @click="startReview" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6 space-y-6">
        <!-- 统计 -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UCard v-for="s in flashStats" :key="s.label">
            <div class="text-center">
              <div class="text-2xl font-bold" :class="s.color">{{ s.value }}</div>
              <div class="text-xs text-(--ui-text-muted) mt-1">{{ s.label }}</div>
            </div>
          </UCard>
        </div>

        <!-- 复习模式 vs 列表模式 -->
        <template v-if="reviewing">
          <!-- ======== 复习模式 ======== -->
          <UCard>
            <div class="text-center space-y-6">
              <div class="text-sm text-(--ui-text-muted)">
                第 {{ reviewIndex + 1 }} / {{ reviewQueue.length }} 张
              </div>

              <div class="flashcard cursor-pointer max-w-lg mx-auto" :class="{ flipped }" @click="flipped = !flipped">
                <div class="flashcard-inner">
                  <div class="flashcard-front">
                    <p class="text-lg font-semibold">{{ currentCard?.question }}</p>
                    <span class="text-xs text-(--ui-text-muted) mt-4">点击翻转查看答案</span>
                  </div>
                  <div class="flashcard-back">
                    <p class="text-base">{{ currentCard?.answer }}</p>
                  </div>
                </div>
              </div>

              <!-- 评分按钮 -->
              <div v-if="flipped" class="space-y-3">
                <p class="text-sm text-(--ui-text-muted)">你记得怎么样？</p>
                <div class="flex gap-2 justify-center flex-wrap">
                  <UButton v-for="q in qualities" :key="q.value"
                    :label="q.label"
                    :color="q.color as any"
                    :variant="q.value === 3 ? 'solid' : 'outline'"
                    size="sm"
                    @click="rateCard(q.value)"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </template>

        <!-- ======== 列表模式 ======== -->
        <template v-else>
          <UDashboardToolbar>
            <template #left>
              <UInput icon="i-lucide-search" v-model="search" placeholder="搜索闪卡..." class="max-w-xs" />
              <USelect v-model="subjectFilter" :items="subjectOptions" placeholder="全部科目" class="max-w-32" />
            </template>
            <template #right>
              <UButton icon="i-lucide-sparkles" label="AI生成" variant="outline" :loading="generating" @click="generateFromKB" />
            </template>
          </UDashboardToolbar>

          <div class="space-y-3 mt-4">
            <UCard v-for="fc in filteredCards" :key="fc.id">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <UBadge v-if="fc.subject" :color="subjectColor(fc.subject)" variant="soft" size="xs">{{ fc.subject }}</UBadge>
                  <span class="text-xs text-(--ui-text-muted)">{{ fc.source_type === 'ai_generated' ? '🤖 AI' : '✍️ 手动' }}</span>
                  <span v-if="fc.next_review_at" class="text-xs ml-auto" :class="new Date(fc.next_review_at) <= new Date() ? 'text-(--ui-error)' : 'text-(--ui-text-muted)'">
                    {{ new Date(fc.next_review_at) <= new Date() ? '🔴 待复习' : '📅 ' + formatDate(fc.next_review_at) }}
                  </span>
                </div>
                <p class="font-semibold text-sm">{{ fc.question }}</p>
                <p class="text-xs text-(--ui-text-muted) line-clamp-2">{{ fc.answer }}</p>
                <div class="flex gap-1 text-xs text-(--ui-text-muted)">
                  <span>间隔: {{ fc.interval_days || 0 }}天</span>
                  <span>· 难度: {{ fc.ease_factor?.toFixed(2) || '2.50' }}</span>
                  <span>· 复习: {{ fc.repetitions || 0 }}次</span>
                </div>
              </div>
            </UCard>
          </div>
        </template>

        <!-- 新建闪卡 Modal -->
        <UModal v-model:open="showAddModal" title="新建闪卡">
          <template #body>
            <div class="space-y-4">
              <UFormField label="科目">
                <USelect v-model="newCard.subject" :items="subjectOptions.filter(s => s.value)" />
              </UFormField>
              <UFormField label="问题" required>
                <UTextarea v-model="newCard.question" placeholder="输入问题..." :rows="3" />
              </UFormField>
              <UFormField label="答案" required>
                <UTextarea v-model="newCard.answer" placeholder="输入答案..." :rows="3" />
              </UFormField>
            </div>
          </template>
          <template #footer>
            <UButton label="取消" variant="outline" @click="showAddModal = false" />
            <UButton label="保存" @click="saveFlashcard" :loading="saving" />
          </template>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const toast = useToast()
const { fetchFlashcards, fetchDueFlashcards, saveFlashcard: dbSaveFlashcard, saveFlashcardReview } = useDatabase()

// 状态
const cards = ref<any[]>([])
const search = ref('')
const subjectFilter = ref('')
const showAddModal = ref(false)
const saving = ref(false)
const generating = ref(false)
const reviewing = ref(false)
const flipped = ref(false)
const reviewQueue = ref<any[]>([])
const reviewIndex = ref(0)

const subjectOptions = [
  { label: '全部科目', value: '' },
  { label: '会计', value: '会计' },
  { label: '税法', value: '税法' },
  { label: '经济法', value: '经济法' },
]

const newCard = reactive({ subject: '', question: '', answer: '' })

const qualities = [
  { value: 0, label: '完全忘了', color: 'error' },
  { value: 1, label: '记得一点', color: 'warning' },
  { value: 2, label: '有些困难', color: 'secondary' },
  { value: 3, label: '基本记住', color: 'primary' },
  { value: 4, label: '比较熟悉', color: 'success' },
  { value: 5, label: '完全掌握', color: 'info' },
]

const filteredCards = computed(() => {
  let data = cards.value
  if (subjectFilter.value) data = data.filter((c: any) => c.subject === subjectFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    data = data.filter((c: any) => c.question?.toLowerCase().includes(q) || c.answer?.toLowerCase().includes(q))
  }
  return data
})

const currentCard = computed(() => reviewQueue.value[reviewIndex.value])

const flashStats = computed(() => ({
  total: { value: cards.value.length, label: '总闪卡', color: '' },
  due: { value: cards.value.filter((c: any) => !c.next_review_at || new Date(c.next_review_at) <= new Date()).length, label: '待复习', color: 'text-(--ui-error)' },
  mastered: { value: cards.value.filter((c: any) => (c.ease_factor || 0) >= 2.5 && (c.repetitions || 0) >= 2).length, label: '已掌握', color: 'text-(--ui-success)' },
  today: { value: cards.value.filter((c: any) => c.last_reviewed?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length, label: '今日复习', color: 'text-(--ui-primary)' },
}))

const subjectColor = (s: string) => s === '会计' ? 'primary' : s === '税法' ? 'secondary' : 'success'

const formatDate = (d: string) => d ? d.slice(0, 10) : '—'

// 加载数据
const loadCards = async () => {
  try { cards.value = await fetchFlashcards() } catch (e: any) { toast.add({ title: '加载失败', description: e.message, color: 'error' }) }
}

// 新建闪卡
const saveFlashcard = async () => {
  if (!newCard.question.trim() || !newCard.answer.trim()) {
    toast.add({ title: '请填写问题和答案', color: 'warning' }); return
  }
  saving.value = true
  try {
    await dbSaveFlashcard({
      subject: newCard.subject || null,
      question: newCard.question.trim(),
      answer: newCard.answer.trim(),
      source_type: 'manual'
    })
    showAddModal.value = false
    newCard.subject = ''; newCard.question = ''; newCard.answer = ''
    toast.add({ title: '闪卡已创建 📇', color: 'success' })
    await loadCards()
  } catch (e: any) { toast.add({ title: '保存失败', description: e.message, color: 'error' }) }
  saving.value = false
}

// AI 从知识库生成闪卡
const generateFromKB = async () => {
  generating.value = true
  const { fetchKnowledge } = useDatabase()
  try {
    const kb = await fetchKnowledge()
    let count = 0
    for (const k of kb.slice(0, 10)) {
      if (!k.content || k.content.length < 10) continue
      await dbSaveFlashcard({
        knowledge_id: k.id, subject: k.subject,
        question: `请简述：${k.topic_name}（${k.subject} 第${k.chapter_no}章）`,
        answer: k.content.slice(0, 300),
        source_type: 'ai_generated'
      })
      count++
    }
    toast.add({ title: `已生成 ${count} 张闪卡`, color: 'success' })
    await loadCards()
  } catch (e: any) { toast.add({ title: '生成失败', description: e.message, color: 'error' }) }
  generating.value = false
}

// SM-2 复习
const startReview = () => {
  const due = cards.value.filter((c: any) => !c.next_review_at || new Date(c.next_review_at) <= new Date())
  if (!due.length) { toast.add({ title: '没有待复习的闪卡 🎉', color: 'success' }); return }
  reviewQueue.value = due
  reviewIndex.value = 0
  flipped.value = false
  reviewing.value = true
}

const rateCard = async (quality: number) => {
  const fc = currentCard.value
  if (!fc) return

  // SM-2 算法
  let interval = fc.interval_days || 1
  let ease = fc.ease_factor || 2.5
  let reps = (fc.repetitions || 0) + 1

  if (quality >= 3) {
    if (reps === 1) interval = 1
    else if (reps === 2) interval = 6
    else interval = Math.round(interval * ease)
    ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if (ease < 1.3) ease = 1.3
  } else {
    reps = 0; interval = 1
  }

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  await saveFlashcardReview({
    flashcard_id: fc.id,
    quality,
    interval_days: interval,
    ease_factor: Math.round(ease * 100) / 100,
    repetitions: reps,
    next_review_at: nextReview.toISOString()
  })

  // 下一张
  if (reviewIndex.value < reviewQueue.value.length - 1) {
    reviewIndex.value++
    flipped.value = false
  } else {
    reviewing.value = false
    toast.add({ title: `🎉 复习完成！今日已复习 ${reviewQueue.value.length} 张闪卡`, color: 'success' })
    await loadCards()
  }
}

onMounted(() => loadCards())
</script>

<style scoped>
.flashcard { perspective: 1000px; min-height: 200px; }
.flashcard-inner { position: relative; width: 100%; min-height: 200px; transition: transform 0.5s; transform-style: preserve-3d; }
.flashcard.flipped .flashcard-inner { transform: rotateY(180deg); }
.flashcard-front, .flashcard-back {
  position: absolute; width: 100%; height: 100%; backface-visibility: hidden;
  border-radius: 0.75rem; padding: 2rem; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
}
.flashcard-front { background: linear-gradient(135deg, var(--ui-bg-elevated), var(--ui-bg)); border: 1px solid var(--ui-border); }
.flashcard-back { background: linear-gradient(135deg, color-mix(in srgb, var(--ui-primary) 10%, var(--ui-bg)), var(--ui-bg-elevated)); border: 1px solid var(--ui-primary); transform: rotateY(180deg); }
</style>
