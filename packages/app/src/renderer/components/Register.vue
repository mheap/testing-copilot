<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Register</h1>
      <p class="mt-2 text-sm text-gray-600">Create your account to get started</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your full name"
        />
      </div>
      
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
          placeholder="Create a password"
        />
      </div>
      
      <button 
        type="submit" 
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Register
      </button>
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Already have an account? 
        <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
          Sign in
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
  name: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  console.log('Register form submitted:', form.value)
  
  try {
    const result = await (window as any).electronAPI.registerUser(form.value)
    if (result.success) {
      showToast('Registration successful!')
      console.log('User registered:', result.user)
      
      // Reset form
      form.value = {
        name: '',
        email: '',
        password: ''
      }
      
      // Navigate to login page
      router.push('/login')
    } else {
      showToast('Registration failed: ' + result.error, 3000, 'error')
    }
  } catch (error) {
    console.error('Registration error:', error)
    showToast('Registration failed: ' + (error as Error).message, 3000, 'error')
  }
}
</script>