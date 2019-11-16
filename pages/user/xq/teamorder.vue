<template>
	<!-- 我的订单 -->
	<view class="container">
		<view class="order-type">
			<view @click="clickType(index)" class="order-type-item" :class="index==currentType?'active':''" v-for="(item,index) in typelist" :key="index">
				<text class="">{{item.val}}</text>
			</view>
		</view>
		<!-- 平台类型 -->
		<view class="pt-type">
			<view :key='index' class="pt-type-item" v-for="(item,index) in pttypelist"  @click="clickptType(index)">
				<text  :class="[index==currentPt?'pt-type-item-active':'']">
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
		<view class="white-space">

		</view>
		<view class="order-item" v-for="(item,index) in navlist" :key="index" v-if="index==currentItem">
			<seize-seat typeimg='noorder'  v-if="item.orderList.length==0"></seize-seat>
			<view class="order-content" v-for="(items,indexs) in item.orderList" :key="indexs">
				
				<view class="order-content-left">
					<image :src="items.item_img" mode="aspectFill"></image>
				</view>
				<view class="order-content-right">
					<view class="order-content-title">
						{{items.title}}
					</view>
					<view class="order-content-content">
						<view class="creat-data">
							<text class="creat-data-w">创建日</text>
							<text>{{items.tb_paid_time}}</text>
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
				typelist:[
					{
						val:"直邀订单",
						type:0
					},
					{
						val:"间邀订单",
						type:1
					}
				],
				currentItem: 0,
				currentType:0,
				currentPt:0,
				token:"",
				pttypelist:[
					{val:'淘宝',platform_type:'tb'},
					{val:'京东',platform_type:'jd'},
					{val:'拼多多',platform_type:'pdd'}
				],
				navlist: [{
						val: "所有订单",
						type: ["all_order_direct","all_order_indirect"],
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
					},
					{
						val: "已付款",
						type: ["direct_order_paid","indirect_order_paid"],
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
					},
					{
						val: "已到账",
						type: ["direct_order_settled","indirect_order_settled"],
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
					},
					{
						val: "已失效",
						type: ["direct_order_expried","indirect_order_expried"],
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
		
		onLoad(){
			this.token = this.$store.state.user.token;
			console.log(this.token)
			this.loadData();
		},
		//上拉加载
		onReachBottom() {
			this.loadData();
		},
		methods: {
			// type点击事件
			clickptType(index){
				console.log(index)
				this.currentPt = index;
				this.loadData("pttypeChange");
			},
			//直邀间邀切换
			clickType(index){
				console.log(index)
				this.currentType = index;
				this.loadData("typeChange");
			},
			copy_dd(data) {
				uni.setClipboardData({
					data: data,
					success: () => {
						this.$msg('复制成功')
					}
				})
			},
			// nav点击事件
			clickNav(index) {
				console.log(index)
				this.currentItem = index;
				this.loadData("tabChange");
			},
			loadData(source) {
				uni.showLoading({
					title:"正在加载...",
					mask:true
				})
				var navItem = this.navlist[this.currentItem];
				//如果是类型变换,重置数据
				if(source=="typeChange"||source=="pttypeChange"){
					this.navlist.forEach(v=>{
						v.loadingType = 'more';
						v.loaded = false;
						v.pageNo = 1;
						v.orderList=[];
					})
				}
				if (source == "refresh") {
					navItem.loadingType = 'more';
					navItem.loaded = false;
					navItem.pageNo = 1;
					navItem.orderList=[];
						uni.stopPullDownRefresh();
				}
				//检测没有数据
				if (navItem.loadingType === "nomore") {
					uni.hideLoading();
					return;
				}
				navItem.loadingType = "loading";
				this.$api.TeamOrders(this.token, navItem.type[this.currentType], navItem.pageNo, 10,this.pttypelist[this.currentPt].platform_type).then(res => {
					uni.hideLoading()
					let {
						code,
						order_data
					} = res.data;
					//请求成功对应序号加一
					navItem.pageNo++;
					//请求成功
					if (code == 2000) {
						let shopList =order_data.order_data;
						// 添加新增数据		
						navItem.orderList = navItem.orderList.concat(shopList);
						console.log(navItem.orderList)
						//请求成功序号增加,并且修改对应得加载状态
						navItem.loaded = true;
						
						//判断是否还有数据
						navItem.loadingType = order_data.page_info.has_next? 'more' : "nomore";
						
					}
					else if(code == 2001){
						navItem.loadingType ="nomore";
					}
					//token过期
					else{
						uni.switchTab({
							url:"/pages/user/user"
						})
						this.$store.commit("clearToken");
						uni.showToast({
							title:"你已在其他客户端登录，请重新登录",
							duration:2000,
							icon:"none"
						})
					}
				}).catch(
					res => {
						uni.hideLoading()
						uni.stopPullDownRefresh();
						this.$msg("荔枝开小差了，请联系客服")
					}
				)
			}

		},

	}
</script>

<style lang="scss">
	page{
		background-color: #F7F7F7;
	}
	.container {
		width: 100%;
		.order-type{
			width: 100%;
			position: fixed;
			height: 80upx;
			display: flex;
			background-color: #FFFFFF;
			border-bottom: 1upx solid #f8f8f8;
			z-index: 1;
			.order-type-item{
				width: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.active{
				color: #f00;
			}
			&:after{
				content:"";
				position:absolute;
				height: 60upx;
				margin-top:10upx;
				// border-right: 2px solid #ccc;
				left: 50%;
			}
		}
		.pt-type{
			border-bottom: 1upx solid #f8f8f8;
			width: 100%;
			padding: 0 40upx;
			display: flex;
			height: 70upx;
			justify-content: space-between;
			align-items: center;
			position: fixed;
			background-color: #fff;
			font-size: $font-base;
			z-index: 1;
			margin-top: 80upx;
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
			margin-top: 150upx;
			justify-content: space-between;
			align-items: center;
			position: fixed;
			background-color: #fff;
			font-size: $font-lg;
			z-index: 1;

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
			margin-top: 140upx;
			box-sizing: border-box;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16upx 20upx;
			height: 80upx;
			border-bottom: #fff solid 1upx;
			background-color: #f8f8f8;
			z-index:1;
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
			height: 220upx;
			width: 100%;
		}

		.order-list {
			
			.order-item{
				width: 100%;
				height: 200upx;
				background-color: #fff;
			}
		}
		.order-item{
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
				flex: 1;
				.order-content-title{
					font-size: $font-base;
					overflow: hidden;
					height: 36upx;
					display: -webkit-box;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					margin-bottom: 16upx;
					line-height: 40upx;
				}
				.order-content-content {
					color: #949494;
					font-size: $font-sm;
				
					.creat-data {
						margin-bottom: 6upx;
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
