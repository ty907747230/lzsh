<template>
	<view class="tui-scroll-top" :style="{bottom:bottom+'rpx',right:right+'rpx'}"  @tap.stop="goTop" v-show="visible && toggle">
			<text class="flicon icon">&#xe6fe;</text>
	</view>
</template>

<script>
	export default {
		name: "tuiScrollTop",
		props: {
			//回顶部按钮距离底部距离 rpx
			bottom: {
				type: Number,
				default: 120
			},
			//回顶部按钮距离右侧距离 rpx
			right: {
				type: Number,
				default: 36
			},
			//距离顶部多少距离显示 px
			top: {
				type: Number,
				default: 100
			},
			//滚动距离
			scrollTop: {
				type: Number
			}
		},
		watch: {
			scrollTop(newValue, oldValue) {
				this.change();
			}
		},
		data() {
			return {
				//判断是否显示
				visible: false,
				//控制显示，主要解决调用api滚到顶部fixed元素抖动的问题
				toggle: true
			};
		},
		methods: {
			goTop: function() {
				this.toggle = false;
				
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
				setTimeout(() => {
					this.toggle = true
				}, 220)
			},
			change() {
				
				let show = this.scrollTop > this.top;
				console.log(show)
				if ((show && this.visible) || (!show && !this.visible)) {
					return
				}
				this.visible = show
			}
		}
	}
</script>

<style>
	.tui-scroll-top {
		width: 66rpx;
		height: 66rpx;
		background: rgba(255, 255, 255, .98);
		
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		position: fixed;
		z-index: 999999;
		box-shadow:  0 0upx 26upx #ccc;
		/* -webkit-transform: translateZ(0);
		transform: translateZ(0); */
		/* -webkit-overflow-scroll: touch; */
	}

	.tui-scroll-top-img {
		width: 48rpx;
		height: 48rpx;
		display: block;
	}
	.icon{
		font-size:40upx;
		color: #F43F3B;
	}
</style>
