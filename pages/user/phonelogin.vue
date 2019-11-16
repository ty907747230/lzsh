<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn flicon icon-zuojiantou" @click="navBack"> </view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" v-model="mobile" placeholder="请输入手机号码" maxlength="11" data-key="mobile" />
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input class="input-code" type="number" v-model="regCode" placeholder="请输入验证码" placeholder-class="input-empty" maxlength="20" />
					<text @click="handleWait"  class="getCode">{{waitMsg}}</text>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">手机登录</button>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				waitMsg: "获取验证码",
				isable: true,  //是否准许倒计时
				mobile: "",
				regCode: "",
			}
		},
		onLoad() {

		},
		methods: {
			handleWait() {
				
				//判断手机号格式
				var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				if (!reg.test(this.mobile)) {
					this.$msg("请输入正确的手机号");
					return;
				};

				if (this.isable) {
					//获取验证码
					this.$api.getRegisterCode(this.mobile).then(res => {
						let {
							code,
							msg
						} = res.data;
						
						this.$msg(msg)
						if (code != 2000) {
							return;
						}
					})
					//60s内禁止点击
					this.isable = false;
					var s = 60;
					var timeId = setInterval(() => {
						s--;
						this.waitMsg = `重新获取(${s}s)`;
						if (s == 0) {
							this.isable = true;
							this.waitMsg = "获取验证码";
							clearInterval(timeId)
						}
					}, 1000);
				}
			},
			navBack() {
				uni.navigateBack();
			},
			//表单提交事件
			toLogin: function() {
				//验证手机号格式
				if (!this.mobile) {
					this.$msg("手机号不能为空");
					return;
				}
				//判断手机号格式
				var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				if (!reg.test(this.mobile)) {
					this.$msg("请输入正确的手机号");
					return;
				};
				console.log(this.regCode.length)
				//验证验证码格式
				if (!this.regCode||this.regCode.length!=4) {
					this.$msg("请输入正确的验证码");
					return;
				}
				//用户登录
				this.$api.useLogin(this.mobile, this.regCode).then(res => {
					let {
						code,
						msg,
					} = res.data;
					this.$msg(msg);
					

				})
			},
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 60upx;
		height: 100upx;
		width: 100upx;
		/* color: $font-color-dark; */
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #ec706b;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		position: relative;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			/* color: $font-color-base; */
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			/* color: $font-color-dark; */
			width: 100%;
		}
		
		.input-code{
			width: 300upx;
		}

		.getCode {
			position: absolute;
			font-size: $font-lg;
			top: 50upx;
			right: 20upx;
			color: #ec706b;
			flex: 1;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: #ec706b;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		/* color: $font-spec; */
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		/* color: $font-color-base; */
		text-align: center;

		text {
			/* color: $font-color-spec; */
			margin-left: 10upx;
		}
	}
</style>
