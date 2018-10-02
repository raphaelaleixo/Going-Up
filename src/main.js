import Vue from 'vue'
import VueAnime from 'vue-animejs';
import App from './App.vue'
import './styles/main.scss';

Vue.config.productionTip = false

Vue.use(VueAnime)

new Vue({
  render: h => h(App)
}).$mount('#app')
