<template>
	<!-- 我的订单 -->
	<view class="container">
		<!-- 平台类型 -->
		<view class="pt-type">
			<view :key='index' class="pt-type-item" v-for="(item,index) in typelist" @click="clickType(index)">
				<text :class="[index==currentType?'pt-type-item-active':'']">
					{{item.val}}
				</text>
			</view>
		</view>
		<view class="nav">
			<view @click="clickNav(index)" :class="[index==currentItem?'nav-item-active':'']" class="nav-item" v-for="(item,index) in navlist"
			 :key="index">
				{{item.val}}
			</view>
		</view>
		<!-- <view class="search">
			<text class="flicon">&#xe69c;</text>
			<input class="uni-input" placeholder="输入订单编号搜索"></input>
		</view> -->
		<view class="white-space">

		</view>



		<view class="order-item" v-for="(item,index) in navlist" :key="index" v-if="index==currentItem">
			<seize-seat typeimg='noorder' v-if="item.orderList.length==0"></seize-seat>
			<view class="order-content" v-if="item.orderList.length!=0" v-for="(items,indexs) in item.orderList" :key="indexs">
				<view class="order-content-left">
					<image :src="items.item_img" mode="aspectFill"></image>
				</view>
				<view class="order-content-right">
					<view class="order-content-title">
						{{items.title}}
					</view>
					<view class="order-content-content">
						<view class="creat-data">
							<text class="creat-data-w">创建日 {{items.tb_paid_time}}</text>
							<text class="order-status weiquan" v-if="items.tk_status==0">维权</text>
							<text class="order-status fukuan" v-if="items.tk_status==1">已付款</text>
							<text class="order-status jiesuan" v-if="items.tk_status==2">已结算</text>
							<text class="order-status shixiao" v-if="items.tk_status==3">已失效</text>
						</view>
						<!-- <view class="">
							<text>结算日</text>
							<text>{{}}</text>
						</view>	 -->
						<view class="dingdan">
							<text class="dingdan-id">订单号 {{items.trade_parent_id}}</text>
							<text @click="copy_dd(items.trade_parent_id)" class="dingdan-c">复制</text>
						</view>
						<view class="shouyi">
							<text>消费金额： ￥{{items.pay_price}}</text>
							<text class="yugu">预估收益： ￥{{items.pub_share_pre_fee}}</text>
						</view>
					</view>

				</view>

			</view>
			<uniLoadMore v-if="item.orderList.length!=0" :status="item.loadingType"></uniLoadMore>
		</view>

	</view>
</template>

