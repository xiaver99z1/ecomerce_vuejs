<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoggingOut = ref(false)
const isRefreshing = ref(false)
const refreshSuccess = ref(false)

async function handleLogout() {
  isLoggingOut.value = true
  try {
    await authStore.logout()
    await router.push({ name: 'login' })
  } finally {
    isLoggingOut.value = false
  }
}

async function handleRefreshProfile() {
  isRefreshing.value = true
  refreshSuccess.value = false
  try {
    await authStore.fetchUser()
    refreshSuccess.value = true
    setTimeout(() => {
      refreshSuccess.value = false
    }, 3000)
  } finally {
    isRefreshing.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
    <!-- Top Navbar -->
    <header class="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
            LV
          </div>
          <span class="font-semibold text-lg tracking-tight text-white">Admin Portal</span>
        </div>

        <div class="flex items-center space-x-4">
          <div class="hidden sm:flex items-center space-x-2 text-sm text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{{ authStore.user?.email }}</span>
          </div>

          <button
            type="button"
            :disabled="isLoggingOut"
            @click="handleLogout"
            class="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{{ isLoggingOut ? 'Logging out...' : 'Log out' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Greeting Banner -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-800/80 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 mb-8 shadow-xl">
        <div class="relative z-10">
          <div class="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            <span>Authenticated Session</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {{ authStore.user?.name || 'User' }}!
          </h1>
          <p class="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
            You are securely authenticated using Laravel Sanctum Bearer tokens and Vue 3 Pinia State Management.
          </p>
        </div>
      </div>

      <!-- User Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <div class="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div>
              <h2 class="text-lg font-bold text-white">User Information</h2>
              <p class="text-xs text-slate-400">Fetched via <code class="text-indigo-400 font-mono">GET /api/v1/auth/me</code></p>
            </div>
            <button
              type="button"
              :disabled="isRefreshing"
              @click="handleRefreshProfile"
              class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/80 transition cursor-pointer disabled:opacity-50"
            >
              <svg
                :class="['w-3.5 h-3.5', isRefreshing ? 'animate-spin' : '']"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
            </button>
          </div>

          <div v-if="refreshSuccess" class="mb-4 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-2 rounded-lg">
            Profile synchronized successfully!
          </div>

          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div class="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
              <dt class="text-xs text-slate-400 font-medium">User ID</dt>
              <dd class="mt-1 font-mono text-slate-200 text-sm">#{{ authStore.user?.id }}</dd>
            </div>

            <div class="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
              <dt class="text-xs text-slate-400 font-medium">Full Name</dt>
              <dd class="mt-1 font-medium text-slate-200 text-sm">{{ authStore.user?.name }}</dd>
            </div>

            <div class="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
              <dt class="text-xs text-slate-400 font-medium">Email Address</dt>
              <dd class="mt-1 font-medium text-slate-200 text-sm truncate">{{ authStore.user?.email }}</dd>
            </div>

            <div class="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
              <dt class="text-xs text-slate-400 font-medium">Super Admin Status</dt>
              <dd class="mt-1 text-sm">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
                    authStore.user?.is_super_admin
                      ? 'bg-purple-900/60 text-purple-200 border border-purple-700/60'
                      : 'bg-slate-700 text-slate-300'
                  ]"
                >
                  {{ authStore.user?.is_super_admin ? 'Super Admin' : 'Regular User' }}
                </span>
              </dd>
            </div>

            <div class="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
              <dt class="text-xs text-slate-400 font-medium">Department</dt>
              <dd class="mt-1 font-medium text-slate-200 text-sm capitalize">
                {{ authStore.user?.department || 'None' }}
              </dd>
            </div>

            <div class="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
              <dt class="text-xs text-slate-400 font-medium">Store ID</dt>
              <dd class="mt-1 font-mono text-slate-200 text-sm">
                {{ authStore.user?.store_id ?? 'None' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Token & Session Card -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h2 class="text-lg font-bold text-white mb-1">Session Token</h2>
            <p class="text-xs text-slate-400 mb-4">Stored in localStorage as Bearer token</p>

            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 break-all select-all">
              {{ authStore.token ? authStore.token.substring(0, 30) + '...' : 'No token found' }}
            </div>

            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between text-xs text-slate-300">
                <span>Sanctum API Status</span>
                <span class="inline-flex items-center text-emerald-400 font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span> Connected
                </span>
              </div>
              <div class="flex items-center justify-between text-xs text-slate-300">
                <span>Frontend State</span>
                <span class="text-indigo-400 font-medium">Pinia Setup Store</span>
              </div>
              <div class="flex items-center justify-between text-xs text-slate-300">
                <span>Protected Routes</span>
                <span class="text-purple-400 font-medium">Vue Router Guards</span>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-800 mt-6">
            <button
              type="button"
              :disabled="isLoggingOut"
              @click="handleLogout"
              class="w-full py-2 px-3 text-center text-xs font-semibold rounded-lg bg-red-950/40 text-red-300 border border-red-900/60 hover:bg-red-900/50 transition cursor-pointer"
            >
              {{ isLoggingOut ? 'Ending session...' : 'Terminate Session (Logout)' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

