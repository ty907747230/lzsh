<template>
	<view>
		<view class="uni-input">
			<input maxlength="16" autofocus placeholder="请输入微信号" type="text" value="" v-model="name"/>
			<text @click="clearName" v-show="name?'true':'false'" class="flicon editflicon">&#xe615;</text>
		</view>
		<view class="editbtn" @click="editname">
			确认修改
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:""
			}
		},
		methods: {
			clearName(){			
				this.name=""
			},
			editname(){
				if(!this.name){
					uni.showToast({
						title: '微信号不能为空',
						icon:"none"
					});
					return
				}
				uni.showLoading({
					mask:true
				});
				this.$api.WechatNum(this.$store.state.user.token,this.name).then(res=>{				
					uni.hideLoading()
						let{code}=res.data;
						if(code==2000){
							uni.navigateBack({
								delta:2
							})
						}
						else{
							this.$msg("修改微信失败")
						}
				}).catch(()=>{
					this.$msg("荔枝开小差了，请联系客服")
					uni.hideLoading()
				})
			}
		},
		onLoad(option){
			this.name=option.name
		}
	}
</script>

<style lang="scss">
.uni-input{
	height: 100upx;
	background-color: #FFFFFF;
	line-height: 100upx;
	padding:20upx 20upx;
	position: relative;
	input{
		width: 80%;
		overflow: hidden;
	}
}
.editflicon{
	position: absolute;
	font-size: 30upx;
	height: 100upx;
	right: 0;
	width: 20%;
	text-align: center;
	line-height: 100upx;
	top: 0;
}
.editbtn{
	width: 90%;
	margin: 80upx auto 0;
	height: 80upx;
	border-radius: 80upx;
	background-color: #FF0000;
	color: #FFFFFF;
	text-align: center;
	line-height: 80upx;
}
</style>
