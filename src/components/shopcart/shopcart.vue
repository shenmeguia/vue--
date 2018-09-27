<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{highlight:totalCount>0}">
							<span class="icon-shopping_cart" :class="{highlight:totalCount>0}"></span>
						</div>
						<div class="num" v-show="totalCount>0">{{totalCount}}</div>
					</div>
					<div class="price"  :class="{highlight:totalPrcie>0}">
						￥{{ totalPrcie }}
					</div>
					<div class="desc">
						另需配送费￥{{ deliveryPrice }}元
					</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay">
					<div class="pay" :class="payClass">
						{{ payDesc }}
					</div>
				</div>
			</div>
			<!-- 半场动画实现小球加入购物车动画 -->
			<div class="ball-container">
				<transition-group @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" tag="div">
					<div class="ball" v-for="(item,i) in balls" v-if="item.show" :key="i">
						<div class="inner inner-hook"></div>
					</div>
				</transition-group>
			</div>

			<!-- 购物车详情 -->
			<div class="shopcart-list" v-show="listShow" ref="shopcartList">
				<div class="list-header">
					<h3>购物车</h3>
					<span @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="(item,i) in selectFood" :key="i">
							<div class="name">{{ item.name }}</div>
							<div class="price">
								<span><i>￥</i>{{ item.price * item.count }}</span>
							</div>
							<div class="cartcontrol-box">
								<cartcontrol :food="item"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>
