<template>
  <a-row :gutter="[16,16]">
    <a-col :xs="24" :md="6">
      <a-card class="ui-card">
        <a-statistic title="Bookings" :value="bookingCount" />
        <div class="ui-muted" style="margin-top:6px">Tổng số booking (tất cả trạng thái)</div>
      </a-card>
    </a-col>

    <a-col :xs="24" :md="6">
      <a-card class="ui-card">
        <a-statistic title="Doanh thu" :value="formatMoney(revenue)" />
        <div class="ui-muted" style="margin-top:6px">Chỉ tính booking checked_out</div>
      </a-card>
    </a-col>

    <a-col :xs="24" :md="6">
      <a-card class="ui-card">
        <a-statistic title="Công suất (7 ngày)" :value="occupancyText" />
        <div class="ui-muted" style="margin-top:6px">Booked-nights / Total room-nights</div>
      </a-card>
    </a-col>

    <a-col :xs="24" :md="6">
      <a-card class="ui-card">
        <a-statistic title="Phòng sẵn sàng" :value="availableRooms" />
        <div class="ui-muted" style="margin-top:6px">Theo trạng thái room (static)</div>
      </a-card>
    </a-col>
  </a-row>

  <a-row :gutter="[16,16]" style="margin-top:16px">
    <a-col :xs="24" :lg="14">
      <a-card class="ui-card" title="Bookings theo ngày (7 ngày gần nhất)" :bodyStyle="{ padding: '12px' }">
        <a-table
          :dataSource="bookingsByDay"
          :columns="dayColumns"
          rowKey="date"
          size="small"
          :pagination="false"
        />
      </a-card>
    </a-col>

    <a-col :xs="24" :lg="10">
      <a-card class="ui-card" title="Top phòng theo doanh thu" :bodyStyle="{ padding: '12px' }">
        <a-table
          :dataSource="topRooms"
          :columns="topColumns"
          rowKey="roomId"
          size="small"
          :pagination="false"
        />
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { computed } from 'vue'
import { rooms } from '@/mock/hotel'
import { useAdminBookingsStore } from '@/stores/adminBookings'

const bookingsStore = useAdminBookingsStore()

const bookingCount = computed(() => bookingsStore.normalized.length)

const revenue = computed(() => {
  return bookingsStore.normalized
    .filter(b => b.status === 'checked_out')
    .reduce((s, b) => s + (Number(b.total) || 0), 0)
})

const availableRooms = computed(() => rooms.filter(r => r.status === 'available').length)

function daysRange(n = 7) {
  const res = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    res.push(`${yyyy}-${mm}-${dd}`)
  }
  return res
}

function overlapNights(checkIn, checkOut, day) {
  // night belongs to [day, day+1)
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  const d = new Date(day)
  const d2 = new Date(d); d2.setDate(d.getDate() + 1)
  return a < d2 && b > d
}

const bookingsByDay = computed(() => {
  const days = daysRange(7)
  const list = bookingsStore.normalized

  return days.map(date => {
    const cnt = list.filter(b => overlapNights(b.checkIn, b.checkOut, date)).length
    const checkedOutCnt = list.filter(b => b.status === 'checked_out' && overlapNights(b.checkIn, b.checkOut, date)).length
    return { date, count: cnt, checkedOut: checkedOutCnt }
  })
})

const dayColumns = [
  { title: 'Ngày', dataIndex: 'date', key: 'date' },
  { title: 'Bookings active', dataIndex: 'count', key: 'count', width: 140 },
  { title: 'Checked-out', dataIndex: 'checkedOut', key: 'checkedOut', width: 120 }
]

const topRooms = computed(() => {
  const map = new Map()
  bookingsStore.normalized
    .filter(b => b.status === 'checked_out')
    .forEach(b => {
      const cur = map.get(b.roomId) || 0
      map.set(b.roomId, cur + (Number(b.total) || 0))
    })

  return Array.from(map.entries())
    .map(([roomId, rev]) => ({
      roomId,
      roomName: rooms.find(r => r.id === roomId)?.name || '—',
      revenue: rev
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)
})

const topColumns = [
  { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
  { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', width: 140, customRender: ({ value }) => formatMoney(value) }
]

const occupancyText = computed(() => {
  const days = daysRange(7)
  const totalRoomNights = rooms.length * days.length
  const bookedNights = bookingsStore.normalized.reduce((s, b) => {
    return s + days.filter(d => overlapNights(b.checkIn, b.checkOut, d)).length
  }, 0)

  const pct = totalRoomNights ? Math.round((bookedNights / totalRoomNights) * 100) : 0
  return `${pct}%`
})

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN').format(Number(v || 0))
}
</script>