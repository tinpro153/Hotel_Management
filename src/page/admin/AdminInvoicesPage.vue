<template>
  <a-card title="Quản lý hóa đơn" :bodyStyle="{ padding: '12px' }">
    <a-space style="margin-bottom:12px" wrap>
      <a-input v-model:value="keyword" allowClear placeholder="Tìm theo mã hóa đơn / khách / SĐT..." style="width:320px" />
      <a-button @click="store.clearAll" danger>Xóa tất cả (demo)</a-button>
    </a-space>

    <a-table :dataSource="filtered" :columns="columns" rowKey="invoiceNo" :pagination="{ pageSize: 8 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'total'">
          {{ formatMoney(record.total) }}₫
        </template>

        <template v-else-if="column.key === 'paid'">
          <a-tag :color="record.paid ? 'green' : 'gold'">
            {{ record.paid ? 'paid' : 'unpaid' }}
          </a-tag>
        </template>

        <template v-else-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button size="small" type="primary" @click="openDetail(record)">Xem</a-button>
            <a-popconfirm title="Xóa hóa đơn này?" @confirm="store.remove(record.invoiceNo)">
              <a-button size="small" danger>Xóa</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="detailOpen" title="Chi tiết hóa đơn" :footer="null" width="720px">
      <template v-if="selected">
        <a-descriptions bordered size="small" :column="1" style="margin-bottom:12px">
          <a-descriptions-item label="Mã hóa đơn">{{ selected.invoiceNo }}</a-descriptions-item>
          <a-descriptions-item label="Ngày tạo">{{ formatDate(selected.createdAt) }}</a-descriptions-item>
          <a-descriptions-item label="Trạng thái">{{ selected.paid ? 'paid' : 'unpaid' }}</a-descriptions-item>
        </a-descriptions>

        <a-descriptions bordered size="small" :column="1" style="margin-bottom:12px">
          <a-descriptions-item label="Khách">{{ selected.customer?.name }}</a-descriptions-item>
          <a-descriptions-item label="SĐT">{{ selected.customer?.phone }}</a-descriptions-item>
          <a-descriptions-item label="Email">{{ selected.customer?.email }}</a-descriptions-item>
          <a-descriptions-item label="Địa chỉ">{{ selected.customer?.address }}</a-descriptions-item>
        </a-descriptions>

        <a-table :dataSource="selected.items || []" :columns="itemCols" rowKey="k" :pagination="false" />

        <a-divider />
        <div style="display:flex; justify-content:space-between; align-items:center">
          <span class="ui-muted">Tổng</span>
          <b>{{ formatMoney(selected.total) }}₫</b>
        </div>
      </template>
    </a-modal>
  </a-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAdminInvoicesStore } from '@/stores/adminInvoices'

const store = useAdminInvoicesStore()

const keyword = ref('')
const detailOpen = ref(false)
const selected = ref(null)

const columns = [
  { title: 'Mã', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 160 },
  { title: 'Khách', dataIndex: ['customer', 'name'], key: 'customerName' },
  { title: 'SĐT', dataIndex: ['customer', 'phone'], key: 'phone', width: 130 },
  { title: 'Ngày', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  { title: 'Tổng', dataIndex: 'total', key: 'total', width: 140 },
  { title: 'Trạng thái', dataIndex: 'paid', key: 'paid', width: 110 },
  { title: 'Thao tác', key: 'action', width: 160 }
]

const itemCols = [
  { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
  { title: 'Check-in', dataIndex: 'checkIn', key: 'checkIn', width: 120 },
  { title: 'Check-out', dataIndex: 'checkOut', key: 'checkOut', width: 120 },
  { title: 'Khách', dataIndex: 'guests', key: 'guests', width: 80 },
  { title: 'Giá', dataIndex: 'price', key: 'price', width: 120, customRender: ({ text }) => formatMoney(text) }
].map((c, idx) => ({ ...c, k: idx }))

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  const list = store.sorted

  if (!kw) return list

  return list.filter((i) => {
    const s =
      `${i.invoiceNo} ${i.customer?.name || ''} ${i.customer?.phone || ''} ${i.customer?.email || ''}`.toLowerCase()
    return s.includes(kw)
  })
})

function openDetail(r) {
  selected.value = r
  detailOpen.value = true
}

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
</script>