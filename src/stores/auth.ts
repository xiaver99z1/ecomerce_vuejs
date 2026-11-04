import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth.api'
import type { User } from '@/types/user.types'
import type { LoginCredentials } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<User | null>(null)
  const isLoading = ref<boolean>(false)
  const isInitialized = ref<boolean>(false)

  const isAuthenticated = computed<boolean>(() => !!token.value && !!user.value)

  async function login(credentials: LoginCredentials): Promise<User> {
    isLoading.value = true
    try {
      const response = await authApi.login(credentials)
      const authToken = response.data.token
      const authUser = response.data.user

      token.value = authToken
      user.value = authUser
      localStorage.setItem('auth_token', authToken)

      return authUser
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(): Promise<User | null> {
    if (!token.value) {
      user.value = null
      return null
    }

    isLoading.value = true
    try {
      const response = await authApi.fetchMe()
      user.value = response.data
      return user.value
    } catch {
      // Token is invalid/expired
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    isLoading.value = true
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('Logout error on server:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      isLoading.value = false
    }
  }

  async function initializeAuth(): Promise<void> {
    if (isInitialized.value) return

    if (token.value) {
      await fetchUser()
    }
    isInitialized.value = true
  }

  return {
    token,
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
    login,
    fetchUser,
    logout,
    initializeAuth,
  }
})

