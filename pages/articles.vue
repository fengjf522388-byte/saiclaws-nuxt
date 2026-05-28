<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="学习文章">
        <template #leading><UDashboardSidebarCollapse /></template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="p-6 space-y-4">
        <!-- 文章列表 -->
        <div class="grid md:grid-cols-2 gap-4">
          <UCard v-for="article in articles" :key="article._path" class="hover:border-(--ui-primary)/30 transition-colors cursor-pointer" @click="navigateTo(article._path)">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <UBadge v-if="article.subject" variant="soft" size="xs">{{ article.subject }}</UBadge>
                <UBadge v-if="article.level" variant="outline" size="xs">{{ article.level }}</UBadge>
                <span class="text-xs text-(--ui-text-muted) ml-auto">{{ article.date }}</span>
              </div>
              <h3 class="font-semibold text-lg">{{ article.title }}</h3>
              <p v-if="article.description" class="text-sm text-(--ui-text-muted) line-clamp-2">{{ article.description }}</p>
              <NuxtLink :to="article._path" class="text-xs text-(--ui-primary) hover:underline">阅读全文 →</NuxtLink>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

// Nuxt Content — 自动查询 content/ 目录下的 Markdown 文件
const { data: articles } = await useAsyncData('content-articles', () =>
  queryContent('/')
    .sort({ date: -1 })
    .find()
)
</script>
