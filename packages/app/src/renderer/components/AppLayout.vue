<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              🤖 Robots are here
            </router-link>
          </div>
          
          <!-- Navigation Links -->
          <div class="flex items-center space-x-4">
            <router-link 
              v-if="!isLoggedIn" 
              to="/register" 
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Register
            </router-link>
            <router-link 
              v-if="!isLoggedIn" 
              to="/login" 
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </router-link>
            <router-link 
              v-if="isLoggedIn" 
              to="/dashboard" 
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </router-link>
            <button 
              v-if="isLoggedIn" 
              @click="logout" 
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main class="py-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)

const checkLoginStatus = async () => {
  try {
    const currentUser = await (window as any).electronAPI.getCurrentUser()
    isLoggedIn.value = !!currentUser
  } catch (error) {
    isLoggedIn.value = false
  }
}

const logout = async () => {
  try {
    await (window as any).electronAPI.logout()
    isLoggedIn.value = false
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Check login status on mount
checkLoginStatus()
</script>