<template>
  <a-row justify="center" style="padding:40px 16px">
    <a-col :xs="24" :sm="16" :md="10" :lg="8">
      <a-card title="Admin Login (mock)">
        <a-form layout="vertical">
          <a-form-item label="Username">
            <a-input v-model:value="username" />
          </a-form-item>
          <a-form-item label="Password">
            <a-input-password v-model:value="password" />
          </a-form-item>
          <a-button type="primary" block @click="login">Đăng nhập</a-button>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const username = ref('')
const password = ref('')

function login() {
  // mock login
  message.success('Login thành công (mock)')
  router.push('/admin')
}
</script>