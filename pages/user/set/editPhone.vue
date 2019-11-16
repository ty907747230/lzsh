<template>
	<view class="">
		<view class="input-content">
			<view class="input-item">
				<text class="tit">手机号码</text>
				<input auto-focus="true" type="number" v-model="mobile" placeholder="请输入手机号码" maxlength="11" data-key="mobile" />
			</view>
			<view class="input-item">
				<text class="tit">验证码</text>
				<input class="input-code" type="number" v-model="regCode" placeholder="请输入验证码" placeholder-class="input-empty" maxlength="4" />
				<text @click="handleWait"  class="getCode">{{waitMsg}}</text>
			</view>
		</view>
		<button class="confirm-btn" @click="toLogin" :disabled="logining">绑定手机</button>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				waitMsg: "获取验证码",
				isable: true,  //是否准许倒计时
				mobile: "",
				regCode: "",
			}
		},
		methods: {
			handleWait() {
				
				//判断手机号格式
				var reg =/^1\d{10}$/;
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
							this.$api("发送失败")
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
			
			//表单提交事件
			toLogin: function() {
				//验证手机号格式
				if (!this.mobile) {
					this.$msg("手机号不能为空");
					return;
				}
				//判断手机号格式
				var reg =/^1\d{10}$/;
				if (!reg.test(this.mobile)) {
					this.$msg("请输入正确的手机号");
					return;
				};
				
				//验证验证码格式
				if (!this.regCode||this.regCode.length!=4) {
					this.$msg("请输入正确的验证码");
					return;
				}
				console.log(this.$store.state.user.token,this.mobile, this.regCode)
				//绑定手机
				this.$api.BindPhone(this.$store.state.user.token,this.mobile, this.regCode).then(res => {
					let {
						code,
						msg,
					} = res.data;
					this.$msg(msg);
					//登录成功获取token
					if (code == 2000) {
							uni.navigateBack({
								delta:2
							})				
					}
		
				})
			},
		},
	}
</script>

<style lang="scss">
	.input-content {
		margin-top: 60upx;
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
</style>
