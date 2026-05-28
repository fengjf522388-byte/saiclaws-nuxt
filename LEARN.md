# Nuxt 3 学习日志 — saiclaws.com 重建

## 2026-05-28

### Step 1: 环境检查 ✅
Node v26.0.0 · npm 11.12.1 · macOS arm64 · npmmirror 镜像

### Step 2: 项目初始化 ✅
- `nuxt.config.ts` — 配置 UI + Supabase + 暗色模式
- `app.config.ts` — 品牌色定制：primary=blue, secondary=amber, neutral=slate
- `assets/css/main.css` — @import tailwindcss + @nuxt/ui
- `app.vue` — 包裹 `<UApp>`（Nuxt UI 强制要求！）

### Step 3: Nuxt UI v4 Skill 集成 ✅
从 `/Downloads/ui-4/skills/nuxt-ui/` 加载官方 Skill：
- **核心规则**: 必须用语义颜色（primary/secondary/neutral），不能用 raw Tailwind 色值
- **Dashboard 布局**: UDashboardGroup → UDashboardSidebar → UDashboardPanel
- **侧边栏**: UNavigationMenu 自动适配折叠状态
- **搜索**: UDashboardSearch 内置搜索组件
- **图标**: `i-lucide-*` 格式（已安装 @iconify-json/lucide）

### Step 4: 组件重写 ✅
| 文件 | 用的 Nuxt UI 组件 |
|------|-------------------|
| layouts/default.vue | UDashboardGroup, UDashboardSidebar, UNavigationMenu, UDashboardSearch |
| pages/index.vue | UDashboardPanel, UDashboardNavbar, UCard, UProgress, UCheckbox |
| pages/*.vue (8页) | UDashboardPanel, UDashboardNavbar + definePageMeta |

### Step 7: Nuxt 3 最佳实践适配 ✅
从官方 examples-main 学到三个核心模式：

| 模式 | 代码 | 作用 |
|------|------|------|
| `useAsyncData` | `await useAsyncData('key', () => $fetch('/api/xxx'))` | SSR 友好数据获取 |
| `useState` | `useState('key', () => defaultValue)` | 跨组件共享状态 |
| `server/api/` | `defineEventHandler(...)` | 服务端 API 端点 |

**创建的服务端 API**:
| 端点 | 文件 |
|------|------|
| `GET /api/stats` | server/api/stats.ts |
| `GET /api/memos` | server/api/memos.ts |
| `GET /api/diary` | server/api/diary.ts |
| 文件 | 功能 |
|------|------|
| `types/database.types.ts` | 数据库类型定义（8 张表） |
| `composables/useDatabase.ts` | 数据访问层（CRUD + 统计 + 打卡） |
| `pages/index.vue` | Dashboard 接入真实统计/备忘/日记/打卡 |
| `pages/knowledge.vue` | 知识库列表 + 筛选 + 搜索 |
| `layouts/default.vue` | 侧边栏实时显示闪卡待复习数 |

**学到的新概念**:
- `useSupabaseClient()` — Nuxt Supabase 模块自动注入的客户端
- `composables/` — 可复用逻辑，Nuxt 自动导入
- `useToast()` — Nuxt UI 的 toast 通知
- `nuxi prepare` — 生成类型文件（`.nuxt/`）
```bash
cd saiclaws-nuxt && npm run dev
→ http://localhost:3000 → HTTP 200 ✅
```

### 核心 Skill 规则（记住这些）
1. ⚠️ 必须包裹 `<UApp>` — toast/tooltip/overlay 都依赖它
2. 🎨 只用语义颜色 — `text-(--ui-text-muted)` 不用 `text-gray-500`
3. 📂 每个页面加 `definePageMeta({ layout: 'default' })`
4. 🔣 图标用 `i-lucide-{name}` 格式，如 `i-lucide-home`
5. 🎯 `UDashboardPanel` 的内容放 `#body` slot 里才能正确滚动
