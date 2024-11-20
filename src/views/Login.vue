<template>
  <div class="container">
    <div class="row justify-content-center min-vh-100 align-items-center">
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Login</h2>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="email" 
                  required
                  placeholder="Enter your email"
                >
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="password" 
                  required
                  placeholder="Enter your password"
                >
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <button 
                type="submit" 
                class="btn btn-primary w-100" 
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)

    const handleLogin = async () => {
      try {
        loading.value = true
        error.value = ''

        const response = await axios.post('/api/users/login', {
          email: email.value,
          password: password.value
        })

        // Handle the token response
        const { token } = response.data
        if (token) {
          // Store token in Vuex
          store.commit('setAuth', token)
          
          // Configure axios defaults for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Redirect to home page
          router.push('/')
        } else {
          throw new Error('Token not received')
        }
      } catch (err) {
        console.error('Login error:', err)
        error.value = err.response?.data?.message || 'Login failed. Please check your credentials.'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      error,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #2c3e50;
  font-weight: 500;
}

input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
  font-size: 0.9rem;
}
</style> 