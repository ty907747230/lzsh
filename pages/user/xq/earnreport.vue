<template>
	<!-- 收益报表 -->
	<view class="container">
		<!--加载框 start-->
		<tui-loading :visible="isSuccess"></tui-loading>
		<!-- 自定义导航栏需要防止内容进入状态栏的区域 -->
		<!-- <view class="status_bar">
			<view class="top_view"></view>
		</view> -->
		<view class="title" v-show="!isSuccess">
			<!-- 头部 -->
			<view class="head">
				<view class="head-num">
					<text>账户余额(元)</text>
					<view class="head-num-content">
						<text class="head-num-content-num">{{yuer}}</text>
						<text @click="tixian" class="tixian">提现</text>
					</view>
					<text class="head-xq" @click="navtoBill()">账单详情</text>
				</view>
			</view>

			<view class="tabs">
				<text class="tabs-item" @click="handleclick(0)" :class="current==0?'active':''">我的收益</text>
				<text class="tabs-item" @click="handleclick(1)" :class="current==1?'active':''">团队收益</text>
			</view>
			
			<view class="pt-type">
				<view :key='index' class="pt-type-item" v-for="(item,index) in pttypelist" @click="clickptType(index)" :class="[index==currentType?'pt-type-item-active':'']">
					<text>
						{{item.val}}
					</text>
				</view>
			</view>

				<swiper class="swiper" @change="handlchange" :current="current">
					<swiper-item>
						<scroll-view scroll-y="true" class="swiper-item">
							<view class="day-earn">
								<view class="day-earn-title">
									<text class="day-earn-title-left">我的日预估收入</text>
									<!-- <text class="day-earn-title-right flicon">&#xe6bc; </text> -->
								</view>
								<view class="day-now day-style">
									<image src="/static/index/jin.png" mode="widthFix"></image>
									<view class="day-now-item item">
										<text>付款笔数</text>
										<text class="num num-b">{{info.user_data.count_today}}</text>
									</view>
									<view class="day-now-item item">
										<text class="flicon" @click="shopTips(manFDayContent)">付款预估收入 &#xe6bc;</text>

										<text class="num">￥ {{info.user_data.pub_share_pre_fee_today}}</text>
									</view>
									<view class="day-now-item item">
										<text class="flicon" @click="shopTips(manJDayContent)">结算预估收入 &#xe6bc;</text>
										<text class="num">￥ {{info.user_data.pub_share_fee_today}}</text>
									</view>
								</view>
								<view class="day-ago day-style">
									<image src="/static/index/zuo.png" mode="widthFix"></image>
									<view class="day-ago-item item">
										<text>付款笔数</text>
										<text class="num num-b">{{info.user_data.count_yesterday}}</text>
									</view>
									<view class="day-ago-item item">
										<text class="flicon mr">付款预估收入</text>
										<text class="num">￥ {{info.user_data.pub_share_pre_fee_yesterday}}</text>
									</view>
									<view class="day-ago-item item">
										<text class="flicon mr">结算预估收入</text>
										<text class="num">￥ {{info.user_data.pub_share_fee_yesterday}}</text>
									</view>
								</view>
							</view>

							<view class="month-earn">
								<view class="month-earn-title">
									<text class="month-earn-title-left">我的月预估收入</text>
									<!-- <text class="month-earn-title-right flicon">&#xe6bc; </text> -->
								</view>
								<view class="month-earn-content">
									<view class="month-now month-now-l">
										<view class="month-now-x">
											<text class="flicon" @click="shopTips(manFMonContent)">本月付款预估收入 &#xe6bc;</text>
											<text class="num">￥ {{info.user_data.gain_this_month_pre}}</text>
										</view>
										<view class="month-now-x">
											<text class="flicon" @click="shopTips(manJMonContent)">本月结算预估收入 &#xe6bc;</text>
											<text class="num">￥ {{info.user_data.gain_this_month}}</text>
										</view>
									</view>
									<view class="month-now">
										<view class="month-now-x">
											<text class="flicon mr">上月付款预估收入</text>
											<text class="num">￥ {{info.user_data.gain_last_month_pre}}</text>
										</view>
										<view class="month-now-x">
											<text class="flicon mr">上月结算预估收入</text>
											<text class="num">￥ {{info.user_data.gain_last_month}}</text>
										</view>
									</view>
								</view>
							</view>

						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view scroll-y="true" class="swiper-item">
							<view class="day-earn">
								<view class="day-earn-title">
									<text class="day-earn-title-left">团队日预估收入</text>

									<!-- <text class=""></text> -->
								</view>
								<view class="day-now day-style">
									<image src="/static/index/jin.png" mode="widthFix"></image>
									<view class="day-now-item item">
										<text>付款笔数</text>
										<text class="num num-b">{{info.team_data.team_count_today}}</text>
									</view>
									<view class="day-now-item item">
										<text class="flicon" @click="shopTips(teamFDayContent)">付款预估收入 &#xe6bc;</text>

										<text class="num">￥ {{info.team_data.team_pub_share_pre_fee_today}}</text>
									</view>
									<view class="day-now-item item">
										<text class="flicon" @click="shopTips(teamFDayContent)">结算预估收入 &#xe6bc;</text>

										<text class="num">￥ {{info.team_data.team_pub_share_fee_today}}</text>
									</view>
								</view>
								<view class="day-ago day-style">
									<image src="/static/index/zuo.png" mode="widthFix"></image>
									<view class="day-ago-item item">
										<text>付款笔数</text>
										<text class="num num-b">{{info.team_data.team_count_yesterday}}</text>
									</view>
									<view class="day-ago-item item">
										<text class="flicon mr">付款预估收入</text>
										<text class="num">￥ {{info.team_data.team_pub_share_pre_fee_yesterday}}</text>
									</view>
									<view class="day-ago-item item">
										<text class="flicon mr">结算预估收入</text>
										<text class="num">￥ {{info.team_data.team_pub_share_fee_yesterday}}</text>
									</view>
								</view>
							</view>

							<view class="month-earn">
								<view class="month-earn-title">
									<text class="month-earn-title-left">团队月预估收入</text>
									<!-- <text class="month-earn-title-right flicon">&#xe6bc;</text> -->
								</view>
								<view class="month-earn-content">
									<view class="month-now month-now-l">
										<view class="month-now-x">
											<text class="flicon" @click="shopTips(teamFMonContent)">本月付款预估收入 &#xe6bc;</text>

											<text class="num">￥ {{info.team_data.team_pub_share_pre_fee_this_month}}</text>
										</view>
										<view class="month-now-x">
											<text class="flicon" @click="shopTips(teamJMonContent)">本月结算预估收入 &#xe6bc;</text>

											<text class="num">￥ {{info.team_data.team_pub_share_fee_this_month}}</text>
										</view>
									</view>
									<view class="month-now">
										<view class="month-now-x">
											<text class="flicon mr">上月付款预估收入</text>
											<text class="num">￥ {{info.team_data.team_pub_share_pre_fee_last_month}}</text>
										</view>
										<view class="month-now-x">
											<text class="flicon mr">上月结算预估收入</text>
											<text class="num">￥ {{info.team_data.team_pub_share_fee_last_month}}</text>
										</view>
									</view>
								</view>
							</view>

						</scroll-view>
					</swiper-item>
				</swiper>
		</view>
	</view>
