<!-- 淘宝热榜列表 -->
<template>
	<view>
		<!-- 淘宝热榜列表 -->
		<view :key="index" v-for="(item,index) in shopList" class="sort-shop" @click="navToDetail(item.tao_id)">
			<!-- 左边图片 -->
			<view class="sort-shop-img">
				<image  :src="item.pict_url+'_310x310.jpg'" mode="aspectFill">		
				</image>
				<!-- <view class="shop-sort">{{index+1}}</view> -->
				
			</view>
			<!-- 右边商品详情 -->
			<view class="sort-shop-news">
				<view class="sort-shop-nums">
					{{type?"近两小时":"今日"}}成交<text>{{item.volume}}</text>件
				</view>
				<!-- 标题 -->
				<view class="sort-shop-title">
					<!-- 小图标 -->
					<image class="shop-icn"  :src="item.user_type==0?'/static/index/icon_tb_s.png':'/static/index/icon_tm_s.png'" mode="aspectFit"></image>
					<span class="til">{{item.tao_title}}</span>
				</view>
				
				<!-- 价格 -->
				<view class="shop-price">
					<text>￥</text>
					<text class="now-price">{{item.commission_rate||item.quanhou_jiage}}</text>
					<text class="ago-price">天猫价:￥{{item.zk_final_price||item.size}}</text>
				</view>
				
				
				<!-- 券 -->
				<view class="sort-shop-ticket">
						<view class="quan">
							<image  src="/static/index/quanzi.png" mode="">
							</image>
							<text class="quan-price"> ￥{{item.coupon_info_money}}</text>
						</view>
						<text class="yugu">
							预估赚:￥8.88
						</text>
					<view class="shop-link">
						<text @click="navToDetail(item.itemid)">立即抢</text>
				</view>
					
					</view>
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
		props: ["shopList","type"],
		methods:{
			//商品详情页面
			navToDetail(id){
				uni.navigateTo({
					url:"/pages/index/shopdetails?id="+id
				})
			}
		}
	}
</script>

<style lang="scss">
	.sort-shop {
		background-color: #fff;
		margin-bottom: 0;
		padding: 10upx;
		margin: 20upx auto 0;
		width: 96%;
		height: 300upx;
		display: flex;
		.sort-shop-img{
			flex: 1.2;
			overflow: hidden;
			margin-right:20upx;
			position: relative;		
			image{
				border-radius: 20upx;
				width: 100%;
				height: 100%;
				
			}
			.shop-sort{
				position: absolute;
				border-radius: 20upx;
				 width: 50upx;
				 height: 50upx;
				 line-height: 50upx;
				 text-align: center;
				top: 0;
				left: 0;
				font-size:$font-sm;
				color: #fff;
				background: url('~@/static/index/h4_icon_svip.png') ;
				background-size: 50upx 50upx;
				background-color: antiquewhite;
				border-radius: 50%;
				 // background-image: linear-gradient(to right, #5446f4, #ae68ec)
			}
		}
		.sort-shop-news{
			flex: 2;
			
			flex-direction: column;
			justify-content: space-evenly;
			.sort-shop-title{
						
				.shop-icn {
					position: absolute;
					width: 50upx;
					height: 30upx;
				}
				
				.til {
					text-indent: 60upx;
					font-size: $font-sm;
					height: 80upx;
					overflow: hidden;
					line-height: 40upx;
					display: -webkit-box;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			.sort-shop-nums{
				
				font-size: $font-base;
				margin-bottom:10upx;
				text{
					color: #ff6621;
				}
			}
			
			.shop-price {
				color: #fb6b73;
				font-size: $font-sm;
				height: 70upx;
				line-height: 70upx;
				position: relative;
				.now-price {
					font-weight: bold;
					font-size: $font-lg+8upx;
					padding-right: 10upx;
				}
			
				.ago-price {
					position: absolute;
					left: 160upx;
					color: #969696;
					
				}
			}
			
			.sort-shop-ticket{
				font-size: $font-sm;
				color: #f54a05;
				display: flex;
				margin: 10upx 0;
				justify-content: space-between;
				.quan{
					display: flex;
					height: 31upx;
					line-height: 30upx;
					font-size: $font-sm;
					border: 1upx solid #f51515;
					//border-left: none;
					
					position: relative;
					image{
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
					background-color: #f5b8b8;
				}
				.shop-link{
					text{
						padding: 6upx 14upx;
						color: #fff;
						font-size: $font-sm;
						border-radius: 26upx;
						background-image: linear-gradient(to right, #fc3c9c, #ff825b)
					}
				}
			}
		}
	}
</style>
