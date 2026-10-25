<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

if (user.value) {
  navigateTo('/')
}

async function signIn() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  error.value = err ? err.message : ''
  if (!err) navigateTo('/')
  loading.value = false
}

async function signUp() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  error.value = err ? err.message : '注册请求已发送，按 Supabase 邮箱设置完成确认后即可登录'
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <form class="w-full max-w-sm space-y-4" @submit.prevent="signIn">
      <h1 class="text-xl font-semibold text-center">登录 saiclaws</h1>
      <input
        v-model="email"
        type="email"
        placeholder="邮箱"
        required
        class="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700"
      />
      <input
        v-model="password"
        type="password"
        placeholder="密码（至少 6 位）"
        required
        minlength="6"
        class="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700"
      />
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
      >
        登录
      </button>
      <button
        type="button"
        :disabled="loading"
        class="w-full rounded border border-gray-300 py-2 dark:border-gray-700"
        @click="signUp"
      >
        注册账号
      </button>
    </form>
  </div>
</template>
