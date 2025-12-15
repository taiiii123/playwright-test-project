import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type LoginRequest, type RegisterRequest } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const username = ref<string | null>(localStorage.getItem('username'))
  const email = ref<string | null>(localStorage.getItem('email'))

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials)
      token.value = response.data.token
      username.value = response.data.username
      email.value = response.data.email
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', response.data.username)
      localStorage.setItem('email', response.data.email)
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await authApi.register(userData)
      token.value = response.data.token
      username.value = response.data.username
      email.value = response.data.email
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', response.data.username)
      localStorage.setItem('email', response.data.email)
      
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    token.value = null
    username.value = null
    email.value = null
    authApi.logout()
  }

  return {
    token,
    username,
    email,
    isAuthenticated,
    login,
    register,
    logout
  }
})
