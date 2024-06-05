<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export default {
  name: 'App',
  data() {
    return {
      IDLE_TIMEOUT: 5, // seconds
      idleSecondsCounter: 0,
      firebaseInitialized: false // Flag para rastrear a inicialização do Firebase
    }
  },
  methods: {
    CheckIdleTime() {
      this.idleSecondsCounter++
      if (this.idleSecondsCounter >= this.IDLE_TIMEOUT) {
        alert('Time expired!')
      }
    }
  },
  created() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCcSbmY_TnLeg6nSO4A6WHX72dvDtzDkko',
      authDomain: 'notifica-e353a.firebaseapp.com',
      projectId: 'notifica-e353a',
      storageBucket: 'notifica-e353a.appspot.com',
      messagingSenderId: '512933252978',
      appId: '1:512933252978:web:fa772aa77dbca203f317eb',
      measurementId: 'G-VYFG1VWJ9B'
    }

    const app = initializeApp(firebaseConfig)
    const messaging = getMessaging(app)

    getToken(messaging, {
      vapidKey: 'BDL4UMz15kousEqkxSNHsK6zjmTA40yK7Xy2bJORjcM0qWVVS4S7vkFNn8W7aSKujPw1C4wgPTw_GcHsJqGZcsU'
    })
      .then((currentToken) => {
        if (currentToken) {
          localStorage.setItem('fcmToken', currentToken)
          console.log('Token salvo no localStorage: ', currentToken)

          // Adicione este bloco para registrar o Service Worker
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('firebase-messaging-sw.js')
              .then((registration) => {
                console.log('Service Worker iniciado com sucesso')
              })
              .catch((error) => {
                console.error('Falha ao registrar o Service Worker:', error)
              })
          } else {
            console.log('Service Worker não suportado no navegador.')
          }
        } else {
          console.log('No registration token available. Request permission to generate one.')
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err)
      })

    // Usar Promise.resolve para lidar com a Promise corretamente
    Promise.resolve(onMessage(messaging, (payload) => {
      // console.log('Message received. ', payload)
    })).then(() => {
      this.firebaseInitialized = true
    }).catch((error) => {
      console.error('Error while setting up message handler:', error)
    })
  },
  beforeMount() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    if (usuario?.configs?.isDark) {
      this.$q.dark.set(usuario?.configs?.isDark)
    }
  }
}
</script>
