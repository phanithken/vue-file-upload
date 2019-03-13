import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'

import VueRx from 'vue-rx'
import { Observable, Subscription, Subject } from 'rxjs'

Vue.config.productionTip = false

Vue.use(VueRx, { Observable, Subscription, Subject })

var config = {
  apiKey: 'AIzaSyAfWSlghJg--9Wkxp5RswLf_8bmGGJH5E8',
  authDomain: 'pk-api.firebaseapp.com',
  databaseURL: 'https://pk-api.firebaseio.com',
  projectId: 'pk-api',
  storageBucket: 'pk-api.appspot.com',
  messagingSenderId: '928588879157'
}
firebase.initializeApp(config)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