<script>
	// 导入加减按钮组件
	import cartcontrol from '../cartcontrol/cartcontrol.vue';

	//导入better-scroll滚动插件 
	import BScroll from 'better-scroll';

	export default {
		data() {
			return {
				// 小球个数，并默认隐藏
				balls:[
					{show:false},
					{show:false},
					{show:false},
					{show:false},
					{show:false}
				],
				// 折叠状态
				fold: true
			}
		},
		methods: {
			// 接收到goods组件传递过来的点击对象
			drop(el) {
				for(var i = 0; i < this.balls.length; i++) {
					var ball = this.balls[i];
					// 找到一个隐藏的小球执行动画
					if(!ball.show){
						ball.show = true;
						ball.el = el;
						return;
					}
				}
			},
			beforeEnter(el) {
				for(var i = 0; i < this.balls.length; i++) {
					var ball = this.balls[i];
					if(ball.show) {
						var ballPosition = ball.el.getBoundingClientRect();
						var x = ballPosition.left - 32;
						var y = -(window.innerHeight - ballPosition.top -22);
						// 外层垂直移动
						el.style.transform = `translate3d(0,${y}px,0)`;
						// 内层水平移动
						var inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter(el,done) {
				/* 触发浏览器重绘; */
				el.offsetWidth;
				el.style.transform = "translate3d(0,0,0)";
				var inner = el.getElementsByClassName('inner-hook')[0];
				inner.style.transform = `translate3d(0,0,0)`;
				done();
			},
			afterEnter(el) {
				this.balls.forEach((item) => {
					item.show = false;
				})
			},
			toggleList() {
				if(!this.totalCount) {
					return;
				}
				if(this.fold) {
					setTimeout(() => {
						this.$refs.shopcartList.style.transform = 'translate3d(0,-100%,0)';
					})
				}else {
					this.$refs.shopcartList.style.transform = 'translate3d(0,0,0)';
				}
				// 切换显示隐藏
				this.fold = !this.fold;
			},
			// 清空购物车，把选中商品的数量全部改为零即可
			empty() {
				this.selectFood.forEach((item) => {
					item.count = 0;
				});
			},
			hideList() {
				this.fold = true;//true表示隐藏
				this.$refs.shopcartList.style.transform = 'translate3d(0,0,0)';
			},
			pay() {
				if(this.totalPrcie < this.minPrice) {
					return;
				}
				window.alert(`需支付${this.totalPrcie}元`);
			}
		},
		// 父组件传递的 配送费 / 起送价 / 选中商品的单价和数量(数组)
		props:['deliveryPrice','minPrice','selectFood'],
		components: {
			cartcontrol
		},
		computed: {
			// 计算总价
			totalPrcie() {
				var total = 0;
				this.selectFood.forEach((item) => {
					total += item.price * item.count;
				});
				return total;
			},
			// 计算选中数量
			totalCount() {
				var count = 0;
				 this.selectFood.forEach((item) => {
				 	count += item.count;
				 });
				 return count;
			},
			// 结算的不同状态
			payDesc() {
				if(this.totalPrcie === 0) {
					return `￥${this.minPrice}起送`;
				}else if(this.totalPrcie < this.minPrice) {
					var diff = this.minPrice - this.totalPrcie;
					return `还差￥${diff}起送`;
				}else {
					return '去结算';
				}
			},
			// 根据结算不同状态添加对应的类
			payClass() {
				if(this.totalPrcie < this.minPrice) {
					return 'no-enough';
				}else {
					return 'enough';
				}
			},
			listShow() {
				// 没有选中任何商品就隐藏
				if(!this.totalCount) {
					this.fold = true;
					return false;
				}
				var show = !this.fold;
				// 当显示购物车详情时初始化better-scroll
				if(show) {
					// 异步操作
					this.$nextTick(() => {
						// 没有初始化过就初始化
						if(!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent,{
								click:true
							})
						// 已经初始化过就只需要调用refresh
						}else {
							this.scroll.refresh();
						}
					});
				}
				return show;
			}
		}
	}
</script>
<style lang="less">
	.shopcart{
		position:fixed;
		left:0;
		bottom:0;
		z-index:50;
		width:100%;
		height:48px;
		.content{
			display:flex;
			background:#141D27;
			.content-left{
				flex:1;
				font-size:0;
				.logo-wrapper{
					display:inline-block;
					position:relative;
					top:-10px;
					margin:0 12px;
					padding:6px;
					width:56px;
					height:56px;
					box-sizing:border-box;
					background:#141D27;
					border-radius:50%;
					.logo{
						width:100%;
						height:100%;
						background:#2B343C;
						border-radius:50%;
						text-align:center;
						&.highlight{
							background:#00A0DC;
						}
						.icon-shopping_cart{
							color:#80858A;
							font-size:24px;
							line-height:44px;
							&.highlight{
								color:white;
							}
						}
					}
					.num{
						position:absolute;
						top:0;
						right:0;
						width:24px;
						height:16px;
						line-height:16px;
						font-size:12px;
						color:white;
						text-align:center;
						border-radius:16px;
						background:rgb(240,20,20);
						box-shadow:0px 4px 8px 0px rgba(0,0,0,0.4);
					}
				}
				.price{
					display:inline-block;
					font-size:16px;
					font-weight:700;
					line-height:24px;
					color:#919396;
					vertical-align:top;
					margin-top:12px;
					padding-right:12px;
					box-sizing:border-box;
					border-right:1px solid rgba(255,255,255,0.1);
					&.highlight{
						color:white;
					}
				}
				.desc{
					display:inline-block;
					vertical-align:top;
					font-size:12px;
					color:#919396;
					line-height:24px;
					margin:12px 0 0 12px;
				}
			}
			.content-right{
				flex:0 0 105px;
				width:105px;
				.pay{
					text-align:center;
					font-size:12px;
					font-weight:700;
					line-height:48px;
					height:48px;
					color:#919396;
					&.enough{
						background:#00b43c;
						color:white;
					}
					&.no-enough{
						background:#2B333B;
					}
				}
			}
		}
		.ball-container{
			.ball{
				position:fixed;
				left:32px;
				bottom:22px;
				z-index:200;
				transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
				.inner{
					width:16px;
					height:16px;
					border-radius:50%;
					background:rgb(240,20,20);
					transition:all 0.4s linear;
				}
			}
		}
		.shopcart-list{
			width:100%;
			position:absolute;
			top:0;
			left:0;
			z-index:-1;
			transition:all 0.4s linear;
			.list-header{
				height:40px;
				line-height:40px;
				background:#f3f5f7;
				border-bottom:1px solid rgba(7,17,27,0.1);
				padding:0 18px;
				display:flex;
				justify-content:space-between;
				h3{
					font-size:14px;
					font-weight:200;
					color:rgb(7,17,27);
				}
				span{
					font-size:12px;
					color:rgb(0,160,220);
				}
			}
			.list-content{
				padding:0 18px;
				max-height:217px;
				background:white;
				overflow:hidden;
				.food{
					position:relative;
					border-bottom:1px solid rgba(7,17,27,0.1);
					padding:12px 0;
					.name{
						font-size:14px;
						color:rgb(7,17,27);
						line-height:24px;
					}
					.price{
						position:absolute;
						right:90px;
						bottom:12px;
						line-height:24px;
						color:rgb(240,20,20);
						span{
							font-size:14px;
							font-weight:700;
							i{
								font-style:normal;
								font-size:12px;
								font-weight:normal;
							}
						}
					}
					.cartcontrol-box{
						position:absolute;
						right:0;
						top:6px;
					}
				}
			}
		}
	}
	.list-mask{
		width:100%;
		height:100%;
		position:fixed;
		top:0;
		left:0;
		z-index:40;
		backdrop-filter:blur(10px);
		background:rgba(7,17,27,0.6);
	}
	.fade-enter,.fade-leave-to{
		opacity:0;
	}
	.fade-enter-active,.fade-leave-active{
		transition:all 0.4s linear;
	}
</style>