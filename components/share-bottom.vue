<template>
	<view class="share-bottom">
		<view class="share-title">


			<text>分享到</text>

		</view>
		<view class="list">
			<view class="box">
				<image src="/static/index/wx.png"></image>
				<view class="title">
					淘口令
				</view>
			</view>
			<view class="box">
				<image src="/static/index/wx.png"></image>
				<view class="title">
					微信
				</view>
			</view>
			<view class="box">
				<image src="/static/index/qq.png"></image>
				<view class="title">
					QQ
				</view>
			</view>
			<view class="box">
				<image src="/static/index/wb.png"></image>
				<view class="title">
					微博
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.share-bottom{
		background-color: #fff;
	
	}
	.share-title {
		width: 100%;
		text-align: center;
		color: #c2c2c2;
		position: relative;
		text {
			position: relative;
			z-index: 1;
			background-color: #fff;
			padding: 0 40upx;
			
		}

		&:after {
			position: absolute;
			width: 100%;
			top: 50%;
			height: 0;
			content: '';
			border-bottom: 1px solid #ccc;
			left: 0;
		}
	}

	// .share-line{
	// 	height: 0;
	// 	width:100%;
	// 	top: 50%;
	// 	position: absolute;
	// 	border-top:1upx solid #959595; 
	// }
	

	.list {
		width: 100%;
		display: flex;
		padding: 20upx 0;

		//border-top: 1px solid #f2f2f2;
		.box {
			width: 25%;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			image {
				width: 13.8vw;
				height: 13.8vw;
			}

			.title {
				margin-top: 10upx;
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 26upx;
			}
		}
	}
</style>
