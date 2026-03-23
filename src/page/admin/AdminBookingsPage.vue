<template>
  <a-card title="Quản lý đặt phòng" :bodyStyle="{ padding: '12px' }">
    <a-space style="margin-bottom:12px" wrap>
      <a-input v-model:value="keyword" placeholder="Tìm theo mã/khách/phòng..." allowClear style="width:260px" />
      <a-select v-model:value="status" allowClear placeholder="Trạng thái" style="width:220px">
        <a-select-option value="pending">pending</a-select-option>
        <a-select-option value="confirmed">confirmed</a-select-option>
        <a-select-option value="checked_in">checked_in</a-select-option>
        <a-select-option value="checked_out">checked_out</a-select-option>
        <a-select-option value="cancelled">cancelled</a-select-option>
        <a-select-option value="no_show">no_show</a-select-option>
        <a-select-option value="refunded">refunded</a-select-option>
      </a-select>

      <a-popconfirm title="Reset về dữ liệu mẫu?" @confirm="bookingsStore.resetSeed()">
        <a-button>Reset seed</a-button>
      </a-popconfirm>
    </a-space>

    <a-table
      :dataSource="filtered"
      :columns="columns"
      rowKey="id"
      :pagination="{ pageSize: 8 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
        </template>

        <template v-else-if="column.key === 'total'">
          {{ formatMoney(record.total) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button size="small" type="primary" :disabled="record.status !== 'pending'" @click="onConfirm(record.id)">
              Confirm
            </a-button>

            <a-button size="small" :disabled="record.status !== 'confirmed'" @click="onCheckIn(record.id)">
              Check-in
            </a-button>

            <a-button size="small" :disabled="record.status !== 'checked_in'" @click="onCheckOut(record.id)">
              Check-out
            </a-button>

            <a-dropdown>
              <a-button size="small">Thêm</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item :disabled="record.status !== 'confirmed'" @click="onNoShow(record.id)">
                    No-show
                  </a-menu-item>

                  <a-menu-item :disabled="!['pending','confirmed'].includes(record.status)" @click="onCancel(record.id)">
                    Cancel
                  </a-menu-item>

                  <a-menu-item :disabled="!['cancelled','no_show'].includes(record.status)" @click="openRefund(record)">
                    Refund
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="refundOpen" title="Refund booking" @ok="doRefund" okText="Refund">
      <div class="ui-muted" style="margin-bottom:10px">
        Booking: <b>#{{ refundTarget?.id }}</b> — Tổng: <b>{{ formatMoney(refundTarget?.total || 0) }}</b>
      </div>
      <a-form layout="vertical">
        <a-form-item label="Số tiền hoàn (VNĐ)">
          <a-input-number v-model:value="refundAmount" :min="0" style="width:100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import { rooms } from '@/mock/hotel'
import { useAdminBookingsStore } from '@/stores/adminBookings'
import { useAdminCustomersStore } from '@/stores/adminCustomers'

const bookingsStore = useAdminBookingsStore()
const customersStore = useAdminCustomersStore()

const keyword = ref('')
const status = ref(undefined)

const rows = computed(() => {
  const bookings = bookingsStore.normalized
  return bookings.map(b => ({
    ...b,
    customerName: customersStore.byId(b.customerId)?.name || '—',
    roomName: rooms.find(r => r.id === b.roomId)?.name || '—'
  }))
})

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return rows.value.filter(r => {
    const okKw =
      !kw ||
      String(r.id).includes(kw) ||
      (r.customerName || '').toLowerCase().includes(kw) ||
      (r.roomName || '').toLowerCase().includes(kw)
    const okStatus = !status.value || r.status === status.value
    return okKw && okStatus
  })
})

const columns = [
  { title: 'Mã', dataIndex: 'id', key: 'id', width: 90 },
  { title: 'Khách', dataIndex: 'customerName', key: 'customerName' },
  { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
  { title: 'Check-in', dataIndex: 'checkIn', key: 'checkIn', width: 120 },
  { title: 'Check-out', dataIndex: 'checkOut', key: 'checkOut', width: 120 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 140 },
  { title: 'Tổng', dataIndex: 'total', key: 'total', width: 140 },
  { title: 'Thao tác', key: 'action', width: 260 }
]

function statusColor(s) {
  if (s === 'pending') return 'gold'
  if (s === 'confirmed') return 'blue'
  if (s === 'checked_in') return 'green'
  if (s === 'checked_out') return 'cyan'
  if (s === 'cancelled') return 'red'
  if (s === 'no_show') return 'volcano'
  if (s === 'refunded') return 'purple'
  return 'default'
}

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN').format(Number(v || 0))
}

function safeRun(fn) {
  try {
    fn()
  } catch (e) {
    message.error(e?.message || 'Có lỗi xảy ra')
  }
}

function onConfirm(id) {
  safeRun(() => {
    bookingsStore.confirm(id)
    message.success('Đã confirm')
  })
}
function onCancel(id) {
  safeRun(() => {
    bookingsStore.cancel(id)
    message.success('Đã cancel')
  })
}
function onNoShow(id) {
  safeRun(() => {
    bookingsStore.noShow(id)
    message.success('Đã set no-show')
  })
}
function onCheckIn(id) {
  safeRun(() => {
    bookingsStore.checkIn(id)
    message.success('Đã check-in')
  })
}
function onCheckOut(id) {
  safeRun(() => {
    bookingsStore.checkOut(id)
    message.success('Đã check-out')
  })
}

const refundOpen = ref(false)
const refundTarget = ref(null)
const refundAmount = ref(0)

function openRefund(record) {
  refundTarget.value = record
  refundAmount.value = record?.total || 0
  refundOpen.value = true
}

function doRefund() {
  safeRun(() => {
    bookingsStore.refund(refundTarget.value.id, refundAmount.value)
    refundOpen.value = false
    message.success('Đã refund')
  })
}
</script>