<template>
	<!-- 设置页面 -->
	<view class="container">
		<view class="content">
			<view class="content-one">
				<!-- 头像 -->
				<view class="content-item" @click="changeHeader">
					<view class="content-item-left">
						头像
					</view>
					<view class="content-item-right">
						<view class="img">
							<image :src="info.base_info.headimgurl" mode="widthFix"></image>
						</view>
						<text class="flicon">&#xe6ec;</text>
					</view>
				</view>

				<!-- 昵称 -->
				<view class="mingzi">
					<view class="content-item" @click="editName">
						<view class="content-item-left">
							昵称
						</view>
						<view class="content-item-right">
							<text>{{info.base_info.user_name}}</text>
							<text class="flicon">&#xe6ec;</text>
						</view>
					</view>
				</view>

				<!-- 手机号 -->
				<view class="phone">
					<view class="content-item" @click="phoneBd">
						<view class="content-item-left">
							手机号
						</view>
						<view class="content-item-right">
							<text>{{info.base_info.user_phone||"未绑定"}}</text>
							<text class="flicon">&#xe6ec;</text>
						</view>
					</view>
				</view>
				<!-- 昵称 -->
				<view class="mingzi">
					<view class="content-item" @click="editWxh">
						<view class="content-item-left">
							微信号
						</view>
						<view class="content-item-right">
							<text>{{info.base_info.wechat_num||"未绑定"}}</text>
							<text class="flicon">&#xe6ec;</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 绑定 -->
			<view class="content-two">
				<view class="content-item" @click="alBd">
					<view class="content-item-left">
						支付宝绑定
					</view>
					<view class="content-item-right">
						<text>{{info.base_info.alipay?"已绑定":"未绑定"}}</text>
						<text class="flicon">&#xe6ec;</text>
					</view>
				</view>
				<view class="content-item" @click="wxBd">
					<view class="content-item-left">
						微信绑定
					</view>
					<view class="content-item-right">
						<text>{{info.base_info.union_id?"已绑定":"未绑定"}}</text>
						<text class="flicon">&#xe6ec;</text>
					</view>
				</view>
				<view class="content-item" @click="tbAuth">
					<view class="content-item-left">
						淘宝授权
					</view>
					<view class="content-item-right">
						<text>{{(info.auth_info.relation_id)?"已授权":"未授权"}}</text>
						<text class="flicon">&#xe6ec;</text>
					</view>
				</view>
			</view>
			<!-- 版本 -->
			<view class="content-three">
				<view class="content-item" @click="clearCache">
					<view class="content-item-left">
						清除缓存
					</view>
					<view class="content-item-right">
						<text>{{cache}}</text>
						<text class="flicon">&#xe6ec;</text>
					</view>
				</view>
				<!-- <view class="content-item">
					<view class="content-item-left">
						推送设置
					</view>
					<view class="content-item-right">
						<text>{{verCode}}</text>
						<text class="flicon">&#xe6ec;</text>
					</view>
				</view> -->
				<view class="content-item" @click="update">
					<view class="content-item-left">
						当前版本
					</view>
					<view class="content-item-right">
						<text>{{verCode}}</text>
						<text class="flicon">&#xe6ec;</text>
					</view>
				</view>
			</view>
		</view>
		<view class="exit-btn" @click="exitApp">
			<text>退出当前登录</text>
		</view>
	</view>
</template>

