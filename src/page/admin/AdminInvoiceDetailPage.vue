<template>
  <a-card title="Chi tiết hóa đơn" :bodyStyle="{ padding: '12px' }">
    <a-alert
      v-if="!invoice"
      type="warning"
      showIcon
      message="Không tìm thấy hóa đơn. Vui lòng quay lại danh sách hóa đơn."
      style="margin-bottom:12px"
    />

    <template v-else>
      <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:12px">
        <div>
          <div><b>Mã hóa đơn:</b> {{ invoice.invoiceNo }}</div>
          <div class="ui-muted">Ngày tạo: {{ formatDate(invoice.createdAt) }}</div>
        </div>

        <a-space wrap>
          <a-button @click="goBack">Quay lại</a-button>
          <a-button type="primary" @click="exportPdf">Xuất PDF</a-button>
          <a-button @click="printInvoice">In</a-button>
        </a-space>
      </div>

      <!-- ✅ vùng sẽ export PDF -->
      <div ref="invoiceRef" class="invoice-wrap">
        <a-alert
          v-if="invoice.paid"
          type="success"
          showIcon
          :message="`Trạng thái: Đã thanh toán${invoice.paidAt ? ' • ' + formatDate(invoice.paidAt) : ''}`"
          style="margin-bottom:12px"
        />
        <a-alert v-else type="info" showIcon message="Trạng thái: Chưa thanh toán" style="margin-bottom:12px" />

        <a-descriptions bordered size="small" :column="1" style="margin-bottom:12px">
          <a-descriptions-item label="Khách hàng">{{ invoice.customer?.name }}</a-descriptions-item>
          <a-descriptions-item label="Số điện thoại">{{ invoice.customer?.phone }}</a-descriptions-item>
          <a-descriptions-item label="Email">{{ invoice.customer?.email }}</a-descriptions-item>
          <a-descriptions-item label="Địa chỉ">{{ invoice.customer?.address }}</a-descriptions-item>
        </a-descriptions>

        <a-table :dataSource="invoice.items || []" :columns="cols" rowKey="rowKey" :pagination="false" />

        <a-divider />

        <div style="display:flex; justify-content:space-between; align-items:center">
          <div class="ui-muted">Tổng thanh toán</div>
          <div style="font-weight:900; font-size:18px">{{ formatMoney(invoice.total) }}₫</div>
        </div>
      </div>
    </template>
  </a-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import html2pdf from 'html2pdf.js'

// ✅ quan trọng: lấy invoice từ query (truyền từ trang list)
const route = useRoute()
const router = useRouter()
const invoiceRef = ref(null)

function safeDecodeInvoice(s) {
  try {
    const json = decodeURIComponent(escape(atob(String(s || ''))))
    return JSON.parse(json)
  } catch {
    return null
  }
}

const invoice = computed(() => safeDecodeInvoice(route.query.invoice))

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

function exportPdf() {
  const el = invoiceRef.value
  if (!el || !invoice.value) return

  const filename = `hoa-don-${invoice.value.invoiceNo || 'invoice'}.pdf`
  const opt = {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(el).save()
}

function goBack() {
  router.push('/admin/invoices')
}
</script>

<style scoped>
.invoice-wrap {
  background: #fff;
}
</style>