</template>

<script>
	import tuiLoading from "@/components/loading/loading";
	export default {
		data() {
			return {
				info: "",
				yuer: 0,
				current: 0,
				isSuccess: true,
				pttypelist: [{
						val: '淘宝'
					},
					{
						val: '京东'
					},
					{
						val: '拼多多'
					}
				],
				currentType: 0,
				manFDayContent: "由今日自购或推广的订单产生的佣金收入",
				manJDayContent: "今日自购或推广的订单已经到账的佣金",
				manFMonContent: "由本月自购或推广的订单产生的佣金收入",
				manJMonContent: "本月自购或推广的订单已经到账的佣金",
				teamFDayContent: "由今日团队订单产生的佣金收入",
				teamJDayContent: "今日团队订单已经到账的佣金",
				teamFMonContent: "由本月团队订单产生的佣金收入",
				teamJMonContent: "本月团队订单已经到账的佣金",

			}
		},
		components: {
			tuiLoading
		},
		methods: {
			// type点击事件
			clickptType(index) {
				this.currentType = index;
				this.getData();
			},
			shopTips(data) {
				console.log('触发')
				uni.showModal({
					content: data,
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			navtoBill() {
				uni.navigateTo({
					url: '/pages/user/incomebill'
				})
			},
			handleclick(index) {
				this.current = index;
			},
			handlchange(e) {
				this.current = e.detail.current;
			},
			getData() {
				console.log(this.currentType)
				this.$api.IncomeStatement(this.$store.state.user.token, this.currentType).then(res => {
					let {
						code,
						data
					} = res.data;
					this.isSuccess = false
					if (code == 2000) {
						this.info = data;
						console.log(data)
					}
				}).catch(() => {
					this.$msg("荔枝开小差了，请联系客服")
				})
			},
			tixian() {
				//判断是否绑定支付宝
				if (!this.$store.state.userpersonal.base_info.alipay) {
					this.$msg("请先绑定支付宝");
					uni.navigateTo({
						url: '/pages/user/set/editalpay',
					});
					return
				}
				uni.navigateTo({
					url: '/pages/user/set/tixian',
				});
			}
		},
		onShow() {
			console.log(this.$store.state.userpersonal.base_info.remain_money)
			this.getData();
			this.yuer = this.$store.state.userpersonal.base_info.remain_money;
		}
	}
</script>

<style lang="scss">
	.mr {
		margin-right: 28upx;
	}

	.flicon {
		font-size: $font-base;
		// font-size: $font-lg+10upx;
		color: #949494;
		// padding: 10upx 20upx;
	}



	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #f3e333;
	}

	.top_view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #f3e333;
		top: 0;
		z-index: 9;
	}
	page{
		height: 100%;
	}
	.container{
		height: 100%;
		
	}
	
	.title{
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		// justify-content: space-between;
	}

	.head {
		// top: 0;
		// position: fixed;
		width: 100%;
		background-color: #f74040;
		padding: 50upx;
		padding-top: 0;
		height: 270upx;
		color: #FFFFFF;

		// border-bottom: 1upx solid #E9E9E9;
		.head-num {
			margin-top: 30upx;
			font-size: $font-base;

			.head-num-content {
				margin: 20upx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.head-num-content-num {
					font-size: $font-lg+18upx;
					font-weight: 600;
				}

				.tixian {
					padding: 4upx 40upx;
					border-radius: 24upx;
					background-color: #545454;
					color: #fff;
				}
			}

			.head-xq {
				font-size: $font-sm;
				padding: 10upx 18upx;
				border-radius: 34upx;
				border: #FFFFFF 1upx solid;
			}
		}
	}

	.pt-type {
		// z-index: 1;
		// top: 350upx;
		// position: fixed;
		margin: 30upx 30upx;
		border: 1upx #EA0000 solid;
		border-radius: 12upx;
		width: 40%;
		height: 40upx;
		display: flex;
		font-size: $font-sm;
		color: #727272;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
		.pt-type-item {
			flex: 1;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			border-right: 1upx solid #EA0000;
			height: 40upx;

			&:last-child {
				border-right: none;
			}
		}

		.pt-type-item-active {
			color: #FFFFFF;
			background-color: #EA0000;
		}
	}

	

	.tabs {
		// position: fixed;
		// top: 270upx;
		height: 80upx;
		background-color: #f74040;
		font-size: $font-lg;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.tabs-item {
			width: 50%;
			text-align: center;
			line-height: 80upx;
			color: #FFFFFF;
		}

		.active {
			background-color: #fd9797;
		}
	}

	.swiper {
		// flex: 1;
		height: 62%;
		swiper-item {
			height: 100%;
			.swiper-item {
				height: 98%;
			}
		}
	}

	.day-earn {
		.day-earn-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30upx;
			padding-top: 0;

			.day-earn-title-left {
				font-size: $font-lg;
				font-weight: 500;
			}

			.day-earn-title-right {
				font-size: $font-lg+10upx;
			}
		}

		.day-style {
			image {
				width: 60upx;
				height: 60upx;
				overflow: hidden;
				position: absolute;
				top: 0;
				left: 0;
			}

			position: relative;
			box-sizing: border-box;
			background-color: #fff;
			width: 92%;
			border-radius: 20upx;
			margin: 0 4%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: $font-base;
			padding:30upx 20upx 30upx 60upx;
			overflow: hidden;

			.item {
				height: 100upx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;

				.num {
					font-size: $font-lg+4upx;
					font-weight: 600;
					color: #fca855;
				}

				.num-b {
					color: #76d9fa;
				}
			}
		}

		.day-now {
			margin-bottom: 20upx;
		}


	}

	.month-earn {
		margin-bottom: 10upx;

		.month-earn-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30upx;

			.month-earn-title-left {
				font-size: $font-lg;
				font-weight: 500;
			}

			.month-earn-title-right {
				font-size: $font-lg+10upx;
			}
		}

		.month-earn-content {
			background-color: #fff;
			border-radius: 20upx;
			padding: 16upx;
			width: 92%;
			margin: 0 4%;

			.month-now {
				padding: 20upx;
				display: flex;
				justify-content: space-between;

			}

			.month-now-l {
				border-bottom: 1upx #fafafa solid;
			}

			.month-now-x {
				height: 100upx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;

				.num {
					font-size: $font-lg+4upx;
					font-weight: 600;
					color: #fca855;
				}
			}
		}
	}
</style>
