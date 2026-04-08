<template>
  <a-card title="Hóa đơn thanh toán (mock)" :bodyStyle="{ padding: '12px' }">
    <a-alert
      v-if="!invoice"
      type="warning"
      showIcon
      message="Không tìm thấy dữ liệu hóa đơn. Vui lòng quay lại giỏ và thanh toán."
      style="margin-bottom:12px"
    />

    <template v-else>
      <!-- Trạng thái -->
      <a-alert
        v-if="paid"
        type="success"
        showIcon
        :message="`Trạng thái: Đã thanh toán${invoice.paidAt ? ' • ' + formatDate(invoice.paidAt) : ''}`"
        style="margin-bottom:12px"
      />
      <a-alert v-else type="info" showIcon message="Trạng thái: Chưa thanh toán" style="margin-bottom:12px" />

      <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap">
        <div>
          <div><b>Mã hóa đơn:</b> {{ invoice.invoiceNo }}</div>
          <div class="ui-muted">Ngày tạo: {{ formatDate(invoice.createdAt) }}</div>
        </div>

        <a-space wrap>
          <a-button @click="goBookings">Xem đơn đặt (/bookings)</a-button>
          <a-button type="primary" @click="printInvoice">In hóa đơn</a-button>
        </a-space>
      </div>

      <a-divider />

      <a-descriptions bordered size="small" :column="1" style="margin-bottom:12px">
        <a-descriptions-item label="Khách hàng">{{ invoice.customer.name }}</a-descriptions-item>
        <a-descriptions-item label="Số điện thoại">{{ invoice.customer.phone }}</a-descriptions-item>
        <a-descriptions-item label="Email">{{ invoice.customer.email }}</a-descriptions-item>
        <a-descriptions-item label="Địa chỉ">{{ invoice.customer.address }}</a-descriptions-item>
      </a-descriptions>

      <a-table :dataSource="invoice.items" :columns="cols" rowKey="rowKey" :pagination="false" />

      <a-divider />

      <div style="display:flex; justify-content:space-between; align-items:center">
        <div class="ui-muted">Tổng thanh toán</div>
        <div style="font-weight:900; font-size:18px">{{ formatMoney(invoice.total) }}₫</div>
      </div>

      <a-divider />

      <!-- ✅ CÁCH B: chỉ hiện QR khi CHƯA thanh toán -->
      <div v-if="!paid" style="text-align:center">
        <div style="font-weight:800; margin-bottom:8px">QR chuyển khoản (tham khảo)</div>
        <img
          :src="qrUrl"
          alt="VietQR"
          style="width:100%; max-width:360px; border:1px solid #eee; border-radius:12px"
        />
        <div class="ui-muted" style="margin-top:8px">
          {{ invoice.bank.bankName }} - {{ invoice.bank.bankAccount }} - {{ invoice.bank.accountHolder }}
        </div>
        <div class="ui-muted">Nội dung: {{ invoice.bank.transferInfo }}</div>
      </div>
    </template>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buildVietQrUrl } from '@/utils/vietqr'

const route = useRoute()
const router = useRouter()

function safeDecodeInvoice(s) {
  try {
    const json = decodeURIComponent(escape(atob(String(s || ''))))
    return JSON.parse(json)
  } catch {
    return null
  }
}

const invoice = computed(() => safeDecodeInvoice(route.query.invoice))

// ✅ CÁCH B: lấy paid từ invoice
const paid = computed(() => !!invoice.value?.paid)

const cols = [
  { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
  { title: 'Check-in', dataIndex: 'checkIn', key: 'checkIn', width: 120 },
  { title: 'Check-out', dataIndex: 'checkOut', key: 'checkOut', width: 120 },
  { title: 'Khách', dataIndex: 'guests', key: 'guests', width: 80 },
  {
    title: 'Giá',
    dataIndex: 'price',
    key: 'price',
    width: 140,
    customRender: ({ text }) => formatMoney(text)
  }
].map((c, idx) => ({ ...c, rowKey: idx }))

const qrUrl = computed(() => {
  if (!invoice.value) return ''
  return buildVietQrUrl({
    bankName: invoice.value.bank.bankName,
    bankAccount: invoice.value.bank.bankAccount,
    accountHolder: invoice.value.bank.accountHolder,
    amount: invoice.value.total,
    addInfo: invoice.value.bank.transferInfo
  })
})

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN').format(Number(v || 0))
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('vi-VN')
  } catch {
    return iso
  }
}

function printInvoice() {
  window.print()
}

function goBookings() {
  router.push('/bookings')
}
</script>