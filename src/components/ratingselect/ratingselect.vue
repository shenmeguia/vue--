<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span class="desc positive" :class="{'active':selectType === 2}" @click="select(2)">
				{{ desc.all }}
				<i class="count" v-if="ratings">{{ ratings.length }}</i>
			</span>
			<span class="desc positive" :class="{'active':selectType === 0}" @click="select(0)">
				{{ desc.positive }}
				<i class="count" v-if="positives">{{ positives.length }}</i>
			</span>
			<span class="desc negative" :class="{'active':selectType === 1}" @click="select(1)">
				{{ desc.negative }}
				<i class="count" v-if="negatives">{{ negatives.length }}</i>
			</span>
		</div>
		<div class="switch" :class="{'active':onlyContent === true}" @click="toggle()">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>
<script>
	export default{
		// 父组件需要传递的数据
		// ratings 评论数据
		// selectType 选择的类型 0正面的 1负面的 2全部
		// onlyContent 布尔值 是否只看有内容的评价
		// desc对象 all属性全部 positive正面的 negative负面的
		props:['ratings','selectType','onlyContent','desc'],
		methods:{
			select(i) {
				this.$emit('select',i);
			},
			toggle() {
				this.$emit('toggle',!this.onlyContent);
			}
		},
		computed:{
			// 计算正面评价的数量
			positives() {
				if(this.ratings) {
					return this.ratings.filter((item) => {
						return item.rateType === 0;
					})
				}
			},
			// 计算负面评价的数量
			negatives() {
				if(this.ratings) {
					return this.ratings.filter((item) => {
						return item.rateType === 1;
					})
				}
			}
		}
	}
</script>
<style lang="less">
	.ratingselect{
		.rating-type{
			padding:18px 0;
			margin:0 18px;
			border-bottom:1px solid rgba(7,17,27,0.1);
			display:flex;
			.desc{
				color:rgb(77,85,93);
				padding:8px 12px;
				border-radius:2px;
				margin-right:8px;
				font-size:12px;
				line-height:16px;
				i{
					font-style:normal;
					font-size:8px;
				}
				&.positive{
					background:rgba(0,160,220,0.2);
					&.active{
						background:rgb(0,160,220);
						color:white;
					}
				}
				&.negative{
					background:rgba(77,85,93,0.2);
					&.active{
						background:rgb(77,85,93);
						color:white;
					}
				}
			}
		}
		.switch{
			padding:12px 18px;
			border-bottom:1px solid #E6E7E8;
			color:rgb(147,153,159);
			line-height:24px;
			display:flex;
			&.active{
				.icon-check_circle{
					color:#00c850;
				}
			}
			.icon-check_circle{
				font-size:24px;
				margin-right:8px;
			}
			.text{
				font-size:12px;
			}
		}
	}
</style>