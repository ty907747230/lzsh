<template>
	<view class="container">
		<!-- 空白区域 -->
		<view class="white-space">
			
		</view>
		<view class="form">
			<view class="shuru">
				<input placeholder-style="color: #ababab;" @input="hanlderInput" focus="true" type="number" maxlength="6"  v-model="formdata" placeholder="请输入正确的邀请码" />
				<text @click="clearCode" class="flicon">&#xe62c;</text>
			</view>
			<view v-if="isSuccess" class="invite">
				<image :src="inviteR.headimgurl" mode="aspectFill"></image>
				<view class="invite-content">
					<text class="name">{{inviteR.name}}</text>
					<text class="tips">邀请您加入荔枝生活</text>
				</view>
			</view>
			<view class="form-btn">
				<button @click="tijiao" class="form-btn-s" :class="isSuccess?'form-btn-sl':''">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formdata: "",
				phone: "",
				wxInfo:"",
				isSuccess:false,//邀请码是否匹配成功
				inviteR:{},
				union_id:""
			}
		},
		methods: {
			clearCode(){
				console.log(this.formdata)
				this.formdata=""
			},
			//键盘输入事件
			hanlderInput(e){
				console.log(e.target.value)
				if(e.target.value.length==6|e.target.value.length==3){
					console.log(e.target.value)
					this.getInvite(e.target.value);
				}else{
					this.isSuccess=false
				}
			},
			//匹配邀请人
			getInvite(code){
				uni.showLoading({
					mask:true
				});
				uni.request({
					url:`http://39.100.111.131:8088/login/WhoInvite?invite_code=${code}`,
					success:(res)=> {
						let{code,data}=res.data;
						console.log(res)
						if(code==2000){
							this.isSuccess=true;
							this.inviteR=data;
						}
						else{
							this.isSuccess=false;
							this.inviteR={}
						}
					},
					complete() {
						uni.hideLoading();
					}
				})
			},
			tijiao() {
				console.log(1);
				uni.showLoading({
					mask:true
				});
				console.log(this.phone);
				console.log(this.union_id)
				//提交邀请码以及用户信息到数据库
				this.$api.getInviteCode(this.phone, this.union_id,this.formdata,"",this.wxInfo).then(res =>{
						uni.hideLoading()
						console.log(this.phone,this.union_id, this.formdata,this.wxInfo)
						console.log(res)
						let {code,msg,data}=res.data;
						// this.$msg(msg);
						if(code==2000){
								//请求成功保存token
								this.$store.commit("editUser",data);
							//微信登录
							if(this.wxInfo){
								//重定向到个人中心呢
								uni.navigateBack({
									delta: 2
								});
							}
							//手机登录
							else{
								uni.navigateBack({
									delta: 4
								});
							}  
							uni.hideKeyboard()
						}
					}
				).catch(()=>{
					uni.showToast({
						title:"你的网路开小差了",
						icon:"none"
					})
					uni.hideLoading();
				})
			}
		},
		onLoad(option) {
			console.log(option)
			//获取页面传递的手机号
			this.phone =option.mobile||"";
			//如果是微信登录则需要上传微信信息
			if(option.wxInfo){
				this.wxInfo=JSON.parse(option.wxInfo)||"";
			}
			this.union_id=option.unionId||""
		}
	}
</script>

<style lang="scss">
page{
	background-color: #fff;
}
	.container{
		
		.white-space{
			width: 100%;
			height: 120upx;;
			}
		.form{
			width: 90%;
			margin: 0 auto;
			.shuru{
				position: relative;
				width: 100%;
				margin-bottom: 70upx;
				padding-bottom: 10upx;
				input{
					caret-color:red;
					border: none;
					font-size: $font-lg;
					text-indent: 16upx;
				}
				text{
					color: #ababab;
					position: absolute;
					right: 0;
					top: 0;
					font-size:  $font-lg+8upx;
					margin-bottom:6upx;
				}
				border-bottom: 1upx solid #f00;
			}
			.invite{
				border-radius: 10upx;
				// border: 1upx solid #fea6b9;
				padding: 20upx;
				display: flex;
				align-items: center;
				margin-bottom: 70upx;

				image{
					width: 80upx;
					height: 80upx;
					border-radius: 60upx;
					overflow: hidden;
					margin-right: 20upx;
				}
				.invite-content{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.name{
						font-size: 28upx;
						font-weight: bold;
						// color: #949494;
					}
					.tips{
						font-size: 24upx;
						color: #848484;
					}
				}
			}
			.form-btn{
				width: 100%;
				.form-btn-s{
					background-color: #f8f8f8;
					color: #ababab;
				}
				.form-btn-sl{
					color: #fff;
					background-color:#ea5e5a;
					box-shadow: 4px 4px 2px #888888;
				}
			}
		}
	}
</style>
