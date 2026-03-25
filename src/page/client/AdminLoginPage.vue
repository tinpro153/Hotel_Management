<template>
  <a-row justify="center" style="padding:40px 16px">
    <a-col :xs="24" :sm="16" :md="10" :lg="8">
      <a-card title="Admin Login">
        <div class="hint ui-muted" style="margin-bottom:12px">
          Demo: admin/admin123 or manager/manager123
        </div>
        <a-form layout="vertical">
          <a-form-item label="Username">
            <a-input v-model:value="username" :disabled="loading" @keyup.enter="login" />
          </a-form-item>
          <a-form-item label="Password">
            <a-input-password v-model:value="password" :disabled="loading" @keyup.enter="login" />
          </a-form-item>
          <a-button type="primary" block @click="login" :loading="loading">Đăng nhập</a-button>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const loading = ref(false)

function login() {
  try {
    loading.value = true
    // Validate & login
    authStore.login(username.value, password.value)
    message.success(`Welcome ${username.value}!`)
    router.push('/admin')
  } catch (e) {
    message.error(e?.message || 'Có lỗi')
  } finally {
    loading.value = false
  }
}
</script>