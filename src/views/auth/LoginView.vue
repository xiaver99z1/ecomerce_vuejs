<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types/auth.types'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive<LoginCredentials>({
  email: '',
  password: '',
})

const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})

function fillDemoCredentials() {
  form.email = 'admin@example.com'
  form.password = 'password123'
  errorMessage.value = null
  fieldErrors.value = {}
}

async function handleSubmit() {
  errorMessage.value = null
  fieldErrors.value = {}

  if (!form.email || !form.password) {
    errorMessage.value = 'Please provide both email and password.'
    return
  }

  isSubmitting.value = true

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    })

    const redirectPath = (route.query.redirect as string) || '/dashboard'
    await router.push(redirectPath)
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 422) {
        fieldErrors.value = err.response.data?.errors || {}
        errorMessage.value = err.response.data?.message || 'Invalid credentials. Please try again.'
      } else if (err.response?.status === 429) {
        errorMessage.value = 'Too many login attempts. Please wait a minute and try again.'
      } else if (!err.response) {
        errorMessage.value = 'Cannot reach the backend server. Is Laravel running on http://localhost:8000?'
      } else {
        errorMessage.value = err.response.data?.message || 'Login failed. Please check your credentials.'
      }
    } else {
      errorMessage.value = 'An unexpected error occurred.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-indigo-500 selection:text-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo / Header -->
      <div class="flex justify-center">
        <div class="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      <h2 class="mt-4 text-center text-3xl font-extrabold tracking-tight text-white">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-slate-400">
        Laravel 13 Sanctum API &bull; Vue 3 &bull; Tailwind CSS
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
      <div class="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
        
        <!-- Demo Credentials Helper Card -->
        <div class="mb-6 rounded-lg bg-indigo-950/50 border border-indigo-800/60 p-3.5 text-xs text-indigo-200 flex items-center justify-between">
          <div>
            <span class="font-semibold text-indigo-300">Test Account:</span>
            <div class="text-slate-300 font-mono mt-0.5">admin@example.com / password123</div>
          </div>
          <button
            type="button"
            @click="fillDemoCredentials"
            class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium text-xs transition shadow-sm cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        <!-- Global Error Alert -->
        <div
          v-if="errorMessage"
          class="mb-6 rounded-lg bg-red-950/50 border border-red-800/80 p-3.5 text-sm text-red-200 flex items-start gap-2.5"
        >
          <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-300">
              Email address
            </label>
            <div class="mt-1.5 relative">
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                placeholder="you@example.com"
                :class="[
                  'block w-full rounded-lg px-3.5 py-2.5 text-slate-100 bg-slate-900/80 border placeholder-slate-500 focus:outline-none transition sm:text-sm',
                  fieldErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                ]"
              />
            </div>
            <p v-if="fieldErrors.email" class="mt-1 text-xs text-red-400">
              {{ fieldErrors.email[0] }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-300">
              Password
            </label>
            <div class="mt-1.5 relative">
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                :class="[
                  'block w-full rounded-lg px-3.5 py-2.5 text-slate-100 bg-slate-900/80 border placeholder-slate-500 focus:outline-none transition sm:text-sm',
                  fieldErrors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                ]"
              />
            </div>
            <p v-if="fieldErrors.password" class="mt-1 text-xs text-red-400">
              {{ fieldErrors.password[0] }}
            </p>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <svg
                v-if="isSubmitting"
                class="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

