<template>
  <div class="space-y-4">
    <UCard v-for="item in items" :key="item.title">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-bold">{{ item.title }}</span>
          <UBadge :color="item.stars >= 5 ? 'error' : 'warning'" variant="subtle" size="sm">
            {{ '⭐'.repeat(item.stars) }}
          </UBadge>
        </div>
      </template>
      <p class="text-sm text-(--ui-text-muted) mb-2">{{ item.author }} · {{ item.type }}</p>
      <p class="text-sm">{{ item.insight }}</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const items = [
  {
    title: '来知德《周易集注》',
    author: '明·来知德',
    type: '明代易学',
    stars: 5,
    insight: '在万县山中隐居29年专心研易，大器晚成的典范。他的「综卦」「错卦」理论是重要创新。用半辈子告诉你：有些人注定是大器晚成型。29年磨一剑，从深山走向世界——你的38岁可能还只是研易的第5年。'
  },
  {
    title: '王夫之《周易外传》《周易内传》',
    author: '清·王夫之（船山）',
    type: '哲学易',
    stars: 5,
    insight: '明清之际最伟大的哲学家。「天下惟器」「道在器中」——道不在天上漂着，道就在具体事物里。你的「人生方向」不是悬在半空的概念，它就在你每天做的事情里。把眼前的事做好，方向自然会慢慢清晰。'
  },
  {
    title: '曾国藩《冰鉴》+ 刘劭《人物志》',
    author: '清·曾国藩 / 三国·刘劭',
    type: '识人之术',
    stars: 5,
    insight: '方向不仅是「做什么事」，还包括「和谁一起做」。冰鉴七法：神骨、刚柔、容貌、情态、须眉、声音、气色——把你15年与人打交道的经验系统化。用八卦找互补搭档：你是乾（领导型）就找坤（执行型）。'
  },
  {
    title: '张志春《神奇之门》',
    author: '现代·张志春',
    type: '奇门遁甲入门',
    stars: 4,
    insight: '奇门遁甲的核心是「时空一体」——做任何决策，时间和空间是两个不可分割的维度。你的方向不仅是「做什么」，还包括「什么时候做」「在哪里做」「和谁一起做」。八门（休生伤杜景死惊开）=八种行动策略。'
  },
  {
    title: '王亭之《紫微斗数初级讲义》',
    author: '现代·王亭之',
    type: '紫微斗数',
    stars: 4,
    insight: '紫微斗数通过命盘十二宫分析人生全景。对38岁最关键的应用：看事业宫主星（适合什么工作类型）、看财帛宫主星（财富来源方式）、看你当前的大限（未来十年运势主题）。记住：是参考框架，不是命运判决书。'
  },
  {
    title: '朱祖夏《命理应用精解》',
    author: '现代·朱祖夏',
    type: '八字命理',
    stars: 4,
    insight: '八字命理最佳现代教材。核心启发：每个人有不同的禀赋配置——有的人天生适合创业（身强），有的人天生适合专家路线（身弱宜印比）。关键是认识自己天生的「配置」，然后选一条匹配的路。38岁已过人生三分之一，用实际经历对照验证。'
  },
  {
    title: '黄宗羲《易学象数论》+ 胡渭《易图明辨》',
    author: '清·黄宗羲 / 清·胡渭',
    type: '考据学',
    stars: 4,
    insight: '不盲从权威的考据精神。你以为自古以来就这样，可能只是某人在某时的创造。同理：「有房有车有存款就是成功」这个「河图洛书」是谁给你画的？你为什么要照单全收？'
  },
]
</script>
