<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light" v-if="isAuthenticated">
    <div class="container">
      <router-link class="navbar-brand" to="/">Vue Shop</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/cart">
              <i class="bi bi-cart"></i> Cart ({{ cartItemCount }})
            </router-link>
          </li>
          <li class="nav-item">
            <button @click="handleLogout" class="btn btn-outline-danger ms-2">
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <router-view></router-view>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const handleLogout = () => {
      store.commit('setAuth', null)
      router.push('/login')
    }

    return {
      cartItemCount: computed(() => store.state.cart.length),
      isAuthenticated: computed(() => store.getters.isAuthenticated),
      handleLogout
    }
  }
}
</script>

<style>
body {
  background-color: #f8f9fa;
}

.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.cart-link {
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  border: 1px solid #333;
  border-radius: 4px;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>