<script>
	import seizeSeat from '@/components/seize-seat.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import orderList from "@/components/orderList.vue"
	export default {
		components: {
			orderList,
			uniLoadMore,
			seizeSeat
		},
		data() {
			return {
				currentItem: 0,
				currentType: 0,
				token: "",
				typelist: [{
						val: '淘宝',
						platform: 0
					},
					{
						val: '京东',
						platform: 1
					},
					{
						val: '拼多多',
						platform: 2
					}
				],
				navlist: [{
						val: "所有订单",
						type: "all_order",
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
					},
					{
						val: "已付款",
						type: "order_paid",
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
					},
					{
						val: "已到账",
						type: "order_settled",
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
					},
					{
						val: "已失效",
						type: "order_expried",
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
					}
				]
			}
		},
		onPullDownRefresh() {
			this.loadData("refresh")
		},
		onLoad() {
			console.log(this.$store.state.user.token)
			//每次显示都请求id
			this.token = this.$store.state.user.token;
			this.loadData();
		},
		//上拉加载
		onReachBottom() {
			this.loadData();
		},
		methods: {
			// type点击事件
			clickType(index) {
				this.currentType = index;
				this.loadData("typeChange");
			},
			// nav点击事件
			clickNav(index) {
				this.currentItem = index;
				this.loadData("tabChange");
			},
			copy_dd(data) {
				uni.setClipboardData({
					data: data,
					success: () => {
						this.$msg('复制成功')
					}
				})
			},
			loadData(source) {
				uni.showLoading({
					title: "正在加载...",
					mask: true
				})
				console.log(this.currentType)
				var typeItem = this.typelist[this.currentType]

				var navItem = this.navlist[this.currentItem];
				console.log(source);
				//刷新或者类型切换都会重新请求数据
				if (source == "refresh") {
					console.log("清空");
					navItem.loadingType = 'more';
					navItem.loaded = false;
					navItem.pageNo = 1;
					navItem.orderList = [];
					uni.stopPullDownRefresh();
				}
				
				if(source == "typeChange"){
					this.navlist.forEach(e=>{
						e.loadingType = 'more';
						e.loaded = false;
						e.pageNo = 1;
						e.orderList = [];
					})
				}

				//检测没有数据
				if (navItem.loadingType === "nomore") {
					uni.hideLoading();
					return;
				}
				//检测是否是第一次加载，防止重复加载数据
				if (source == "tabChange" && navItem.loaded == true) {
					uni.hideLoading();
					return
				}
				navItem.loadingType = "loading";
				console.log(typeItem.platform)
				this.$api.MyOrders(this.token, navItem.type, navItem.pageNo, 10, typeItem.platform).then(res => {
					uni.hideLoading();
					let {
						code,
						data
					} = res.data;
					//请求成功对应序号加一
					navItem.pageNo++;
					//请求成功
					if (code == 2000) {
						console.log(res)
						let shopList = data.order_data;
						// 添加新增数据		
						navItem.orderList = navItem.orderList.concat(shopList);
						console.log(navItem.orderList)
						//请求成功序号增加,并且修改对应得加载状态
						navItem.loaded = true;
						//判断是否还有数据
						navItem.loadingType = data.page_info.has_next ? 'more' : "nomore";
					} else if (code == 2001) {
						navItem.loadingType = "nomore";
					}
					//token过期
					else {
						uni.switchTab({
							url: "/pages/user/user"
						})
						this.$store.commit("clearToken");
						uni.showToast({
							title: "你已在其他客户端登录，请重新登录",
							duration: 2000,
							icon: "none"
						})
					}
				}).catch(res => {
					uni.hideLoading()
					uni.stopPullDownRefresh();
					this.$msg("荔枝开小差了，请联系客服")
				})
			}

		},

	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}

	.container {

		width: 100%;

		.pt-type {
			width: 100%;
			padding: 0 40upx;
			display: flex;
			height: 70upx;
			justify-content: space-between;
			align-items: center;
			position: fixed;
			background-color: #fff;
			font-size: $font-base;
			border-bottom: 1upx solid #f8f8f8;
			z-index: 1;

			.pt-type-item {
				flex: 1;
				padding: 10upx 0;
				text-align: center;
				display: flex;
				justify-content: center;
			}

			.pt-type-item-active {
				color: #FFFFFF;
				background-color: #F56657;
				padding: 0 20upx;
				border-radius: 70upx;
			}
		}

		.nav {
			width: 100%;
			padding: 0 40upx;
			display: flex;
			height: 70upx;
			justify-content: space-between;
			align-items: center;
			position: fixed;
			background-color: #fff;
			font-size: $font-lg;
			z-index: 1;
			top: 70upx;

			.nav-item {
				padding: 10upx 0;
			}

			.nav-item-active {
				color: #f00;
				border-bottom: 1px solid #f00;
			}
		}

		.search {
			position: fixed;
			margin-top: 70upx;
			box-sizing: border-box;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16upx 20upx;
			height: 80upx;
			border-bottom: #fff solid 1upx;
			z-index: 2;
			background-color: #f8f8f8;

			input {
				width: 96%;
				background-color: #fff;
				margin: 0 auto;
				height: 60upx;
				border-radius: 16upx;
				text-indent: 60upx;
			}

			.flicon {
				font-size: 40upx;
				position: absolute;
				padding-right: 20upx;
				left: 6%;
				top: 16upx;
			}
		}

		.white-space {
			height: 150upx;
			width: 100%;
		}

		.order-list {

			.order-item {
				width: 100%;
				height: 200upx;
				background-color: #fff;
			}
		}

		.order-item {
			padding: 10upx 20upx;
		}

		.order-content {
			display: flex;
			background-color: #FFFFFF;
			width: 100%;
			height: 200upx;
			margin-bottom: 20upx;
			border-radius: 16upx;

			.order-content-left {
				width: 200upx;
				margin-right: 16upx;

				image {
					border-radius: 16upx;
					width: 200upx;
					height: 200upx;
					overflow: hidden;
				}
			}

			.order-content-right {
				height: 200upx;
				padding: 14upx;
				flex: 1;
				color: #545454;

				.order-content-title {
					font-size: $font-base;
					overflow: hidden;
					padding: 2upx 6upx;
					line-height: 40upx;
					display: -webkit-box;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					margin-bottom: 16upx;
				}

				.order-content-content {
					color: #949494;
					font-size: $font-sm;

					.creat-data {
						margin-bottom: 6upx;
						.order-status{
							padding: 2upx 16upx;
							border-radius: 30upx;
							color: #FFFFFF;
							margin-left: 20upx;
							border:1upx solid #FFFFFF;
						}
						.weiquan{
							background-color: #DD5353;
						}
						.fukuan{
							background-color: #0081FF;
						}
						.jiesuan{
							background-color: #44CF85;
						}
						.shixiao{
							background-color: #BCBCBC;
						}
						.creat-data-w {
							margin-right: 10upx;
						}
					}

					.dingdan {
						.dingdan-id {
							margin-right: 16upx;
						}

						.dingdan-c {
							font-size: $font-mi;
							padding: 6upx 26upx 0;
							border-radius: 30upx;
							border: solid 1upx #969696;
							margin-left: 10upx;

						}
					}

					.shouyi {
						margin-top: 16upx;
						color: #545454;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.yugu {
							color: #dc8279;
						}
					}
				}


			}
		}
	}
</style>
