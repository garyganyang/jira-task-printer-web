import Vue from 'vue';
import Print from 'vue-print-nb';
import ElementUI from 'element-ui';
import store from './store';
import router from './router';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Print);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
