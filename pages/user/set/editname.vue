<template>
	<view>
		<view class="uni-input">
			<input maxlength="16" autofocus placeholder="请输入新昵称" type="text" value="" v-model="name"/>
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
						title: '名字不能为空',
						icon:"none"
					});
					return
				}
				uni.showLoading({
					mask:true
				});
				uni.request({
					url:'http://39.100.111.131:8088/UserCenter/Setting/SetName',
					data:{
						token:this.$store.state.user.token,
						new_name:this.name,
					},
					method:'post',
					success:(res)=>{
						let{code}=res.data;
						if(code==2000){
							uni.navigateBack({
								delta:2
							})
						}
						else{
							this.$msg("修改昵称失败,昵称不能超过16位")
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
