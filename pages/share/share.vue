<template>
	<view class="container">
		<!-- 自定义导航栏需要防止内容进入状态栏的区域 -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<view class="header">
			<!-- 返回按钮 -->
			<view class="back-btn flicon" @click="navBack">&#xe653;</view>
			<!-- 头部按钮 -->
			<view class="header-tarbar">
				<view class="header-tarbar-item">
					<view class="tarbar" v-for="(item,index) in tarbar" :key="index" :class="{active:currentTab==index}" @click="tabClick(index)">
						<text>{{item.val}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 提示 -->
		<view class="earn-tips">
			<text>分享奖励预估:￥{{num}}</text>
			<!-- <text class="earn-tips-right">规则 ></text> -->
		</view>

		<!-- 分享文案 -->
		<view class="share-article" v-if="currentTab==0">
			<!-- 内容 -->
			<view class="share-content">
				<view class="share-token">
					<text>{{contentValue}}</text>
					<!-- <view class="shop-price">
						<text>{{contentValue}}</text>
						<text>【在售价】{{shopItem.reserve_price}}元</text>
						<text>【券后价】{{shopItem.zk_final_price}}元</text>
						<text>【下单链接】{{shopItem.item_url}}元</text>
					</view>
					<text>————</text>
					<text>复制这条信息，￥XHQvYTdbg7C￥，到【手机淘宝】即可查看</text> -->
				</view>
				<!-- 选择功能 -->
				<checkbox-group @change="checkboxChange" class="select">
					<label class="checkbox" v-for="(item,index) in checkList" :key="index">
						<checkbox class="box" checked="true" color="#d81106" style="transform:scale(0.5)" :value="item.value" />
						{{item.val}}
					</label>

				</checkbox-group>

				<view class="share-btn" @click="copyContent(contentValue)">
					<text class="flicon">
						&#xe607; 复制分享文案
					</text>
				</view>
				<!-- <button class="copy-content" type="primary" >复制文案</button> -->
				<view class="share-tips">
					<view class="share-token">
						<text>{{comment}}</text>
					</view>

					<view class="share-btn" @click="copyContent(comment)">
						<text class="flicon">
							&#xe607; 复制评论模板
						</text>
					</view>
					<!-- <button class="copy-content" type="primary" @click="copyContent(comment)">复制评论</button> -->
				</view>
			</view>

			<!-- 分享 -->
			<view class="footer">
				<view class="share-bottom">
					<view class="share-title">
						<text>分享到</text>
					</view>
					<view class="list">
						<view class="box" @click="copyTkl">
							<image src="/static/index/tkl.png"></image>
							<view class="title">
								淘口令
							</view>
						</view>
						<view class="box" @click="shareWX">
							<image src="/static/index/wx.png"></image>
							<view class="title">
								微信
							</view>
						</view>
						<view class="box" @click="sharePYQ">
							<image src="/static/index/pyq.png"></image>
							<view class="title">
								朋友圈
							</view>
						</view>
						<view class="box" @click="downImg">
							<image src="/static/index/xz-y.png"></image>
							<view class="title">
								下载导图
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 分享素材 -->
		<view class="share-img" v-if="currentTab==1">
			<view class="share-img-div">
				<!-- 标题 -->
				<!-- 图片列表区域 -->
				<view class="share-img-view">
					<checkbox-group class="checkgroup" @change="checkImgChange">
						<scroll-view scroll-x="shareImgList.length>3" class="floor-list">
							<view class="scoll-wrapper">
								<view class="share-img-item" v-for="(itemImg,indexImg) in shareImgList" :key="indexImg">
									<image :src="indexImg<shareImgList.length-1?itemImg+'_310x310.jpg':itemImg" class="shopimg" mode="widthFix"
									 @tap="showBigImg(indexImg)"></image>
									<label class="checkbox">
										<checkbox class="box" :value="itemImg" />
									</label>

								</view>
							</view>
						</scroll-view>

						<view class="qrcode">
							<image @tap="showBigImg()" :src="qrCodeImg" mode="widthFix"></image>
							<label class="checkbox">
								<checkbox checked="true" class="box" :value="qrCodeImg" />
							</label>
						</view>
					</checkbox-group>
				</view>
				<!-- 按钮 -->
				<view class="share-img-btn">
					<button class="copy-img" @click="copyImg">保存图片</button>
					<button class="share" @click="handleShare">立即分享</button>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	// import shareBottom from "@/components/share-bottom.vue"
	export default {
		data() {
			return {
				tarbar: [{
						val: "分享文案",
						url: ""
					},
					{
						val: "分享素材",
						url: ""
					}
				],
				checkList: [{
						val: "下单链接",
						value: "link"
					},
					{
						val: "邀请码",
						value: "code"
					},
					{
						val: "淘口令",
						value: "tkl"
					}
				],
				currentTab: 0,
				shopItem: {}, //商品信息
				qrCodeImg: "", //二维码图片
				shareImgList: [], //分享图片列表
				contentValue: "",
				comment: "", //评论内容
				tkl: "",
				previewList: [],
				checkImgList: [],
				num: 0,
				relativePathArr: [], //分享完成后删除下载的本地图片
				pictures: [], //分享的图片数据数组
				picNum: 0, //本地图片已经添加到上面数组中的数量，包括下载成功或者失败的
				picLength: 0, //后台请求获取的图片数组长度
			}
		},
		components: {

		},
		methods: {
			copyTkl() {
				if (!this.tkl) {
					uni.showToast({
						icon: "none",
						title: "口令正在生成，请稍后重试"
					})
					return
				}
				uni.setClipboardData({
					data: `(${this.tkl})`,
					success: () => {
						uni.showToast({
							icon: "none",
							title: "复制成功"
						})
					}
				})
			},
			shareQQ() {
				if (!this.qrCodeImg) {
					this.$msg('导图正在生成')
				}
				uni.showLoading({
					mask: true,
					title: '正在发起分享'
				})
				uni.setClipboardData({
					data: this.contentValue,
					success: () => {
						this.$msg("已帮你自动复制分享文案")
					}
				})
				var shareObj = {};
				shareObj.provider = "qq";
				shareObj.type = 2;
				var downLoader = plus.downloader.createDownload(this.qrCodeImg, {}, function(download, status) {
					if (status == 200) {
						plus.gallery.save(download.filename, function() {
							shareObj.imageUrl = download.filename;
							uni.hideLoading()
							uni.share(shareObj);
						}, function(e) {
							uni.hideLoading()
							console.log("分享失败")
						});
					} else {
						uni.hideLoading()
						console.log("分享失败")
					}
				})
				downLoader.start();
			},
			sharePYQ() {
				if (!this.qrCodeImg) {
					this.$msg('导图正在生成');
					return
				}
				// uni.showLoading({
				// 	mask:true,
				// 	title:'正在发起分享'
				// })
				uni.setClipboardData({
					data: this.contentValue,
					success: () => {
						this.$msg("已帮你自动复制分享文案")
					}
				})
				var shareObj = {};
				shareObj.provider = "weixin";
				shareObj.scene = "WXSenceTimeline";
				shareObj.type = 2;
				shareObj.imageUrl = this.qrCodeImg;
				uni.share(shareObj)
				// var downLoader = plus.downloader.createDownload(this.qrCodeImg, {}, function(download, status) {
				// 	if (status == 200) {
				// 		plus.gallery.save(download.filename, function() {
				// 			shareObj.imageUrl = download.filename;
				// 			uni.hideLoading()
				// 			uni.share(shareObj);
				// 		}, function(e) {
				// 			uni.hideLoading()
				// 			console.log("分享失败")
				// 		});
				// 	}else{
				// 		uni.hideLoading()
				// 		console.log("分享失败")
				// 	}
				// })
				// downLoader.start();	
			},
			shareWX() {
				if (!this.qrCodeImg) {
					this.$msg('导图正在生成');
					return
				}
				uni.setClipboardData({
					data: this.contentValue,
					success: () => {
						this.$msg("已帮你自动复制分享文案")
					}
				})

				var shareObj = {};
				shareObj.provider = "weixin";
				shareObj.scene = "WXSceneSession";
				shareObj.type = 2;
				shareObj.imageUrl = this.qrCodeImg;
				shareObj.fail = function(e) {
					console.log(e);
				}
				shareObj.complete = function(e) {
					console.log(e);
				}
				shareObj.success = function(e) {
					console.log(e);
				}
				uni.share(shareObj);
			},
			//下载图片
			downImg() {
				if (!this.qrCodeImg) {
					uni.showToast({
						icon: "none",
						title: "图片正在生成，请稍后重试"
					})
					return
				}
				uni.showLoading({
					mask: true,
					title: "正在下载"
				})
				var _that = this;
				var downLoader = plus.downloader.createDownload(this.qrCodeImg, {}, function(download, status) {
					if (status == 200) {
						plus.gallery.save(download.filename, function() {
							_that.$msg("下载成功")
						}, function(e) {
							_that.$msg("下载失败")
						});
					} else {
						console.log("下载失败")
					}
					uni.hideLoading()
				})
				downLoader.start();
			},
			//图片复选框改变事件
			checkImgChange(e) {
				this.checkImgList = e.detail.value;
			},
			//保存图片
			copyImg() {
				this.$msg("正在保存图片")
				var that = this;
				console.log(this.checkImgList)
				if (this.checkImgList.length) {
					this.checkImgList.map(v => {
						if (v.indexOf("http://lizhiduo.oss") != -1) {
							var downLoader = plus.downloader.createDownload(this.qrCodeImg, {}, function(download, status) {
								if (status == 200) {
									plus.gallery.save(download.filename, function() {
										if (that.checkImgList.length == 1) {
											that.$msg("保存成功")
										}
									}, function(e) {});
								}
							})
							downLoader.start();
							return
						}
						uni.saveImageToPhotosAlbum({
							filePath: v,
							success: function() {
								that.$msg("保存成功")
							}
						});
					})
				} else {
					this.$msg("请选择图片")
				}
			},

			/*
			 *1.从本地获取,如果本地存在,则直接设置图片
			 *2.如果本地不存在则网络下载,缓存到本地,再设置图片
			 * */
			setImg(imgId, loadUrl) {
				var _that = this;
				if (imgId == null || loadUrl == null) return;
				//图片下载成功 默认保存在本地相对路径的"_downloads"文件夹里面, 如"_downloads/logo.jpg"
				var filename = loadUrl.substring(loadUrl.lastIndexOf("/") + 1, loadUrl.length);
				var relativePath = "_downloads/" + filename;
				this.relativePathArr.push(relativePath); //存储起来等分享结束后删除数据使用

				//检查图片是否已存在
				plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
					console.log("存在")
					//如果文件存在,则直接设置本地图片
					_that.setImgFromLocal(imgId, relativePath);
				}, function(e) {
					console.log("下载")
					//如果文件不存在,联网下载图片
					_that.setImgFromNet(imgId, loadUrl, relativePath);
				});
			},

			/*联网下载图片,并设置给<img>*/
			setImgFromNet(imgId, loadUrl, relativePath) {
				var _that = this;
				//先设置下载中的默认图片
				//创建下载任务
				var dtask = plus.downloader.createDownload(loadUrl, {}, function(d, status) {
					if (status == 200) {
						_that.setImgFromLocal(imgId, d.filename);
					} else {
						_that.picNum++;
						//	                		console.log("下载失败");
						//下载失败,需删除本地临时文件,否则下次进来时会检查到图片已存在
						//dtask.abort();//文档描述:取消下载,删除临时文件;(但经测试临时文件没有删除,故使用delFile()方法删除);
						if (relativePath != null)
							_that.delFile(relativePath);
					}
				});
				//启动下载任务
				dtask.start();
			},

			/*删除指定文件*/
			delFile(relativePath) {
				plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
					entry.remove(function(entry) {
						console.log("文件删除成功");
					}, function(e) {
						console.log("文件删除失败" + relativePath);
					});
				});
			},

			/*给图片标签<img>设置本地图片
			 * imgId 图片标签<img>的id
			 * relativePath 本地相对路径 例如:"_downloads/logo.jpg"
			 */
			setImgFromLocal(imgId, relativePath) {
				var _that = this;
				//本地相对路径("_downloads/logo.jpg")转成SD卡绝对路径("/storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/downloads/logo.jpg");
				var sd_path = plus.io.convertLocalFileSystemURL(relativePath);
				this.pictures.push("file://" + sd_path);
				this.picNum++;
				console.log(this.picLength, this.picNum)
				//这里要注意picNu ++的地方，要在图片下载完成后或者失败后；
				if (this.picLength == this.picNum) {
					console.log("开始分享")
					//确定全部图片都下载到本地后调分享
					var msg = {
						pictures: this.pictures
					};
					plus.share.sendWithSystem(msg, function(e) {
						uni.hideLoading()
					}, function(e) {
						uni.hideLoading()

					});
				}
			},

			//分享
			handleShare() {
				uni.showLoading({
					title: "正在发起分享",
					mask: true
				})

				this.picLength = this.checkImgList.length;
				this.picNum = 0;
				this.relativePathArr = [];
				this.pictures = [];
				console.log(this.checkImgList)
				for (var i = 0; i < this.checkImgList.length; i++) {
					this.setImg("img" + i, this.checkImgList[i]);
				}
			},
			//图片预览
			showBigImg(src) {
				try {
					console.log(src);
					console.log(this.previewList[src]);
					if (!src) {
						src = this.previewList.length - 1;
					}

					uni.previewImage({
						current: src,
						urls: this.previewList,
						// indicator: "number"
						fail: (e) => {
							console.log(e);
						},
						complete: res => {
							console.log(res);
						}
					})

				} catch (e) {
					console.log(e);
				}
			},
			//tab栏点击切换
			tabClick(index) {
				this.currentTab = index;
			},
			// 评论复选框改变
			checkboxChange(e) {
				this.comment = "";
				let values = e.detail.value;
				values.map(v => {
					if (v == "link") {
						this.comment += `【下单链接】${this.shopItem.item_url}\n`;
					}
					if (v == "code") {
						this.comment += `【邀请码】${this.shopItem.item_url}\n`;
					}
					if (v == "tkl") {
						this.comment += `【淘口令】(${this.tkl})\n`;
					}
				})
			},
			//返回按钮
			navBack() {
				uni.navigateBack();
			},
			//点击复制到剪切版
			copyContent(data) {
				uni.setClipboardData({
					data
				});
				uni.showToast({
					title: '复制成功',
					icon: "none",
					duration: 2000
				});
			}
		},
		onLoad(options) {
			this.num = options.num;
			this.pic_url = options.pic_url;
			//请求商品详情
			this.$api.getDetailCommon(options.id).then(res => {
				let {
					status,
					content
				} = res.data;

				if (status == 200) {
					this.shopItem = content[0];
					this.shareImgList = content[0].small_images.split("|");
					this.previewList = [...this.shareImgList];
					this.contentValue =
						`${this.shopItem.title}\n【在售价】${this.shopItem.size}元\n【券后价】${this.shopItem.quanhou_jiage}元\n————\n${this.shopItem.jianjie}`;
					// this.comment = `【下单链接】${this.shopItem.item_url}\n【邀请码】${this.$store.state.user.invite_code}`;
				}
			});
			//请求二维码
			this.$api.qrCode(options.id, options.rid).then(res => {
				let {
					code,
					data
				} = res.data;
				if (code == 200) {
					this.qrCodeImg = data.pic_url;
					//请求成功将二维码图片加入图片列表；
					this.previewList.push(this.qrCodeImg);
					this.checkImgList.push(this.qrCodeImg)
				}
			})
			//请求淘口令
			this.$api.relation_tkl(options.id, options.rid).then(res => {
				let {
					code,
					result
				} = res.data;
				console.log(res)
				if (code == 200) {
					this.tkl = result.data.tpwd;
					console.log(this.tkl);
					this.comment =
						`【下单链接】正在生成...\n【邀请码】${this.$store.state.user.invite_code}\n【淘口令】(${this.tkl})`;
					if (this.tkl) {
						this.$api.HandleLink({
							tkl: this.tkl,
							pic: this.pic_url
						}).then(rest => {
							this.comment =
								`【下单链接】${rest.data.buy_url}\n【邀请码】${this.$store.state.user.invite_code}\n【淘口令】(${this.tkl})`;
						}).catch(() => {
							this.comment =
								`【下单链接】无\n【邀请码】${this.$store.state.user.invite_code}\n【淘口令】(${this.tkl})`;
						})
					}
				}
			});


		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
		height: 100%;

	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #F8F8F8;
	}

	.top_view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #F8F8F8;
		top: 0;
		z-index: 999;
	}

	.container {
		height: 100%;
		//background-color: #efefef;

		.header {
			background-color: #fcfffc;
			width: 100%;
			height: 90upx;
			border-bottom: 1px solid #ced6c2;
			display: flex;

			.back-btn {
				font-size: $font-lg+8upx;
				line-height: 90upx;
				margin-left: 40upx;
			}

			.header-tarbar {
				height: 60upx;
				line-height: 60upx;
				font-size: $font-base;
				width: 400upx;
				margin: 10upx auto;
				border-radius: 10upx;
				border: 1px #b5754d solid;
				overflow: hidden;

				.header-tarbar-item {
					display: flex;
					text-align: center;

					.tarbar {
						flex: 1;

					}

					.active {
						background-color: #fe5821;
						color: #fff;
					}
				}
			}
		}

		.earn-tips {
			display: flex;
			justify-content: space-between;
			background-color: #eefdeb;
			height: 70upx;
			line-height: 70upx;
			font-size: $font-base;
			padding: 0 30upx;
			color: #4b622e;

			.earn-tips-right {
				color: #828d7f;
			}
		}

		//分享文案
		.share-article {
			background-color: #fcfffc;
			padding: 16upx;

			.share-content {
				font-size: $font-sm;

				.share-token {
					background-color: #f7f7f7;

					padding: 20upx;
					display: flex;
					flex-direction: column;
					border-radius: 16upx;

					.shop-price {
						display: flex;
						flex-direction: column;
					}
				}

				.select {
					margin-top: 10upx;
					display: flex;
					justify-content: space-between;
					font-size: $font-sm;

					.checkbox {
						checkbox .wx-checkbox-input {
							border-radius: 50% !important;
						}

						checkbox .wx-checkbox-input.wx-checkbox-input-checked {
							border-radius: 50% !important;
							border: 1px solid #ff4500;
							background: #f54d07;
							color: #fff !important;
						}

					}
				}

				.share-btn {
					color: #f00;
					display: flex;
					justify-content: flex-end;
					margin: 10upx 0;
					font-size: $font-sm;

					.flicon {
						background-color: #fbdfdf;
						font-size: $font-sm;
						padding: 6upx 20upx;
						border-radius: 30upx;
					}
				}
			}

			.share-tips {}

			.footer {
				position: absolute;
				bottom: 0;
				padding: 0 30upx;
			}
		}

		//分享素材
		.share-img {
			width: 100%;

			padding-top: 20upx;
			flex: 1;


			.share-img-div {
				box-sizing: border-box;
				width: 94%;
				background-color: #fff;
				margin: 20upx auto;
				padding: 0 25upx;
				border-radius: 16upx;

				.share-title {
					font-size: $font-base;
					height: 60upx;
					line-height: 60upx;
				}

				.share-img-view {
					width: 100%;

					.checkgroup {
						width: 100%;

						.qrcode {
							width: 66%;
							position: relative;
							margin: 30upx auto;

							image {
								width: 100%;
							}

							.checkbox {
								position: absolute;
								right: 6upx;
								top: 10upx;
								transform: scale(0.8);
								margin: 0;
								padding: 10upx 10upx 40upx 40upx;

								checkbox .wx-checkbox-input {
									border-radius: 50% !important;
								}

								checkbox .wx-checkbox-input.wx-checkbox-input-checked {
									border: 1px solid #ff4500;
									background: #f54d07;
									color: #fff !important;
								}

							}
						}

						.floor-list {
							white-space: nowrap;

							.scoll-wrapper {
								display: flex;
								justify-content: space-between;

								.share-img-item {
									position: relative;
									width: 220upx;
									padding: 16upx 10upx;
									box-sizing: content-box;

									.shopimg {
										width: 220upx;
										height: 220upx;
									}

									.checkbox {
										position: absolute;
										right: 6upx;
										top: 10upx;
										transform: scale(0.8);
										padding: 10upx 10upx 40upx 40upx;
										margin: 0;

										checkbox .wx-checkbox-input {
											border-radius: 50% !important;
										}

										checkbox .wx-checkbox-input.wx-checkbox-input-checked {
											border-radius: 50% !important;
											border: 1px solid #ff4500;
											background: #f54d07;
											color: #fff !important;
										}

									}

								}
							}
						}
					}
				}

				.share-img-btn {
					position: fixed;
					left: 0;
					bottom: 10upx;
					display: flex;
					justify-content: space-between;
					width: 100%;
					padding-top: 10upx;

					button {
						font-size: $font-lg;
						width: 45%;
						height: 80upx;
						line-height: 80upx;
						border-radius: 20upx;
					}

					.copy-img {
						border: #4db5f7 solid 1upx;
						color: #4db5f7;
						background-color: #fff;
					}

					.share {
						border: solid #fa6523 1upx;
						color: #fa6523;
						background-color: #fff;
					}
				}
			}
		}
	}

	.share-bottom {
		background-color: #fff;

	}

	.share-title {
		width: 100%;
		text-align: center;
		color: #c2c2c2;
		position: relative;

		text {
			position: relative;
			z-index: 1;
			background-color: #fff;
			padding: 0 40upx;

		}

		&:after {
			position: absolute;
			width: 100%;
			top: 50%;
			height: 0;
			content: '';
			border-bottom: 1px solid #ccc;
			left: 0;
		}
	}

	.list {
		width: 100%;
		display: flex;
		padding: 20upx 0;

		//border-top: 1px solid #f2f2f2;
		.box {
			width: 25%;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			image {
				width: 13.8vw;
				height: 13.8vw;
			}

			.title {
				margin-top: 10upx;
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 26upx;
			}
		}
	}
</style>
