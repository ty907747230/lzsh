<template>
	<view class="container">
		<view class="logo">
			<image src="/static/sharemenu/logo.png" mode="widthFix"></image>
			<text class="lz-title">荔枝生活</text>
			<!-- <text class="en-title">Litchi Life</text> -->
		</view>
		<view class="desc-content">
			<view class="content-item">
				<view class="content-item-left">当前版本
				</view>
				<view class="content-item-right">
					<text>{{verCode}}</text>

				</view>
			</view>
			<view class="content-item div-m" @click="update">
				<view class="content-item-left">检查更新
				</view>
				<view class="content-item-right">
					<text class="flicon">&#xe6ec;</text>
				</view>
			</view>
			<view class="content-item " @click="yhxy">
				<view class="content-item-left">用户协议
				</view>
				<view class="content-item-right">
					<text class="flicon">&#xe6ec;</text>
				</view>
			</view>
			<view class="content-item" @click="yszc">
				<view class="content-item-left">隐私政策
				</view>
				<view class="content-item-right">
					<text class="flicon">&#xe6ec;</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<!-- <text>版本号 {{verCode}}</text> -->
			<text>copyright @ 重庆利之多网络科技有限公司</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				verCode: "",
			}
		},
		onLoad() {
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
				this.verCode = widgetInfo.version;
			})
		},
		methods: {
			closeTask() {
				this.downloadTask.abort()
				this.downloadTask = null
			},
			installPackge() {
				plus.runtime.install(this.packgePath, {
					force: true
				}, function() {
					plus.runtime.restart()
				})
			},
			createTask(downloadLink) {
				uni.showToast({
					icon: 'none',
					title: '正在下载更新'
				})
				//判断是否已经存在任务
				if (this.packgePath) {
					this.installPackge()
				} else {

					this.downloadTask = uni.downloadFile({
						url: downloadLink,
						success: (res) => {
							if (res.statusCode === 200) {
								// 保存下载的安装包
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (res) => {
										this.packgePath = res.savedFilePath
										uni.showToast({
											icon: 'none',
											title: '更新完成'
										})
										// 进行安装
										this.installPackge()
										// 任务完成，关闭下载任务
										this.closeTask()
									}
								})
							}
						}
					})
				}
			},
			update() {
				uni.showLoading({
					title: "正在检测版本",
					mask: true
				})
				// 检查更新，参数：{ 当前版本号，跳转到更新页面的url }
				if (plus.os.name.toLowerCase() == 'ios') {
					plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
						var vcode = widgetInfo.version.replace(/\./g, '')
						uni.request({
							url: `http://39.100.111.131:8088/UserCenter/Setting/VersionUpgrade/Ios?version_num=${vcode}&device_type=${plus.os.name.toLowerCase()}`,
							success: (res) => {
								let {
									code,
									data
								} = res.data;
								if (code == 2000) {
									if (data.app_url) {
										this.createTask(data.app_url)
									}
								} else if (code == 4101) {
									this.$msg("已是最新版本")
								} else {
									this.$msg(msg)
								}
							}
						})
					})
				} else {
					plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
						var vcode = widgetInfo.version.replace(/\./g, '')
						uni.request({
							url: `http://39.100.111.131:8088/UserCenter/Setting/VersionUpgrade/Android?version_num=${vcode}&device_type=${plus.os.name.toLowerCase()}`,
							success: (res) => {
								let {
									code,
									data
								} = res.data;
								if (code == 2000) {
									// if (data.app_url) {
									// 	this.createTask(data.app_url)
									// }
									uni.navigateTo({
										url: '/pages/update/index'
									})
								} else if (code == 4101) {
									this.$msg("已是最新版本")
								} else {
									this.$msg(msg)
								}
							}
						})
					})
				}
				uni.hideLoading()
			},
			yhxy() {
				console.log(1);
				uni.navigateTo({
					url: '/pages/user/privacyweb'
				});
			},
			yszc() {
				console.log(1);
				uni.navigateTo({
					url: '/pages/user/ysxy'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f6f6f6;
	}

	.container {
		.logo {
			width: 180upx;
			margin: 100upx auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			image {
				border-radius: 26upx;
				width: 160upx;
				height: 160upx;
			}

			.lz-title {
				font-size: $font-lg+4upx;
				color: orangered;
				font-weight: bold;
				margin: 10upx 0;

			}

			.en-title {
				color: #949494;
				font-size: $font-base+4upx;
			}
		}

		.desc-content {
			margin: 0 2%;
			width: 96%;

			.content-item {
				display: flex;
				justify-content: space-between;
				padding: 20upx;
				background-color: #fff;
				align-items: center;
				margin-bottom: 1upx;

				.flicon {
					font-size: $font-lg+10upx;
					color: #949494;
				}
			}

			.div-m {
				margin-bottom: 10upx;
			}
		}

		.footer {
			position: fixed;
			bottom: 20upx;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #949494;
			line-height: 40upx;
			font-size: $font-sm;
		}
	}
</style>
