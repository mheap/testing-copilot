// Renderer process code
import { createApp, ref } from 'vue'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import './styles.css'

// App Layout Component with Navigation
const AppLayout = {
  template: `
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
  `,
  setup() {
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
        const router = getCurrentRouter()
        router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    // Check login status on mount
    checkLoginStatus()

    return { isLoggedIn, logout }
  }
}

// Landing Component
const Landing = {
  template: `
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
  `
}

// Register Component
const Register = {
  template: `
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
  `,
  setup() {
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
          const router = getCurrentRouter()
          router.push('/login')
        } else {
          showToast('Registration failed: ' + result.error, 3000, 'error')
        }
      } catch (error) {
        console.error('Registration error:', error)
        showToast('Registration failed: ' + (error as Error).message, 3000, 'error')
      }
    }

    return { form, handleSubmit }
  }
}

// Login Component
const Login = {
  template: `
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
  `,
  setup() {
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
          const router = getCurrentRouter()
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

    return { form, handleSubmit }
  }
}

// Dashboard Component
const Dashboard = {
  template: `
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
  `,
  setup() {
    const user = ref(null)

    const loadUser = async () => {
      try {
        const currentUser = await (window as any).electronAPI.getCurrentUser()
        user.value = currentUser
      } catch (error) {
        console.error('Error getting current user:', error)
        const router = getCurrentRouter()
        router.push('/')
      }
    }

    const logout = async () => {
      try {
        await (window as any).electronAPI.logout()
        const router = getCurrentRouter()
        router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    // Load user on component mount
    loadUser()

    return { user, logout }
  }
}

// Toast utility function
function showToast(message: string, duration: number = 3000, type: 'success' | 'error' = 'success') {
  const existingToast = document.querySelector('.toast')
  if (existingToast) {
    existingToast.remove()
  }

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const toast = document.createElement('div')
  toast.className = `toast fixed top-5 right-5 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-300`
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.classList.remove('opacity-0')
    toast.classList.add('opacity-100')
  }, 10)
  
  setTimeout(() => {
    toast.classList.remove('opacity-100')
    toast.classList.add('opacity-0')
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  }, duration)
}

// Router setup
const routes = [
  { path: '/', component: Landing },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Global router access
let currentRouter: any = null

function getCurrentRouter() {
  return currentRouter
}

// Set up Electron API interface
declare global {
  interface Window {
    electronAPI: {
      registerUser: (userData: any) => Promise<{ success: boolean; user?: any; error?: string }>
      loginUser: () => Promise<{ success: boolean; user: any }>
      getCurrentUser: () => Promise<any>
      logout: () => Promise<void>
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Vue app starting...')
  
  const app = createApp({
    components: { AppLayout },
    template: '<AppLayout />'
  })

  app.use(router)
  currentRouter = router
  app.mount('#app')
})