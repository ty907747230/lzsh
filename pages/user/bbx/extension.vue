<template>
	<view class="container">
		<!--加载框 start-->
		<tui-loading :visible="isSuccess"></tui-loading>
		<view class="" v-show="!isSuccess">
			<view class="content">
				<swiper class="card-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="false"
				 duration="500" @change="cardSwiper" indicator-color="#8799a3"
				 indicator-active-color="#0081ff">
					<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
						<view class="swiper-item">
							<image :src="item" mode="aspectFit"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="footer">
				<view class="footer-item copycode" @click="copyCode">
					复制下载链接
				</view>
				<view class="footer-item haibao" @click="copyImg">
					保存图片
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiLoading from "@/components/loading/loading";
	export default{
		components:{
			tuiLoading
		},
		data(){
			return{
				isSuccess:true,
				cardCur:0,
				dotStyle: false,
				swiperList:[],
				code:""
			}
		},
		methods:{
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
				console.log(this.cardCur);
			},
			copyCode(){
				var _that=this;
				var r_url=`http://app.lizhiduo.cn/UserCenter/AddInvitedUsers?invite_code=${_that.code}`;
				r_url=encodeURIComponent(r_url);
				console.log(r_url)
				uni.setClipboardData({
					data:`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8252232acbe2a53f&redirect_uri=${r_url}&response_type=code&scope=snsapi_userinfo&#wechat_redirect`,
					success:()=>{
						_that.$msg("复制成功")
					}
				})
			},
			shareImg(){
				this.$msg("正在跳转微信")
				var shareObj={};
				shareObj.provider = "weixin";
				shareObj.scene = "WXSceneSession";
				shareObj.type = 2;
				shareObj.imageUrl = this.swiperList[this.cardCur];
				uni.share(shareObj);
			},
			copyImg(){
				uni.showLoading({
					mask: true,
					title: "正在保存"
				})
				var _that = this;
				var downLoader = plus.downloader.createDownload(this.swiperList[this.cardCur], {}, function(download, status) {
					if (status == 200) {
						plus.gallery.save(download.filename, function() {
							_that.$msg("保存成功")
						}, function(e) {
							_that.$msg("保存失败")
						});
					} else {
						console.log("保存失败")
					}
					uni.hideLoading()
				})
				downLoader.start();
			}
		},
		onLoad() {
			this.$api.SharePoster(this.$store.state.user.token).then(res=>{
				console.log(res)
				
				let{code,data}=res.data;
				if(code==2000){
					this.swiperList=data.img_url_list;
					this.code=data.invite_code;
					
				}
				this.isSuccess=false;
			}).catch(()=>{
				this.isSuccess=false;
				this.$msg("荔枝开小差了，请联系客服")
			})
		}
	}
</script>

<style lang="scss">
	.footer{
		position: fixed;
		height: 140upx;
		bottom: 0;
		width: 100%;
		box-shadow: 0px -5px 10px #ccc;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		padding: 25upx;
		.footer-item{
			color: #fff;
			width: 46%;
			height: 90upx;
			text-align: center;
			font-size: $font-lg;
			line-height: 90upx;
			border-radius: 14upx;
			background-color: #465252;
		}
		.copycode{
			background-color: #ff8400;
		}
		.haibao{
			background-color: #ee2c2c;
		}
	}
	.content{
		width: 100%;
		
		.card-swiper{
			width: 100%;
			height: 1000upx;
			.swiper-item{
				width: 100%;
				height: 900upx;
				display: flex;
				justify-content: center;
				image{
					border-radius: 20upx;
					width: 500upx;
					height: 900upx;
				}
			}
		}
	}
	
</style>
