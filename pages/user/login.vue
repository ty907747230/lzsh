<template>
	<view class="container">
		<img src="" alt="">
		<!-- 空白区域 -->
		<!-- <view class="empty-block">
		</view>
		<view class="logo">
			<view class="logo-img">
				<image src="/static/login/logo-liziduo.jpg" mode="widthFix"></image>
			</view>
			<view class="logo-wenzi">
				<image src="/static/login/logo-desc.png" mode="aspectFill"></image>
			</view>
		</view> -->

		<view class="login-content">
			<view class="wrapper" >

				<button class="wconfirm-btn flicon" @click="wxLogin">
					<image src="/static/login/weixin.png" mode="widthFix"></image>
					微 信 登 录
				</button>
			</view>

			<!-- 手机登录 -->
			<view class="wrapper">

				<button class="mconfirm-btn flicon" @click="phoneLogin">
					<image src="/static/login/phone.png" mode="widthFix"></image>
					手 机 登 录
				</button>

			</view>
		</view>

		<!-- 是否阅读 -->
		<view class="agreement">
			<view class="agreement-content">
				<!-- <text class="flicon">&#xe60f;</text> -->
				 <!-- <radio-group @change="radioChange"> -->
				<label class="radio" @click="handleRead">
					<radio value="" :checked="isRead" style="transform:scale(0.6)"/>
				</label>
				<!-- </radio-group> -->
				
					<text class="confirm-span">我已同意并阅读</text>
					<text class="blue-wenzi" @click="navtoxy">《用户协议》</text>
					<text>和</text>
					<text class="blue-wenzi" @click="navtoys">《隐私政策》</text>
				
			</view>
			<view class="" > </view>
		</view>
	</view>
</template>

<script>
	import setId from '@/common/set_id.js'
	export default {
		data() {
			return {
				isShow: true,
				isRead:true,
				type: "",
				
			}
		},
		onBackPress(event) {

			// uni.switchTab({
			// 	url: '/pages/index/index'
			// });
			if (this.type) {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},
		methods: {
			navtoxy(){
				uni.navigateTo({
					url: '/pages/user/privacyweb'
				});
			},
			navtoys(){
				uni.navigateTo({
					url:'/pages/user/ysxy'
				})
			},
			handleRead(){
				this.isRead=!this.isRead;
				console.log(this.isRead)
			},
			radioChange(e){
				console.log(e)
			},
			//TAB切换
			handleChange() {
				this.isShow = !this.isShow;
			},
			//手机登陆
			phoneLogin() {
				if(!this.isRead){
					this.$msg("请勾选阅读协议!");
					return
				}
				uni.navigateTo({
					url: '/pages/user/phonelogin',
					success: res => {},
				});
			},
			//微信登录

			wxLogin() {
				if(!this.isRead){
					this.$msg("请勾选阅读协议");
					return
				}
				uni.showLoading({
					mask: true,
					title: '正在拉起微信授权'
				})
				// this.$msg("正在拉起微信授权")
				var _that = this;
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								scopes: "auth_user",
								success: function(loginRes) {
									uni.showLoading({
										mask: true,
										title: '正在跳转'
									})
									// console.log(loginRes)
									// 获取用户信息
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) {
											// console.log(loginRes)
											// console.log(infoRes)

											_that.$api.login("", "", infoRes.userInfo.unionId).then(res => {
												uni.hideLoading()
												// console.log(infoRes.userInfo.unionId)
												let {
													code,
													msg,
													data
												} = res.data;

												//登录成功获取token
												if (code == 2000 || code == 2001) {
													//老用户
													if (code == 2000) {
														//获取到用户的唯一标识token，并保存到本地
														_that.$store.commit("editUser", res.data.data);
														if(res.data.data.token){
															setId(res.data.data.token)
														}
														//重定向
														uni.navigateBack({
															delta: 1
														});
													}
													//新用户
													if (code == 2001) {
														//跳转邀请页面
														uni.navigateTo({
															url: '/pages/user/yqcode?unionId=' + infoRes.userInfo.unionId + '&wxInfo=' + JSON.stringify(
																infoRes.userInfo),

														});
													}
												}
											}).catch(() => {
												uni.hideLoading()
											})
										},
										fail: () => {
											uni.hideLoading()
										}
									});
								},
								fail: () => {
									uni.hideLoading()
								}
							});
						}
					},
					fail: () => {
						uni.hideLoading();
					}
				});
			},

		},
		onLoad(option) {
			this.type = option.type;
			// if(plus.os.name=='Android'){
			// 	this.iosisshow=true
			// }
			// else{
			// 	this.iosisshow=uni.getStorageSync('lzd-iosisshow');
			// 	console.log(this.iosisshow)
			// }
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.container {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: url('~@/static/login/loginbg.jpg') no-repeat fixed center;
		background-size: 100%;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		//z-index: 1;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: #fff;
	}

	.close {
		width: 60%;
		margin: 0 auto;
		display: flex;
		justify-content: flex-end;
		padding-right: 20upx;

		text {
			font-size: $font-lg+8upx;
		}

	}

	.empty-block {
		height: 200upx;
	}

	.logo {
		margin-bottom: 200upx;

		.logo-img {
			display: flex;
			justify-content: center;

			image {
				width: 200upx;
				height: 200upx;
			}
		}

		.logo-wenzi {
			margin: 0 auto;
			padding-left: 40%;

			image {
				height: 50upx;
			}
		}
	}

	.login-content {
		position: fixed;
		bottom: 20%;
		width: 100%;
	}

	.wrapper {
		position: relative;

		image {
			position: absolute;
			width: 50upx;
			height: 50upx;
			top: 20upx;
			left: 20upx;
		}

		.wconfirm-btn {
			width: 500upx;
			height: 86upx;
			line-height: 86upx;
			border-radius: 10upx;
			margin: 0 auto;
			background: #32b16c;
			color: #fff;
			font-size: $font-lg+8upx;
		}

		.mconfirm-btn {
			width: 500upx;
			height: 86upx;
			line-height: 86upx;
			border-radius: 10upx;
			margin: 50upx auto 0;
			background: #f19149;
			color: #fff;
			font-size: $font-lg+8upx;
		}

		.other-login {
			margin-top: 40upx;
			text-align: center;
			color: #fff;
			font-size: 24upx;
			line-height: 40upx;
		}
	}

	.agreement {
		width: 100%;
		position: fixed;
		bottom: 40upx;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		color: #848484;
		display: flex;
		.agreement-content{
			.radio{
				padding: 20upx 0 20upx 20upx;
			}
		}
	}
	.confirm-span{
		padding: 20upx 0;
		padding-top: 6upx;
	}
	.blue-wenzi{
		padding-top: 6upx;
		color: #0A7BFA;
	}
</style>
