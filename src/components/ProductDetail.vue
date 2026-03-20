<template>
  <div class="product-detail" v-if="product">
    <div class="detail-content">
      <div class="image-box">
        <img
          :src="require(`@/assets/image/${product.hinh}`)"
          :alt="product.tensp"
        />
      </div>
      <div class="info-box">
        <h1 class="product-title">{{ product.tensp }}</h1>
        <p class="price">Tổng giá: {{ totalPrice.toLocaleString('vi-VN') }}đ</p>
        <div class="size-select">
          <label>Chọn size:</label>
          <div class="size-btn-group">
            <button
              v-for="s in sizes"
              :key="s.id"
              :class="['size-btn', { active: selectedSize && selectedSize.id === s.id }]"
              type="button"
              @click="selectedSize = s"
            >
              {{ s.tensize }} {{ s.price > 0 ? `+${s.price.toLocaleString('vi-VN')}đ` : '' }}
            </button>
          </div>
        </div>
        <div class="topping-select">
          <label>Chọn topping:</label>
          <div class="topping-list">
            <label
              v-for="t in toppings"
              :key="t.id"
              class="topping-item"
            >
              <input
                type="checkbox"
                :value="t.id"
                v-model="selectedToppings"
              />
              {{ t.tentopping }} +{{ t.price.toLocaleString('vi-VN') }}đ
            </label>
          </div>
        </div>
        <button class="add-cart-btn">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Không tìm thấy sản phẩm.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { APIURL } from '../constraint'

const route = useRoute()
const product = ref(null)
const sizes = ref([])
const toppings = ref([])
const selectedSize = ref(null)
const selectedToppings = ref([])

const totalPrice = computed(() => {
  if (!product.value) return 0
  const sizePrice = selectedSize.value ? selectedSize.value.price : 0
  const toppingPrice = toppings.value
    .filter(t => selectedToppings.value.includes(t.id))
    .reduce((sum, t) => sum + t.price, 0)
  return product.value.gia + sizePrice + toppingPrice
})

onMounted(async () => {
  const [productRes, sizesRes, toppingsRes] = await Promise.all([
    axios.get(`${APIURL}/products/${route.params.id}`),
    axios.get(`${APIURL}/sizes`),
    axios.get(`${APIURL}/toppings`)
  ])
  product.value = productRes.data
  sizes.value = sizesRes.data
  toppings.value = toppingsRes.data
  selectedSize.value = sizesRes.data[0] ?? null
})
</script>

<style scoped>
.product-detail {
  width: 100%;
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  padding: 40px 32px;
}
.detail-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}
.image-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-box img {
  width: 320px;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.info-box {
  flex: 2;
  text-align: left;
}
.product-title {
  font-size: 2.2rem;
  color: #0c2b44;
  margin-bottom: 18px;
}
.price {
  font-size: 1.3rem;
  color: #b30404;
  margin-bottom: 18px;
}
.size-select,
.topping-select {
  margin-bottom: 22px;
}
.size-btn-group {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.size-btn {
  padding: 8px 18px;
  border: 1px solid #b30404;
  background: #fff;
  color: #b30404;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}
.size-btn.active,
.size-btn:hover {
  background: #b30404;
  color: #fff;
}
.topping-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
  margin-top: 8px;
}
.topping-item {
  font-size: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}
.add-cart-btn {
  margin-top: 28px;
  padding: 12px 32px;
  background: #0c2b44;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.add-cart-btn:hover {
  background: #b30404;
}
</style>
