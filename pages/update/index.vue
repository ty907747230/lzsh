<template>
	<view class="">
		<!--加载框 start-->
		<tui-loading :visible="isSuccess"></tui-loading>
		<view class="flex-column" v-show="!isSuccess">
			<view class="content">
				<view class="status_bar">
					<view class="top_view"></view>
				</view>
				<view class="content-title">
					<text @click="toback" class="back flicon">&#xe653;</text>
					<text class="title-w">版本更新</text>
				</view>
			</view>
			
			<view class="box-content">
				<view class="box-content-bb">
					<text class="box-content-bb-t">新版本特性</text>
					<text class="box-i">大小: {{package_size}}</text>
					<text class="box-i">版本号: {{version_code}}</text>	
				</view>
				<view class="box-content-c">
					<p :key="index" v-for="(item,index) in updateinfo" class="box-content-c-w">{{item}}</p>
				</view>
			</view>
			
			<view class="minorContent bottom_aera">
				<view v-if="startProgress && !currentIsLatest" class="smallTitle">
					<text>下载进度:{{ downloadProgress }}%</text>
					<progress :percent="downloadProgress" stroke-width="4" />
				</view>
				<button v-if="!startProgress && !currentIsLatest" @click="handleUpdate()" class="btn">立即更新</button>
				<button v-if="currentIsLatest" :loading="buttonLoading"  @click="getLatest()" class="btn">检查更新</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {

			return {
				isSuccess:true,
				info: '正在加载', // 主标题显示版本号
				Minfo: '未知', // 副标题显示版本类型
				Mtip: '', // 小提示标语
				updateinfo: '', // 更新摘要
				version_code:"",
				package_size:'',
				latest: null, // 版本信息
				
				packgePath: null, // 更新包的文件地址
				downloadTask: null, // 下载任务
				downloadProgress: 0, // 下载进度
				buttonLoading: false, // 加载 - 标记
				installed: false, // 是否执行了安装 - 标记
				startProgress: false, // 下载进行 - 标记
				currentIsLatest: true // 当前版本就是最新版本 - 标记
			}
		},
		onReady() {
			this.getLatest()
			const updated = uni.getStorageSync('updated')
			if (updated.packgePath) {
				this.packgePath = updated.packgePath
			}
		},
		// 如果用户下载后没有完成安装，却回到app，则执行这里
		onShow() {
			if (this.installed === true && this.packgePath) {
				this.installed = false
				this.haveDownloaded()
			}
		},
		// 用户关闭页面时检查是否存在下载任务
		onUnload() {
			if (this.downloadTask) {
				this.closeTask()
				this.showToast('更新被取消')
			}
		},

		methods: {
			toback(){
				uni.navigateBack({
					delta:1
				})
			},
			// 封装个Toast方便用
			showToast(text) {
				uni.showToast({
					title: text,
					duration: 3000,
					icon: 'none'
				})
			},
			installPackge() {
				console.log(this.packgePath)
				// 安装更新
				plus.runtime.install(this.packgePath, {
					force: true
				}, function() {
					console.log("安装成功")
				})
				this.installed = true
				// 保存更新记录到stroage，方便下次启动app时删除安装包
				uni.setStorage({
					key: 'updated',
					data: {
						completed: true,
						packgePath: this.packgePath
					},
					success: (res) => {
						console.log('成功保存更新记录')
					}
				})
				// 判断是否为热更新（判断文件名中是否含有.wgt）
				if (this.packgePath.match(RegExp(/.wgt/))) {
					this.installed = false
					uni.showModal({
						title: '提示',
						content: '应用将重启以完成更新',
						showCancel: false,
						complete: () => {
							plus.runtime.restart()
						}
					})
				}
			},
			// 已经下载了更新包但是没有安装
			haveDownloaded() {
				uni.showModal({
					title: '更新尚未完成',
					content: '您已下载更新包，但是还没有完成安装，请问是否要继续安装更新包呢？',
					success: (res) => {
						if (res.confirm) {
							// 安装
							this.installPackge()
						} else if (res.cancel) {
							this.showToast('更新被取消')
						}
					}
				})
			},
			// 取得最新版本及其所有信息
			getLatest() {
				this.buttonLoading = true
				this.latest = null
				
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
					console.log(widgetInfo.versionCode)
					console.log(plus.os.name.toLowerCase())
					uni.request({
						url: `http://39.100.111.131:8088/UserCenter/Setting/VersionUpgrade?version_num=${widgetInfo.versionCode}&device_type=${plus.os.name.toLowerCase()}`,
						method: 'GET',
						success: (res) => {
							let {
								code,
								data							
							} = res.data;
							this.isSuccess=false;
							if (code == 2000) {
								this.version_code=data.version_code;
								this.updateinfo=data.update_info;
								this.latest = data.app_url;
								this.buttonLoading = false;
								this.package_size=data.package_size;
								this.checkLatest(this.latest)
							}
						},
						fail:()=>{
							this.$msg("荔枝开小差了，请联系客服")
						}
					})
				})
			},
			// 检查版本
			checkLatest() {
				if (this.$current != this.latest) { // 当前版本与新版本不符（$current在main.js里）
					console.log(this.currentIsLatest)
					this.currentIsLatest = false
				} else {
					this.showToast('当前是最新版了')
					this.currentIsLatest = true
				}
			},
			
			// 关闭下载任务
			closeTask() {
				this.downloadTask.abort()
				this.downloadTask = null
				this.startProgress = false
			},
			// 开始下载任务
			createTask(downloadLink) {
				//判断是否已经存在任务
				if (this.packgePath) {
					this.haveDownloaded()
				} else {
					this.downloadProgress = 0
					this.startProgress = true
					// 创建下载任务对象
					this.downloadTask = uni.downloadFile({
						url: downloadLink,
						success: (res) => {
							if (res.statusCode === 200) {
								console.log(res.tempFilePath)
								// 保存下载的安装包
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (res) => {
										this.packgePath = res.savedFilePath
										console.log(res.savedFilePath)
										// 进行安装
										this.installPackge()
										// 任务完成，关闭下载任务
										this.closeTask()
									}
								})
							}
						}
					})
					// 进度条更新
					this.downloadTask.onProgressUpdate((res) => {
						this.downloadProgress = res.progress
					})
				}
			},
			handleUpdate() {
				// 判断系统类型
				if (plus.os.name.toLowerCase() === 'android') {
					if (this.latest) { // 我这里默认#也是没有地址，请根据业务自行修改
						// 安卓：创建下载任务
						this.createTask(this.latest)
					} else {
						this.showToast('未找到下载地址')
					}
				} else {
					if (this.latest) { // 我这里默认#也是没有地址，请根据业务自行修改
						// 苹果(A)：进行热更新（如果iosLink是wgt更新包的下载地址）判断文件名中是否含有.wgt
						if (this.latest.match(RegExp(/.wgt/))) {
							this.createTask(this.latest)
						} else {
							// 苹果(B)：打开商店链接（如果iosLink是苹果商店的地址）
							plus.runtime.openURL(this.latest)
						}
					} else {
						this.showToast('未找到ios商店地址')
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.flicon{
		font-family: flicon;
	}
	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.content {
		width: 100%;
		height: 500upx;
		background-image: url('~@/static/index/update_bg.png');
		background-size: 100% 100%;
		position: fixed;
		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
		}
		
		.top_view {
			height: var(--status-bar-height);
			width: 100%;
			position: fixed;	
			top: 0;
			z-index: 9;
		}
		.content-title{
			margin-top: 16upx;
			background-color: rgba(0,0,0,0);
			color: #fff;
			font-size: $font-lg+4upx;
			width: 100%;
			display: flex;
			justify-content: center;
			align-content: center;
			height: 100upx;
			position: relative;
			.back{
				position: absolute;
				left: 20upx;
				top: 0;
				font-size: $font-lg+12upx;
			}
		}
	}
	
	.box-content{
		margin-top: 510upx;
		color: #888;
		font-size: $font-lg;
		.box-content-bb{
			padding: 20upx 40upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.box-content-bb-t{
				font-size: $font-lg+8upx;
				font-weight: bold;
			}
			.box-i{
				margin-left: 20upx;
			}
		}
		.box-content-c{
			width: 90%;
			margin: 0 5%;
			background-color: #fff;
			border-radius: 20upx;
			padding: 30upx 20upx;
			.box-content-c-w{
				text-indent: 40upx;
				
				line-height: 1.5;
				
			}
		}
	}

	.minorContent {
		width: 90%;
		padding: 0 50upx;
		margin: 0 5%;
		position: fixed;
		bottom: 40upx;
		// box-shadow: 0 0 5upx #ccc;
	}

	.process {
		margin-top: 200upx;
		margin-left: 30%;
	}

	.btn{
		color: #fff;
		font-size: $font-base;
		width: 100%;
		background-image: linear-gradient(to right,rgb(253,150,126),rgb(252,70,69))
	}
	  .smallTitle {
	  font-size:26upx;
	  font-weight:500;
	  padding:20upx 0;
	  line-height:1.5;
	  color:#888;
	}
</style>
