<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="文章">
        <template #leading><UDashboardSidebarCollapse /></template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div v-if="pending" class="p-6 text-center text-(--ui-text-muted)">加载中...</div>
      <div v-else-if="!data" class="p-6 text-center text-(--ui-text-muted)">文章未找到</div>
      <div v-else class="p-6 max-w-3xl mx-auto">
        <!-- 文章头 -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-2">
            <UBadge v-if="data.subject" variant="soft">{{ data.subject }}</UBadge>
            <UBadge v-if="data.level" variant="outline">{{ data.level }}</UBadge>
            <span class="text-xs text-(--ui-text-muted)">{{ data.date }}</span>
          </div>
          <h1 class="text-3xl font-bold mb-2">{{ data.title }}</h1>
          <p v-if="data.description" class="text-(--ui-text-muted)">{{ data.description }}</p>
        </div>
        <!-- Markdown 内容 -->
        <div class="prose prose-invert max-w-none">
          <ContentRenderer :value="data" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = (route.params.slug as string[])?.join('/') || ''

const { data, pending } = await useAsyncData(`content-${slug}`, () =>
  queryContent(slug).findOne()
)
</script>
