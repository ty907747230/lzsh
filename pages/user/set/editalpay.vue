<template>
	<view>
		<view class="uni-input">
			<input maxlength="32" autofocus placeholder="请输入名字" type="text"  v-model="name"/>
			<text @click="clearName" v-show="name?'true':'false'" class="flicon editflicon">&#xe615;</text>
		</view>
		<view class="uni-input">
			<input maxlength="32" autofocus placeholder="请输入支付宝账号" type="text"  v-model="count"/>
			<text @click="clearCount" v-show="name?'true':'false'" class="flicon editflicon">&#xe615;</text>
		</view>
		<view class="editbtn" @click="editname">
			保存
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:"",
				count:""
			}
		},
		methods: {
			clearName(){			
				this.name=""
			},
			clearCount(){
				this.count=""
			},
			editname(){
				if(!this.name){
					uni.showToast({
						title: '名字不能为空',
						icon:"none"
					});
					return
				}
				uni.showLoading({
					mask:true
				});
				uni.request({
					url:'http://39.100.111.131:8088/UserCenter/Setting/Alipay',
					data:{
						token:this.$store.state.user.token,
						alipay_name:this.name,
						alipay_num:this.count
					},
					method:'post',
					success:(res)=>{
						let{code,msg}=res.data;
						if(code==2000){
							uni.navigateBack({
								delta:2
							})
						}
						else{
							this.$msg(msg)
						}
					},
					fail:()=>{
						uni.showToast({
							icon:"none",
							title:"荔枝开小差了，请联系客服"
						})
					},
					complete:()=>{
						uni.hideLoading()
					}
				})
			}
		},
		onLoad() {
			this.name=this.$store.state.userpersonal.base_info.alipay_name;
			this.count=this.$store.state.userpersonal.base_info.alipay
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
	margin-bottom: 30upx;
	input{
		width: 80%;
		overflow: hidden;
	}
}
.editflicon{
	position: absolute;
	font-size: 40upx;
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
