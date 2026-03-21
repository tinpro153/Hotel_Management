<template>
  <a-card title="Quản lý phòng" :bodyStyle="{ padding: '12px' }">
    <a-space style="margin-bottom:12px" wrap>
      <a-input v-model:value="keyword" placeholder="Tìm theo tên/ID..." allowClear style="width:260px" />

      <a-select v-model:value="status" allowClear placeholder="Trạng thái" style="width:180px">
        <a-select-option value="available">available</a-select-option>
        <a-select-option value="occupied">occupied</a-select-option>
        <a-select-option value="maintenance">maintenance</a-select-option>
      </a-select>

      <a-button type="primary" @click="openCreate">Thêm phòng</a-button>
      <a-popconfirm title="Reset về dữ liệu mẫu?" @confirm="store.resetSeed()">
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
        <template v-if="column.key === 'price'">
          {{ formatMoney(record.price) }}
        </template>

        <template v-else-if="column.key === 'amenities'">
          <a-tag v-for="a in record.amenities.slice(0, 3)" :key="a">{{ a }}</a-tag>
          <a-tag v-if="record.amenities.length > 3">+{{ record.amenities.length - 3 }}</a-tag>
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button size="small" @click="openEdit(record)">Sửa</a-button>
            <a-popconfirm title="Xóa phòng này?" @confirm="onDelete(record.id)">
              <a-button size="small" danger>Xóa</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- Modal -->
    <a-modal
      v-model:open="modalOpen"
      :title="modalMode === 'create' ? 'Thêm phòng' : 'Sửa phòng'"
      @ok="onSubmit"
      :okText="modalMode === 'create' ? 'Tạo' : 'Lưu'"
    >
      <a-form layout="vertical">
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="ID phòng" required>
              <a-input-number
                v-model:value="form.id"
                style="width:100%"
                :disabled="modalMode === 'edit'"
                :min="1"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Tên phòng" required>
              <a-input v-model:value="form.name" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Loại phòng (typeId)" required>
              <a-select v-model:value="form.typeId" style="width:100%">
                <a-select-option v-for="t in roomTypes" :key="t.id" :value="t.id">
                  {{ t.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Trạng thái" required>
              <a-select v-model:value="form.status" style="width:100%">
                <a-select-option value="available">available</a-select-option>
                <a-select-option value="occupied">occupied</a-select-option>
                <a-select-option value="maintenance">maintenance</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Sức chứa" required>
              <a-input-number v-model:value="form.capacity" :min="1" :max="10" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Giá/đêm (VNĐ)" required>
              <a-input-number v-model:value="form.price" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Tiện nghi (ngăn cách bằng dấu phẩy)">
          <a-input v-model:value="amenitiesText" placeholder="Wifi, TV, Điều hòa" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { roomTypes } from '@/mock/hotel'
import { useAdminRoomsStore } from '@/stores/adminRooms'

const store = useAdminRoomsStore()

const keyword = ref('')
const status = ref(undefined)

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return store.rooms.filter(r => {
    const okKw =
      !kw ||
      String(r.id).includes(kw) ||
      (r.name || '').toLowerCase().includes(kw)
    const okStatus = !status.value || r.status === status.value
    return okKw && okStatus
  })
})

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'Type', dataIndex: 'typeId', key: 'typeId', width: 90 },
  { title: 'Sức chứa', dataIndex: 'capacity', key: 'capacity', width: 100 },
  { title: 'Giá', dataIndex: 'price', key: 'price', width: 140 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 130 },
  { title: 'Tiện nghi', key: 'amenities' },
  { title: 'Thao tác', key: 'action', width: 160 }
]

const modalOpen = ref(false)
const modalMode = ref('create') // create | edit

const form = reactive({
  id: 0,
  name: '',
  typeId: 1,
  capacity: 2,
  price: 0,
  status: 'available',
  amenities: []
})
const amenitiesText = ref('')

function openCreate() {
  modalMode.value = 'create'
  form.id = 0
  form.name = ''
  form.typeId = roomTypes[0]?.id || 1
  form.capacity = 2
  form.price = 0
  form.status = 'available'
  amenitiesText.value = 'Wifi, TV'
  modalOpen.value = true
}

function openEdit(r) {
  modalMode.value = 'edit'
  form.id = r.id
  form.name = r.name
  form.typeId = r.typeId
  form.capacity = r.capacity
  form.price = r.price
  form.status = r.status
  amenitiesText.value = (r.amenities || []).join(', ')
  modalOpen.value = true
}

function parseAmenities(text) {
  return (text || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

function validate() {
  if (!form.id) return 'Vui lòng nhập ID'
  if (!form.name?.trim()) return 'Vui lòng nhập tên phòng'
  if (!form.typeId) return 'Vui lòng chọn loại phòng'
  if (!form.capacity || form.capacity < 1) return 'Sức chứa không hợp lệ'
  if (form.price == null || form.price < 0) return 'Giá không hợp lệ'
  return ''
}

function onSubmit() {
  const err = validate()
  if (err) {
    message.error(err)
    return
  }

  const payload = {
    id: Number(form.id),
    name: form.name.trim(),
    typeId: Number(form.typeId),
    capacity: Number(form.capacity),
    price: Number(form.price),
    status: form.status,
    amenities: parseAmenities(amenitiesText.value)
  }

  try {
    if (modalMode.value === 'create') {
      store.create(payload)
      message.success('Tạo phòng thành công')
    } else {
      store.update(payload.id, payload)
      message.success('Cập nhật phòng thành công')
    }
    modalOpen.value = false
  } catch (e) {
    message.error(e?.message || 'Có lỗi xảy ra')
  }
}

function onDelete(id) {
  store.remove(id)
  message.success('Đã xóa')
}

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN').format(v)
}
</script>