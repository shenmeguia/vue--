<template>
	<!-- 通过starType判断star的大小设置不同的样式 一共三个尺寸 -->
	<div class="star" :class="starType">
		<span v-for="(item,i) in itemClasses" :class="item" class="star-item" :key="i"></span>
	</div>
</template>
<script> 
	const LENGTH = 5;//星星个数(五星)
	//星星的状态，对应三个类
	const ON = 'on';
	const OFF = 'off';
	const HALF = 'half'; 
	export default {
		// 尺寸和评分
		props:['size','score'],
		// 计算属性
		computed: {
			// starType三种尺寸 48 36 24
			starType() {
				return 'star-' + this.size;
			},
			itemClasses() {
				// 结果为一个数组
				var result = [];
				var score = Math.floor(this.score * 2) / 2;
				// 评分是否有小数
				var decimal = score % 1 !== 0;
				// 评分整数个数
				var integer = Math.floor(score);
				// 整数都添加on
				for(var i = 0; i < integer; i++) {
					result.push(ON);
				}
				// 小数添加half
				if(decimal) {
					result.push(HALF);
				}
				// 剩下的都是off
				while(result.length < LENGTH) {
					result.push(OFF);
				}
				return result;
			}
		}
	}
</script>
<style lang="less">
	.star{
		.star-item{
			background-repeat:no-repeat;
			display:inline-block;
		}
		&.star-48{
			.star-item{
				width:20px;
				height:20px;
				margin-right:22px;
				background-size:20px 20px;
				&:last-child{
					margin-right:0;
				}
				&.on{
					background-image:url(star48_on@2x.png);
				}
				&.off{
					background-image:url(star48_off@2x.png);
				}
				&.half{
					background-image:url(star48_half@2x.png);
				}
			}
		}
		&.star-36{
			.star-item{
				width:15px;
				height:15px;
				margin-right:6px;
				background-size:15px 15px;
				&:last-child{
					margin-right:0;
				}
				&.on{
					background-image:url(star36_on@2x.png);
				}
				&.off{
					background-image:url(star36_off@2x.png);
				}
				&.half{
					background-image:url(star36_half@2x.png);
				}
			}
		}
		&.star-24{
			.star-item{
				width:10px;
				height:10px;
				margin-right:3px;
				background-size:10px 10px;
				&:last-child{
					margin-right:0;
				}
				&.on{
					background-image:url(star24_on@2x.png);
				}
				&.off{
					background-image:url(star24_off@2x.png);
				}
				&.half{
					background-image:url(star24_half@2x.png);
				}
			}
		}
	}
</style>