<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="收藏夹">
        <template #leading><UDashboardSidebarCollapse /></template>
        <template #right><UButton icon="i-lucide-plus" label="添加" @click="showAdd = true" /></template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="p-6 space-y-4">
        <div v-if="loading" class="text-center py-8 text-(--ui-text-muted)">加载中...</div>
        <div v-else-if="!bookmarks.length" class="text-center py-8 text-(--ui-text-muted)">暂无收藏</div>
        <UCard v-for="b in bookmarks" :key="b.id">
          <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <a :href="b.url" target="_blank" class="font-semibold text-sm text-(--ui-primary) hover:underline">{{ b.title || b.url }}</a>
                <p class="text-xs text-(--ui-text-muted) break-all mt-0.5">{{ b.url }}</p>
              </div>
              <UButton icon="i-lucide-trash-2" variant="ghost" size="xs" color="error" @click="remove(b.id)" />
            </div>
            <div v-if="b.tags?.length" class="flex gap-1 flex-wrap">
              <UBadge v-for="t in b.tags" :key="t" size="xs" variant="outline">{{ t }}</UBadge>
            </div>
            <p v-if="b.summary" class="text-xs text-(--ui-text-muted)">{{ b.summary }}</p>
          </div>
        </UCard>

        <UModal v-model:open="showAdd" title="添加收藏">
          <template #body>
            <div class="space-y-3">
              <UFormField label="URL" required><UInput v-model="form.url" placeholder="https://..." /></UFormField>
              <UFormField label="标题"><UInput v-model="form.title" placeholder="网页标题" /></UFormField>
              <UFormField label="标签（逗号分隔）"><UInput v-model="form.tags" placeholder="会计, 税法" /></UFormField>
              <UFormField label="科目"><USelect v-model="form.subject" :items="subjectOpts" /></UFormField>
            </div>
          </template>
          <template #footer>
            <UButton label="取消" variant="outline" @click="showAdd = false" />
            <UButton label="保存" @click="addBookmark" :loading="saving" />
          </template>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const toast = useToast()
const { fetchBookmarks, saveBookmark } = useDatabase()
const client = useSupabaseClient()

const bookmarks = ref<any[]>([])
const loading = ref(true)
const showAdd = ref(false)
const saving = ref(false)
const form = reactive({ url: '', title: '', tags: '', subject: '' })
const subjectOpts = [{ label: '无', value: '' }, { label: '会计', value: '会计' }, { label: '税法', value: '税法' }, { label: '经济法', value: '经济法' }]

const addBookmark = async () => {
  if (!form.url.trim()) { toast.add({ title: '请输入URL', color: 'warning' }); return }
  saving.value = true
  try {
    await saveBookmark({ url: form.url.trim(), title: form.title.trim() || form.url.trim(), tags: form.tags ? form.tags.split(',').map((s: string) => s.trim()) : [], subject: form.subject || null })
    showAdd.value = false; form.url = ''; form.title = ''; form.tags = ''; form.subject = ''
    toast.add({ title: '收藏已添加 🔖', color: 'success' })
    await load()
  } catch (e: any) { toast.add({ title: '添加失败', description: e.message, color: 'error' }) }
  saving.value = false
}

const remove = async (id: string) => {
  await client.from('bookmarks').update({ is_deleted: true }).eq('id', id)
  toast.add({ title: '已删除', color: 'success' })
  await load()
}

const load = async () => {
  loading.value = true
  try { bookmarks.value = await fetchBookmarks() } catch (e: any) { toast.add({ title: '加载失败', description: e.message, color: 'error' }) }
  loading.value = false
}

onMounted(() => load())
</script>
