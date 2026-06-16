<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="学习记录 💊">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            icon="i-lucide-layout-grid"
            :variant="viewMode === 'grid' ? 'solid' : 'outline'"
            size="xs"
            @click="viewMode = 'grid'"
            class="mr-1"
          />
          <UButton
            icon="i-lucide-list"
            :variant="viewMode === 'timeline' ? 'solid' : 'outline'"
            size="xs"
            @click="viewMode = 'timeline'"
            class="mr-2"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <template #left>
          <USelect v-model="subjectFilter" :items="subjectOptions" placeholder="全部科目" class="max-w-28" />
          <USelect v-model="chapterFilter" :items="chapterOptions" placeholder="全部章节" class="max-w-36" />
          <UInput icon="i-lucide-search" v-model="search" placeholder="搜索记录..." class="max-w-xs" />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="新建胶囊" @click="openAdd" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6">
        <!-- ======== 章节进度条 ======== -->
        <div v-if="chapterProgress.length" class="mb-6 p-4 bg-(--ui-bg-elevated) rounded-xl border border-(--ui-border)">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">
              📊 {{ subjectFilter || '全部科目' }} · 章节覆盖率
            </span>
            <span class="text-xs text-(--ui-primary) font-bold">{{ completedChapters }}/{{ chapterProgress.length }} 章已记录</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <UTooltip
              v-for="cp in chapterProgress"
              :key="cp.no"
              :text="`第${cp.no}章 ${cp.name} · ${cp.count}条记录`"
            >
              <div
                class="w-8 h-2 rounded-full cursor-pointer transition-all hover:scale-110"
                :class="cp.count > 0 ? 'bg-(--ui-primary)' : 'bg-(--ui-border)'"
                @click="chapterFilter = cp.no"
              />
            </UTooltip>
          </div>
        </div>

        <!-- ======== 加载/空状态 ======== -->
        <div v-if="loading" class="text-center py-12 text-(--ui-text-muted)">
          <div class="text-4xl mb-3">💊</div>
          <p>加载胶囊中...</p>
        </div>
        <div v-else-if="!filteredRecords.length" class="text-center py-12 text-(--ui-text-muted)">
          <div class="text-5xl mb-4">💊</div>
          <p class="text-lg font-semibold mb-1">还没有学习胶囊</p>
          <p class="text-sm">开始记录你的学习收获，每一颗胶囊都是成长的印记 ✨</p>
          <UButton icon="i-lucide-plus" label="创建第一颗胶囊" class="mt-4" @click="openAdd" />
        </div>

        <!-- ======== 胶囊网格视图 ======== -->
        <template v-else-if="viewMode === 'grid'">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="r in filteredRecords"
              :key="r.id"
              class="capsule-card group cursor-pointer"
              @click="openDetail(r)"
            >
              <!-- 胶囊顶部色条 -->
              <div class="h-1.5 rounded-t-xl" :class="subjectBarClass(r.subject)" />

              <div class="p-4 space-y-3">
                <!-- 头部信息 -->
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-sm line-clamp-2 group-hover:text-(--ui-primary) transition-colors">
                      {{ r.title }}
                    </h3>
                  </div>
                  <div class="flex items-center gap-0.5 flex-shrink-0">
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="text-xs"
                      :class="i <= r.difficulty_rating ? 'text-(--ui-warning)' : 'text-(--ui-border)'"
                    >★</span>
                  </div>
                </div>

                <!-- 元信息 -->
                <div class="flex items-center gap-2 flex-wrap">
                  <UBadge :color="subjectColor(r.subject)" variant="soft" size="xs">{{ r.subject }}</UBadge>
                  <span class="text-xs text-(--ui-text-muted)">第{{ r.chapter_no }}章</span>
                  <span class="text-xs text-(--ui-text-muted)">{{ formatDate(r.study_date) }}</span>
                  <span v-if="r.study_minutes" class="text-xs text-(--ui-text-muted)">🕐 {{ r.study_minutes }}min</span>
                </div>

                <!-- 内容预览 -->
                <p v-if="r.content" class="text-xs text-(--ui-text-muted) line-clamp-3">
                  {{ r.content }}
                </p>

                <!-- 关键收获标签 -->
                <div v-if="r.key_takeaways?.length" class="flex flex-wrap gap-1">
                  <span
                    v-for="(kt, i) in r.key_takeaways.slice(0, 3)"
                    :key="i"
                    class="text-[10px] px-1.5 py-0.5 rounded-full bg-(--ui-success)/10 text-(--ui-success) font-medium"
                  >
                    💡 {{ kt }}
                  </span>
                  <span v-if="r.key_takeaways.length > 3" class="text-[10px] text-(--ui-text-muted)">
                    +{{ r.key_takeaways.length - 3 }}
                  </span>
                </div>

                <!-- 标签 -->
                <div v-if="r.tags?.length" class="flex flex-wrap gap-1">
                  <UBadge v-for="t in r.tags" :key="t" variant="outline" size="xs">{{ t }}</UBadge>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ======== 时间线视图（按章节分组） ======== -->
        <template v-else>
          <div class="space-y-8">
            <div v-for="group in groupedByChapter" :key="group.key">
              <!-- 章节标题 -->
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  :class="subjectBadgeClass(group.subject)">
                  {{ group.chapter_no }}
                </div>
                <div>
                  <h3 class="font-semibold text-sm">{{ group.chapter_name }}</h3>
                  <p class="text-xs text-(--ui-text-muted)">{{ group.subject }} · {{ group.records.length }} 条记录</p>
                </div>
                <div class="flex-1 h-px bg-(--ui-border)" />
              </div>

              <!-- 章节内的胶囊时间线 -->
              <div class="relative pl-8">
                <div class="absolute left-3 top-1 bottom-1 w-0.5 bg-(--ui-border)" />
                <div
                  v-for="r in group.records"
                  :key="r.id"
                  class="relative mb-4 cursor-pointer group"
                  @click="openDetail(r)"
                >
                  <div
                    class="absolute left-[-1.25rem] top-2 w-3 h-3 rounded-full border-2 border-(--ui-bg)"
                    :class="subjectDotClass(r.subject)"
                  />
                  <UCard class="hover:border-(--ui-primary)/40 transition-colors">
                    <div class="space-y-2">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs text-(--ui-text-muted)">{{ formatDate(r.study_date) }}</span>
                        <span v-if="r.study_minutes" class="text-xs text-(--ui-text-muted)">🕐 {{ r.study_minutes }}min</span>
                        <div class="flex items-center gap-0.5 ml-auto">
                          <span v-for="i in 5" :key="i" class="text-[10px]"
                            :class="i <= r.difficulty_rating ? 'text-(--ui-warning)' : 'text-(--ui-border)'">★</span>
                        </div>
                      </div>
                      <h4 class="font-semibold text-sm group-hover:text-(--ui-primary) transition-colors">{{ r.title }}</h4>
                      <p v-if="r.content" class="text-xs text-(--ui-text-muted) line-clamp-2">{{ r.content }}</p>
                      <div v-if="r.key_takeaways?.length" class="flex flex-wrap gap-1">
                        <span v-for="(kt, i) in r.key_takeaways" :key="i"
                          class="text-[10px] px-1.5 py-0.5 rounded-full bg-(--ui-success)/10 text-(--ui-success) font-medium">
                          💡 {{ kt }}
                        </span>
                      </div>
                    </div>
                  </UCard>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ======== 分页 ======== -->
        <div v-if="filteredRecords.length > pageSize" class="flex justify-center mt-6 gap-2">
          <UButton
            variant="outline" size="xs"
            :disabled="page <= 1"
            @click="page--"
          >上一页</UButton>
          <span class="text-sm text-(--ui-text-muted) self-center">
            {{ page }} / {{ totalPages }}
          </span>
          <UButton
            variant="outline" size="xs"
            :disabled="page >= totalPages"
            @click="page++"
          >下一页</UButton>
        </div>
      </div>
    </template>

    <!-- ======== 详情/编辑 Modal ======== -->
    <UModal v-model:open="showDetail" :title="editingRecord?.title || '学习胶囊'">
      <template #body>
        <template v-if="editingRecord">
          <!-- 阅读模式 -->
          <template v-if="!isEditing">
            <div class="space-y-4">
              <div class="flex items-center gap-2 flex-wrap">
                <UBadge :color="subjectColor(editingRecord.subject)" variant="soft" size="sm">{{ editingRecord.subject }}</UBadge>
                <span class="text-sm text-(--ui-text-muted)">第{{ editingRecord.chapter_no }}章 {{ editingRecord.chapter_name }}</span>
                <span class="text-sm text-(--ui-text-muted)">{{ formatDate(editingRecord.study_date) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-sm text-(--ui-text-muted) mr-1">难度：</span>
                <span v-for="i in 5" :key="i" class="text-sm"
                  :class="i <= editingRecord.difficulty_rating ? 'text-(--ui-warning)' : 'text-(--ui-border)'">★</span>
                <span v-if="editingRecord.study_minutes" class="text-sm text-(--ui-text-muted) ml-3">🕐 {{ editingRecord.study_minutes }}分钟</span>
              </div>
              <div v-if="editingRecord.content" class="bg-(--ui-bg-elevated) rounded-lg p-4">
                <p class="text-sm whitespace-pre-wrap">{{ editingRecord.content }}</p>
              </div>
              <div v-if="editingRecord.key_takeaways?.length" class="space-y-1">
                <p class="text-xs font-semibold text-(--ui-text-muted) uppercase">💡 关键收获</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(kt, i) in editingRecord.key_takeaways" :key="i"
                    class="text-xs px-2 py-1 rounded-full bg-(--ui-success)/10 text-(--ui-success) font-medium">
                    {{ kt }}
                  </span>
                </div>
              </div>
              <div v-if="editingRecord.tags?.length" class="flex gap-1 flex-wrap">
                <UBadge v-for="t in editingRecord.tags" :key="t" variant="outline" size="xs">{{ t }}</UBadge>
              </div>
              <div class="flex gap-2 pt-2 border-t border-(--ui-border)">
                <UButton icon="i-lucide-pencil" label="编辑" variant="outline" size="sm" @click="isEditing = true" />
                <UButton icon="i-lucide-trash-2" label="删除" color="error" variant="outline" size="sm" @click="removeRecord" />
              </div>
            </div>
          </template>

          <!-- 编辑模式 -->
          <template v-else>
            <div class="space-y-3">
              <UFormField label="科目" required>
                <USelect v-model="editForm.subject" :items="subjectOpts" />
              </UFormField>
              <div class="grid grid-cols-2 gap-3">
                <UFormField label="章节号">
                  <UInput v-model.number="editForm.chapter_no" type="number" placeholder="如：5" />
                </UFormField>
                <UFormField label="章节名">
                  <UInput v-model="editForm.chapter_name" placeholder="如：长期股权投资" />
                </UFormField>
              </div>
              <UFormField label="标题" required>
                <UInput v-model="editForm.title" placeholder="如：权益法核算要点" />
              </UFormField>
              <UFormField label="学习内容">
                <UTextarea v-model="editForm.content" :rows="5" placeholder="记录你学到的内容，支持 Markdown 格式..." />
              </UFormField>
              <UFormField label="关键收获（逗号分隔）">
                <UInput v-model="editForm.key_takeaways_str" placeholder="如：权益法≠成本法, 顺流交易抵消" />
              </UFormField>
              <div class="grid grid-cols-2 gap-3">
                <UFormField label="难度评级">
                  <div class="flex gap-1 pt-1">
                    <UButton
                      v-for="i in 5" :key="i"
                      :icon="i <= editForm.difficulty_rating ? 'i-lucide-star' : 'i-lucide-star-off'"
                      :variant="i <= editForm.difficulty_rating ? 'solid' : 'outline'"
                      :color="i <= editForm.difficulty_rating ? 'warning' : 'neutral'"
                      size="xs"
                      @click="editForm.difficulty_rating = i"
                    />
                  </div>
                </UFormField>
                <UFormField label="学习时长（分钟）">
                  <UInput v-model.number="editForm.study_minutes" type="number" placeholder="30" />
                </UFormField>
              </div>
              <UFormField label="学习日期">
                <UInput v-model="editForm.study_date" type="date" />
              </UFormField>
              <UFormField label="标签（逗号分隔）">
                <UInput v-model="editForm.tags_str" placeholder="如：重点, 易错, 真题" />
              </UFormField>
            </div>
          </template>
        </template>
      </template>
      <template #footer>
        <template v-if="!isEditing">
          <UButton label="关闭" variant="outline" @click="showDetail = false" />
        </template>
        <template v-else>
          <UButton label="取消" variant="outline" @click="isEditing = false; openDetail(editingRecord)" />
          <UButton label="保存修改" @click="saveEdit" :loading="saving" />
        </template>
      </template>
    </UModal>

    <!-- ======== 新建胶囊 Modal ======== -->
    <UModal v-model:open="showAddModal" title="🧬 新建学习胶囊">
      <template #body>
        <div class="space-y-3">
          <UFormField label="科目" required>
            <USelect v-model="newForm.subject" :items="subjectOpts" />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="章节号">
              <UInput v-model.number="newForm.chapter_no" type="number" placeholder="如：1" />
            </UFormField>
            <UFormField label="章节名">
              <UInput v-model="newForm.chapter_name" placeholder="如：总论" />
            </UFormField>
          </div>
          <UFormField label="标题" required>
            <UInput v-model="newForm.title" placeholder="如：会计信息质量要求" />
          </UFormField>
          <UFormField label="学习内容">
            <UTextarea v-model="newForm.content" :rows="5" placeholder="今天学到了什么？记录下来..." />
          </UFormField>
          <UFormField label="关键收获（逗号分隔）">
            <UInput v-model="newForm.key_takeaways_str" placeholder="如：可靠性是基础, 相关性决定有用性" />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="难度评级">
              <div class="flex gap-1 pt-1">
                <UButton
                  v-for="i in 5" :key="i"
                  :icon="i <= newForm.difficulty_rating ? 'i-lucide-star' : 'i-lucide-star-off'"
                  :variant="i <= newForm.difficulty_rating ? 'solid' : 'outline'"
                  :color="i <= newForm.difficulty_rating ? 'warning' : 'neutral'"
                  size="xs"
                  @click="newForm.difficulty_rating = i"
                />
              </div>
            </UFormField>
            <UFormField label="学习时长（分钟）">
              <UInput v-model.number="newForm.study_minutes" type="number" placeholder="30" />
            </UFormField>
          </div>
          <UFormField label="学习日期">
            <UInput v-model="newForm.study_date" type="date" />
          </UFormField>
          <UFormField label="标签（逗号分隔）">
            <UInput v-model="newForm.tags_str" placeholder="如：重点, 易错" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <UButton label="取消" variant="outline" @click="showAddModal = false" />
        <UButton label="创建胶囊 💊" @click="saveRecord" :loading="saving" />
      </template>
    </UModal>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const toast = useToast()
const { fetchStudyRecords, fetchStudyRecordsByChapter, saveStudyRecord, updateStudyRecord, deleteStudyRecord } = useDatabase()

// ======== 状态 ========
const records = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const search = ref('')
const subjectFilter = ref('会计')
const chapterFilter = ref<number | ''>('')
const viewMode = ref<'grid' | 'timeline'>('grid')
const page = ref(1)
const pageSize = 12

// Modal 状态
const showAddModal = ref(false)
const showDetail = ref(false)
const isEditing = ref(false)
const editingRecord = ref<any>(null)

const today = new Date().toISOString().slice(0, 10)

// ======== 表单 ========
const emptyForm = {
  subject: '会计' as string,
  chapter_no: null as number | null,
  chapter_name: '',
  title: '',
  content: '',
  key_takeaways_str: '',
  difficulty_rating: 1,
  study_minutes: null as number | null,
  study_date: today,
  tags_str: ''
}
const newForm = reactive({ ...emptyForm })
const editForm = reactive({ ...emptyForm })

// ======== 选项 ========
const subjectOptions = [
  { label: '全部科目', value: '' },
  { label: '会计', value: '会计' },
  { label: '税法', value: '税法' },
  { label: '经济法', value: '经济法' },
]
const subjectOpts = subjectOptions.filter(s => s.value)

// 动态章节选项
const chapterOptions = computed(() => {
  const chapters = new Map<number, string>()
  records.value.forEach((r: any) => {
    if (!subjectFilter.value || r.subject === subjectFilter.value) {
      if (!chapters.has(r.chapter_no)) chapters.set(r.chapter_no, r.chapter_name)
    }
  })
  const opts: { label: string; value: number | '' }[] = [{ label: '全部章节', value: '' }]
  Array.from(chapters.entries())
    .sort((a, b) => a[0] - b[0])
    .forEach(([no, name]) => opts.push({ label: `第${no}章 ${name}`, value: no }))
  return opts
})

// ======== 计算属性 ========
const filteredRecords = computed(() => {
  let data = records.value
  if (subjectFilter.value) data = data.filter((r: any) => r.subject === subjectFilter.value)
  if (chapterFilter.value) data = data.filter((r: any) => r.chapter_no === chapterFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    data = data.filter((r: any) =>
      r.title?.toLowerCase().includes(q) ||
      r.content?.toLowerCase().includes(q) ||
      r.chapter_name?.toLowerCase().includes(q) ||
      r.key_takeaways?.some((k: string) => k.toLowerCase().includes(q)) ||
      r.tags?.some((t: string) => t.toLowerCase().includes(q))
    )
  }
  return data
})

const totalPages = computed(() => Math.ceil(filteredRecords.value.length / pageSize) || 1)

// 按章节分组（时间线视图）
const groupedByChapter = computed(() => {
  const groups = new Map<string, { key: string; subject: string; chapter_no: number; chapter_name: string; records: any[] }>()
  filteredRecords.value.forEach((r: any) => {
    const key = `${r.subject}-${r.chapter_no}`
    if (!groups.has(key)) {
      groups.set(key, { key, subject: r.subject, chapter_no: r.chapter_no, chapter_name: r.chapter_name, records: [] })
    }
    groups.get(key)!.records.push(r)
  })
  return Array.from(groups.values()).sort((a, b) => a.chapter_no - b.chapter_no)
})

// 章节进度（所有章节覆盖情况）
const chapterProgress = computed(() => {
  const map = new Map<number, { no: number; name: string; count: number }>()
  records.value
    .filter((r: any) => !subjectFilter.value || r.subject === subjectFilter.value)
    .forEach((r: any) => {
      if (!map.has(r.chapter_no)) map.set(r.chapter_no, { no: r.chapter_no, name: r.chapter_name, count: 0 })
      map.get(r.chapter_no)!.count++
    })
  return Array.from(map.values()).sort((a, b) => a.no - b.no)
})

const completedChapters = computed(() => chapterProgress.value.filter(cp => cp.count > 0).length)

// ======== 辅助函数 ========
const subjectColor = (s: string) => s === '会计' ? 'primary' as const : s === '税法' ? 'secondary' as const : 'success' as const
const subjectBarClass = (s: string) => s === '会计' ? 'bg-(--ui-primary)' : s === '税法' ? 'bg-(--ui-secondary)' : 'bg-(--ui-success)'
const subjectBadgeClass = (s: string) => s === '会计' ? 'bg-(--ui-primary)/10 text-(--ui-primary)' : s === '税法' ? 'bg-(--ui-secondary)/10 text-(--ui-secondary)' : 'bg-(--ui-success)/10 text-(--ui-success)'
const subjectDotClass = (s: string) => s === '会计' ? 'bg-(--ui-primary)' : s === '税法' ? 'bg-(--ui-secondary)' : 'bg-(--ui-success)'
const formatDate = (d: string) => d ? d.slice(0, 10) : '—'

// ======== 加载数据 ========
const loadRecords = async () => {
  loading.value = true
  try {
    if (subjectFilter.value) {
      records.value = await fetchStudyRecordsByChapter(subjectFilter.value)
    } else {
      records.value = await fetchStudyRecords()
    }
  } catch (e: any) {
    toast.add({ title: '加载失败', description: e.message, color: 'error' })
  }
  loading.value = false
}

// ======== 新建胶囊 ========
const openAdd = () => {
  Object.assign(newForm, { ...emptyForm, study_date: today })
  showAddModal.value = true
}

const saveRecord = async () => {
  if (!newForm.subject || !newForm.title.trim()) {
    toast.add({ title: '请填写科目和标题', color: 'warning' }); return
  }
  saving.value = true
  try {
    await saveStudyRecord({
      subject: newForm.subject,
      chapter_no: newForm.chapter_no || 1,
      chapter_name: newForm.chapter_name || '未分类',
      title: newForm.title.trim(),
      content: newForm.content.trim() || null,
      key_takeaways: newForm.key_takeaways_str
        ? newForm.key_takeaways_str.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
      difficulty_rating: newForm.difficulty_rating,
      study_minutes: newForm.study_minutes || 0,
      study_date: newForm.study_date || today,
      tags: newForm.tags_str
        ? newForm.tags_str.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
    })
    showAddModal.value = false
    toast.add({ title: '胶囊已创建 💊', description: '学习记录已保存', color: 'success' })
    await loadRecords()
  } catch (e: any) {
    toast.add({ title: '保存失败', description: e.message, color: 'error' })
  }
  saving.value = false
}

// ======== 查看/编辑胶囊 ========
const openDetail = (record: any) => {
  editingRecord.value = record
  isEditing.value = false
  Object.assign(editForm, {
    subject: record.subject,
    chapter_no: record.chapter_no,
    chapter_name: record.chapter_name,
    title: record.title,
    content: record.content || '',
    key_takeaways_str: Array.isArray(record.key_takeaways)
      ? record.key_takeaways.join(', ')
      : (record.key_takeaways || ''),
    difficulty_rating: record.difficulty_rating || 1,
    study_minutes: record.study_minutes,
    study_date: record.study_date || today,
    tags_str: Array.isArray(record.tags)
      ? record.tags.join(', ')
      : (record.tags || ''),
  })
  showDetail.value = true
}

const saveEdit = async () => {
  if (!editingRecord.value) return
  saving.value = true
  try {
    await updateStudyRecord(editingRecord.value.id, {
      subject: editForm.subject,
      chapter_no: editForm.chapter_no || 1,
      chapter_name: editForm.chapter_name || '未分类',
      title: editForm.title.trim(),
      content: editForm.content.trim() || null,
      key_takeaways: editForm.key_takeaways_str
        ? editForm.key_takeaways_str.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
      difficulty_rating: editForm.difficulty_rating,
      study_minutes: editForm.study_minutes || 0,
      study_date: editForm.study_date || today,
      tags: editForm.tags_str
        ? editForm.tags_str.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
    })
    isEditing.value = false
    showDetail.value = false
    toast.add({ title: '胶囊已更新 💊', color: 'success' })
    await loadRecords()
  } catch (e: any) {
    toast.add({ title: '更新失败', description: e.message, color: 'error' })
  }
  saving.value = false
}

const removeRecord = async () => {
  if (!editingRecord.value) return
  try {
    await deleteStudyRecord(editingRecord.value.id)
    showDetail.value = false
    toast.add({ title: '胶囊已删除', color: 'success' })
    await loadRecords()
  } catch (e: any) {
    toast.add({ title: '删除失败', description: e.message, color: 'error' })
  }
}

// 科目切换时重置章节筛选
watch(subjectFilter, () => {
  chapterFilter.value = ''
  loadRecords()
})

onMounted(() => loadRecords())
</script>

<style scoped>
.capsule-card {
  border-radius: 0.75rem;
  border: 1px solid var(--ui-border);
  background: var(--ui-bg);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.capsule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: color-mix(in srgb, var(--ui-primary) 30%, var(--ui-border));
}
</style>
