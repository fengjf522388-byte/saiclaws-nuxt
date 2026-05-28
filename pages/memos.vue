<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="备忘录">
        <template #leading><UDashboardSidebarCollapse /></template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="p-6 space-y-4">
        <UCard>
          <div class="flex gap-2 mb-4">
            <UInput v-model="newMemoContent" icon="i-lucide-plus" placeholder="添加新备忘..." @keyup.enter="addMemo" class="flex-1" />
            <USelect v-model="newMemoPriority" :items="priorityOpts" class="w-24" />
            <UButton label="添加" @click="addMemo" :loading="adding" />
          </div>
        </UCard>

        <div v-if="loading" class="text-center text-(--ui-text-muted) py-8">加载中...</div>
        <UCard v-else>
          <div v-if="!filteredMemos.length" class="text-center text-(--ui-text-muted) py-8">暂无备忘录</div>
          <div v-for="m in filteredMemos" :key="m.id" class="flex items-center gap-3 py-2.5 border-b border-(--ui-border) last:border-0">
            <UCheckbox :model-value="m.is_done" size="sm" @change="toggleMemoItem(m)" />
            <span class="text-sm flex-1" :class="{ 'line-through text-(--ui-text-muted)': m.is_done }">{{ m.content }}</span>
            <UBadge v-if="m.priority" size="xs" :color="m.priority === 'high' ? 'error' : m.priority === 'medium' ? 'warning' : 'neutral'" variant="soft">
              {{ m.priority === 'high' ? '高' : m.priority === 'medium' ? '中' : '低' }}
            </UBadge>
            <span class="text-xs text-(--ui-text-muted) w-20 text-right">{{ m.memo_date?.slice(5) }}</span>
            <UButton icon="i-lucide-trash-2" variant="ghost" size="xs" color="error" @click="removeMemo(m.id)" />
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const toast = useToast()
const { fetchMemos, saveMemo, toggleMemo } = useDatabase()
const client = useSupabaseClient()

const memos = ref<any[]>([])
const loading = ref(true)
const adding = ref(false)
const newMemoContent = ref('')
const newMemoPriority = ref('')

const priorityOpts = [
  { label: '无', value: '' },
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' },
]

const filteredMemos = computed(() => memos.value)

const addMemo = async () => {
  if (!newMemoContent.value.trim()) return
  adding.value = true
  try {
    const today = new Date().toISOString().slice(0, 10)
    await saveMemo({ content: newMemoContent.value.trim(), memo_date: today, priority: newMemoPriority.value || null })
    newMemoContent.value = ''
    newMemoPriority.value = ''
    toast.add({ title: '备忘已添加', color: 'success' })
    await load()
  } catch (e: any) { toast.add({ title: '添加失败', description: e.message, color: 'error' }) }
  adding.value = false
}

const toggleMemoItem = async (m: any) => { await toggleMemo(m.id, m.is_done); m.is_done = !m.is_done }
const removeMemo = async (id: number) => {
  await client.from('daily_memos').update({ is_deleted: true }).eq('id', id)
  toast.add({ title: '已删除', color: 'success' })
  await load()
}

const load = async () => {
  loading.value = true
  try { memos.value = await fetchMemos() } catch (e: any) { toast.add({ title: '加载失败', description: e.message, color: 'error' }) }
  loading.value = false
}

onMounted(() => load())
</script>
