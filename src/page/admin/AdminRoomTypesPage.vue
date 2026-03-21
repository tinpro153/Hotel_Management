<template>
  <a-card title="Quản lý loại phòng" :bodyStyle="{ padding: '12px' }">
    <a-space style="margin-bottom:12px" wrap>
      <a-input
        v-model:value="keyword"
        placeholder="Tìm theo tên/ID..."
        allowClear
        style="width:260px"
      />
      <a-button type="primary" @click="openCreate">Thêm loại phòng</a-button>

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
        <template v-if="column.key === 'priceBase'">
          {{ formatMoney(record.priceBase) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button size="small" @click="openEdit(record)">Sửa</a-button>
            <a-popconfirm title="Xóa loại phòng này?" @confirm="onDelete(record.id)">
              <a-button size="small" danger>Xóa</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- Modal -->
    <a-modal
      v-model:open="modalOpen"
      :title="modalMode === 'create' ? 'Thêm loại phòng' : 'Sửa loại phòng'"
      @ok="onSubmit"
      :okText="modalMode === 'create' ? 'Tạo' : 'Lưu'"
    >
      <a-form layout="vertical">
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Type ID" required>
              <a-input-number
                v-model:value="form.id"
                :min="1"
                style="width:100%"
                :disabled="modalMode === 'edit'"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Tên loại phòng" required>
              <a-input v-model:value="form.name" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Mô tả">
          <a-textarea v-model:value="form.description" :rows="3" placeholder="Ví dụ: Phòng rộng, view đẹp..." />
        </a-form-item>

        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Giá cơ bản/đêm (VNĐ)" required>
              <a-input-number v-model:value="form.priceBase" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Sức chứa gợi ý">
              <a-input-number v-model:value="form.suggestedCapacity" :min="1" :max="10" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useAdminRoomTypesStore } from '@/stores/adminRoomTypes'

const store = useAdminRoomTypesStore()

const keyword = ref('')

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return store.roomTypes.filter(t => {
    if (!kw) return true
    return String(t.id).includes(kw) || (t.name || '').toLowerCase().includes(kw)
  })
})

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'Mô tả', dataIndex: 'description', key: 'description' },
  { title: 'Giá cơ bản', dataIndex: 'priceBase', key: 'priceBase', width: 140 },
  { title: 'Sức chứa gợi ý', dataIndex: 'suggestedCapacity', key: 'suggestedCapacity', width: 140 },
  { title: 'Thao tác', key: 'action', width: 160 }
]

const modalOpen = ref(false)
const modalMode = ref('create') // create | edit

const form = reactive({
  id: 0,
  name: '',
  description: '',
  priceBase: 0,
  suggestedCapacity: 2
})

function openCreate() {
  modalMode.value = 'create'
  form.id = 0
  form.name = ''
  form.description = ''
  form.priceBase = 0
  form.suggestedCapacity = 2
  modalOpen.value = true
}

function openEdit(t) {
  modalMode.value = 'edit'
  form.id = t.id
  form.name = t.name
  form.description = t.description || ''
  form.priceBase = Number(t.priceBase || 0)
  form.suggestedCapacity = Number(t.suggestedCapacity || 2)
  modalOpen.value = true
}

function validate() {
  if (!form.id) return 'Vui lòng nhập Type ID'
  if (!form.name?.trim()) return 'Vui lòng nhập tên loại phòng'
  if (form.priceBase == null || form.priceBase < 0) return 'Giá cơ bản không hợp lệ'
  if (form.suggestedCapacity && form.suggestedCapacity < 1) return 'Sức chứa gợi ý không hợp lệ'
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
    description: (form.description || '').trim(),
    priceBase: Number(form.priceBase),
    suggestedCapacity: Number(form.suggestedCapacity || 0)
  }

  try {
    if (modalMode.value === 'create') {
      store.create(payload)
      message.success('Tạo loại phòng thành công')
    } else {
      store.update(payload.id, payload)
      message.success('Cập nhật loại phòng thành công')
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