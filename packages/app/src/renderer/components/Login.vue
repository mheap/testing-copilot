<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Sign In</h1>
      <p class="mt-2 text-sm text-gray-600">Welcome back! Please sign in to your account</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email address"
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password"
        />
      </div>
      
      <button 
        type="submit" 
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Sign In
      </button>
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account? 
        <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
          Register here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast'

const router = useRouter()
const form = ref({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  console.log('Login form submitted:', form.value)
  showToast('Success!')
  
  // Create session with first user in database
  try {
    const result = await (window as any).electronAPI.loginUser()
    if (result.success) {
      console.log('Logged in as:', result.user)
      // Navigate to dashboard after successful login
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
  }
  
  // Reset form
  form.value = {
    email: '',
    password: ''
  }
}
</script>