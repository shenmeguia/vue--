<template>
	<div class="cartcontrol">
		<transition name="gd">
			<div class="cart-reduce icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="reduceCount"></div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCount"></div>
	</div>
</template>
<script>
	import Vue from 'vue';
	export default {
		//这个组件food中count的变化也会传递给父组件
		props:['food'],
		methods: {
			addCount(event) {
				// 没有count时先添加count属性
				if(!this.food.count) {
					// 因为food中没有count属性
					// Vue.set( target, key, value )用于向响应式对象上添加新属性
					Vue.set(this.food,'count',1);
				}else{
					this.food.count++;
				}
				//this $emit（'父组件的事件名',要传送的数据
				// 这里把点击的对象传给父组件
				this.$emit('cart-add',event.target);
			},
			reduceCount() {
				if(this.food.count > 0) {
					this.food.count--;
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.gd-enter,.gd-leave-to{
		opacity:0;
		transform:translate3d(24px,0,0) rotate(180deg);
	}
	.gd-enter-active,.gd-leave-active{
		transition:all 0.3s linear;
	}
	.cartcontrol{
		display:flex;
		.cart-reduce,.cart-add{
			padding:6px;
			line-height:24px;
			font-size:24px;
			color:#009FDA;
		}
		.cart-count{
			font-size:12px;
			color:rgb(147,153,159);
			line-height:36px;
		}
	}
</style>