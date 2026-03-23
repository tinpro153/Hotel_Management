import { defineStore } from 'pinia'

/**
 * Demo coupons:
 * - WELCOME10: giảm 10% tối đa 200k
 * - LONGSTAY5: giảm 5% nếu >= 5 đêm (tính theo tổng nights trong cart)
 * - FLAT100: giảm 100k nếu subtotal >= 1.000.000
 */
const COUPONS = [
  { code: 'WELCOME10', type: 'percent', value: 10, maxDiscount: 200000, minSubtotal: 0, minNights: 0, active: true },
  { code: 'LONGSTAY5', type: 'percent', value: 5, maxDiscount: null, minSubtotal: 0, minNights: 5, active: true },
  { code: 'FLAT100', type: 'flat', value: 100000, maxDiscount: null, minSubtotal: 1000000, minNights: 0, active: true }
]

export const useCouponsStore = defineStore('coupons', {
  state: () => ({
    coupons: COUPONS
  }),
  getters: {
    byCode: (state) => (code) => state.coupons.find(c => c.code === String(code || '').toUpperCase())
  },
  actions: {
    validate({ code, subtotal, nights }) {
      const c = this.byCode(code)
      if (!c) return { ok: false, reason: 'Mã giảm giá không tồn tại.' }
      if (!c.active) return { ok: false, reason: 'Mã giảm giá đã hết hiệu lực.' }
      if ((subtotal || 0) < (c.minSubtotal || 0)) return { ok: false, reason: `Chỉ áp dụng cho đơn từ ${c.minSubtotal}₫.` }
      if ((nights || 0) < (c.minNights || 0)) return { ok: false, reason: `Chỉ áp dụng cho đơn từ ${c.minNights} đêm.` }
      return { ok: true, coupon: c }
    },
    calcDiscount({ coupon, subtotal }) {
      if (!coupon) return 0
      let d = 0
      if (coupon.type === 'percent') d = Math.round((subtotal || 0) * (coupon.value / 100))
      if (coupon.type === 'flat') d = Number(coupon.value || 0)
      if (coupon.maxDiscount != null) d = Math.min(d, Number(coupon.maxDiscount))
      d = Math.max(0, d)
      return Math.min(d, subtotal || 0)
    }
  }
})