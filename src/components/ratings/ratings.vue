<template>
	<div class="ratings" ref="container">
		<div class="ratings-container">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{ seller.score }}</h1>
					<p class="score-text">综合评分</p>
					<span class="desc">高于周边商家{{ seller.rankRate }}%</span>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="explain">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{ seller.serviceScore }}</span>
					</div>
					<div class="score-wrapper">
						<span class="explain">商品评分</span>
						<star :size="36" :score="seller.score"></star>
						<span class="score">{{ seller.score }}</span>
					</div>
					<div class="delivery-time">
						<span class="explain">送达时间</span>
						<span class="time">{{ seller.deliveryTime }}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect :desc="desc" :select-type="selectType" :only-content="onlyContent" :ratings="ratings" @select="select" @toggle="toggle"></ratingselect>
			<div class="ratings-wrapper">
				<ul>
					<li v-for="(rating,i) in ratings" :key="i" class="rating-box" v-show="change(rating.rateType,rating.text)">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28">
						</div>
						<div class="content">
							<h3 class="username">{{ rating.username }}</h3>
							<div class="score-box">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery-time" v-show="rating.deliveryTime">{{ rating.deliveryTime }}分钟送达</span>
							</div>
							<p class="evaluate">{{ rating.text }}</p>
							<div class="recommend-wrapper" v-show="rating.recommend && rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="(item,i) in rating.recommend" :key="i" class="recommend">
									{{ item }}
								</span>
							</div>
							<div class="time">
								{{ rating.rateTime | formatDate}}
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import BScroll from 'better-scroll';
	// 导入star组件
	import star from '../star/star.vue';
	// 导入split组件
	import split from '../split/split.vue';
	// 导入评论组件
	import ratingselect from '../ratingselect/ratingselect.vue';
	export default{
		data() {
			return {
				desc:{
					all:'全部',
					positive:'满意',
					negative:'不满意'
				},
				selectType:2,
				onlyContent:false,
				ratings:[]
			}
		},
		created() {
			this.$http.get('/api/ratings').then((result) => {
				result = result.body;
				if(result.errno === 0) {
					this.ratings = result.data;
					this.$nextTick(() => {
						this.scroll = new BScroll(this.$refs.container,{
							click:true
						});
					});
				}
			});
		},
		methods:{
			select(type) {
				this.selectType = type;
			},
			toggle(bool) {
				this.onlyContent = bool;
			},
			change(type,text) {
				if(this.onlyContent && !text) {
					return false;
				}
				if(this.selectType === 2) {
					return true;
				}else {
					return type === this.selectType;
				}
			}
		},
		props:['seller'],
		components:{
			star,
			split,
			ratingselect
		}
	}
</script>
<style lang="less">
	.ratings{
		position:absolute;
		width:100%;
		top:176px;
		left:0;
		bottom:0;
		overflow:hidden;
		.overview{
			display:flex;
			padding:18px 0;
			.overview-left{
				flex:0 0 137px;
				width:137px;
				text-align:center;
				padding:6px 0;
				border-right:1px solid rgba(7,17,27,0.1);
				@media only screen and (max-width:320px) {
					flex:0 0 120px;
					width:120px;
				}
				.score{
					font-size:24px;
					color:rgb(255,153,0);
					line-height:28px;
				}
				.score-text{
					font-size:12px;
					color:rgb(7,17,27);
					line-height:12px;
					margin:6px 0 8px 0;
				}
				.desc{
					font-size:10px;
					color:rgba(7,17,27,0.4);
					line-height:10px;
				}
			}
			.overview-right{
				flex:1;
				padding:6px 0 6px 24px;
				@media only screen and (max-width:320px) {
					padding-left:6px;
				}
				.score-wrapper{
					margin-bottom:8px;
					display:flex;
					font-size:12px;
					line-height:18px;
					.explain{
						color:rgb(7,17,27);
						margin-right:12px;
					}
					.score{
						color:rgb(255,153,0);
						margin-left:12px;
					}
				}
				.delivery-time{
					display:flex;
					font-size:12px;
					line-height:18px;
					.explain{
						color:rgb(7,17,27);
						margin-right:12px;
					}
					.time{
						color:rgb(147,153,159);
					}
				}
			}
		}
		.ratings-wrapper{
			.rating-box{
				padding:18px 0;
				margin:0 18px;
				border-bottom:1px solid rgba(7,17,27,0.1);
				position:relative;
				display:flex;
				.avatar{
					margin-right:12px;
					img{
						border-radius:50%;
					}
				}
				.content{
					.username{
						font-size:10px;
						color:rgb(7,17,27);
						line-height:12px;
					}
					.score-box{
						display:flex;
						height:12px;
						line-height:12px;
						margin:4px 0 6px 0;
						.delivery-time{
							font-size:10px;
							color:rgb(147,153,159);
							margin-left:6px;
							line-height:12px;
						}
					}
					.evaluate{
						font-size:12px;
						color:rgb(7,17,27);
						line-height:18px;
					}
					.recommend-wrapper{
						margin-top:6px;
						display:flex;
						flex-wrap:wrap;
						.icon-thumb_up{
							font-size:12px;
							line-height:16px;
							color:rgb(0,160,200);
							margin-top:2px;
						}
						.recommend{
							font-size:9px;
							color:rgba(147,153,159);
							line-height:16px;
							padding:0 6px;
							margin-left:8px;
							border:1px solid rgba(7,17,27,0.1);
							border-radius:2px;
							margin-top:2px;
						}
					}
				}
				.time{
					position:absolute;
					top:18px;;
					right:0;
					color:rgb(147,153,159);
					font-size:10px;
					line-height:12px;
				}
			}
		}
	}
</style>
