import { defineStore } from 'pinia'
import { roomTypes as seedRoomTypes } from '@/mock/hotel'

const STORAGE_KEY = 'hotel_admin_room_types_v1'

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

export const useAdminRoomTypesStore = defineStore('adminRoomTypes', {
  state: () => ({
    roomTypes: load() || seedRoomTypes.map(t => ({ ...t }))
  }),
  getters: {
    byId: (state) => (id) => state.roomTypes.find(t => t.id === Number(id))
  },
  actions: {
    resetSeed() {
      this.roomTypes = seedRoomTypes.map(t => ({ ...t }))
      save(this.roomTypes)
    },
    create(type) {
      if (this.roomTypes.some(t => t.id === Number(type.id))) {
        throw new Error('Type ID đã tồn tại')
      }
      this.roomTypes.unshift({ ...type, id: Number(type.id) })
      save(this.roomTypes)
    },
    update(id, patch) {
      const idx = this.roomTypes.findIndex(t => t.id === Number(id))
      if (idx === -1) throw new Error('Không tìm thấy room type')
      this.roomTypes[idx] = { ...this.roomTypes[idx], ...patch, id: Number(id) }
      save(this.roomTypes)
    },
    remove(id) {
      this.roomTypes = this.roomTypes.filter(t => t.id !== Number(id))
      save(this.roomTypes)
    }
  }
})