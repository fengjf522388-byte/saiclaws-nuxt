<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="知识库">
        <template #leading><UDashboardSidebarCollapse /></template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <template #left>
          <UInput icon="i-lucide-search" v-model="search" placeholder="搜索知识点..." class="max-w-xs" />
          <USelect v-model="subjectFilter" :items="subjectOptions" placeholder="全部科目" class="max-w-32" />
          <USelect v-model="levelFilter" :items="levelOptions" placeholder="全部要求" class="max-w-32" />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="新增" @click="openAdd" />
        </template>
      </UDashboardToolbar>
    </template>
    <template #body>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8 text-(--ui-text-muted)">加载中...</div>
        <div v-else-if="!filtered.length" class="text-center py-8 text-(--ui-text-muted)">暂无知识点</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="k in filtered" :key="k.id" class="hover:border-(--ui-primary)/30 transition-colors">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <UBadge :color="subjectColor(k.subject)" variant="soft" size="xs">{{ k.subject }}</UBadge>
                <span class="text-xs text-(--ui-text-muted)">第{{ k.chapter_no }}章</span>
                <UBadge v-if="k.syllabus_level" size="xs" variant="outline" class="ml-auto">
                  {{ ['', '了解', '理解', '掌握'][k.syllabus_level] || '了解' }}
                </UBadge>
              </div>
              <h3 class="font-semibold">{{ k.topic_name }}</h3>
              <p class="text-xs text-(--ui-text-muted)">{{ k.chapter_name }}</p>
              <p class="text-sm text-(--ui-text-muted) line-clamp-2">{{ k.content }}</p>
              <div v-if="k.key_points?.length" class="flex flex-wrap gap-1">
                <UBadge v-for="kp in k.key_points" :key="kp" variant="outline" size="xs">{{ kp }}</UBadge>
              </div>
              <div class="flex gap-1 pt-2 border-t border-(--ui-border)">
                <UButton icon="i-lucide-pencil" variant="ghost" size="xs" @click="openEdit(k)">编辑</UButton>
                <UButton icon="i-lucide-trash-2" variant="ghost" size="xs" color="error" @click="remove(k.id)">删除</UButton>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Modal: 新增/编辑 -->
        <UModal v-model:open="showModal" :title="editing ? '编辑知识点' : '新增知识点'">
          <template #body>
            <div class="space-y-3">
              <UFormField label="科目" required>
                <USelect v-model="editForm.subject" :items="subjectOpts" />
              </UFormField>
              <div class="grid grid-cols-2 gap-3">
                <UFormField label="章节号"><UInput v-model.number="editForm.chapter_no" type="number" /></UFormField>
                <UFormField label="章节名"><UInput v-model="editForm.chapter_name" placeholder="如：固定资产" /></UFormField>
              </div>
              <UFormField label="知识点" required>
                <UInput v-model="editForm.topic_name" placeholder="如：固定资产折旧方法" />
              </UFormField>
              <UFormField label="内容"><UTextarea v-model="editForm.content" :rows="3" /></UFormField>
              <UFormField label="大纲要求">
                <USelect v-model.number="editForm.syllabus_level" :items="levels" />
              </UFormField>
              <UFormField label="关键考点（逗号分隔）">
                <UInput v-model="editForm.key_points_str" placeholder="折旧方法, 加速折旧" />
              </UFormField>
            </div>
          </template>
          <template #footer>
            <UButton label="取消" variant="outline" @click="showModal = false" />
            <UButton label="保存" @click="save" :loading="saving" />
          </template>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const toast = useToast()
const { fetchKnowledge, saveKnowledge, updateKnowledge, deleteKnowledge } = useDatabase()

const items = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const subjectFilter = ref('')
const levelFilter = ref('')
const showModal = ref(false)
const saving = ref(false)
const editing = ref<any>(null)

const subjectOptions = [{ label: '全部科目', value: '' }, { label: '会计', value: '会计' }, { label: '税法', value: '税法' }, { label: '经济法', value: '经济法' }]
const subjectOpts = subjectOptions.filter(s => s.value)
const levelOptions = [{ label: '全部要求', value: '' }, { label: '了解', value: '1' }, { label: '理解', value: '2' }, { label: '掌握', value: '3' }]
const levels = [{ label: '了解', value: 1 }, { label: '理解', value: 2 }, { label: '掌握', value: 3 }]
const emptyForm = { subject: '', chapter_no: null as number | null, chapter_name: '', topic_name: '', content: '', syllabus_level: 2, key_points_str: '' }
const editForm = reactive({ ...emptyForm })

const subjectColor = (s: string) => s === '会计' ? 'primary' : s === '税法' ? 'secondary' : 'success' as const

const filtered = computed(() => {
  let data = items.value
  if (subjectFilter.value) data = data.filter((k: any) => k.subject === subjectFilter.value)
  if (levelFilter.value) data = data.filter((k: any) => String(k.syllabus_level) === levelFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    data = data.filter((k: any) => k.topic_name?.toLowerCase().includes(q) || k.content?.toLowerCase().includes(q) || k.chapter_name?.toLowerCase().includes(q) || k.key_points?.some((p: string) => p.toLowerCase().includes(q)))
  }
  return data
})

const openAdd = () => { editing.value = null; Object.assign(editForm, { ...emptyForm }); showModal.value = true }
const openEdit = (k: any) => {
  editing.value = k
  Object.assign(editForm, {
    subject: k.subject, chapter_no: k.chapter_no, chapter_name: k.chapter_name,
    topic_name: k.topic_name, content: k.content || '',
    syllabus_level: k.syllabus_level || 2,
    key_points_str: Array.isArray(k.key_points) ? k.key_points.join(', ') : (k.key_points || '')
  })
  showModal.value = true
}

const save = async () => {
  if (!editForm.subject || !editForm.topic_name) { toast.add({ title: '请填写必填字段', color: 'warning' }); return }
  saving.value = true
  const payload = {
    subject: editForm.subject, chapter_no: editForm.chapter_no,
    chapter_name: editForm.chapter_name, topic_name: editForm.topic_name,
    content: editForm.content || null, syllabus_level: editForm.syllabus_level,
    key_points: editForm.key_points_str ? editForm.key_points_str.split(',').map((s: string) => s.trim()) : []
  }
  try {
    if (editing.value) await updateKnowledge(editing.value.id, payload)
    else await saveKnowledge(payload)
    showModal.value = false
    toast.add({ title: editing.value ? '已更新' : '已添加', color: 'success' })
    await load()
  } catch (e: any) { toast.add({ title: '保存失败', description: e.message, color: 'error' }) }
  saving.value = false
}

const remove = async (id: number) => {
  await deleteKnowledge(id)
  toast.add({ title: '已删除', color: 'success' })
  await load()
}

const load = async () => {
  loading.value = true
  try { items.value = await fetchKnowledge() } catch (e: any) { toast.add({ title: '加载失败', description: e.message, color: 'error' }) }
  loading.value = false
}

onMounted(() => load())
</script>
