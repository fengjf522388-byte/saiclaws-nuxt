<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="回收站">
        <template #leading><UDashboardSidebarCollapse /></template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8 text-(--ui-text-muted)">加载中...</div>
        <div v-else-if="!items.length" class="text-center py-8 text-(--ui-text-muted)">🎉 回收站是空的</div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="item in items" :key="item._key">
            <div class="space-y-2">
              <UBadge size="xs" variant="soft" color="error">{{ item._source }}</UBadge>
              <p class="text-sm font-semibold">{{ item._title }}</p>
              <p class="text-xs text-(--ui-text-muted) line-clamp-2">{{ item._desc }}</p>
              <div class="flex gap-2">
                <UButton icon="i-lucide-undo-2" label="恢复" size="xs" variant="outline" @click="restore(item)" />
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const toast = useToast()
const client = useSupabaseClient()

const items = ref<any[]>([])
const loading = ref(true)

const tables = [
  { name: 'knowledge_base', label: '知识库', titleKey: 'topic_name', descKey: 'content' },
  { name: 'study_diary', label: '日记', titleKey: 'chapter_name', descKey: 'oral_transcript' },
  { name: 'daily_memos', label: '备忘录', titleKey: 'content', descKey: 'memo_date' },
]

const load = async () => {
  loading.value = true
  const results: any[] = []
  for (const t of tables) {
    const { data } = await client.from(t.name).select('*').eq('is_deleted', true).order('id', { ascending: false }).limit(50)
    if (data) {
      for (const row of data) {
        results.push({ ...row, _key: `${t.name}-${row.id}`, _source: t.label, _title: row[t.titleKey] || '(无标题)', _desc: row[t.descKey] || '', _table: t.name })
      }
    }
  }
  items.value = results
  loading.value = false
}

const restore = async (item: any) => {
  await client.from(item._table).update({ is_deleted: false }).eq('id', item.id)
  toast.add({ title: '已恢复 ✅', color: 'success' })
  await load()
}

onMounted(() => load())
</script>
