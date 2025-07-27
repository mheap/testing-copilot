// Toast utility function
export function showToast(message: string, duration: number = 3000, type: 'success' | 'error' = 'success') {
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