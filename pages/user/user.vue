<template>
	<!-- 我的页面 -->
	<view class="container">
		<view class="">
			<!-- 头部 -->
			<view class="header">
				<!-- 自定义导航栏后防止内容进入状态栏的区域 -->
				<!-- 自定义导航栏需要防止内容进入状态栏的区域 -->
				<view class="status_bar">
					<view class="top_view"></view>
				</view>
				<!-- 未登录头部样式 -->
				<view class="header-content">
					<view class="left">
						<view class="head-img">
							<text v-if="!isLogin" class="flicon">&#xe66a;</text>
							<image class="head-img-img" v-if="isLogin" :src="userInfo.base_info.headimgurl" mode="widthFix">
							</image>
						</view>
						<text v-if="!isLogin" @click="goLogin" class="uer-name">点击登录</text>
						<view class="head-content" v-if="isLogin">
							<view class="head-mingzi">
								<view class="username">{{userInfo.base_info.user_name}}</view>
								
								<image  class="user-level" :src="userInfo.base_info.head_icon" mode="widthFix"></image>
							</view>
							<view class="code">
								<text>邀请码：{{userInfo.base_info.invite_code||""}}</text>
								<text class="copy" @click="copycode">复制</text>
							</view>
						</view>
					</view>

					<view class="head-btn" @click="navtoSet">

						<text class="flicon">&#xe613;</text>
					</view>
				</view>
				<view class="huiyuan-tab-div">
					<!-- <view class="huiyuan-tab">
						<text>累计收益：</text>
					</view> -->
					<image @click="goLogin" v-if="!userInfo.base_info" src="/static/huiyuan/huiyuan-login.png" mode="widthFix" class="huiyuan-tab"></image>
					<image @click="update" v-if="userInfo.base_info.level==0" class="huiyuan-tab" src="/static/huiyuan/huiyuan-1.png"
					 mode="widthFix"></image>
					<image @click="update" v-if="userInfo.base_info.level==1" class="huiyuan-tab" src="/static/huiyuan/huiyuan-2.png"
					 mode="widthFix"></image>
					<image @click="update" v-if="userInfo.base_info.level==2" class="huiyuan-tab" src="/static/huiyuan/huiyuan-3.png"
					 mode="widthFix"></image>
					 <image @click="update" v-if="userInfo.base_info.level==3" class="huiyuan-tab" src="/static/huiyuan/huiyuan-4.png"
					  mode="widthFix"></image>
				</view>

			</view>

			<!-- 内容 -->
			<view class="section">
				<!-- 余额 -->
				<view class="balance">
					<view class="left">
						<text class="left-w">余额(元)<text class="num">{{userInfo.base_info.remain_money||0}}</text>
						</text>
					</view>
					<text @click="tixian" class="tx-btn">提 现</text>
				</view>

				<!-- 收益 -->
				<view class="profitList">
					<view class="profit-item" :key="index" @click="navTo('/pages/user/xq/earnreport')">
						<view class="profit-item-top">
							<text class="profit-price">{{gain_money.gain_today||0}}</text>
						</view>
						<view class="profit-item-bottom">
							<text>今日收益</text>
						</view>
					</view>
					<view class="profit-item" :key="index" @click="navTo('/pages/user/xq/earnreport')">
						<view class="profit-item-top">
							<text class="profit-price">{{gain_money.gain_this_month||0}}</text>
						</view>
						<view class="profit-item-bottom">
							<text>本月预估</text>
						</view>
					</view>
					<view class="profit-item" :key="index" @click="navTo('/pages/user/xq/earnreport')">
						<view class="profit-item-top">
							<text class="profit-price">{{gain_money.gain_last_month||0}}</text>
						</view>
						<view class="profit-item-bottom">
							<text>上月预估</text>
						</view>
					</view>
					<view class="profit-item" :key="index" @click="navTo('/pages/user/xq/earnreport')">
						<view class="profit-item-top">
							<text class="profit-price">{{userInfo.base_info.gain_all||0}}</text>
						</view>
						<view class="profit-item-bottom">
							<text>累计收益</text>
						</view>
					</view>
				</view>

				<!-- 授权 -->
				<image v-if="isLogin&&isshow" @click="autoTb" class="auth-tab" src="/static/center/auth.png" mode="widthFix"></image>


				<!-- 会员详情 -->
				<view class="member">
					<view class="member-content">
						<view class="menber-item" @click="navMitem(item.url)" v-for="(item,index) in memberList" :key="index">


							<image :src="item.icon" mode="widthFix"></image>
							<text class="member-item-bottom">{{item.val }}</text>

						</view>
					</view>
				</view>

				<!-- 我的工具 -->
				<view class="tool">
					<view class="tool-title">
						<text class="flicon">&#xe662;</text>
						<text>百宝箱</text>
					</view>
					<view class="tool-content">
						<view class="menber-item" @click="navTo(item.url)" v-for="(item,index) in toolList" :key="index">
							<image class="gj-icon" :src="item.src" mode="widthFix"></image>
							<text class="tool-item-bottom">{{item.val}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiLoading from "@/components/loading/loading";
	const plug = uni.requireNativePlugin('Html5app-Baichuan');
	export default {
		components: {
			tuiLoading
		},
		data() {
			return {

				isshow: false,
				isfirst: true,
				token: "",
				isLogin: false, //是否是登陆状态
				userInfo: {}, //用户信息
				gain_money: {}, //收益信息
				profitList: [{
						val: "今日收益",
						num: 0
					},
					{
						val: "昨日预估",
						num: 0
					},
					{
						val: "本月预估",
						num: 0
					},
					{
						val: "上月结算",
						num: 0
					},

				],
				memberList: [{
						val: "我的订单",
						icon: "/static/center/wd.png",
						color: "red",
						url: "/pages/user/xq/myorder"
					},
					{
						val: "团队订单",
						icon: "/static/center/td.png",
						color: "blue",
						url: "/pages/user/xq/teamorder"
					},
					{
						val: "我的团队",
						icon: "/static/center/wdtd.png",
						color: "redT",
						url: "/pages/user/xq/myteam"
					},
					{
						val: "收益报表",
						icon: "/static/center/sy.png",
						color: "orange",
						url: "/pages/user/xq/earnreport"
					},

				],
				toolList_ios: [{
						val: "我的足迹",
						src: "/static/center/zj.png",
						url: "/pages/user/bbx/myfoot"
					},
					{
						val: "我的收藏",
						src: "/static/center/sc.png",
						url: '/pages/user/bbx/collection',
					},
					{
						val: "在线客服",
						src: "/static/center/kf.png",
						url: "/pages/user/bbx/service"
					},
					{
						val: "关于我们",
						src: "/static/center/wm.png",
						url: "/pages/user/bbx/aboutus"
					}
				],
				toolList: [{
						val: "新手教程",
						src: "/static/center/jc.png",
						url: '/pages/index/swiper/jc'
					},
					{
						val: "订单找回",
						src: "/static/center/zh.png",
						url: "/pages/user/bbx/findbill"
					},
					{
						val: "我的足迹",
						src: "/static/center/zj.png",
						url: "/pages/user/bbx/myfoot"
					},
					{
						val: "我的收藏",
						src: "/static/center/sc.png",
						url: '/pages/user/bbx/collection',
					},
					{
						val: "分享推广",
						src: "/static/center/tg.png",
						url: "/pages/user/bbx/extension",
					},
					{
						val: "常见问题",
						src: "/static/center/wt.png",
						url: "/pages/user/bbx/question"
					},
					{
						val: "在线客服",
						src: "/static/center/kf.png",
						url: "/pages/user/bbx/service"
					},
					{
						val: "关于我们",
						src: "/static/center/wm.png",
						url: "/pages/user/bbx/aboutus"
					}
				],

			}
		},
		onLoad() {
			// this.connect()
			plug.logout({}, result => {
				console.log(result);
			});
			console.log(plus.os.name);
			// if (plus.os.name == 'Android') {
			// 	this.iosisshow = true;
			// 	console.log(this.iosisshow);
			// } else {
			// 	this.iosisshow = uni.getStorageSync('lzd-iosisshow');
			// 	this.kzshow = uni.getStorageSync('lzd-kzshow');
			// 	console.log(this.iosisshow)
			// }
		},
		methods: {

			//跳转到扩展网页
			// tokz() {
			// 	uni.navigateTo({
			// 		url: `/pages/index/kzindex?img=${this.kzshow.second_url}`
			// 	});
			// },
			//提现
			tixian() {
				//判断是否登录
				if (!this.isLogin) {
					this.$msg("请先登录");
					return
				}

				//判断是否绑定支付宝
				if (!this.userInfo.base_info.alipay) {
					this.$msg("请先绑定支付宝");
					uni.navigateTo({
						url: '/pages/user/set/editalpay',
					});
					return
				}
				uni.navigateTo({
					url: '/pages/user/set/tixian',
				});
			},
			//淘宝授权
			autoTb() {
				if (!this.isLogin) {
					this.$msg("请先登录");
					return
				}
				this.btnclick()
			},
			//授权
			btnclick: function() {
				plug.checkSession({}, result => {
					console.log(result);
					if (result.code == '0') {
						this.TBOauth();
					} else {
						plug.login({}, result => {
							if (result.code == '0') {
								uni.showToast({
									title: '正在跳往授权',
									icon: "none"
								});
								this.TBOauth();

							} else {
								this.$msg(result.msg || "淘宝登录失败，请重试")
								plug.logout({}, result => {
									console.log(result);
								});
							}
						});
					}
				});

			},

			TBOauth() {
				this.$msg('正在跳转授权')
				plug.taobaoOauth({
					url: "https://oauth.taobao.com/authorize?response_type=code&client_id=27711073&redirect_uri=http://m.baidu.com/oauth/&state=1212&view=wap"
				}, ret => {
					console.log(JSON.stringify(ret));
					if (ret.retcode == "0") {
						uni.request({
							url: `http://39.100.111.131/sr/2.php?code=${ret.code}`,
							success: (res) => {
								if (res.data.relation_id) {
									this.$api.GetAuth(this.$store.state.user.token, res.data.relation_id['0'], 1).then(res => {
										console.log(res.data)

										let {
											code,
											msg
										} = res.data;
										console.log(code, res.data.relation_id)
										if (code == 2000) {
											if (res.data.relation_id) {
												uni.setStorageSync("relation_id", res.data.relation_id);
											}
											this.$msg("已授权");
											uni.startPullDownRefresh({
												success: () => {
													console.log("显示")
												}
											})
										} else if (code == 4039) {
											uni.showToast({
												title: msg,
												icon: "none",
												duration: 3000
											})
											plug.logout({}, result => {
												console.log(result);
											});
										} else {
											this.$msg(msg);
											plug.logout({}, result => {
												console.log(result);
											});
										}
									}).catch(() => {
										plug.logout({}, result => {
											console.log(result);
										});
										this.$msg("授权信息保存失败，请联系客服")
									})
								} else {

									plug.logout({}, result => {
										console.log(result);
									});
									this.$msg("找不到授权渠道id，请联系客服")
								}

							},
							fail: () => {

								plug.logout({}, result => {
									console.log(result);
								});
								this.$msg("授权请求失败，请联系客服")
							}
						})
					} else {
						plug.logout({}, result => {
							console.log(result);
						});
						this.$msg("用户取消授权")
					}
				})
			},

			copycode() {
				uni.setClipboardData({
					data: this.userInfo.base_info.invite_code,
					success: () => {
						this.$msg("复制成功")
					}
				})
			},
			navMitem(url) {
				this.navTo(url);
			},

			//封装跳转方法
			navTo(url) {
				if (!this.isLogin) {
					uni.navigateTo({
						url: '/pages/user/login',
					});
					this.$msg("请先登录");
				} else {
					uni.navigateTo({
						url
					})
				}
			},
			//升级
			update() {
				this.navTo(`/pages/user/update/update?code=${this.userInfo.base_info.invite_code}`)
			},
			//跳转登录
			goLogin() {
				uni.navigateTo({
					url: '/pages/user/login'
				});
			},
			//跳转设置页面
			navtoSet() {
				this.navTo("/pages/user/set");
			},
			//请求个人中心数据
			getUserInfo() {
				console.log(this.$store.state.user.token)
				this.$api.UserCenter(this.$store.state.user.token).then(res => {
					console.log(res)
					let {
						code,
						data
					} = res.data
					// console.log(res.data)
					if (code == 2000) {
						uni.stopPullDownRefresh();
						// console.log(data)

						if (this.$store.state.userpersonal != data) {
							this.$store.commit("editUserpersonal", data);
							this.userInfo = data;
							this.gain_money = data.gain_money;
							console.log(this.gain_money.gain_this_month)
							if (!this.userInfo.auth_info.relation_id) {
								this.isshow = true

							} else {
								this.isshow = false
							}
						}
						
						console.log(this.userInfo.base_info.headimgurl)
					} else {
						uni.stopPullDownRefresh();
						this.userInfo = {};
						this.gain_money = {},
							this.isLogin = false;
						this.$store.commit("clearToken");
						// const bcPlugin = uni.requireNativePlugin('dahui-alibaichuan');
						try {
							plug.logout({}, result => {
								console.log(result)
							});
						} catch (e) {
							console.log(e)
						}
						// bcPlugin.BCUserLogout(result => {
						// 	console.log(result)
						// });
						this.$msg("你已在其他客户端登录，请重新登录");
					}
				}).catch(function(err) {
					this.$msg("荔枝开小差了，请联系客服")
					uni.stopPullDownRefresh();
				})
			},
		},

		// onReady() {
		// 	// this.isSuccess = false;
		// 	// this.isfirst = false;
		// 	uni.startPullDownRefresh({
		// 	})
		// },

		//下拉刷新
		onPullDownRefresh() {
			console.log(this.isLogin)
			//登录状态下
			if (this.isLogin) {
				this.getUserInfo();
			} else {
				uni.stopPullDownRefresh();
			}
		},

		onShow() {
			//由于nvue页面向vue页面传值较慢，所以在第一次可以通过读取储存赋值
			if (!this.$store.state.user) {
				this.$store.state.user = uni.getStorageSync('lzd-user')
			}
			//用户已登陆
			if (this.$store.state.user) {
				this.isLogin = true;
				this.getUserInfo();
			}
			//用户没登录
			else {
				this.userInfo = {}, //用户信息
					this.gain_money = {}, //收益信息
					this.isLogin = false;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f6f6f6;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;

	}

	.top_view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 999;
	}

	.container {

		// 头部
		.header {
			width: 100%;
			background-color: #ff3939;
			// height: 400upx;

			.huiyuan-tab-div {
				padding: 0 20upx;
			}

			.huiyuan-tab {
				// background-color: #000000;
				height: 96upx;
				display: flex;
				justify-content: center;
				font-size: 36upx;
				color: #FAE904;
				border-radius: 10upx 10upx 0 0;
				width: 100%;
			}

			.header-content {
				height: 250upx;
				display: flex;
				padding: 80upx 30upx 30upx;
				justify-content: space-between;

				.left {
					display: flex;
					.left-w{
						color: #FAE904;
					}
					.uer-name {
						padding: 20upx;
						height: 100upx;
						line-height: 60upx;
						font-size: 38upx;
						color: #FFFFFF;
					}

					.head-img {
						width: 120upx;
						height: 120upx;
						border-radius: 120upx;
						background-color: #8a8a8a;
						color: #dd5353;
						text-align: center;
						line-height: 120upx;
						margin-right: 30upx;
						overflow: hidden;
						position: relative;
						z-index: 1;

						.head-img-img {
							width: 120upx;
							height: 120upx;
							border-radius: 120upx;
							// overflow: hidden;
						}

						.flicon {
							font-size: 70upx;
							font-weight: bold;

						}
					}

					.head-content {
						font-size: $font-lg;
						color: #fff;

						.head-mingzi {
							margin-bottom: 20upx;
							display: flex;

							.username {
								overflow: hidden;
								max-width: 260upx;
								text-overflow: ellipsis;
								white-space: nowrap;
								margin-right: 10upx;
							}

							.user-level {
								width: 160upx;
								height: 40upx;
							}

							.flicon {
								color: #bb9574;
								font-size: $font-sm;
								padding: 6upx 20upx;
								border-radius: 26upx;
								background-color: #434343;
								margin-left: 20upx;
							}
						}
					}
				}

				.code {
					.copy {
						background-color: #deae82;
						padding: 6upx 16upx;
						border-radius: 36upx;
						margin-left: 20upx;
						color: #434343;
						font-size: $font-base;
						// color: #fff;
					}
				}

				.head-btn {
					color: #fff;
					padding: 20upx;

					.flicon {
						font-size: $font-lg+26upx;
						margin-right: 20upx;
					}
				}
			}
		}

		.section {
			//margin-top: 20upx;
			padding: 0 20upx 20upx;
		}

		// 余额
		.balance {
			// box-shadow: 8upx 8upx 30upx #9d9c9d;
			height: 96upx;
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			align-items: center;
			border-radius: 0 0 10upx 10upx;
			margin: 0 auto 16upx;
			position: relative;
			padding: 0 20upx;

			.left {
				display: flex;
				align-items: center;

				.num {
					font-size: $font-lg+16upx;
					margin: 20upx 10upx;
					color: #fe4242;
				}

				.balance-num {
					font-size: $font-lg+16upx;
					padding-left: 20upx;
				}
			}

			.tx-btn {
				font-size: 30upx;
				height: 60upx;
				width: 130upx;
				border-radius: 60upx;
				background-color: #fee7b6;
				text-align: center;
				line-height: 60upx;
			}
		}

		// 收益
		.profitList {
			margin-bottom: 16upx;
			margin-top: 16upx;
			height: 140upx;
			background-color: #fff;
			display: flex;
			border-radius: 20upx;
			padding: 20upx;

			.profit-item {
				font-size: $font-lg;
				flex-direction: column;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				border-right: 1upx solid #eee;

				.profit-item-top {
					margin-bottom: 20upx;

					.profit-price {
						font-size: $font-lg+10upx;
					}
				}

				.profit-item-bottom {
					font-size: $font-sm;
					color: #949494;
				}
			}

			>.profit-item:last-child {
				border-right: none;
			}
		}

		// 授权
		.auth-tab {
			width: 100%;
			height: 120upx;
		}

		//会员详情
		.member {
			margin-top: 16upx;
			background-color: #fff;
			// height: 240upx;
			border-radius: 20upx;
			font-size: $font-lg;
			padding: 22upx;
			display: flex;
			flex-direction: column;

			.member-title {
				margin-bottom: 26upx;

				.flicon {
					margin-right: 16upx;
					font-size: 32upx;
				}
			}

			.member-content {
				display: flex;

				.menber-item {
					flex-direction: column;
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						width: 60upx;
						height: 60upx;
					}
				}

				.member-item-top {
					// margin-bottom: 10upx;
				}

				.member-item-bottom {
					font-size: $font-sm;
					color: #7d7d7d;
				}
			}
		}

		// 我的工具
		.tool {
			background-color: #fff;
			margin-top: 16upx;
			border-radius: 20upx;
			font-size: $font-sm;
			padding: 20upx;

			.tool-title {
				font-size: $font-lg;

				.flicon {
					margin-right: 16upx;
					font-size: $font-lg+10upx;
				}

				margin-bottom: 14upx;
			}

			.tool-content {
				display: flex;
				flex-wrap: wrap;

				.menber-item {
					flex-direction: column;
					width: 25%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 20upx;
					margin-bottom: 10upx;

					.gj-icon {
						width: 60upx;
						height: 60upx;
						margin-bottom: 16upx;
					}

					.tool-item-top {
						margin-bottom: 14upx;
					}

					.tool-item-bottom {
						color: #7d7d7d;
					}
				}
			}
		}
	}
</style>
