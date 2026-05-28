<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="学习日记">
        <template #leading><UDashboardSidebarCollapse /></template>
        <template #right>
          <UButton icon="i-lucide-plus" label="写日记" @click="showModal = true" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="p-6">
        <div v-if="loading" class="text-center text-(--ui-text-muted) py-8">加载中...</div>
        <div v-else-if="!diaries.length" class="text-center text-(--ui-text-muted) py-8">还没有学习日记，开始写吧！</div>
        <div v-else class="relative pl-8">
          <!-- 时间线竖线 -->
          <div class="absolute left-3 top-2 bottom-2 w-0.5 bg-(--ui-border)" />
          <div v-for="d in diaries" :key="d.id" class="relative mb-6">
            <div class="absolute left-[-1.25rem] top-1.5 w-3.5 h-3.5 rounded-full bg-(--ui-primary) border-2 border-(--ui-bg)" />
            <div class="text-xs text-(--ui-text-muted) mb-1">{{ d.entry_date?.slice(0, 10) }}</div>
            <UCard>
              <div class="space-y-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <UBadge size="xs" variant="soft">{{ d.subject }}</UBadge>
                  <span v-if="d.chapter_name" class="text-sm font-semibold">{{ d.chapter_name }}</span>
                  <UBadge v-if="d.mastery_score" size="xs" :color="d.mastery_score >= 80 ? 'success' : d.mastery_score >= 60 ? 'warning' : 'error'" variant="soft">
                    {{ d.mastery_score }}分
                  </UBadge>
                </div>
                <p v-if="d.oral_transcript" class="text-sm text-(--ui-text-muted) line-clamp-3">{{ d.oral_transcript }}</p>
                <p v-if="d.ai_summary" class="text-xs text-(--ui-primary)"><strong>AI总结：</strong>{{ d.ai_summary }}</p>
                <p v-if="d.missing_points" class="text-xs text-(--ui-error)"><strong>薄弱环节：</strong>{{ d.missing_points }}</p>
              </div>
            </UCard>
          </div>
        </div>

        <!-- 写日记 Modal -->
        <UModal v-model:open="showModal" title="✍️ 写学习日记">
          <template #body>
            <div class="space-y-3">
              <UFormField label="日期">
                <UInput v-model="form.entry_date" type="date" />
              </UFormField>
              <UFormField label="科目" required>
                <USelect v-model="form.subject" :items="subjectOpts" />
              </UFormField>
              <UFormField label="章节">
                <UInput v-model="form.chapter_name" placeholder="如：第5章 长期股权投资" />
              </UFormField>
              <UFormField label="口述记录">
                <UTextarea v-model="form.oral_transcript" :rows="4" placeholder="今天学到什么..." />
              </UFormField>
              <UFormField label="AI总结">
                <UTextarea v-model="form.ai_summary" :rows="2" placeholder="AI生成的学习总结" />
              </UFormField>
              <UFormField label="薄弱环节">
                <UInput v-model="form.missing_points" placeholder="需要加强的知识点" />
              </UFormField>
              <UFormField label="掌握度评分">
                <UInput v-model.number="form.mastery_score" type="number" min="0" max="100" placeholder="如：75" />
              </UFormField>
            </div>
          </template>
          <template #footer>
            <UButton label="取消" variant="outline" @click="showModal = false" />
            <UButton label="保存" @click="saveDiary" :loading="saving" />
          </template>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const toast = useToast()
const { fetchDiary, saveDiary: dbSaveDiary } = useDatabase()

const diaries = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const today = new Date().toISOString().slice(0, 10)

const form = reactive({ entry_date: today, subject: '', chapter_name: '', oral_transcript: '', ai_summary: '', missing_points: '', mastery_score: null as number | null })

const subjectOpts = [{ label: '请选择', value: '' }, { label: '会计', value: '会计' }, { label: '税法', value: '税法' }, { label: '经济法', value: '经济法' }]

const saveDiary = async () => {
  if (!form.subject) { toast.add({ title: '请选择科目', color: 'warning' }); return }
  saving.value = true
  try {
    await dbSaveDiary({ ...form })
    showModal.value = false
    form.entry_date = today; form.subject = ''; form.chapter_name = ''; form.oral_transcript = ''; form.ai_summary = ''; form.missing_points = ''; form.mastery_score = null
    toast.add({ title: '日记已保存 📝', color: 'success' })
    await load()
  } catch (e: any) { toast.add({ title: '保存失败', description: e.message, color: 'error' }) }
  saving.value = false
}

const load = async () => {
  loading.value = true
  try { diaries.value = await fetchDiary() } catch (e: any) { toast.add({ title: '加载失败', description: e.message, color: 'error' }) }
  loading.value = false
}

onMounted(() => load())
</script>
