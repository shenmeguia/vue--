// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment'

Vue.config.productionTip = false

import "./common/style/index.less"

// 注册vue-resource
import VueResource from 'vue-resource'
Vue.use(VueResource)

// 定义一个全局的时间过滤器
Vue.filter('formatDate',function (time) {
	var date = new Date(time);
	return moment(date).format('YYYY-MM-DD HH:mm');
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
