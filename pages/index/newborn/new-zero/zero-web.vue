<template>
	<view>
		<web-view src="http://yun.lizhiduo.cn/"></web-view>
	</view>
</template>

<script>
	// var plug = uni.requireNativePlugin('Html5app-Baichuan');
	export default {
		data() {
			return {

			}
		},
		methods: {

			isLogin() {

			}
		},
		onNavigationBarButtonTap(e) {
			uni.setClipboardData({
				data:"http://yun.lizhiduo.cn/",
				success:()=>{
					uni.showToast({
						icon:'none',
						title:'复制成功'
					})
				}
			})
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
			// plus.runtime.openURL('weixin://yun.lizhiduo.cn/index.html', function(res) {
			// 	console.log('打开失败');
			// 	uni.showModal({
			// 		content: "本机未检测到微信客户端，是否打开浏览器访问微信？",
			// 		success: function(res) {
			// 			//用户点击确定
			// 			if (res.confirm) {

			// 				plus.runtime.openURL('weixin://yun.lizhiduo.cn/index.html', function(res) {
			// 					console.log(res);
			// 				})
			// 			}
			// 		}
			// 	})
			// });
		},
		onLoad() {

			// #ifdef APP-PLUS
			var currentWebview = this.$mp.page.$getAppWebview(); //获取当前页面的webview对象
			var _that = this;
			setTimeout(function() {
				var wv = currentWebview.children()[0]
				console.log(wv);
				wv.overrideUrlLoading({
					mode: "reject",
					match: ".*taobao.*"
				}, function(e) {
					console.log(e);

					if (!_that.$store.state.user) {
						uni.navigateTo({
							url: '/pages/user/login',
						});
						return;
					}
					
					var reation_id = uni.getStorageSync("relation_id");
					// console.log(reation_id)
					// console.log(_that.$store.state.user.relation_id);
					// console.log(reation_id||_that.$store.state.user.relation_id);
					if (!(reation_id||_that.$store.state.user.relation_id)) {
						uni.showToast({
							icon: "none",
							title: "请您先去个人中心授权"
						})
						return
					}

					if (e.url.indexOf('lz_one') != -1) {
						
						console.log(e.url.replace('lz_one', ''));
						// plug.detailPage({
						// 	url: e.url.replace('lz_one', ''),
						// 	"openType": 0
						// }, result => {
						// 	console.log(res)
						// });
						var coupon_url=e.url.replace('lz_one', '');
						var index = coupon_url.indexOf("/");
						
						var url = "taobao:" + coupon_url.substring(index);
						console.log(url)
						plus.runtime.openURL(url, function(res) {
							console.log('打开失败');
							uni.showModal({
								content: "本机未检测到淘宝客户端，是否打开浏览器访问淘宝？",
								success: function(res) {
									//用户点击确定
									if (res.confirm) {
						
										plus.runtime.openURL(coupon_url, function(res) {
											console.log(res);
										})
									}
								}
							})
						});
						return;
					}

					uni.showModal({
						title: '温馨提示',
						content: '是否锁定此商品，每人仅限一次机会，确定之后不可更换',
						success: res => {
							if (res.confirm) {
								uni.request({
									url: `http://zhou.lizhiduo.cn/CheckPurchase?code=${_that.$store.state.user.invite_code}`,
									success: res => {
										let {
											code,
											msg,
											coupon_url
										} = res.data
										console.log(_that.$store.state.user.invite_code);
										console.log(res.data);
										if (code == 200) {
											// plug.detailPage({
											// 	url: coupon_url,
											// 	"openType": 0
											// }, result => {
											// 	console.log(res)
											// });
											var index = coupon_url.indexOf("/");
											
											var url = "taobao:" + coupon_url.substring(index);
											console.log(url)
											plus.runtime.openURL(url, function(res) {
												console.log('打开失败');
												uni.showModal({
													content: "本机未检测到淘宝客户端，是否打开浏览器访问淘宝？",
													success: function(res) {
														//用户点击确定
														if (res.confirm) {
											
															plus.runtime.openURL(coupon_url, function(res) {
																console.log(res);
															})
														}
													}
												})
											});
										}
										if (code == 203) {
											_that.$msg(msg)
										}
										if (code == 301) {
											_that.$msg(msg)
										}
									}
								})
							}
						}
					})
				})
			}, 1200); //如果是页面初始化调用时，需要延时一下
			// #endif
		}
	}
</script>

<style>


</style>
