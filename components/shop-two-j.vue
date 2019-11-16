<!-- 双列商品列表 -->
<template>
	<view class="shop-two">
		<!-- 双列商品列表 -->
		<view :key="index" v-for="(item,index) in shopList" class="shop" @click="navToDetail(item.goods_id)">
			<!-- 上边图片 -->
			<view class="shop-img">
				<image class="shop-img-img" :src="item.picurl" mode="aspectFill">
				</image>

			</view>
			<!-- 下边商品详情 -->
			<view class="shop-content">
				<!-- 标题 -->
				<view class="shop-title">
					<image class="shop-icn" src="/static/index/jd-icon.png"></image>
					<view class="til">{{item.goods_short_name}}</view>
				</view>

				<!-- 券信息 -->
				<view class="shop-ticket">
					<view class="quan">
						<image src="/static/index/quanzi.png" mode="">
						</image>
						<text class="quan-price"> ￥{{item.discount}}</text>
					</view>
					<!-- <text class="yugu"  v-if="userlevel.on_off">
						当前奖:￥{{tofix(item.tkfee3||item.tkmoney)}}
					</text> -->
				</view>
				
				<view class="sale-num">
					<!-- 价格 -->
					<view class="shop-price">
						<text>券后￥</text>
						<text class="now-price">{{item.price_after}}</text>
					<!-- 	<text class="ago-price">{{item.zk_final_price||item.size}}</text> -->
					</view>
					<text >已售{{yishou(item.sales)}}</text>
				</view>
				
				<view class="volume">
					<text class="shop-title">{{item.shopname}}</text>
					
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			userlevel: {} //用户等级信息
			};
		},
		props: ["shopList","isshow"],
		methods: {
			yishou(data){
				return this.$yishou(data)
			},
			//商品详情页面
			navToDetail(id) {
				uni.navigateTo({
					url: "/pages/index/shopdetails-j?id=" + id
				})
			},
			tofix(data) {
				return (data * this.userlevel.level_percent).toFixed(2)
			},
		},
		onShow() {
			this.userlevel = this.$store.state.userlevel;
		}
	}
</script>

<style lang="scss">
	.shop-two {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 20upx;

		.shop {
			background-color: #fff;
			width: 49%;
			height: 600upx;
			display: flex;
			border-radius: 10upx;
			overflow: hidden;
			flex-direction: column;
			border-radius: 20upx;
			overflow: hidden;
			margin-top: 20upx;
			.shop-img {
				flex: 1.4;
				overflow: hidden;
				border-radius: 20upx;
				.shop-img-img {
					border-radius: 20upx;
					overflow: hidden;
					// width: 100%;
					height: 340upx;
				}
			}

			.shop-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				font-size: $font-sm;
				padding: 20upx;

				.shop-title {
					.shop-icn {
						position: absolute;
						width: 30upx;
						height: 30upx;
					}

					.til {
						text-indent: 40upx;
						font-size: $font-base;
						height: 80upx;
						overflow: hidden;
						line-height: 40upx;
						display: -webkit-box;
						text-overflow: ellipsis;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}

				.shop-ticket {
					font-size: $font-mi;
					display: flex;
					justify-content: space-between;
					margin-top:10upx;
					.quan {
						display: flex;
						height: 31upx;
						line-height: 30upx;
						font-size: $font-sm;
						border: 1upx solid #f51515;
						position: relative;

						image {
							position: absolute;
							left: -1upx;
							width: 30upx;
							height: 30upx;
						}
						.quan-price{
							margin-left:30upx;
							padding:0 6upx;
							color: #f51515;
							
						}
					}
					.yugu{
						color: #ea3424;
						background-color: #fdf6f2;
						padding:0 6upx;
						border-radius: 10upx;
					}
				}

				.ticket-price {
					text {
						font-weight: bold;
						font-size: $font-lg+8upx;
						color: #dc1c46;
					}
				}

				.sale-num {
					display: flex;
					justify-content: space-between;
					align-content: center;
					color: #969696;
					margin-top:10upx;
					
					.shop-price {
						color: #fb6b73;
						font-size: $font-sm;
						// height: 70upx;
						// line-height: 70upx;
						//position: relative;
						.now-price {
							font-weight: bold;
							font-size: $font-lg;
							padding-right: 10upx;
						}
					
						.ago-price {
							text-decoration: line-through;
							color: #969696;
							
						}
					}
					
				}
				.volume{
					color: #969696;
					padding-top:6upx;
				
				}
			}

		}
	}
</style>
