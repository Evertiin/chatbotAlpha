// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyCcSbmY_TnLeg6nSO4A6WHX72dvDtzDkko',
  authDomain: 'notifica-e353a.firebaseapp.com',
  projectId: 'notifica-e353a',
  storageBucket: 'notifica-e353a.appspot.com',
  messagingSenderId: '512933252978',
  appId: '1:512933252978:web:fa772aa77dbca203f317eb',
  measurementId: 'G-VYFG1VWJ9B'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)

  const notificationTitle = payload.notification.title || 'Title not available'
  const notificationOptions = {
    body: payload.notification.body || 'Body not available'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
