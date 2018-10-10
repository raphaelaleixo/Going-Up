import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAnime from 'vue-animejs';
import App from './App.vue';
import './styles/main.scss';
import store from './store/store';
import { routes } from './router';

Vue.config.productionTip = false;

Vue.use(VueAnime);
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history',
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
