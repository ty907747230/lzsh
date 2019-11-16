<template>
	<view class="uni-load-more">
		<view class="uni-load-more__img"  v-show="status === 'loading' && showIcon">
			<view class="load1">
				
			</view>
		</view>
		<view class="uni-load-more__text" :style="{color:color}">{{status === 'more' ? contentText.contentdown : (status === 'loading' ? contentText.contentrefresh : contentText.contentnomore)}}</view>
	</view>
</template>

<script>
	// 加载时候的样式组件，包括提示与动画
	export default {
		name: "uni-load-more",
		props: {
			status: {
				//上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
				type: String,
				default: 'more'
			},
			showIcon: {
				type: Boolean,
				default: true
			},
			color: {
				type: String,
				default: "#777777"
			},
			contentText: {
				type: Object,
				default () {
					return {
						contentdown: "",
						contentrefresh: "正在加载...",
						contentnomore: "没有更多数据了"
					};
				}
			}
		},
		data() {
			return {}
		}
	}
</script>

<style>
	@charset "UTF-8";

	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		line-height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.load1
	{
		display: inline-block;
		width: 32upx;
		height: 32upx;
		border-radius: 50%;
		border: 2upx solid gray;
		border-bottom-color: transparent;
		vertical-align: middle;
		-webkit-animation: load 0.6s linear infinite;
		animation: load 0.6s linear infinite;
		margin-right: 20upx;
	}

	@-webkit-keyframes load {
		0% {
			-webkit-transform: rotate(0deg);
		}
		
		100% {
			-webkit-transform: rotate(360deg);
		}
	}
</style>