<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{ seller.name }}</h1>
				<div class="desc border-1px">
					<star :size="36" :score="seller.score"></star>
					<span class="rating-count">({{ seller.ratingCount }})</span>
					<span class="sell-count">月售{{ seller.sellCount }}单</span>
				</div>
				<ul class="remark">
					<li class="remark-item">
						<h3 class="remark-title">起送价</h3>
						<div class="remark-content">
							<span class="num">{{ seller.minPrice }}</span>元
						</div>
					</li>
					<li class="remark-item">
						<h3 class="remark-title">商家配送</h3>
						<div class="remark-content">
							<span class="num">{{ seller.deliveryPrice }}</span>元
						</div>
					</li>
					<li class="remark-item">
						<h3 class="remark-title">平均配送时间</h3>
						<div class="remark-content">
							<span class="num">{{ seller.deliveryTime }}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite" @click="toggleFavo">
					<span class="icon-favorite" :class="{active:flag}"></span>
					<span class="text">{{ favoriteText }}</span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告活动</h1>
				<div class="border-1px bull-content">
					<p class="content">{{ seller.bulletin }}</p>
				</div>
			</div>
			<ul class="infoList" v-if="seller.supports">
				<li class="list" v-for="(item,i) in seller.supports" :key="i">
					<span :class="classMap[item.type]" class="icon"></span>
					<span class="description">{{ item.description }}</span>
				</li>
			</ul>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pics-wrapper" ref="picsWrapper">
					<ul class="pics-list" ref="picsList">
						<li class="item" v-for="(pic,i) in seller.pics" :key="i">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="info">
				<h1 class="title">商家信息</h1>
				<ul>
					<li class="info-item" v-for="(item,i) in seller.infos" :key="i">
						{{ item }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import star from '../star/star.vue';
	// 导入split组件
	import split from '../split/split.vue';
	import BScroll from 'better-scroll';
	// 导入设置和获取localStorage方法
	import {saveToLocal,loadFromLocal} from '../../common/js/store.js';
	export default{
		data() {
			return {
				flag:(() => {
					return loadFromLocal(this.seller.id,"favorite",false)
				})()
			}
		},
		props:['seller'],
		created() {
			// 根据不同的数据显示对应的背景图片
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
			console.log(this.flag);
		},
		mounted() {
			this._initScroll();
			this._initPicScroll();
		},
		methods:{
			_initScroll() {
				this.scroll = new BScroll(this.$refs.seller,{
					click:true
				});
			},
			// 初始化图片横向滚动
			_initPicScroll() {
				if(this.seller.pics) {
					var imgWidth = 120,
							margin = 6,
							picsListWidth = (imgWidth + margin) * this.seller.pics.length - margin;
					this.$refs.picsList.style.width = picsListWidth + 'px';
					this.picScroll = new BScroll(this.$refs.picsWrapper,{
						scrollX:true
					})
				}
			},
			toggleFavo() {
				this.flag = !this.flag;
				saveToLocal(this.seller.id,"favorite",this.flag);
			}
		},
		watch:{
			'seller'() {
				this._initScroll();
				this._initPicScroll();
			}
		},
		components:{
			star,
			split
		},
		computed:{
			favoriteText() {
				return this.flag === true ? '已收藏' : '收藏';
			}
		}
	}
</script>
<style lang="less">
	.seller{
		position:absolute;
		top:176px;
		left:0;
		bottom:0;
		width:100%;
		overflow:hidden;
		.overview{
			padding:18px;
			position:relative;
			.title{
				font-size:14px;
				color:rgb(7,17,27);
				line-height:14px;
			}
			.desc{
				display:flex;
				padding:8px 0 18px 0;
				.rating-count,.sell-count{
					font-size:10px;
					color:rgb(77,85,93);
					line-height:18px;
				}
				.rating-count{
					margin:0 12px 0 8px;
				}
			}
			.remark{
				display:flex;
				padding-top:18px;
				.remark-item{
					flex:1;
					text-align:center;
					border-right:1px solid rgba(7,17,27,0.1);
					&:last-child{
						border:none;
					}
					.remark-title{
						font-size:10px;
						color:rgb(147,153,159);
						line-height:10px;
						margin-bottom:4px;
					}
					.remark-content{
						font-size:10px;
						color:rgb(7,17,27);
						line-height:24px;
						font-weight:200;
						.num{
							font-size:24px;
						}
					}
				}
			}
			.favorite{
				position:absolute;
				right:18px;
				top:18px;
				text-align:center;
				width:40px;
				.icon-favorite{
					display:block;
					font-size:24px;
					color:rgba(7,17,27,0.3);
					line-height:24px;
					margin-bottom:4px;
					&.active{
						color:rgb(240,20,20);
					}
				}
				.text{
					display:block;
					font-size:10px;
					color:rgb(77,85,93);
					line-height:10px;
				}
			}
		}
		.bulletin{
			padding:18px 18px 0 18px;
			.title{
				font-size:14px;
				color:rgb(7,17,27);
				line-height:14px;
			}
			.bull-content{
				padding:8px 0 16px 0;
				.content{
					padding:0 12px;
					font-size:12px;
					line-height:24px;
					color:rgb(240,20,20);
				}
			}
		}
		.infoList{
			padding:0 18px;
			.list{
				padding:16px 12px;
				color:rgb(7,17,27);
				display:flex;
				border-bottom:1px solid rgba(7,17,27,0.1);
				&:last-child{
					border:none;
				}
				.icon{
					width:16px;
					height:16px;
					background-repeat:no-repeat;
					background-size:16px 16px;
					margin-right:6px;
					&.decrease{
						background-image:url(decrease_4@2x.png);	
					}
					&.discount{
						background-image:url(discount_4@2x.png);
					}
					&.guarantee{
						background-image:url(guarantee_4@2x.png);
					}
					&.invoice{
						background-image:url(invoice_4@2x.png);
					}
					&.special{
						background-image:url(special_4@2x.png);
					}
				}
				.description{
					font-size:12px;
					line-height:16px;
				}
			}
		}
		.pics{
			padding:18px;
			padding-right:0;
			.title{
				font-size:14px;
				color:rgb(7,17,27);
				line-height:14px;
				margin-bottom:12px;
			}
			.pics-wrapper{
				width:100%;
				overflow:hidden;
				.pics-list{
					display:flex;
					.item{
						margin-right:6px;
					}
				}
			}
		}
		.info{
			padding:18px 18px 0 18px;
			.title{
				font-size:14px;
				color:rgb(7,17,27);
				line-height:14px;
				padding-bottom:12px;
				border-bottom:1px solid rgba(7,17,27,0.1);
			}
			.info-item{
				padding:16px 12px;
				font-size:12px;
				color:rgb(7,17,27);
				line-height:16px;
				border-bottom:1px solid rgba(7,17,27,0.1);
				&:last-child{
					border:none;
				}
			}
		}
	}
</style>

