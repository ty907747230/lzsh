<template>
	<view class="container">
		<!-- <view class="qun" @longpress="copyqun">
			vip交流群：818056135 （长按复制）
		</view> -->
		<view class="kefu-list" v-for="(item,index) in cusList" :key=index>
			<view class="kefu-list-item">
				<text class="kefu-mz">{{item.val}}</text>
				<view class="img-content" @longpress="saveImg(item.url)">
					<image :src="item.url" mode="widthFix"></image>
					<text class="imgTips">长按保存微信二维码</text>
				</view>
				<view class="wxCode">
					微信号:{{item.code}}
				</view>
				<text class="copy-btn" @click="copyCode(item.code)">复制微信号添加好友</text>
				<text>添加微信有助于帮您解决任何问题哦</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cusList: [{
						val: "官方客服",
						code: "xiaomage309350242",
						url: '/static/custom/cus.jpg'
					}
				]
			}
		},
		methods: {
			copyqun(){
				uni.setClipboardData({
					data: "818056135",
					success: () => {
						this.$msg("复制成功");
						
					}
				})
			},
			copyCode(data) {
				uni.setClipboardData({
					data: data,
					success: () => {
						this.$msg("复制成功");
						this.openWeixin();
					}
				})
			},
			saveImg(url) {
				var _that = this;
				uni.saveImageToPhotosAlbum({
					filePath: url,
					success: function() {
						_that.$msg("保存成功");
						
					}
				});
			},
			openWeixin() {
				if (plus.os.name == "Android") {
					plus.runtime.launchApplication({
						pname: "com.tencent.mm"
					}, function(e) {
						plus.nativeUI.confirm("检查到您未安装\"微信\"，是否到商城搜索下载？", function(i) {
							if (i.index == 0) {
								androidMarket("com.tencent.mm");
							}
						});
					});
				} else if (plus.os.name == "iOS") {
					plus.runtime.launchApplication({
						action: "weixin://RnUbAwvEilb1rU9g9yBU"
					}, function(e) {
						plus.nativeUI.confirm("检查到您未安装\"微信\"，是否到商城搜索下载？", function(i) {
							if (i.index == 0) {
								iosAppstore("itunes.apple.com/cn/app/wechat/id414478124?mt=8");
							}
						});
					});
				}
				//  var url = "http://weixin.qq.com/r/RnUbAwvEilb1rU9g9yBU";  
				//  plus.runtime.openURL( url );  
			}
		}
	}
</script>

<style lang="scss">
	page {}

	.container {
		.qun{
			text-align: center;
			font-size: $font-base;
		}
		height: 3300upx;
		padding-top: 20upx;
		background-image: linear-gradient(to bottom, #9359ff, #dc3e91);

		.kefu-list {
			width: 70%;
			margin: 20upx 15% 0;

			.kefu-list-item {
				box-shadow: 0 0 20px #fff;
				font-size: $font-base;
				padding: 20upx;
				background-color: #fff;
				border-radius: 20upx;
				width: 100%;
				height: 600upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				color: #545454;

				.kefu-mz {
					font-size: $font-lg;
					font-weight: bold;
				}

				.img-content {
					width: 210upx;
					display: flex;
					flex-direction: column;
					justify-content: center;

					image {
						width: 200upx;
						height: 200upx;
						margin-bottom: 16upx;
					}

					.imgTips {
						color: #949494;
						font-size: $font-sm;
					}
				}

				.wxCode {
					padding: 10upx 26upx;
					box-shadow: 0 0 10upx #ccc;
					border-radius: 40upx;
					border: 1upx #ccc solid;
				}

				.copy-btn {
					padding: 16upx 50upx;
					color: #fff;
					border-radius: 40upx;
					background-image: linear-gradient(to bottom, #ac9bff, #945cff);
				}
			}
		}
	}
</style>
