<template>
	<view class="container">
		<!--加载框 start-->
		<tui-loading :visible="isSuccess"></tui-loading>
		<view v-show="!isSuccess">
			<!-- 头部 -->
			<view class="head">
				<image class="bg" src="/static/brand/brand_bg.png" mode="widthFix"></image>
				<view class="head-content">
					<view class="head-logo">
						<image class="logo-img" :src="shopList.inside_logo" mode="aspectFit"></image>
						<text>{{shopList.fq_brand_name}}</text>
					</view>
					<text class="head-desc">{{shopList.introduce}}</text>
				</view>
			</view>
			<!-- 商品列表 -->
			<view class="shop">
				<ShopListOne :userlevel="userlevel" :shopList="shopList.items"></ShopListOne>
				<!-- <uni-load-more :status="loadingType"></uni-load-more> -->
			</view>
		</view>
	</view>
</template>

<script>
	import ShopListOne from "@/components/shop-news.vue"; //单列
	import tuiLoading from "@/components/loading/loading";
	
	export default {
		data() {
			return {
				shopList: {},
				loadingType: "more",
				id:"",
				//页面是否加载完毕
				isSuccess: true,
				userlevel:{}
			}
		},
		components: {
			ShopListOne,
			tuiLoading
		},
		methods: {
			loadData() {
				uni.request({
					url:`http://39.100.111.131:8080/singlebrand/id/${this.id}`,
					success:(res)=>{
						this.isSuccess = false;
						let {
							code,
							data
						} = res.data;
						// 请求成功
						if (code == 1) {
							let list = data;
							this.shopList = data;
							//判断是否还有数据		
						}
						this.loadingType = "nomore";
					},
					fail:()=>{
						
						this.loadingType = "nomore";
					}
				})	
			}
		},
		onLoad(option) {
			this.id=option.id
			console.log(this.id)
			this.loadData();
		},
		onShow(){
			this.userlevel=this.$store.state.userlevel
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		
	}
	.container {
		.head{
			position: relative;
		} 
		.bg{
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
		}
		.head-content{
			padding: 20upx;
			position: relative;
			z-index: 1;
			padding-top: 150upx;
			width: 100%;	
			.head-desc{
				color: #fff;		
				font-size: 28upx;		
				line-height: 40upx;
				overflow: hidden;
				line-height: 40upx;
				display: -webkit-box;
				text-overflow: ellipsis;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}
		}
		.head-logo{
			display: flex;
			font-size: $font-lg;
			padding: 20upx 0;
			align-items: center;
			color: #fff;
			.logo-img{
				width: 150upx;
				height: 80upx;
				overflow: hidden;
				margin-right:20upx;
			}
		}
		.shop{
			position: relative;
			z-index: 1;
		}
	}
</style>
