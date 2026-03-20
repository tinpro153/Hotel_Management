import { defineStore } from 'pinia'
import axios from 'axios'
import { APIURL } from '../constraint'

function normalizeToppings(toppings = []) {
  return toppings
    .map(t => ({ id: Number(t.id), tentopping: t.tentopping, price: Number(t.price) || 0 }))
    .sort((a, b) => a.id - b.id)
}

function sameToppings(left = [], right = []) {
  if (left.length !== right.length) return false
  return left.every((item, index) => item.id === right[index].id)
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
    error: null
  }),
  getters: {
    cartCount: state => state.cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal: state => state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  },
  actions: {
    async fetchCart() {
      try {
        const response = await axios.get(`${APIURL}/cart`)
        this.cartItems = response.data
      } catch (error) {
        this.error = 'Lỗi khi lấy giỏ hàng'
      }
    },

    async addToCart(payload) {
      if (!payload || !payload.id) return

      const normalizedToppings = normalizeToppings(payload.toppings || payload.topping || [])

      const cartItem = {
        id: Number(payload.id),
        name: payload.name || payload.tensp || '',
        image: payload.image || payload.hinh || '',
        size: {
          id: Number(payload.size?.id || payload.size?.idsize || 0),
          name: payload.size?.name || payload.size?.namesize || payload.size?.tensize || ''
        },
        toppings: normalizedToppings,
        price: Number(payload.price) || 0,
        quantity: Number(payload.quantity) || 1
      }

      try {
        const existIndex = this.cartItems.findIndex(item => {
          const sameProduct = Number(item.id) === cartItem.id
          const sameSize = Number(item.size?.id) === Number(cartItem.size.id)
          const itemToppings = normalizeToppings(item.toppings || item.topping || [])
          return sameProduct && sameSize && sameToppings(itemToppings, cartItem.toppings)
        })

        if (existIndex === -1) {
          this.cartItems.push(cartItem)
          await axios.post(`${APIURL}/cart`, cartItem)
          return
        }

        const updated = {
          ...this.cartItems[existIndex],
          quantity: this.cartItems[existIndex].quantity + cartItem.quantity,
          price: cartItem.price,
          image: cartItem.image || this.cartItems[existIndex].image
        }

        this.cartItems[existIndex] = updated
        await axios.put(`${APIURL}/cart/${updated.id}`, updated)
      } catch (error) {
        this.error = 'Lỗi khi thêm sản phẩm vào giỏ hàng'
      }
    },

    async removeCartItem(itemId) {
      const index = this.cartItems.findIndex(item => Number(item.id) === Number(itemId))
      if (index === -1) return

      try {
        this.cartItems.splice(index, 1)
        await axios.delete(`${APIURL}/cart/${itemId}`)
      } catch (error) {
        this.error = 'Lỗi khi xóa sản phẩm khỏi giỏ hàng'
      }
    }
  }
})
