<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Robots are here! 🤖
        </h1>
        <div class="text-6xl mt-4 mb-6">🤖🦾🤖</div>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Welcome to the Robots are here application!
        </p>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Please choose an option to continue:
        </p>
      </div>
      
      <div class="mt-8 flex justify-center space-x-4">
        <router-link 
          to="/register" 
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
        >
          Get Started
        </router-link>
        <router-link 
          to="/login" 
          class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          Sign In
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this component
</script>