<script>
	const plug = uni.requireNativePlugin('Html5app-Baichuan');
	export default {
		data() {
			return {
				info: "", //个人中心数据
				authoList: [{
						val: "支付宝绑定",
						state: "未绑定"
					},
					{
						val: "微信号绑定",
						state: "未绑定"
					},
					{
						val: "淘宝授权",
						state: "未授权"
					},

				],

				verCode: "",
				cache: 0
			}
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
					icon:'none',
					title:'正在下载更新'
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
											icon:'none',
											title:'更新完成'
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
			getCache() {
				plus.cache.calculate((size) => {
					size = parseInt(size);
					var fileSizeString = "";
					if (size == 0) {
						fileSizeString = "0B";
					} else if (size < 1024) {
						fileSizeString = size + "B";
					} else if (size < 1048576) {
						fileSizeString = (size / 1024).toFixed(2) + "KB";
					} else if (size < 1073741824) {
						console.log("Mb" + size);
						fileSizeString = (size / 1048576).toFixed(2) + "MB";
						console.log("/ after" + fileSizeString);
					} else {
						fileSizeString = (size / 1073741824).toFixed(2) + "GB";
					}
					this.cache = fileSizeString;
				});
			},
			clearCache() {
				var _that = this;
				if (plus.os.name == "Android") {
					let main = plus.android.runtimeMainActivity();
					let sdRoot = main.getCacheDir();
					let files = plus.android.invoke(sdRoot, "listFiles");
					let len = files.length;
					for (let i = 0; i < len; i++) {
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
							if (entry.isDirectory) {
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
									uni.showToast({
										title: '缓存清理完成',
										duration: 2000,
										icon: "none"
									});
									_that.getCache() // 重新计算缓存  
								}, function(e) {
									console.log(e.message)
								});
							} else {
								uni.hideLoading()
								entry.remove();
							}
						}, function(e) {
							console.log('文件路径读取失败')
						});
					}

				} else {
					// uni.clearStorageSync()
					plus.cache.clear(function() {
						uni.showToast({
							title: '缓存清理完成',
							duration: 2000
						});
						_that.getCache()
					});
					uni.showToast({
						title: '缓存清理完成',
						duration: 2000,
						icon: "none"
					});
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
				}
				uni.hideLoading()
			},
			//换取图片
			changeHeader() {
				var _that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'],
					success: function(res) {
						console.log(res.tempFiles);
						uni.showLoading({
							title: "正在上传",
							mask: true
						})
						console.log(JSON.stringify(res.tempFiles[0].size));
						uni.uploadFile({
							url: 'http://39.100.111.131:8088/UserCenter/Setting/SetHeadImg', //仅为示例，非真实的接口地址
							filePath: res.tempFiles[0].path,
							fileType: "image",
							name: 'lizhi',
							formData: {
								'user': _that.info.base_info.invite_code,
							},
							success: (uploadFileRes) => {
								console.log(uploadFileRes);
								uni.hideLoading();
								if (uploadFileRes.data != '2001') {
									_that.info.base_info.headimgurl = uploadFileRes.data;
									console.log(_that.info);
									uni.showToast({
										title: '上传suceess',
										icon: "none"
									});
								}else{
									_that.$msg('图片过大')
								}
							},
							fail: () => {
								uni.hideLoading();
								uni.showToast({
									title: '上传失败',
									icon: "none"
								});
							}
						});
					}
				});

				// plus.gallery.pick(function(p) {
				// 			console.log(p);
				// 			uni.showLoading({
				// 				title: "正在上传",
				// 				mask: true
				// 			})

				// 		})
			},
			//微信号
			editWxh() {
				uni.navigateTo({
					url: `/pages/user/set/editwxh?name=${this.$store.state.userpersonal.base_info.wechat_num}`
				})
			},
			//手机号绑定
			phoneBd() {
				if (this.info.base_info.user_phone) {
					this.$msg("已绑定手机")
					return
				}
				uni.navigateTo({
					url: "/pages/user/set/editPhone"
				})
			},
			//授权
			btnclick: function() {
				plug.checkSession({}, result => {
					console.log(result);
					if (result.code == '0') {
						this.TBOauth();
					} else {
						plug.login({}, result => {
							if (result.code == '0') {
								uni.showToast({
									title: '正在跳往授权',
									icon: "none"
								});
								this.TBOauth();

							} else {
								this.$msg(result.msg || "淘宝登录失败，请重试")
								plug.logout({}, result => {
									console.log(result);
								});
							}
						});
					}
				});

			},

			TBOauth() {
				this.$msg('正在跳转授权');
				plug.taobaoOauth({
					url: "https://oauth.taobao.com/authorize?response_type=code&client_id=27711073&redirect_uri=http://m.baidu.com/oauth/&state=1212&view=wap"
				}, ret => {
					console.log(JSON.stringify(ret));
					if (ret.retcode == "0") {
						uni.request({
							url: `http://39.100.111.131/sr/2.php?code=${ret.code}`,
							success: (res) => {
								if (res.data.relation_id) {
									this.$api.GetAuth(this.$store.state.user.token, res.data.relation_id['0'], 1).then(res => {
										console.log(res)
										let {
											code,
											msg,
											data
										} = res.data;
										console.log(code, data.relation_id)
										if (code == 2000) {
											if (data.relation_id) {
												uni.setStorageSync("relation_id", data.relation_id);
											}
											uni.navigateBack({
												delta: 1
											})
											this.$msg("已授权");

										} else if (code == 4039) {
											uni.showToast({
												title: msg,
												icon: "none",
												duration: 3000
											})
											plug.logout({}, result => {
												console.log(result);
											});
										} else {
											this.$msg(msg);
											plug.logout({}, result => {
												console.log(result);
											});
										}
									}).catch(() => {
										plug.logout({}, result => {
											console.log(result);
										});
										this.$msg("授权信息保存失败，请联系客服")
									})
								} else {

									plug.logout({}, result => {
										console.log(result);
									});
									// this.$msg("找不到授权渠道id，请联系客服")
									this.$msg("淘宝号违规或者异常，请联系客服")
								}
							},
							fail: () => {

								plug.logout({}, result => {
									console.log(result);
								});
								this.$msg("授权请求失败，请联系客服")
							}
						})
					} else {
						plug.logout({}, result => {
							console.log(result);
						});
						this.$msg("用户取消授权")
					}
				})
			},
			//取消淘宝授权
			tbAuth() {
				if (this.info.auth_info.relation_id) {
					uni.showModal({
						content: "是否取消授权",
						success: (res) => {
							if (res.confirm) {
								uni.showLoading({
									mask: true,
									title: '正在取消授权'
								})
								this.$api.GetAuth(this.$store.state.user.token, "relation_id", 0).then(res => {
									try {
										plug.logout({}, result => {
											console.log(result)
										});
									} catch (e) {
										console.log(e)
									}

									let {
										code,
										msg
									} = res.data;
									if (code == 2001) {
										uni.hideLoading()
										uni.navigateBack({
											delta: 2
										})
										uni.removeStorageSync('relation_id');
										this.$msg("取消授权成功")
									} else {
										uni.hideLoading()
										this.$msg("取消授权失败")
									}
								}).catch(() => {
									uni.hideLoading()
									this.$msg("荔枝开小差了，请联系客服")
								})
							}
						}
					})
					return
				}
				this.btnclick()
			},
			//支付宝绑定
			alBd() {
				uni.navigateTo({
					url: "/pages/user/set/editalpay"
				})
			},
			//微信绑定
			wxBd() {
				//如果已绑定
				if (this.info.base_info.union_id) {
					this.$msg("已绑定");
					return
				}
				uni.showLoading({
					mask: true,
					title: '正在拉起微信授权'
				})
				var _that = this;
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								scopes: "auth_user",
								success: function(loginRes) {
									uni.showLoading({
										mask: true,
										title: '正在跳转'
									})

									// 获取用户信息
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) {
											_that.$api.BindWechat(_that.$store.state.user.token, infoRes.userInfo.unionId).then(res => {
												let {
													code,
													msg
												} = res.data;

												//绑定成功
												if (code == 2000) {
													_that.$msg(msg)
													uni.navigateBack({
														delta: 2
													})
												} else {
													_that.$msg(msg)
												}
											})
										},
										fail: () => {
											uni.showToast({
												icon: "none",
												title: "荔枝开小差了，请联系客服"
											})
										},
										complete: () => {
											uni.hideLoading()
										}
									});
								},
								fail: () => {
									uni.hideLoading();
								}
							});
						}
					},
					fail: () => {
						uni.hideLoading();
					}
				});
			},
			//修改名字
			editName() {
				uni.navigateTo({
					url: `/pages/user/set/editname?name=${this.$store.state.userpersonal.base_info.user_name}`
				})
			},
			exitApp() {
				let _that = this;
				uni.showModal({
					content: '是否退出登录',
					success: function(res) {
						if (res.confirm) {

							try {
								plug.logout({}, result => {
									console.log(result)
								});
							} catch (e) {
								console.log(e)
							}
							_that.$store.commit("clearToken");
							_that.$msg("退出成功");
							uni.switchTab({
								url: '/pages/index/index'
							});
						}
					}
				});

			}
		},
		onShow() {
			this.info = this.$store.state.userpersonal;

		},
		onLoad() {
			plug.logout({}, result => {
				console.log(result);
			});
			var _that = this;
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
				_that.verCode = widgetInfo.version

			});
			this.getCache();
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}

	.container {
		font-size: $font-lg;
		color: #3d3d3d;

		.content-item {
			display: flex;
			justify-content: space-between;
			padding: 20upx;
			background-color: #fff;
			align-items: center;
			margin-bottom: 10upx;

			.flicon {
				font-size: $font-lg+10upx;
			}
		}

		.content {
			.content-one {
				.content-item-right {
					display: flex;
					align-items: center;

					.img {
						width: 70upx;
						height: 70upx;
						border-radius: 70upx;
						background-color: #818080;
						overflow: hidden;
						position: relative;
						z-index: 1;
						// overflow: hidden;
						image {
							width: 70upx;
							height: 70upx;
							border-radius: 70upx;
							overflow: hidden;
						}
					}
				}

			}

			.content-two {
				margin-top: 30upx;
			}

			.content-three {
				margin-top: 30upx;
			}


		}

		.exit-btn {
			margin-top: 30upx;
			color: #f00;
			text-align: center;
			padding: 20upx 0;
			background-color: #fff;
		}
	}
</style>
