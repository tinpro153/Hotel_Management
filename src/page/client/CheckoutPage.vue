<template>
  <a-card title="Xác nhận đặt phòng (mock)">
    <a-alert
      type="info"
      showIcon
      message="Hiện tại chỉ là UI demo. Sau này bạn nối API để tạo booking thật."
      style="margin-bottom:12px"
    />

    <a-form layout="vertical">
      <a-row :gutter="12">
        <a-col :xs="24" :sm="12">
          <a-form-item label="Họ tên">
            <a-input v-model:value="name" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="Số điện thoại">
            <a-input v-model:value="phone" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="Ghi chú">
        <a-textarea v-model:value="note" :rows="3" />
      </a-form-item>

      <a-space>
        <a-button @click="goCart">Quay lại giỏ</a-button>
        <a-button type="primary" :disabled="!cart.count" @click="placeOrder">
          Đặt phòng
        </a-button>
      </a-space>
    </a-form>
  </a-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingCartStore } from '@/stores/bookingCart'
import { message } from 'ant-design-vue'

const router = useRouter()
const cart = useBookingCartStore()

const name = ref('')
const phone = ref('')
const note = ref('')

function goCart() {
  router.push('/cart')
}

function placeOrder() {
  // mock success
  cart.clear()
  message.success('Đặt phòng thành công (mock)')
  router.push('/bookings')
}
</script>