<template>
	<!-- 提现 -->
	<view class="container">
		<view class="ali-info">
			<!-- 支付宝账号信息 -->
			<view class="ali-info-count">
				<text>提现人: {{info.alipay_name}}</text>
				<text>支付宝: {{info.alipay}}</text>
			</view>
			<text @click="editAli" class="edit-content">修改</text>
		</view>
		<view class="input-box">
			<text class="input-box-title">提现金额</text>
			<view class="input-content">
				<text class="input-content-icon">￥</text>
				<view class="uni-input">
					<input maxlength="32" placeholder-class="tip-cla" placeholder="最低可提现1元" type="number" v-model="num" />
					<view class="editflicon" @click="clearNum" v-if="num">
						<text   class="flicon">&#xe615;</text>
					</view>
				</view>
				<text @click="quanbu" class="edit-content">全部</text>
			</view>
		</view>
		<view class="record">
			<text @click="navtorecord" class="record-text">* 查看提现记录</text>
		</view>
		<view class="editbtn" @click="tixian">
			确认提现
		</view>
		<!-- <view class="">
			<text>* 每月25号后可提现上个月内确认收货的订单收益</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: "",
				info: {}
			}
		},
		onShow() {
			console.log(this.$store.state.userpersonal)
			this.info = this.$store.state.userpersonal.base_info
		},
		methods: {
			navtorecord(){
				uni.navigateTo({
					url:"/pages/user/set/record"
				})
			},
			sub(data){
				console.log(data)
				return data.substring(0,3)
			},
			quanbu() {
				this.num = this.$store.state.userpersonal.base_info.remain_money;
				
			},
			editAli() {
				uni.navigateTo({
					url: '/pages/user/set/editalpay'
				})
			},
			clearNum() {
				console.log(1)
				this.num = ""
			},
			tixian() { 
				this.$api.CashOut(this.$store.state.user.token, this.num,  this.info.alipay,this.info.alipay_name).then(res => {
					console.log(res)
					let {code,msg,data}=res.data;
					if(code==2000){
						this.$store.state.userpersonal.base_info.remain_money=data.remain_money;
						console.log(data.remain_money)
						uni.navigateBack({
							delta: 1
						});
					}
					this.$msg(msg)
				}).catch(() => {
					this.$msg("荔枝开小差了，请联系客服")
				})
			}
		}
	}
</script>

<style lang=scss>
	.ali-info {
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 10upx 30upx;
		margin: 16upx 0;
		font-size: $font-lg;
		.ali-info-count {
			font-size: $font-base;
			padding: 16upx 0;
			height: 140upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.edit-content {
			background-color: #FF2A1F;
			padding: 6upx 16upx;
			color: #FFFFFF;
			border-radius: 40upx;
		}
	}
	.input-box {
		background-color: #FFFFFF;
		padding: 30upx;
		padding-bottom: 30upx;
		.input-box-title {
			margin-bottom: 20upx;
			font-size: $font-lg;
			font-weight: bold;
		}
	}

	.input-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1upx solid #EFEFEF;
		.input-content-icon {
			font-size: $font-lg+8upx;
			font-weight: bold;
			/* padding-bottom: 16upx; */
		}

		.edit-content {
			color: #FF2A1F;
			/* padding-bottom: 16upx; */
		}
	}
	.tip-cla{
		font-size: $font-base;
	}
	.uni-input {
		width: 84%;
		background-color: #FFFFFF;
		padding: 20upx 20upx 0;
		position: relative;
		margin-bottom: 20upx;
		input {
			overflow: hidden;
			font-size: $font-lg+8upx;
			color: #007AFF;
			width: 80%;
		}
	}

	.editflicon {
		
		position: absolute;
		font-size: 34upx;
		height: 100upx;
		right: 0;
		width: 20%;
		text-align: center;
		line-height: 100upx;
		top: 0;
	}
	.record{
		padding-right: 30upx;
		margin-top: 16upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.record-text{
		color: #0eb3f0;
		font-size: $font-sm;
	}
	.editbtn {
		width: 90%;
		margin: 60upx auto 0;
		height: 80upx;
		border-radius: 80upx;
		background-color: #FF0000;
		color: #FFFFFF;
		text-align: center;
		line-height: 80upx;
		font-size: 36upx;
	}
</style>
