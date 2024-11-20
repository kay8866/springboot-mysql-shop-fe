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

    <!-- Products Grid -->
    <div v-else class="row g-4">
      <div class="col-12 col-sm-6 col-lg-4 col-xl-3" v-for="product in products" :key="product.id">
        <div class="card h-100 shadow-sm">
          <router-link 
            :to="{ name: 'ProductDetail', params: { id: product.id }}" 
            class="text-decoration-none"
          >
            <div class="position-relative">
              <img 
                :src="product.image" 
                :alt="product.name" 
                class="card-img-top product-image"
              >
              <div class="position-absolute top-0 end-0 p-2">
                <span class="badge bg-light text-dark">
                  Stock: {{ product.stock }}
                </span>
              </div>
            </div>
          </router-link>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            
            <div class="mb-2">
              <span 
                v-for="category in product.categories" 
                :key="category.id" 
                class="badge bg-secondary me-1"
              >
                {{ category.name }}
              </span>
            </div>
            
            <p class="card-text text-muted small flex-grow-1">
              {{ truncateDescription(product.description) }}
            </p>
            
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold mb-0 text-primary">
                  ${{ formatPrice(product.price) }}
                </h6>
              </div>
              
              <button 
                @click="addToCart(product)" 
                class="btn btn-primary w-100"
                :disabled="product.stock === 0"
              >
                <i class="bi bi-cart-plus me-1"></i>
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && products.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted"></i>
      <p class="mt-3">No products available</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from '../utils/axios'

export default {
  setup() {
    const store = useStore()
    const products = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchProducts = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await axios.get('/products')
        products.value = response.data
      } catch (err) {
        console.error('Error fetching products:', err)
        error.value = 'Failed to load products. Please try again later.'
      } finally {
        loading.value = false
      }
    }

    const addToCart = (product) => {
      store.commit('addToCart', product)
      showNotification(`${product.name} added to cart!`)
    }

    const truncateDescription = (text, length = 100) => {
      return text.length > length 
        ? text.substring(0, length) + '...' 
        : text
    }

    const formatPrice = (price) => {
      return price.toFixed(2)
    }

    const showNotification = (message) => {
      alert(message)
    }

    onMounted(() => {
      fetchProducts()
    })

    return {
      products,
      loading,
      error,
      addToCart,
      truncateDescription,
      formatPrice
    }
  }
}
</script>

<style scoped>
.product-image {
  height: 200px;
  object-fit: cover;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}
</style> 