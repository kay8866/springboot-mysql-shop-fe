<template>
  <div class="container py-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="row">
      <!-- Back Button -->
      <div class="col-12 mb-4">
        <button @click="goBack" class="btn btn-outline-primary">
          <i class="bi bi-arrow-left"></i> Back to Products
        </button>
      </div>

      <!-- Product Image -->
      <div class="col-12 col-md-6 mb-4">
        <div class="card border-0 shadow-sm">
          <img :src="product.image" :alt="product.name" class="card-img-top product-image">
        </div>
      </div>

      <!-- Product Info -->
      <div class="col-12 col-md-6">
        <div class="card border-0 shadow-sm p-4">
          <h1 class="mb-3">{{ product.name }}</h1>
          
          <!-- Categories -->
          <div class="mb-3">
            <span 
              v-for="category in product.categories" 
              :key="category.id" 
              class="badge bg-secondary me-2"
            >
              {{ category.name }}
            </span>
          </div>

          <!-- Price and Stock -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary mb-0">${{ formatPrice(product.price) }}</h2>
            <span :class="['badge', stockStatusClass]">
              {{ stockStatus }}
            </span>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <h5>Description</h5>
            <p class="text-muted">{{ product.description }}</p>
          </div>

          <!-- Add to Cart -->
          <div class="d-flex align-items-center">
            <div class="input-group me-3" style="width: 140px;">
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                @click="decrementQuantity"
                :disabled="quantity <= 1"
              >
                <i class="bi bi-dash"></i>
              </button>
              <input 
                type="number" 
                class="form-control text-center" 
                v-model="quantity"
                min="1"
                :max="product.stock"
              >
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                @click="incrementQuantity"
                :disabled="quantity >= product.stock"
              >
                <i class="bi bi-plus"></i>
              </button>
            </div>

            <button 
              @click="addToCart" 
              class="btn btn-primary flex-grow-1"
              :disabled="product.stock === 0"
            >
              <i class="bi bi-cart-plus me-2"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from '../utils/axios'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    
    const product = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const quantity = ref(1)

    // Computed properties
    const stockStatus = computed(() => {
      if (!product.value) return ''
      if (product.value.stock === 0) return 'Out of Stock'
      if (product.value.stock < 10) return 'Low Stock'
      return 'In Stock'
    })

    const stockStatusClass = computed(() => {
      if (!product.value) return ''
      if (product.value.stock === 0) return 'bg-danger'
      if (product.value.stock < 10) return 'bg-warning text-dark'
      return 'bg-success'
    })

    // Methods
    const fetchProduct = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await axios.get(`/products/${route.params.id}`)
        product.value = response.data
      } catch (err) {
        console.error('Error fetching product:', err)
        error.value = 'Failed to load product details. Please try again later.'
      } finally {
        loading.value = false
      }
    }

    const formatPrice = (price) => {
      return price.toFixed(2)
    }

    const incrementQuantity = () => {
      if (quantity.value < product.value.stock) {
        quantity.value++
      }
    }

    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const addToCart = () => {
      store.commit('addToCart', {
        ...product.value,
        quantity: quantity.value
      })
      // Show success message (you can implement a toast notification here)
      alert(`${quantity.value} ${product.value.name}(s) added to cart!`)
    }

    const goBack = () => {
      router.push('/')
    }

    onMounted(() => {
      fetchProduct()
    })

    return {
      product,
      loading,
      error,
      quantity,
      stockStatus,
      stockStatusClass,
      formatPrice,
      incrementQuantity,
      decrementQuantity,
      addToCart,
      goBack
    }
  }
}
</script>

<style scoped>
.product-image {
  max-height: 500px;
  object-fit: contain;
  background-color: #f8f9fa;
}

/* Remove arrows from number input */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style> 