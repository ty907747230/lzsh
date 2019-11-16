<!-- 单列商品列表组件 -->
<template>
	<view>
		<!-- 商品列表 -->
		<view  class="shop-list" @click="navToDetail(item.num_iid||item.tao_id||item.itemid)" v-for="(item,index) in shopList" :key="index">
			<!-- 图片 -->
			<view class="shop-pictrue">
				<image class="big-pict" :src="(item.white_image||item.pict_url||item.itempic)+'_310x310.jpg'" mode="aspectFill"></image>
			</view>
			<!-- 右侧内容 -->
			<view class="shop-content">
				<!-- 标题 -->
				<view class="shop-title">
					<image class="shop-icn" :src="item.user_type==0?'/static/index/icon_tb.png':'/static/index/icon_tm_s.png'" mode="aspectFit"></image>
					<span class="til">{{item.title||item.itemshorttitle}}</span>
				</view>

				<view class="quan-div">
					<view class="quan">
						<image src="/static/index/quanzi.png" mode="">
						</image>
						<text class="quan-price"> {{item.youhuiquan||item.coupon_info_money||item.couponmoney}}</text>
					</view>
				</view>

				<!-- 价格 -->
				<view class="shop-price">
					<text class="ago-price">{{item.user_type==0?'淘宝':'天猫'}}价:￥{{item.zk_final_price||item.size||item.itemprice}}</text>
					<text class="yugu" v-if="userlevel.on_off">
						奖:￥{{tofix(item.tkfee3||item.tkmoney)}}
					</text> 
				</view>
				<!-- 券 -->
				<view class="progress-box">
					<view class="now-price">
						<text class="now-price-icon">￥</text>
						<text class="now-price">{{item.commission_rate||item.quanhou_jiage||item.itemendprice}}</text>
					</view>
					<text class="sold-num">已售{{yishou(item.volume||item.itemsale)}}件</text>
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
		props: ["shopList","userlevel","isshow"],
		methods: {
			tofix(data) {
				return (data * this.userlevel.level_percent).toFixed(2)
			},
			yishou(data) {
				return this.$yishou(data)
			},
			//商品详情页面
			navToDetail(id) {
				uni.navigateTo({
					url: "/pages/index/shopdetails?id=" + id
				})
			}
		},
		
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
				width: 260upx;
				height: 260upx;
				border-radius: 10upx;
			}
		}

		.shop-content {
			padding: 10upx;
			padding-right: 20upx;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.shop-title {
				margin-top: 10upx;
				.shop-icn {
					position: absolute;
					width: 50upx;
					height: 30upx;
				}
				.til {
					text-indent: 60upx;
					font-size: $font-base;
					height: 40upx;
					overflow: hidden;
					line-height: 40upx;
					display: -webkit-box;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
			}
			.quan-div{
				display: flex;  
			}
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
				padding-right: 26upx;
				font-size: $font-mi;
				color: #969696;
				display: flex;
				justify-content: space-between;

				.ago-price {
					font-size: $font-sm;
					color: #969696;
				}
			}

			// 进度条
			.progress-box {
				padding-right: 26upx;
				color: #fb6b73;
				font-size: $font-sm;
				display: flex;
				justify-content: space-between;

				.now-price {
					.now-price-icon {
						font-size: $font-base;
					}

					font-weight: bold;
					font-size: $font-lg+8upx;
					padding-right: 10upx;
				}

				.sold-num {
					color: #969696;
					font-size: $font-sm;

				}
			}


			.yugu {
				border:solid 1upx #ea3424;
				color: #ea3424;
				background-color: #fdf6f2;
				padding: 0 6upx;
				border-radius: 10upx;
				font-size: $font-sm;
			}
		}
	}
</style>
