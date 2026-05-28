<template>
  <UDashboardGroup>
    <!-- ============ 侧边栏 ============ -->
    <UDashboardSidebar collapsible resizable>
      <template #header="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" @click="searchOpen = true" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="navItems"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <div class="space-y-1">
          <UButton
            :icon="collapsed ? 'i-lucide-download' : undefined"
            :label="collapsed ? undefined : '导出数据'"
            color="neutral"
            variant="ghost"
            block
            @click="exportData"
          />
          <UButton
            :icon="collapsed ? 'i-lucide-trash-2' : undefined"
            :label="collapsed ? undefined : '回收站'"
            color="neutral"
            variant="ghost"
            block
            to="/trash"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <!-- ============ 页面内容 ============ -->
    <slot />

    <!-- ============ 全局搜索弹窗 ============ -->
    <UDashboardSearch
      :groups="searchGroups"
      @close="searchOpen = false"
    />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const { fetchDueFlashcards } = useDatabase()

const srsDue = ref(0)

// 导航菜单 — 分组数组
const navItems = computed<NavigationMenuItem[][]>(() => [
  [{
    label: '工作台',
    icon: 'i-lucide-layout-dashboard',
    to: '/'
  }, {
    label: '今日',
    icon: 'i-lucide-calendar',
    to: '/today',
    ...(srsDue.value > 0 ? { badge: String(srsDue.value) } : {})
  }],
  [{
    label: '知识库',
    icon: 'i-lucide-library',
    to: '/knowledge'
  }, {
    label: '闪卡复习',
    icon: 'i-lucide-cards',
    to: '/flashcards',
    ...(srsDue.value > 0 ? { badge: String(srsDue.value) } : {})
  }, {
    label: '学习日记',
    icon: 'i-lucide-book-open',
    to: '/diary'
  }],
  [{
    label: '备忘录',
    icon: 'i-lucide-clipboard-list',
    to: '/memos'
  }, {
    label: '番茄钟',
    icon: 'i-lucide-timer',
    to: '/pomodoro'
  }, {
    label: '收藏夹',
    icon: 'i-lucide-bookmark',
    to: '/bookmarks'
  }]
])

const searchOpen = ref(false)
const searchGroups = computed(() => [])

const exportData = () => {
  // TODO: 导出 JSON
}

// 加载闪卡待复习数
onMounted(async () => {
  try {
    const due = await fetchDueFlashcards()
    srsDue.value = due.length
  } catch (e) {}
})
</script>
