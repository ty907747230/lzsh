<template>
	<view >
		<view class="order-content" v-for="(item,index) in shopList" :key="index">
			
			<view class="order-content-left">
				<image :src="item.item_img" mode="widthFix"></image>
			</view>
			<view class="order-content-right">
				<view class="order-content-title">
					{{item.title}}
				</view>
				<view class="order-content-content">
			1
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
		
			};
		},
		props: ["shopList"],
	}
</script>

<style lang="scss">
	.order-content {
		display: flex;
		background-color: #FFFFFF;
		width: 100%;
		height: 260upx;

		.order-content-left {
			width: 300upx;

			image {
				width: 300upx;
				height: 300upx;
			}
		}

		.order-content-right {
			flex: 1;
		}
	}
</style>
