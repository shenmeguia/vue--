<template>
	<transition name="toleft">
		<div class="food-container" v-show="flag" ref="foodBox">
			<div class="food-content">
				<div class="header-img">
					<img :src="food.image">
					<div class="back" @click="flag=false">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{ food.name }}</h1>
					<div class="detail">
						<span class="sale-count">月售{{ food.sellCount }}</span><span>好评率{{ food.rating }}%</span>
					</div>
					<div class="price">
						<span class="new-prcie"><i>￥</i>{{ food.price }}</span><span v-show="food.oldPrice" class="old-price"><i>￥</i>{{ food.oldPrice }}</span>
					</div>
					<div class="cartcontrol-box">
						<!-- 父组件通过v-on监听到事件 -->
						<cartcontrol :food="food" @cart-add="cartAdd"></cartcontrol>
					</div>
					<div class="buy" v-show="!food.count || food.count === 0" @click="firstCount">加入购物车</div>
				</div>
				<!-- 因为info可能没有，所以有的时候才展示 -->
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<h3 class="title">商品介绍</h3>
					<p class="info-content">{{ food.info }}</p>
				</div>
				<split></split>
				<div class="rating-box">
					<h3 class="title">商品评价</h3>
					<ratingselect :desc="desc" :select-type="selectType" :only-content="onlyContent" :ratings="food.ratings" @select="select" @toggle="toggle"></ratingselect>
					<div class="ratings-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-for="(item,i) in food.ratings" :key="i" class="rating-item border-1px" v-show="change(item.rateType,item.text)">
								<div class="user">
									<span class="username">{{ item.username }}</span>
									<img :src="item.avatar" width="12" height="12">
								</div>
								<div class="time">{{ item.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':item.rateType===0,'icon-thumb_down':item.rateType===1}"></span>
									{{ item.text }}
								</p>
							</li>
						</ul>
						<div class="no-ratings" v-show="!food.ratings || !food.ratings.length">没有评价哦</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
	import BScroll from 'better-scroll';
	// 导入加减按钮组件
	import cartcontrol from '../cartcontrol/cartcontrol.vue';
	import Vue from 'vue';
	// 导入split组件
	import split from '../split/split.vue';
	// 导入评论组件
	import ratingselect from '../ratingselect/ratingselect.vue';
	export default{
		data() {
			return {
				flag:false,
				desc:{
					all:'全部',
					positive:'推荐',
					negative:'吐槽'
				},
				selectType:2,
				onlyContent:false
			}
		},
		props:['food'],
		methods:{
			// 当页面显示时初始化better-scroll
			show() {
				this.flag = true;
				this.$nextTick(() => {
					if(!this.scroll) {
						this.scroll = new BScroll(this.$refs.foodBox,{
							click:true
						})
					}else {
						this.scroll.refresh();
					}
				});
			},
			firstCount(event) {
				// 因为food中没有count属性
				// Vue.set( target, key, value )用于向响应式对象上添加新属性
				// 延时隐藏，防止获取不到小球的起始位置
				setTimeout(() => {
					Vue.set(this.food,'count',1);
				},0);
				//this $emit（'父组件的事件名',要传送的数据
				// 这里把点击的对象传给父组件
				this.$emit('cart-add',event.target);
			},
			cartAdd(el) {
				this.$emit('cart-add',el)
			},
			select(type) {
				this.selectType = type;
			},
			toggle(bool) {
				this.onlyContent = bool;
			},
			change(type,text) {
				// 显示有内容的并且没内容隐藏
				if(this.onlyContent && !text) {
					return false;
				}
				// 显示全部
				if(this.selectType === 2) {
					return true;
				}else {
					// 显示对应类型的评价
					return type === this.selectType;
				}
			}
		},
		components: {
			cartcontrol,
			split,
			ratingselect
		}
	}
</script>
<style lang="less">
	.toleft-enter,.toleft-leave-to{
		transform:translate3d(100%,0,0);
	}
	.toleft-enter-active,.toleft-leave-active{
		transition:all 0.2s linear;
	}
	.food-container{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		bottom:48px;
		z-index:30;
		background:white;
		.header-img{
			position:relative;
			width:100%;
			height:0;
			padding-top:100%;
			img{
				position:absolute;
				left:0;
				top:0;
				width:100%;
				height:100%;
			}
			.back{
				position:absolute;
				left:4px;
				top:4px;
				background:rgba(0,0,0,0.3);
				i{
					color:white;
					display:block;
					padding:10px;
				}
			}
		}
		.content{
			padding:18px;
			background:white;
			position:relative;
			.title{
				font-size:14px;
				color:rgb(7,17,27);
				font-weight:700;
				line-height:14px;
			}
			.detail{
				color:rgb(147,153,159);
				font-size:10px;
				margin:8px 0 18px 0;
				.sale-count{
					padding-right:12px;
				}
			}
			.price{
				line-height:24px;
				.new-prcie{
					font-size:14px;
					color:rgb(240,20,20);
					font-weight:700;
					i{
						font-style:normal;
						font-size:10px;
						font-weight:normal;
					}
				}
				.old-price{
					font-size:10px;
					color:rgb(147,153,159);
					padding-left:8px;
					text-decoration:line-through;
					font-weight:700;
					i{
						font-style:normal;
						font-weight:normal;
					}
				}
			}
			.cartcontrol-box{
				position:absolute;
				right:12px;
				bottom:12px;
			}
			.buy{
				position:absolute;
				right:18px;
				bottom:18px;
				background:rgb(0,160,220);
				padding:0 12px;
				height:24px;
				line-height:24px;
				font-size:12px;
				text-align:center;
				border-radius:12px;
				color:white;
			}
		}
		.info{
			padding:18px;
			.title{
				font-size:14px;
				color:rgb(7,17,27);
				font-weight:normal;
				line-height:14px;
				margin-bottom:6px;
			}
			.info-content{
				font-size:12px;
				font-weight:200;
				color:rgb(77,85,93);
				line-height:24px;
			}
		}
		.rating-box{
			padding-top:18px;
			.title{
				font-size:14px;
				color:rgb(7,17,27);
				font-weight:normal;
				line-height:14px;
				margin-left:18px;
			}
			.ratings-wrapper{
				padding:0 18px;
				.rating-item{
					padding:16px 0;
					position:relative;
					.user{
						position:absolute;
						display:flex;
						right:0;
						top:16px;
						.username{
							font-size:10px;
							line-height:12px;
							color:rgb(147,153,159);
							margin-right:6px;
						}
						img{
							border-radius:50%;
						}
					}
					.time{
						font-size:10px;
						line-height:12px;
						color:rgb(147,153,159);
						margin-bottom:6px;
					}
					.text{
						font-size:12px;
						line-height:16px;
						color:rgb(7,17,27);
						.icon-thumb_up,.icon-thumb_down{
							font-size:12px;
						}
						.icon-thumb_up{
							color:rgb(0,160,220);
						}
						.icon-thumb_down{
							color:rgb(147,153,159);
						}
					}
				}
				.no-ratings{
					padding:18px 0;
					color:rgb(147,153,159);
					font-size:12px;
				}
			}
		}
	}
</style>