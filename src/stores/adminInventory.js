import { defineStore } from 'pinia'
import { useAdminBookingsStore } from './adminBookings'

const STORAGE_KEY = 'hotel_admin_inventory_v1'

// Tạo list ngày từ checkIn đến checkOut (không bao gồm checkOut)
function getDateRange(checkIn, checkOut) {
  const dates = []
  const current = new Date(checkIn)
  const end = new Date(checkOut)
  while (current < end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

// inventory[roomId][YYYY-MM-DD] = { status: 'available'|'occupied'|'maintenance'|'closed', note?: '' }
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useAdminInventoryStore = defineStore('adminInventory', {
  state: () => ({
    inventory: load(),
    _initialized: false
  }),
  actions: {
    // ===== Khởi tạo inventory từ bookings =====
    initFromBookings() {
      if (this._initialized) return
      
      const bookingsStore = useAdminBookingsStore()
      const normalized = bookingsStore.normalized
      
      // Cập nhật inventory từ bookings đang confirmed/checked_in/checked_out
      normalized.forEach(b => {
        if (!['confirmed', 'checked_in', 'checked_out'].includes(b.status)) return
        if (!b.checkIn || !b.checkOut) return
        
        const dates = getDateRange(b.checkIn, b.checkOut)
        dates.forEach(date => {
          this.setCell(b.roomId, date, { status: 'occupied', note: `Booking #${b.id}` })
        })
      })
      
      this._initialized = true
    },
    setCell(roomId, date, patch) {
      const rid = String(roomId)
      if (!this.inventory[rid]) this.inventory[rid] = {}
      const cur = this.inventory[rid][date] || {}
      this.inventory[rid][date] = { ...cur, ...patch }
      save(this.inventory)
    },
    clearCell(roomId, date) {
      const rid = String(roomId)
      if (!this.inventory[rid]) return
      delete this.inventory[rid][date]
      save(this.inventory)
    },
    resetAll() {
      this.inventory = {}
      save(this.inventory)
    }
  }
})