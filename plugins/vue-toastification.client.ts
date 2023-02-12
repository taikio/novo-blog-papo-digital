import Toast, { PluginOptions, POSITION, useToast } from 'vue-toastification'
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'

const options: PluginOptions = {
  position: POSITION.TOP_CENTER,
  timeout: 2984,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
}

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Toast, options)

  return {
    provide: {
      toast: useToast(),
    },
  }
})
