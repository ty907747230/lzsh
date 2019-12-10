<script>
	// 引入检查更新模块
	import share from "@/common/shareIndex.js";
	import jdreg from '@/common/reg.js';
	import pddreg from '@/common/pdd_reg.js';
	import handelTs from '@/common/notice.js';
	import setId from '@/common/set_id.js';
	export default {
		onUniNViewMessage: function(e) {
			
			if (e.data.user) {
				// this.$store.state.user = e.data.user;
				this.$store.commit('editUser', e.data.user)
			}

		},
		onError(res) {
			console.log('err', res)
			// plus.runtime.restart()
		},
		onLaunch: function() {
			
			//获取上架隐藏开关
			// if (plus.os.name == 'iOS') {
			// 	this.$api.GetIosVersion(plus.runtime.versionCode).then((res) => {
			// 		let {
			// 			code
			// 		} = res.data;
			// 		console.log(res)
			// 		if (code == 2000) {
			// 			uni.setStorageSync('lzd-iosisshow', true)
			// 		} else {
			// 			uni.setStorageSync('lzd-iosisshow', false)
			// 		}
			// 	})
			// 	this.$api.GetExtendOnOff(plus.runtime.versionCode).then((res) => {
			// 		let {
			// 			code,
			// 			data
			// 		} = res.data;
			// 		console.log(res)
			// 		if (code == 4000) {
			// 			uni.setStorageSync('lzd-kzshow', data)
			// 		}
			// 	})
			// 	console.log(plus.runtime.versionCode)
			// }
			// notice();
			handelTs(this);
			
			if(this.$store.state.user){
				console.log(this.$store.state.user.token);
				setId(this.$store.state.user.token)
			}
			
			uni.getNetworkType({
				success: function(res) {
					if (!res.networkType) {
						uni.showToast({
							icon: "none",
							title: "网络延时，请稍后重试"
						})

					}
				}
			});
			uni.onNetworkStatusChange(function(res) {
				if (!res.isConnected) {
					uni.showToast({
						icon: "none",
						title: "网络延时，请稍后重试"
					})
				}
				console.log(res.isConnected);
				console.log(res.networkType);
			})
			console.log('App Launch')
		},
		onShow: function() {
			
			//获取剪切版内容
			uni.getClipboardData({
				success: res => {
					console.log(res.data)
					if (!res.data) {
						return
					}
					var contents = res.data;
					console.log(res.data)
					// if(res.data.indexOf('\n')!=-1){
					// 	console.log('检测到')
					// 	return
					// }
					var tao_id;
					this.$api.open_shangpin_id(contents, 1).then(res => {
						var isSuccess = false; //是否解析成功
						let {
							content,
							status
						} = res.data;
						console.log(res)

						if (status == 200) {
							isSuccess = true;
							contents = content[0].tao_title;
							tao_id = content[0].tao_id
						}
						contents = contents.trim()

						var reg = /^\d{1,}$/;
						// console.log(reg.test(contents.replace(/\s/g,'')))
						// console.log(reg.test(contents.replace(/\s/g,'')));
						if ((contents.length >= 15 && !reg.test(contents.replace(/\s/g, ''))) || isSuccess) {
							let shareList = [{
									icon: "/static/index/tao.png",
									text: "淘宝"
								},
								{
									icon: "/static/index/jd.png",
									text: "京东"
								},
								{
									icon: "/static/index/pdd.png",
									text: "拼多多"
								}

							];
							this.shareObj = share(shareList, contents, function(index) {

								let shareObj = {
									success: (res) => {

										console.log("success:" + JSON.stringify(res));
									},
									fail: (err) => {
										console.log("fail:" + JSON.stringify(err));
									}
								};
								switch (index) {
									//淘宝
									case 0:
										if (tao_id) {
											uni.navigateTo({
												url: "/pages/index/shopdetails?id=" + tao_id
											})
											return
										}
										uni.navigateTo({
											url: `/pages/index/search-shop?keywords=${contents}`,
										});

										break;
										//京东
									case 1:
										if (jdreg(contents)) {
											uni.navigateTo({
												url: `/pages/index/shopdetails-j?id=${jdreg(contents)}`,
											});
										} else {
											uni.navigateTo({
												url: `/pages/index/search-jshop?keywords=${contents}`,
											});
										}
										break;
										//拼多多
									case 2:
										console.log(contents)
										console.log(pddreg(contents))
										if (pddreg(contents)) {
											uni.navigateTo({
												url: `/pages/index/shopdetails-p?id=${pddreg(contents)}`,
											});
										} else {
											uni.navigateTo({
												url: `/pages/index/search-pshop?keywords=${contents}`,
											});
										}
										break;
								};
							});
							this.$nextTick(() => {
								this.shareObj.alphaBg.show();
								this.shareObj.shareMenu.show();
							});
							plus.key.addEventListener("backbutton", () => {
								if (this.shareObj.shareMenu.isVisible()) {
									this.shareObj.shareMenu.hide();
									this.shareObj.alphaBg.hide();
									return true
								}
							});

							var os = plus.os.name;
							if ('iOS' == os) {

								var pasteboard = plus.ios.invoke('UIPasteboard', 'generalPasteboard');
								plus.ios.invoke(pasteboard, 'setValue:forPasteboardType:', '', 'public.utf8-plain-text');
							} else {
								var main = plus.android.runtimeMainActivity();

								var clip = main.getSystemService('clipboard');
								plus.android.invoke(clip, 'setText', '');
							}
						}
					})
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// ...mapMutations(['updatePushMessage'])
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";

	/*每个页面公共css */
	/* @font-face {
		font-family: flicon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1251546_z1mec203ig.ttf') format('truetype');
	} */

	/* 全局公共样式和字体图标 */
	@font-face {
		font-family: 'flicon';
		src: url('~@/static/font/iconfont.ttf');
	}

	.flicon {
		font-family: flicon;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-zuojiantou:before {
		content: "\e622";
	}

	.icon-fangdajing:before {
		content: "\e69c";
	}

	.icon-xiaoxi1:before {
		content: "\e60d";
	}

	.icon-xingzhuang:before {
		content: "\e623";
	}

	.icon-shanchu:before {
		content: "\e696";
	}

	image {
		display: block;
		will-change: transform !important;
	}

	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
</style>
