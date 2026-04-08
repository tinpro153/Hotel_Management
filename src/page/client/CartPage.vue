<template>
  <a-card title="Giỏ đặt phòng">
    <a-table :dataSource="cart.items" :columns="columns" rowKey="id" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'price'">
          {{ formatMoney(record.price) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button danger @click="cart.remove(record.id)">Xóa</a-button>
        </template>
      </template>
    </a-table>

    <a-divider />

    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><b>Tổng:</b> {{ formatMoney(cart.total) }}₫</div>
      <a-space>
        <a-button @click="cart.clear" :disabled="!cart.count">Xóa hết</a-button>
        <a-button type="primary" @click="openPay" :disabled="!cart.count">Thanh toán</a-button>
      </a-space>
    </div>

    <!-- Modal thanh toán QR -->
    <a-modal v-model:open="payOpen" title="Thanh toán chuyển khoản (QR)" :footer="null" width="560px">
      <a-alert
        type="info"
        showIcon
        message="Quét QR để chuyển khoản. Nội dung chuyển khoản giúp đối soát nhanh (demo)."
        style="margin-bottom:12px"
      />

      <!-- Thông tin xuất hóa đơn -->
      <a-form layout="vertical" style="margin-bottom:12px">
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Họ tên" required>
              <a-input v-model:value="payerName" placeholder="Nguyễn Văn A" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Số điện thoại" required>
              <a-input v-model:value="payerPhone" placeholder="090..." />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Email" required>
              <a-input v-model:value="payerEmail" placeholder="abc@gmail.com" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Địa chỉ" required>
              <a-input v-model:value="payerAddress" placeholder="Số nhà, đường, quận..." />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <div style="display:flex; justify-content:space-between; margin-bottom:8px">
        <span class="ui-muted">Tổng tiền</span>
        <b>{{ formatMoney(cart.total) }}₫</b>
      </div>

      <a-descriptions bordered size="small" :column="1" style="margin-bottom:12px">
        <a-descriptions-item label="Ngân hàng">{{ payment.bankName }}</a-descriptions-item>
        <a-descriptions-item label="Số tài khoản">{{ payment.bankAccount }}</a-descriptions-item>
        <a-descriptions-item label="Chủ tài khoản">{{ payment.accountHolder }}</a-descriptions-item>
        <a-descriptions-item label="Nội dung">{{ transferInfo }}</a-descriptions-item>
      </a-descriptions>

      <div style="text-align:center">
        <img
          :src="qrUrl"
          alt="VietQR"
          style="width:100%; max-width:360px; border:1px solid #eee; border-radius:12px"
        />
        <div class="ui-muted" style="margin-top:8px">
          Nếu QR không hiện, kiểm tra lại bankName / bankAccount.
        </div>
      </div>

      <a-divider />

      <a-space wrap style="display:flex; justify-content:flex-end">
        <a-button :disabled="paying" @click="payOpen=false">Đóng</a-button>
        <a-button type="primary" :loading="paying" @click="payAndCreateInvoice">Tôi đã thanh toán</a-button>
      </a-space>
    </a-modal>
  </a-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import { useBookingCartStore } from '@/stores/bookingCart'
import { usePaymentStore } from '@/stores/payment'
import { buildVietQrUrl } from '@/utils/vietqr'

import { useAdminBookingsStore } from '@/stores/adminBookings'
import { useAdminCustomersStore } from '@/stores/adminCustomers'
import { useAdminInvoicesStore } from '@/stores/adminInvoices'

const router = useRouter()
const cart = useBookingCartStore()
const payment = usePaymentStore()

const bookingsStore = useAdminBookingsStore()
const customersStore = useAdminCustomersStore()
const invoicesStore = useAdminInvoicesStore()

const columns = [
  { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
  { title: 'Check-in', dataIndex: 'checkIn', key: 'checkIn' },
  { title: 'Check-out', dataIndex: 'checkOut', key: 'checkOut' },
  { title: 'Khách', dataIndex: 'guests', key: 'guests' },
  { title: 'Giá', dataIndex: 'price', key: 'price' },
  { title: 'Thao tác', key: 'action' }
]

const payOpen = ref(false)
const paying = ref(false)

const payerName = ref('')
const payerPhone = ref('')
const payerEmail = ref('')
const payerAddress = ref('')

function openPay() {
  payOpen.value = true
}

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN').format(Number(v || 0))
}

const transferInfo = computed(() => `HOTEL ${cart.items.length} DON`)

const qrUrl = computed(() => {
  return buildVietQrUrl({
    bankName: payment.bankName,
    bankAccount: payment.bankAccount,
    accountHolder: payment.accountHolder,
    amount: cart.total,
    addInfo: transferInfo.value
  })
})

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function nextId(list) {
  const max = (list || []).reduce((m, x) => Math.max(m, Number(x.id || 0)), 0)
  return max + 1
}

function validateInvoiceInfo() {
  if (!cart.count) return 'Giỏ hàng đang trống'
  if (!payerName.value.trim()) return 'Vui lòng nhập họ tên'
  if (!payerPhone.value.trim()) return 'Vui lòng nhập số điện thoại'
  if (!payerEmail.value.trim()) return 'Vui lòng nhập email'
  if (!payerAddress.value.trim()) return 'Vui lòng nhập địa chỉ'
  return ''
}

async function payAndCreateInvoice() {
  const err = validateInvoiceInfo()
  if (err) {
    message.error(err)
    return
  }

  if (paying.value) return
  paying.value = true

  try {
    // giả lập thanh toán 1–2 giây
    const ms = 1000 + Math.floor(Math.random() * 1000)
    await sleep(ms)

    // 1) tạo customer
    const customerId = nextId(customersStore.customers)
    customersStore.create({
      id: customerId,
      name: payerName.value.trim(),
      phone: payerPhone.value.trim(),
      email: payerEmail.value.trim(),
      address: payerAddress.value.trim()
    })

    // 2) tạo booking cho từng item
    const createdBookingIds = []
    cart.items.forEach((it) => {
      const bookingId = nextId(bookingsStore.bookings)
      createdBookingIds.push(bookingId)

      bookingsStore.create({
        id: bookingId,
        roomId: Number(it.roomId),
        customerId,
        checkIn: it.checkIn,
        checkOut: it.checkOut,
        guests: Number(it.guests || 1),
        status: 'pending',
        note: `Invoice for ${payerName.value.trim()}`
      })
    })

    // 3) tạo invoice (CÁCH B: có trạng thái paid)
    const nowIso = new Date().toISOString()
    const invoice = {
      invoiceNo: `INV-${Date.now()}`,
      createdAt: nowIso,
      paid: true,
      paidAt: nowIso,

      customer: {
        id: customerId,
        name: payerName.value.trim(),
        phone: payerPhone.value.trim(),
        email: payerEmail.value.trim(),
        address: payerAddress.value.trim()
      },

      items: cart.items.map((it) => ({
        roomName: it.roomName,
        checkIn: it.checkIn,
        checkOut: it.checkOut,
        guests: it.guests,
        price: it.price
      })),

      total: cart.total,

      bank: {
        bankName: payment.bankName,
        bankAccount: payment.bankAccount,
        accountHolder: payment.accountHolder,
        transferInfo: transferInfo.value
      },

      bookingIds: createdBookingIds
    }

    // ✅ lưu vào admin invoices để admin xem
    invoicesStore.create(invoice)

    cart.clear()
    payOpen.value = false
    message.success('Đã thanh toán thành công (mock)')

    // chuyển sang trang hóa đơn client
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(invoice))))
    router.push({ path: '/checkout', query: { invoice: encoded } })
  } finally {
    paying.value = false
  }
}
</script>