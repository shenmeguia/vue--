import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import goods from '../components/goods/goods.vue'
import seller from '../components/seller/seller.vue'
import ratings from '../components/ratings/ratings.vue'
export default new Router({
	routes:[
		{path:'/',redirect:'/goods'},
		{path:'/goods',component:goods},
		{path:'/seller',component:seller},
		{path:'/ratings',component:ratings}
	],
	// 路由之间切换默认回到顶部
	scrollBehavior: function(to, from, savedPosition) {
      return { x: 0, y: 0 }
 	},
 	// 路由选中高亮自定义类名
 	linkActiveClass:'active'
})
