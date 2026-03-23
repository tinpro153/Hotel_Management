import { defineStore } from 'pinia'
import { bookings as seedBookings, rooms as seedRooms } from '@/mock/hotel'

const STORAGE_KEY = 'hotel_admin_bookings_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

function calcTotal(b, rooms) {
  if (b.total != null) return Number(b.total) || 0
  const room = rooms.find(r => r.id === b.roomId)
  const nights = calcNights(b.checkIn, b.checkOut)
  return (Number(room?.price || 0) * nights) || 0
}

export const useAdminBookingsStore = defineStore('adminBookings', {
  state: () => ({
    bookings: (load() || seedBookings || []).map(b => ({ ...b }))
  }),
  getters: {
    byId: (state) => (id) => state.bookings.find(b => b.id === Number(id)),
    normalized: (state) => {
      // đảm bảo booking luôn có total + status hợp lệ
      const rooms = seedRooms
      return state.bookings.map(b => ({
        ...b,
        id: Number(b.id),
        roomId: Number(b.roomId),
        customerId: Number(b.customerId),
        guests: Number(b.guests || 1),
        status: b.status || 'pending',
        total: calcTotal(b, rooms)
      }))
    }
  },
  actions: {
    resetSeed() {
      this.bookings = (seedBookings || []).map(b => ({ ...b }))
      save(this.bookings)
    },
    create(booking) {
      if (this.bookings.some(b => b.id === Number(booking.id))) {
        throw new Error('Booking ID đã tồn tại')
      }
      this.bookings.unshift({ ...booking, id: Number(booking.id) })
      save(this.bookings)
    },
    update(id, patch) {
      const idx = this.bookings.findIndex(b => b.id === Number(id))
      if (idx === -1) throw new Error('Không tìm thấy booking')
      this.bookings[idx] = { ...this.bookings[idx], ...patch, id: Number(id) }
      save(this.bookings)
    },
    remove(id) {
      this.bookings = this.bookings.filter(b => b.id !== Number(id))
      save(this.bookings)
    },

    // ----- status flow -----
    setStatus(id, status) {
      const allowed = new Set([
        'pending',
        'confirmed',
        'checked_in',
        'checked_out',
        'cancelled',
        'no_show',
        'refunded'
      ])
      if (!allowed.has(status)) throw new Error('Trạng thái không hợp lệ')
      this.update(id, { status })
    },

    confirm(id) {
      const b = this.byId(id)
      if (!b) throw new Error('Không tìm thấy booking')
      if (b.status !== 'pending') throw new Error('Chỉ xác nhận booking đang pending')
      this.setStatus(id, 'confirmed')
    },
    cancel(id) {
      const b = this.byId(id)
      if (!b) throw new Error('Không tìm thấy booking')
      if (!['pending', 'confirmed'].includes(b.status)) {
        throw new Error('Chỉ hủy booking pending/confirmed')
      }
      this.setStatus(id, 'cancelled')
    },
    noShow(id) {
      const b = this.byId(id)
      if (!b) throw new Error('Không tìm thấy booking')
      if (b.status !== 'confirmed') throw new Error('No-show chỉ áp dụng cho confirmed')
      this.setStatus(id, 'no_show')
    },
    checkIn(id) {
      const b = this.byId(id)
      if (!b) throw new Error('Không tìm thấy booking')
      if (b.status !== 'confirmed') throw new Error('Check-in chỉ áp dụng cho confirmed')
      this.setStatus(id, 'checked_in')
    },
    checkOut(id) {
      const b = this.byId(id)
      if (!b) throw new Error('Không tìm thấy booking')
      if (b.status !== 'checked_in') throw new Error('Check-out chỉ áp dụng cho checked_in')
      this.setStatus(id, 'checked_out')
    },
    refund(id, refundedAmount = 0) {
      const b = this.byId(id)
      if (!b) throw new Error('Không tìm thấy booking')
      if (!['cancelled', 'no_show'].includes(b.status)) {
        throw new Error('Refund chỉ áp dụng cho cancelled/no_show')
      }
      this.update(id, { status: 'refunded', refundedAmount: Number(refundedAmount || 0) })
    }
  }
})