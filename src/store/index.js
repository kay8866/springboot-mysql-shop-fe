import { createStore } from 'vuex'

export default createStore({
  state: {
    cart: [],
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  mutations: {
    addToCart(state, product) {
      const existingProduct = state.cart.find(item => item.id === product.id)
      
      if (existingProduct) {
        existingProduct.quantity++
      } else {
        state.cart.push({
          ...product,
          quantity: 1
        })
      }
    },
    setAuth(state, token) {
      state.token = token
      state.isAuthenticated = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getToken: state => state.token
  }
}) 