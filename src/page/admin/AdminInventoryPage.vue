<template>
  <a-card title="Tồn kho theo ngày (Calendar - từng phòng)" :bodyStyle="{ padding: '12px' }" class="ui-card">
    <a-space style="margin-bottom:12px" wrap>
      <a-input v-model:value="keyword" allowClear placeholder="Tìm phòng theo tên/ID..." style="width:260px" />
      <a-input-number v-model:value="days" :min="7" :max="31" />
      <a-button @click="prev">←</a-button>
      <a-button @click="next">→</a-button>

      <a-popconfirm title="Xóa toàn bộ calendar overrides?" @confirm="inv.resetAll()">
        <a-button danger>Reset calendar</a-button>
      </a-popconfirm>
    </a-space>

    <div class="hint ui-muted" style="margin-bottom:10px">
      Click vào ô để set trạng thái theo ngày (available/occupied/maintenance/closed). Nếu không set, hệ thống dùng status mặc định của room.
    </div>

    <div class="grid">
      <div class="grid-head">
        <div class="cell room-col">Phòng</div>
        <div v-for="d in dateCols" :key="d" class="cell day-col">{{ d.slice(5) }}</div>
      </div>

      <div v-for="r in filteredRooms" :key="r.id" class="grid-row">
        <div class="cell room-col">
          <div class="room-name"><b>#{{ r.id }}</b> {{ r.name }}</div>
          <div class="ui-muted">{{ r.city ? r.city : '' }}</div>
        </div>

        <div
          v-for="d in dateCols"
          :key="r.id + '-' + d"
          class="cell day-col"
          :class="cellClass(r, d)"
          @click="openCell(r, d)"
        >
          {{ cellStatus(r, d) }}
        </div>
      </div>
    </div>

    <a-modal v-model:open="cellOpen" title="Cập nhật trạng thái theo ngày" @ok="saveCell" okText="Lưu">
      <div style="margin-bottom:10px" class="ui-muted">
        Phòng <b>#{{ cellRoom?.id }}</b> — {{ cellRoom?.name }} <br />
        Ngày: <b>{{ cellDate }}</b>
      </div>

      <a-form layout="vertical">
        <a-form-item label="Trạng thái">
          <a-select v-model:value="cellStatusValue">
            <a-select-option value="inherit">inherit (dùng status phòng)</a-select-option>
            <a-select-option value="available">available</a-select-option>
            <a-select-option value="occupied">occupied</a-select-option>
            <a-select-option value="maintenance">maintenance</a-select-option>
            <a-select-option value="closed">closed (stop sell)</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Ghi chú">
          <a-input v-model:value="cellNote" />
        </a-form-item>
      </a-form>

      <a-button danger @click="clearCell" style="margin-top:8px">Xóa override</a-button>
    </a-modal>
  </a-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAdminRoomsStore } from '@/stores/adminRooms'
import { useAdminInventoryStore } from '@/stores/adminInventory'
import { message } from 'ant-design-vue'

const roomsStore = useAdminRoomsStore()
const inv = useAdminInventoryStore()

const keyword = ref('')
const days = ref(14)

const start = ref(new Date()) // today

function fmt(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const dateCols = computed(() => {
  const res = []
  for (let i = 0; i < Number(days.value || 14); i++) {
    const d = new Date(start.value)
    d.setDate(start.value.getDate() + i)
    res.push(fmt(d))
  }
  return res
})

function prev() {
  const d = new Date(start.value)
  d.setDate(d.getDate() - Number(days.value || 14))
  start.value = d
}
function next() {
  const d = new Date(start.value)
  d.setDate(d.getDate() + Number(days.value || 14))
  start.value = d
}

const filteredRooms = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return roomsStore.rooms.filter(r => {
    if (!kw) return true
    return String(r.id).includes(kw) || (r.name || '').toLowerCase().includes(kw)
  })
})

function getOverride(roomId, date) {
  return inv.inventory?.[String(roomId)]?.[date] || null
}

function cellStatus(room, date) {
  const o = getOverride(room.id, date)
  return o?.status || room.status || 'available'
}

function cellClass(room, date) {
  const s = cellStatus(room, date)
  return {
    'st-available': s === 'available',
    'st-occupied': s === 'occupied',
    'st-maintenance': s === 'maintenance',
    'st-closed': s === 'closed'
  }
}

const cellOpen = ref(false)
const cellRoom = ref(null)
const cellDate = ref('')
const cellStatusValue = ref('inherit')
const cellNote = ref('')

function openCell(room, date) {
  cellRoom.value = room
  cellDate.value = date
  const o = getOverride(room.id, date)
  cellStatusValue.value = o?.status || 'inherit'
  cellNote.value = o?.note || ''
  cellOpen.value = true
}

function saveCell() {
  try {
    if (cellStatusValue.value === 'inherit') {
      inv.clearCell(cellRoom.value.id, cellDate.value)
    } else {
      inv.setCell(cellRoom.value.id, cellDate.value, { status: cellStatusValue.value, note: cellNote.value })
    }
    cellOpen.value = false
    message.success('Đã lưu')
  } catch (e) {
    message.error(e?.message || 'Có lỗi')
  }
}

function clearCell() {
  inv.clearCell(cellRoom.value.id, cellDate.value)
  message.success('Đã xóa override')
}
</script>

<style scoped>
.grid{
  width: 100%;
  overflow: auto;
  border: 1px solid rgba(15,23,42,.10);
  border-radius: 14px;
}

.grid-head, .grid-row{
  display: grid;
  grid-template-columns: 260px repeat(auto-fit, minmax(70px, 1fr));
}

.cell{
  padding: 10px;
  border-bottom: 1px solid rgba(15,23,42,.08);
  border-right: 1px solid rgba(15,23,42,.08);
  font-size: 12px;
  user-select: none;
}

.room-col{
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 2;
}

.grid-head .cell{
  font-weight: 900;
  background: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 3;
}

.day-col{
  text-align: center;
  cursor: pointer;
}

.room-name{ font-size: 13px; }

.st-available{ background: rgba(34,197,94,.10); }
.st-occupied{ background: rgba(244,63,94,.10); }
.st-maintenance{ background: rgba(245,158,11,.10); }
.st-closed{ background: rgba(148,163,184,.18); }
</style>