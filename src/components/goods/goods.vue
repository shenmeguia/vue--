<template>
	<div class="goods">
		<div class="menu" ref="menu">
			<ul class="goodslist">
				<!-- 当滚动计算到的索引值等于当前索引值时才添加current类 -->
				<li v-for="(item,i) in goods" :key="i" class="list" :class="{current:currentIndex === i}" @click="selectMenu(i,$event)">
					<p class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
						<span class="cont">{{ item.name }}</span>
					</p>
				</li>
			</ul>
		</div>
		<div class="goods-content" ref="content">
			<ul>
				<li v-for="(item,i) in goods" :key="i" class="food-list food-list-hook">
					<h1 class="title">{{ item.name }}</h1>
					<ul>
						<li v-for="(food,i) in item.foods" :key="i" class="food-item" @click="stFood(food)">
							<div class="food-img">
								<img :src="food.icon" width="57" height="57">
							</div>
							<div class="food-content">
								<h2 class="name">{{ food.name }}</h2>
								<p class="desc" v-show="food.description">{{ food.description }}</p>
								<div class="other">
									<span class="sale-count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
								</div>
								<div class="price">
									<span class="new-prcie"><i>￥</i>{{ food.price }}</span><span v-show="food.oldPrice" class="old-price"><i>￥</i>{{ food.oldPrice }}</span>
								</div>
								<!-- 加减按钮组件 -->
								<div class="cartcontrol">
									<!-- 父组件通过v-on监听到事件 -->
									<cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<!-- 传给购物车组件 配送费和起送价 -->
		<shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFood="selectFood" ref="shopcart"></shopcart>
		<!-- 传给商品详情组件当前选中的是每一个商品 -->
		<food :food="selectedFood" ref="food" v-on:cart-add="cartAdd"></food>
	</div>
</template>
<script>
	//导入better-scroll滚动插件 
	import BScroll from 'better-scroll';
	// 导入购物车组件
	import shopcart from '../shopcart/shopcart.vue';
	// 导入加减按钮组件
	import cartcontrol from '../cartcontrol/cartcontrol.vue';
	// 导入商品详情组件
	import food from '../food/food.vue';
	export default {
		data() {
			return {
				goods:[],
				classMap:['decrease','discount','special','invoice','guarantee'],
				//内容的高度
				listHeight:[],
				//滚动距离
				scrollY:0,
				// 当前点击的商品
				selectedFood:{}
			}
		},
		computed: {
			// 内容滚动高度对应左侧menu的索引值
			currentIndex() {
				for(var i = 0; i < this.listHeight.length; i++) {
					// 滚动高度在哪一个区间就对应哪一个索引值
					var height1 = this.listHeight[i],
							height2 = this.listHeight[i + 1];
						if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
							return i;
						}
				}
				return 0;
			},
			// 选中的商品，通过子组件的选择传递过来
			selectFood() {
				var selectfoods = [];
				// 遍历到每一个food，有count就表明被选中了
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if(food.count) {
							selectfoods.push(food);
						}
					});
				});
				return selectfoods;
			}
		},
		created() {
			this.$http.get('/api/goods').then((result) => {
				result = result.body;
				if(result.errno === 0) {
					this.goods = result.data;
					console.log(this.goods);
					// DOM更新后执行
					this.$nextTick(() => {
						this._initScroll();
						this._calcHeight();
					})
				}
			});
		},
		methods:{
			//初始化better-scroll插件 
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menu,{
					click:true
				});
				//probeType:3 实时监听滚动的位置
				this.contentScroll = new BScroll(this.$refs.content,{ 
					probeType:3,
					click:true
				});
				// 获取滚动的距离
				this.contentScroll.on('scroll',(pos) => {
					// 取整并取绝对值
					this.scrollY = Math.abs(Math.round(pos.y));
				});
				
			},
			// 计算内容高度的方法
			_calcHeight() {
				var foodList = this.$refs.content.getElementsByClassName('food-list-hook');
				var height = 0; //每一个分类的高度，第一个为0
				//把每个分类的高度都添加到数组中
				this.listHeight.push(height);
				for(var i = 0; i < foodList.length; i++) {
					// 每个分类的高度等于之前分类高度的和加上自身高度
					height += foodList[i].clientHeight;
					//把每个分类的高度都添加到数组中
					this.listHeight.push(height);
				}
			},
			// 左侧menu点击右侧内容联动方法
			selectMenu(i,event) {
				if(!event._constructed) {
					return;
				}
				var foodList = this.$refs.content.getElementsByClassName('food-list-hook');
				// 获取每一个分类
				var el = foodList[i];
				// 通过scrollToElement(dom,时间)实现滚动
				this.contentScroll.scrollToElement(el,1000);
			},
			cartAdd(el) {
				// dom元素更新后执行
				// 异步实现小球动画
				this.$nextTick(() => {
					// 调用shopcart组件的drop()函数
					// 并把把点击的对象传给drop()函数
					this.$refs.shopcart.drop(el);
				});
			},
			stFood(food) {
				this.selectedFood = food;
				// 触发food组件的show方法让其显示
				this.$refs.food.show();
			}
		},
		props:['seller'],
		components:{
			shopcart,
			cartcontrol,
			food
		}
	}
</script>
<style lang="less">
	.goods{
		position:absolute;
		width:100%;
		top:176px;
		bottom:46px;
		display:flex;
		overflow:hidden;
		.menu{
			flex:0 0 80px;
			width:80px;
			background:#f3f5f7;
			.goodslist{
				.list{
					width:56px;
					height:54px;
					line-height:14px;
					padding:0 12px;
					display:table;
					&.current{
						background:white;
						font-weight:700;
						.border-1px{
							&:after{
								border:none;
							}
						}
					}
					.text{
						display:table-cell;
						width:56px;
						vertical-align:middle;
						.icon{
							float:left;
							width:12px;
							height:12px;
							margin:2px 2px 0 0;
							background-size:12px 12px;
							background-repeat:no-repeat;
							&.decrease{
								background-image:url(decrease_3@2x.png);	
							}
							&.discount{
								background-image:url(discount_3@2x.png);
							}
							&.guarantee{
								background-image:url(guarantee_3@2x.png);
							}
							&.invoice{
								background-image:url(invoice_3@2x.png);
							}
							&.special{
								background-image:url(special_3@2x.png);
							}
						}
						.cont{
							font-size:12px;
						}
					}
				}
			}
		}
		.goods-content{
			flex:1;
			.title{
				background:#f3f5f7;
				font-size:12px;
				color:rgba(147,153,159);
				line-height:26px;
				border-left:2px solid #d9dde1;
				padding-left:14px;
			}
			.food-item{
				display:flex;
				margin:18px;
				padding-bottom:18px;
				border-bottom:1px solid rgba(7,17,27,0.1);
				position:relative;
				&:last-child{
					margin-bottom:0;
					border:none;
				}
				.food-img{
					flex:0 0 57px;
					width:57px;
					margin-right:10px;
				}
				.food-content{
					.name{
						font-size:14px;
						color:rgb(7,17,27);
						line-height:14px;
						padding-top:2px;
					}
					.desc{
						color:rgb(147,153,159);
						font-size:10px;
						padding-top:8px;
						line-height:12px;
					}
					.other{
						color:rgb(147,153,159);
						font-size:10px;
						padding-top:8px;
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
					.cartcontrol{
						position:absolute;
						right:0;
						bottom:6px;
					}
				}
			}
		}
	}
</style>
