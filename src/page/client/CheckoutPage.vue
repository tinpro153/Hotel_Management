<template>
  <a-card title="Xác nhận đặt phòng (mock)" :bodyStyle="{ padding: '12px' }">
    <a-alert
      type="info"
      showIcon
      message="Hiện tại chỉ là demo. Sau này kết nối API để tạo booking thật."
      style="margin-bottom:12px"
    />

    <a-form layout="vertical">
      <a-row :gutter="12">
        <a-col :xs="24" :sm="12">
          <a-form-item label="Họ tên" required>
            <a-input v-model:value="name" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="Số điện thoại" required>
            <a-input v-model:value="phone" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="Ghi chú">
        <a-textarea v-model:value="note" :rows="3" />
      </a-form-item>

      <a-space wrap>
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
import { useAdminBookingsStore } from '@/stores/adminBookings'
import { useAdminCustomersStore } from '@/stores/adminCustomers'
import { message } from 'ant-design-vue'

const router = useRouter()
const cart = useBookingCartStore()

// stores mà /bookings đang dùng
const bookingsStore = useAdminBookingsStore()
const customersStore = useAdminCustomersStore()

const name = ref('')
const phone = ref('')
const note = ref('')

function goCart() {
  router.push('/cart')
}

function validate() {
  if (!cart.count) return 'Giỏ hàng đang trống'
  if (!name.value.trim()) return 'Vui lòng nhập họ tên'
  if (!phone.value.trim()) return 'Vui lòng nhập số điện thoại'
  return ''
}

function nextId(list) {
  const max = (list || []).reduce((m, x) => Math.max(m, Number(x.id || 0)), 0)
  return max + 1
}

function placeOrder() {
  const err = validate()
  if (err) {
    message.error(err)
    return
  }

  // 1. Tạo customer mới
  const customerId = nextId(customersStore.customers)
  customersStore.create({
    id: customerId,
    name: name.value.trim(),
    phone: phone.value.trim(),
    email: '' // 
  })

  // 2. Tạo booking cho từng item trong cart
  cart.items.forEach((it) => {
    const bookingId = nextId(bookingsStore.bookings)

    bookingsStore.create({
      id: bookingId,
      roomId: Number(it.roomId),
      customerId,
      checkIn: it.checkIn,
      checkOut: it.checkOut,
      guests: Number(it.guests || 1),
      status: 'pending',
      note: note.value || ''
    })
  })

  // 3. Clear cart + chuyển sang /bookings
  cart.clear()
  message.success('Đặt phòng thành công')
  router.push('/bookings')
}
</script>