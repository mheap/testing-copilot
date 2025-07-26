// Renderer process code
import { createApp, ref } from 'vue'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'

// Landing Component
const Landing = {
  template: `
    <div class="container">
      <h1>Robots are here! 🤖</h1>
      <div style="font-size: 2em; text-align: center; margin: 20px 0;">🤖🦾🤖</div>
      <p>Welcome to the Robots are here application!</p>
      <p>Please choose an option to continue:</p>
      <div class="nav-links">
        <router-link to="/register">Register</router-link>
        <router-link to="/login">Login</router-link>
      </div>
    </div>
  `
}

// Register Component
const Register = {
  template: `
    <div class="container">
      <h1>Register</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required 
          />
        </div>
        <button type="submit" class="btn">Register</button>
      </form>
      <div class="nav-links">
        <router-link to="/">Back to Home</router-link>
        <router-link to="/login">Already have an account? Login</router-link>
      </div>
    </div>
  `,
  setup() {
    const form = ref({
      name: '',
      email: '',
      password: ''
    })

    const handleSubmit = () => {
      console.log('Register form submitted:', form.value)
      showToast('Success!')
      
      // Reset form
      form.value = {
        name: '',
        email: '',
        password: ''
      }
    }

    return { form, handleSubmit }
  }
}

// Login Component
const Login = {
  template: `
    <div class="container">
      <h1>Login</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required 
          />
        </div>
        <button type="submit" class="btn">Login</button>
      </form>
      <div class="nav-links">
        <router-link to="/">Back to Home</router-link>
        <router-link to="/register">Don't have an account? Register</router-link>
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
    <div class="container">
      <h1>Dashboard</h1>
      <p>Welcome, {{ user?.name }}!</p>
      <p>You are successfully logged in.</p>
      <div class="nav-links">
        <button @click="logout" class="btn">Logout</button>
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
function showToast(message: string, duration: number = 3000) {
  const existingToast = document.querySelector('.toast')
  if (existingToast) {
    existingToast.remove()
  }

  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.classList.add('show')
  }, 10)
  
  setTimeout(() => {
    toast.classList.remove('show')
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
      loginUser: () => Promise<{ success: boolean; user: any }>
      getCurrentUser: () => Promise<any>
      logout: () => Promise<void>
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Vue app starting...')
  
  const app = createApp({
    components: { RouterView },
    template: '<router-view></router-view>'
  })

  app.use(router)
  currentRouter = router
  app.mount('#app')
})