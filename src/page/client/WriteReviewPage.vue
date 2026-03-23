<template>
  <a-card class="ui-card" title="Viết đánh giá" :bodyStyle="{ padding: '12px' }">
    <a-alert
      type="info"
      showIcon
      message="Chỉ cho phép đánh giá sau khi booking đã checked_out và mỗi booking chỉ được đánh giá 1 lần."
      style="margin-bottom:12px"
    />

    <a-result
      v-if="blockedReason"
      status="warning"
      title="Không thể đánh giá"
      :sub-title="blockedReason"
    >
      <template #extra>
        <a-button type="primary" @click="goBookings">Quay lại Bookings</a-button>
      </template>
    </a-result>

    <div v-else>
      <div style="margin-bottom:12px" class="ui-muted">
        Booking: <b>#{{ bookingId }}</b> • Room: <b>#{{ roomId }}</b>
      </div>

      <a-form layout="vertical">
        <a-row :gutter="12">
          <a-col :xs="24" :md="8">
            <a-form-item label="Điểm tổng (1-10)" required>
              <a-input-number v-model:value="form.overall" :min="1" :max="10" style="width:100%" />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="16">
            <a-form-item label="Nhận xét" required>
              <a-textarea v-model:value="form.comment" :rows="3" placeholder="Chia sẻ trải nghiệm của bạn..." />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :xs="24" :md="6">
            <a-form-item label="Sạch sẽ">
              <a-input-number v-model:value="form.cleanliness" :min="1" :max="10" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="6">
            <a-form-item label="Vị trí">
              <a-input-number v-model:value="form.location" :min="1" :max="10" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="6">
            <a-form-item label="Nhân viên">
              <a-input-number v-model:value="form.staff" :min="1" :max="10" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="6">
            <a-form-item label="Thoải mái">
              <a-input-number v-model:value="form.comfort" :min="1" :max="10" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Ảnh thực tế (demo)">
          <a-upload
            list-type="picture-card"
            :file-list="fileList"
            :before-upload="beforeUpload"
            @remove="onRemove"
          >
            <div>Upload</div>
          </a-upload>
          <div class="ui-muted">Demo lưu ảnh base64 vào LocalStorage (không tối ưu cho ảnh lớn).</div>
        </a-form-item>

        <a-space wrap>
          <a-button @click="goBookings">Hủy</a-button>
          <a-button type="primary" @click="submit">Gửi đánh giá</a-button>
        </a-space>
      </a-form>
    </div>
  </a-card>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useReviewsStore } from '@/stores/reviews.js'
import { useAdminBookingsStore } from '@/stores/adminBookings'

const route = useRoute()
const router = useRouter()
const reviewsStore = useReviewsStore()
const bookingsStore = useAdminBookingsStore()

const bookingId = computed(() => Number(route.query.bookingId || 0))
const roomId = computed(() => Number(route.query.roomId || 0))

const booking = computed(() => bookingsStore.byId(bookingId.value))

const blockedReason = computed(() => {
  if (!bookingId.value || !roomId.value) return 'Thiếu bookingId/roomId.'
  if (!booking.value) return 'Không tìm thấy booking.'
  if (booking.value.roomId !== roomId.value) return 'Booking không khớp room.'
  if (booking.value.status !== 'checked_out') return 'Booking chưa checked_out nên chưa thể đánh giá.'
  if (reviewsStore.byBookingId(bookingId.value)) return 'Booking này đã được đánh giá rồi.'
  return ''
})

const form = reactive({
  overall: 9,
  cleanliness: 9,
  location: 9,
  staff: 9,
  comfort: 9,
  comment: ''
})

const fileList = ref([]) // Ant Upload format
const imagesBase64 = ref([])

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function beforeUpload(file) {
  // chặn upload tự động
  const maxSizeMb = 2
  if (file.size / 1024 / 1024 > maxSizeMb) {
    message.error('Ảnh quá lớn (tối đa 2MB/ảnh)')
    return false
  }

  const b64 = await toBase64(file)
  imagesBase64.value.push(b64)

  fileList.value = [
    ...fileList.value,
    {
      uid: file.uid,
      name: file.name,
      status: 'done',
      url: b64
    }
  ]

  return false
}

function onRemove(file) {
  fileList.value = fileList.value.filter(f => f.uid !== file.uid)
  imagesBase64.value = fileList.value.map(f => f.url).filter(Boolean)
}

function submit() {
  if (blockedReason.value) {
    message.warning(blockedReason.value)
    return
  }
  if (!form.comment.trim()) {
    message.error('Vui lòng nhập nhận xét')
    return
  }

  try {
    reviewsStore.create({
      bookingId: bookingId.value,
      roomId: roomId.value,
      overall: Number(form.overall),
      cleanliness: Number(form.cleanliness),
      location: Number(form.location),
      staff: Number(form.staff),
      comfort: Number(form.comfort),
      comment: form.comment.trim(),
      images: imagesBase64.value
    })
    message.success('Đã gửi đánh giá')
    router.push({ name: 'RoomDetail', params: { id: roomId.value } })
  } catch (e) {
    message.error(e?.message || 'Có lỗi xảy ra')
  }
}

function goBookings() {
  router.push('/bookings')
}
</script>