<template>
	<div class="header-box">
		<div class="content-wrapper">
			<div class="avatar">
				<img :src="seller.avatar" width="64" height="64">
			</div>
			<div class="content">
				<p class="title">
					<span class="brnd"></span>
					<span class="name">{{ seller.name }}</span>
				</p>
				<p class="desc">
					{{ seller.description }}/{{ seller.deliveryTime }}分钟
				</p>
				<p class="support" v-if="seller.supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{ seller.supports[0].description }}</span>
				</p>
			</div>
			<div class="support-count" v-if="seller.supports" @click="flag = true">
				<span>{{ seller.supports.length }}个</span><span class="icon-keyboard_arrow_right"></span>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="flag = true">
			<span class="bulletin"></span>
			<span class="text">{{ seller.bulletin }}</span>
			<span class="icon-keyboard_arrow_right"></span>
		</div>
		<!-- 背景模糊图 css的filter能实现背景模糊-->
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%">
		</div>

		<!-- 弹窗层 -->
		<!-- Sticky Footer 绝对底部 -->
		<transition>
			<div class="detail" v-show="flag">
				<div class="detail-wrapper clearfix">
					<div class="detail-content">
						<h1 class="title">{{ seller.name }}</h1>
						<div class="star">
							<star :size="48" :score="seller.score"></star>
						</div>
						<div class="subtitle">
							<div class="line"></div>
							<h2>优惠信息</h2>
							<div class="line"></div>
						</div>
						<ul class="infoList" v-if="seller.supports">
							<li class="list" v-for="(item,i) in seller.supports" :key="i">
								<span :class="classMap[item.type]" class="icon"></span>
								<span class="description">{{ item.description }}</span>
							</li>
						</ul>
						<div class="subtitle">
							<div class="line"></div>
							<h2>商家公告</h2>
							<div class="line"></div>
						</div>
						<p class="notice">{{ seller.bulletin }}</p>
					</div>
				</div>
				<div class="detail-close" @click="flag = false">
					<span class="icon-close"></span>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
	import star from '../star/star.vue';
	export default{
		data() {
			return {
				flag:false
			}
		},
		props:['seller'],
		created() {
			// 根据不同的数据显示对应的背景图片
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		},
		components:{
			star
		}
	}
</script>
<style lang="less" scoped>
	.v-enter,.v-leave-to{
		opacity:0;
	}
	.v-enter-active,.v-leave-active{
		transition: all 0.5s ease;
	}
	.header-box{
		background:rgba(7,17,27,0.5);
		color:white;
		position:relative;
		overflow:hidden;
		.content-wrapper{
			padding:24px 12px 18px 24px;
			display:flex;
			position:relative;
			.avatar{
				img{
					border-radius:2px;
				}
			}
			.content{
				margin-left:16px;
				.title{
					display:flex;
					margin:2px 0 8px 0;
					.brnd{
						width:30px;
						height:18px;
						display:block;
						background:url(brand@2x.png) no-repeat;
						background-size:30px 18px;
					}
					.name{
						font-size:16px;
						font-weight:bold;
						line-height:18px;
						margin-left:6px;
					}
				}
				.desc{
					font-size:12px;
					line-height:12px;
					margin-bottom:10px;
				}
				.support{
					display:flex;
					.icon{
						width:12px;
						height:12px;
						margin-right:4px;
						background-size:12px 12px;
						background-repeat:no-repeat;
						&.decrease{
							background-image:url(decrease_1@2x.png);	
						}
						&.discount{
							background-image:url(discount_1@2x.png);
						}
						&.guarantee{
							background-image:url(guarantee_1@2x.png);
						}
						&.invoice{
							background-image:url(invoice_1@2x.png);
						}
						&.special{
							background-image:url(special_1@2x.png);
						}
					}
					.text{
						height:12px;
						font-size:12px;
						line-height:12px;
					}
				}
			}
			.support-count{
				position:absolute;
				right:12px;
				bottom:18px;
				padding:0 8px;
				border-radius:14px;
				height:24px;
				background:rgba(0,0,0,0.2);
				color:white;
				span{
					font-size:10px;
					line-height:24px;
				}
			}
		}
		.bulletin-wrapper{
			height:28px;
			line-height:28px;
			background:rgba(7,17,27,0.2);
			padding:0 16px 0 12px;
			white-space:nowrap;
			overflow:hidden;
			text-overflow:ellipsis;
			position:relative;
			.bulletin{
				display:inline-block;
				width:22px;
				height:12px;
				background:url(bulletin@2x.png) no-repeat;
				background-size:22px 12px;
				margin-top:8px;
			}
			.text{
				vertical-align:middle;
				font-size:10px;
				margin:0 2px;
			}
			.icon-keyboard_arrow_right{
				position:absolute;
				right:8px;
				top:7px;
			}
		}
		.background{
			width:100%;
			height:100%;
			position:absolute;
			top:0;
			left:0;
			filter:blur(10px);
			z-index:-1;
		}
		.detail{
			position:fixed;
			top:0;
			left:0;
			width:100%;
			height:100%;
			overflow:auto;
			z-index:100;
			background:rgba(7,17,27,0.8);
			backdrop-filter:blur(10px);
			.detail-wrapper{
				min-height:100%;
				width:100%;
				color:white;
				.detail-content{
					margin-top:64px;
					padding-bottom:64px;
					.title{
						font-size:16px;
						text-align:center;
						font-weight:700;
						line-height:16px;
					}
					.star{
						text-align:center;
						margin-top:16px;
					}
					.subtitle{
						display:flex;
						width:80%;
						margin:28px auto 24px;
						.line{
							flex:1;
							border-bottom:1px solid rgba(255,255,255,0.2);
							position:relative;
							top:-7px;
						}
						h2{
							font-size:14px;
							font-weight:700;
							line-height:14px;
							padding:0 12px;
						}
					}
					.infoList{
						box-sizing:border-box;
						width:80%;
						margin:0 auto;
						padding:0 12px;
						.list{
							margin-bottom:12px;
							display:flex;
							&:last-child{
								margin-bottom:0;
							}
							.icon{
								width:16px;
								height:16px;
								background-repeat:no-repeat;
								background-size:16px 16px;
								margin-right:6px;
								&.decrease{
									background-image:url(decrease_1@2x.png);	
								}
								&.discount{
									background-image:url(discount_1@2x.png);
								}
								&.guarantee{
									background-image:url(guarantee_1@2x.png);
								}
								&.invoice{
									background-image:url(invoice_1@2x.png);
								}
								&.special{
									background-image:url(special_1@2x.png);
								}
							}
							.description{
								font-size:12px;
								line-height:16px;
							}
						}
					}
					.notice{
						width:80%;
						padding:0 12px;
						box-sizing:border-box;
						margin: 0 auto;
						font-size:12px;
						line-height:24px;
					}
				}
			}
			.detail-close{
				width:32px;
				height:32px;
				font-size:32px;
				position:relative;
				margin:-64px auto 0;
				clear:both;
			}
		}
	}
</style>
