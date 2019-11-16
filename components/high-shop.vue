<!-- 单列商品列表组件 -->
<template>
	<view>
		<!-- 商品列表 -->
		<view class="shop-list" @click="navToDetail(item.num_iid||item.tao_id)" v-for="(item,index) in shopList" :key="index">
			<!-- 图片 -->
			<view class="shop-pictrue">
				<image class="big-pict" mode="aspectFill" :src="item.white_image+'_260x260.jpg'"></image>
			</view>
			<!-- 右侧内容 -->
			<view class="shop-content">
				<!-- 标题 -->
				<view class="shop-title">
					<image  class="shop-icn" :src="item.user_type==0?'/static/index/icon_tb.png':'/static/index/icon_tm_s.png'"
					 mode="aspectFit"></image>
					<span class="til">{{item.title}}</span>
				</view>

				<!-- 券 -->
				<view class="progress-box">
					<view class="quan">
						<image src="/static/index/quanzi.png" mode="">
						</image>
						<text class="quan-price"> ￥{{item.youhuiquan||item.coupon_info_money}}</text>
					</view>
				</view>

				<view class="shop-center">
						<text class="ago-price">原价:￥{{item.zk_final_price||item.size}}</text>
					<!-- <text @click.stop="handleShare" class="flicon">&#xe609;</text> -->
				</view>


				<!-- 价格 -->
				<view class="shop-price">
					<view class="shop-price-left">
						<text class="shop-icon">￥</text>
						<text class="now-price">{{item.commission_rate||item.quanhou_jiage}}</text>
					</view>
					<text class="sold-num">已售{{yishou(item.volume)}}件</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品列表

			};
		},
		props: ["shopList"],
		methods: {
			yishou(data){
				if(data>=10000){
					return (data/10000).toFixed(1)+'万'
				}
				else{
					return data
				}
			},
			//商品详情页面
			navToDetail(id) {
				uni.navigateTo({
					url: "/pages/index/shopdetails?id=" + id
				})
			},
			
			//分享逻辑
			handleShare(){
				console.log("点击")
			}
		}
	}
</script>

<style lang="scss">
	//商品列表
	.shop-list {
		margin: 20upx auto 20upx;
		width: 94%;
		display: flex;
		height: 260upx;
		background-color: #fff;
		border-radius: 10upx;
		overflow: hidden;

		.shop-pictrue {
			overflow: hidden;
			width: 260upx;
			padding-right: 16upx;
			.big-pict {
				display: block;
				width: 260upx;
				height: 260upx;
				border-radius: 10upx;
			}
		}
		.shop-content {
			padding: 10upx;
			flex: 1;

			.shop-title {
				.shop-icn {
					position: absolute;
					width: 50upx;
					height: 30upx;
				}

				.til {
					text-indent: 60upx;
					font-size: $font-lg;
					height: 80upx;
					overflow: hidden;
					line-height: 40upx;
					display: -webkit-box;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.shop-desc {
				color: #fb6b73;
				font-size: $font-mi;
				height: $font-mi;
				line-height: $font-mi;

				.desc {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.flicon {
					font-size: $font-base;
					float: right;
					font-weight: bold;
				}
			}

			.shop-price {
				padding-right: 20upx;
				margin-top: 10upx;
				color: #fb6b73;
				font-size: $font-sm;
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				
				.now-price {
					font-weight: bold;
					font-size: $font-lg+8upx;
					padding-right: 10upx;
				}

				.sold-num {
					color: #969696;
					font-size: $font-sm;
				}
			}

			.progress-box {
				margin-top: 10upx;
				position: relative;
				color: #969696;
				display: flex;

				.quan {
					display: flex;
					height: 32upx;
					line-height: 30upx;
					font-size: $font-sm;
					border: 1upx solid #f51515;
					margin-right: 40upx;
					position: relative;

					image {
						position: absolute;
						left: -1upx;
						width: 30upx;
						height: 30upx;

					}

					.quan-price {
						margin-left: 30upx;
						padding: 0 6upx;
						color: #f51515;
					}
				}
			}

			.shop-center {
				margin-top: 10upx;
				color: #fb6b73;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.ago-price {
					color: #969696;
					font-size: $font-sm;
				}

				.price-num {
					// font-size: $font-lg+8upx;
				}
				
				.flicon{
					font-size: $font-lg+18upx;
				}
			}
		}
	}
</style>
