import { defineStore } from 'pinia'

const STORAGE_KEY = 'hotel_admin_auth_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(data) {
  if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

// Mock admin accounts
const ADMIN_ACCOUNTS = [
  { username: 'admin', password: 'admin123' },
  { username: 'manager', password: 'manager123' }
]

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: load()
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    currentUser: (state) => state.user
  },
  actions: {
    login(username, password) {
      // Validate
      if (!username || !password) {
        throw new Error('Vui lòng nhập username và password')
      }

      // Check mock accounts
      const account = ADMIN_ACCOUNTS.find(
        a => a.username === username && a.password === password
      )

      if (!account) {
        throw new Error('Username hoặc password không đúng')
      }

      // Save auth
      const user = { username: account.username, loginTime: new Date().toISOString() }
      this.user = user
      save(user)
    },
    logout() {
      this.user = null
      save(null)
    }
  }
})
