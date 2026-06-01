<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="☯️ 易经寻路指南">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6 space-y-8 max-w-4xl mx-auto">

        <!-- Hero -->
        <div class="text-center py-8">
          <h1 class="text-3xl font-bold mb-3">易经著作深度分析</h1>
          <p class="text-(--ui-text-muted) text-lg">250部著作 · 5批次系统分析</p>
          <p class="text-(--ui-primary) font-bold text-lg mt-2">
            38岁尚未找到成功方向？易经有答案。
          </p>
        </div>

        <!-- 批次导航 -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          <UCard v-for="batch in batches" :key="batch.id" class="cursor-pointer hover:ring-2 hover:ring-(--ui-primary) transition-all" @click="activeBatch = batch.id">
            <div class="text-center">
              <div class="text-2xl mb-1">{{ batch.icon }}</div>
              <div class="font-bold text-sm" :class="activeBatch === batch.id ? 'text-(--ui-primary)' : ''">{{ batch.title }}</div>
              <div class="text-(--ui-text-muted) text-xs">{{ batch.range }}</div>
            </div>
          </UCard>
        </div>

        <!-- 当前批次内容 -->
        <div v-if="activeBatch === 1">
          <h2 class="text-xl font-bold mb-4">📚 第一批（001-050）：入门筑基与核心经典</h2>
          <p class="text-(--ui-text-muted) mb-4">王弼、程颐、朱熹、苏轼、王夫之、南怀瑾、曾仕强、傅佩荣...</p>
          <Batch1Content />
        </div>

        <div v-if="activeBatch === 2">
          <h2 class="text-xl font-bold mb-4">📚 第二批（051-100）：现代应用与人生智慧</h2>
          <p class="text-(--ui-text-muted) mb-4">职场解答、商战应用、高岛断易、荣格心理学路线...</p>
          <Batch2Content />
        </div>

        <div v-if="activeBatch === 3">
          <h2 class="text-xl font-bold mb-4">📚 第三批（101-150）：术数体系与历代传承</h2>
          <p class="text-(--ui-text-muted) mb-4">八字命理、风水堪舆、奇门遁甲、紫微斗数、面相识人、王夫之...</p>
          <Batch3Content />
        </div>

        <div v-if="activeBatch === 4">
          <h2 class="text-xl font-bold mb-4">📚 第四批（151-200）：跨界融合与现代拓展</h2>
          <p class="text-(--ui-text-muted) mb-4">管理学、心理学（荣格）、自然科学、中医养生、2020-2026新作...</p>
          <Batch4Content />
        </div>

        <div v-if="activeBatch === 5">
          <h2 class="text-xl font-bold mb-4">📚 第五批（201-250）：精华50选 + 实操指南</h2>
          <p class="text-(--ui-text-muted) mb-4">从240本中精选50本必读，附四周行动方案和十条终极建议</p>
          <Batch5Content />
        </div>

        <!-- 底部：四条核心方法论 -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-bold">🔑 三大核心方法论</h2>
          </template>
          <div class="space-y-4 text-sm">
            <div class="flex gap-3 items-start">
              <span class="text-xl mt-0.5">1️⃣</span>
              <div>
                <strong>焦循「以易解易」→ 以我解我</strong><br>
                <span class="text-(--ui-text-muted)">用你自己的经历来解读你的方向，不要用别人的模板</span>
              </div>
            </div>
            <div class="flex gap-3 items-start">
              <span class="text-xl mt-0.5">2️⃣</span>
              <div>
                <strong>王弼「得意忘象」→ 抓住本质</strong><br>
                <span class="text-(--ui-text-muted)">不要在表面困难里打转，找到深层规律</span>
              </div>
            </div>
            <div class="flex gap-3 items-start">
              <span class="text-xl mt-0.5">3️⃣</span>
              <div>
                <strong>李鼎祚「集解」→ 兼听则明</strong><br>
                <span class="text-(--ui-text-muted)">多听不同声音，你的答案可能藏在某个角落</span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- 底部信息 -->
        <p class="text-center text-(--ui-text-muted) text-xs py-4">
          由 OpenCLAW 🐵 整理分析 · 2026年6月 · 完整250本分析见工作区 Markdown 文件
        </p>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const activeBatch = ref(1)

const batches = [
  { id: 1, icon: '📖', title: '核心经典', range: '001-050' },
  { id: 2, icon: '💼', title: '现代应用', range: '051-100' },
  { id: 3, icon: '🔮', title: '术数传承', range: '101-150' },
  { id: 4, icon: '🔬', title: '跨界融合', range: '151-200' },
  { id: 5, icon: '⭐', title: '精华指南', range: '201-250' },
]
</script>
