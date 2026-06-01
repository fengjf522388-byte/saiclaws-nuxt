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
    title: '刘君祖《易经与现代生活》',
    author: '现代·刘君祖',
    type: '现代应用',
    stars: 5,
    insight: '台湾最活跃的易学应用专家，把六十四卦放到现代生活：职场、情感、健康、投资……最核心的洞察：不仅看你现在是什么卦（本卦=现状），还要看你在往什么卦变化（之卦=趋势）。不要只盯着现状焦虑，要看清趋势的方向。'
  },
  {
    title: '《易经——史上最强职场解答之书》',
    author: '现代编著',
    type: '职场应用',
    stars: 5,
    insight: '六十四卦对应六十四个职场智慧法则——工作、财富、交际、身心健康全覆盖。对于在职场打拼了十几年但还没找到方向的38岁人士来说，这本书就像一本「职场易经词典」。'
  },
  {
    title: '吴进辉《易经十二卦解答AI时代人生难题》',
    author: '现代·吴进辉',
    type: '2025新作',
    stars: 5,
    insight: 'AI时代最需要的十二卦：AI能替代什么？AI不能替代什么？（乾/坤）；技术变革中如何保持竞争力？（革/鼎）；信息过载中如何保持内心平静？（艮/兑）。2025年出版，最新的易学应用视角。'
  },
  {
    title: '顾文《易经你我他——人生64个怎么办》',
    author: '现代·顾文',
    type: '人生问题解答',
    stars: 5,
    insight: '把六十四卦对应到六十四个人生常见问题。畅销10万册。和找方向直接相关的卦：屯卦（万事开头难）、蒙卦（学新东西无从下手）、需卦（等待时机）、比卦（找不到同道）、大畜卦（怎么积累核心竞争力）。'
  },
  {
    title: '高岛吞象《高岛断易》',
    author: '日本·高岛吞象',
    type: '占筮实践',
    stars: 5,
    insight: '日本明治维新传奇人物，日本易学第一人。核心方法论：「至诚息妄」——当你心够诚、够静，杂念被清空的时候，答案其实早就在心里，只是被噪音盖住了。38岁想太多反而找不到方向，试试「至诚」的方法——清空脑子，只问一个真问题。'
  },
  {
    title: '余敦康《周易现代解读》',
    author: '现代·余敦康',
    type: '现代诠释',
    stars: 5,
    insight: '著名哲学大家对易经的现代转化。「明体达用」——既讲清楚哲学体系（体），又落实到伦常日用（用）。核心主张：每个时代都应创造属于自己时代的易学——你不要照搬古人的解法来指导现代人生。'
  },
  {
    title: '紫钦天《太极博弈原理》',
    author: '现代·紫钦天',
    type: '思想融汇',
    stars: 5,
    insight: '不解释卦象，只讲易学思想在生活中的运用。你没学过易经也能培养「易思维」。核心概念：未来信息对现在的影响往往是负面的——越是过多考虑未来的不确定，就越难把握现在。别再「等我准备好」了。'
  },
  {
    title: '梁冬《周易有答案》',
    author: '现代·梁冬',
    type: '生活应用',
    stars: 4,
    insight: '你不是在算卦，你是在用易经做自我对话。你之所以迷茫，不是因为缺少信息，而是因为没有和自己的内心好好对话。易经就是对话的工具——六十四卦是六十四个人生场景，把你的问题投射进去。'
  },
]
</script>
