import { defineStore } from 'pinia'
import { rooms as seedRooms } from '@/mock/hotel'

const STORAGE_KEY = 'admin_rooms_v1'

function normalizeSeed(list) {
  return (list || []).map(r => ({
    id: Number(r.id),
    name: r.name || `Phòng ${r.id}`,
    typeId: Number(r.typeId || 1),
    capacity: Number(r.capacity || 2),
    price: Number(r.price || 0),
    status: r.status || 'available',
    amenities: Array.isArray(r.amenities) ? r.amenities : []
  }))
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const useAdminRoomsStore = defineStore('adminRooms', {
  state: () => ({
    rooms: load() ?? normalizeSeed(seedRooms)
  }),

  actions: {
    resetSeed(roomsArg) {
      const base = Array.isArray(roomsArg) && roomsArg.length ? roomsArg : seedRooms
      this.rooms = normalizeSeed(base)
      save(this.rooms)
    },

    create(payload) {
      const id = Number(payload.id)
      if (!id) throw new Error('ID không hợp lệ')
      if (this.rooms.some(r => Number(r.id) === id)) throw new Error('ID đã tồn tại')

      this.rooms.push({ ...payload, id })
      save(this.rooms)
    },

    update(id, payload) {
      const idx = this.rooms.findIndex(r => Number(r.id) === Number(id))
      if (idx === -1) throw new Error('Không tìm thấy phòng')

      this.rooms[idx] = { ...this.rooms[idx], ...payload, id: Number(id) }
      save(this.rooms)
    },

    remove(id) {
      this.rooms = this.rooms.filter(r => Number(r.id) !== Number(id))
      save(this.rooms)
    },

    clearStorage() {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})