<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900">Dashboard</h1>
        <div class="mt-4">
          <div class="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Logged in successfully
          </div>
        </div>
      </div>
      
      <div class="text-center">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">
            Welcome back, {{ user?.name || 'User' }}! 👋
          </h2>
          <p class="mt-2 text-gray-600">
            You are successfully logged in to the Robots are here application.
          </p>
        </div>
        
        <div class="flex justify-center space-x-4">
          <div class="bg-blue-50 rounded-lg p-6 text-center max-w-sm">
            <div class="text-3xl mb-2">🤖</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Robot Features</h3>
            <p class="text-sm text-gray-600">
              Explore all the amazing robot capabilities available in this application.
            </p>
          </div>
          
          <div class="bg-green-50 rounded-lg p-6 text-center max-w-sm">
            <div class="text-3xl mb-2">⚙️</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Settings</h3>
            <p class="text-sm text-gray-600">
              Customize your experience and manage your account preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

const loadUser = async () => {
  try {
    const currentUser = await (window as any).electronAPI.getCurrentUser()
    user.value = currentUser
  } catch (error) {
    console.error('Error getting current user:', error)
    router.push('/')
  }
}

const logout = async () => {
  try {
    await (window as any).electronAPI.logout()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Load user on component mount
loadUser()
</script>