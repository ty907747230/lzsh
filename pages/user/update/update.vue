<template>
	<view class="container">
		<!-- 升级页面 -->
		<web-view :src="'http://appdata.lizhiduo.cn/update/lzUpdate/active/shengji/uphhr.html?token='+token"></web-view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				token:""
			}
		},
		onLoad(option) {
			var wv;
			this.token=this.$store.state.user.token;
			var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			var _that=this;
			var timeId=setTimeout(function(){
				wv = currentWebview.children()[1];
				console.log(wv);
				wv.overrideUrlLoading({
					mode: "reject",
					match: ".*superiorwx=.*"
				},function(e){
					console.log(e.url.substring(e.url.indexOf('superiorwx=')).replace('superiorwx=',''));
					var swx=e.url.substring(e.url.indexOf('superiorwx=')).replace('superiorwx=','');
					if(swx){
						console.log(swx);
						uni.showModal({
							confirmText:'复制微信',
							title: '联系导师',
							content:`导师微信号: ${swx}`,
							success:(res)=>{
								if(res.confirm){
									uni.setClipboardData({
										data:swx,
										success:(res)=>{
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
								}
							}
						})
					}
				})
			},1000)
		},
		onReady() {
			setTimeout(function(){
				const subNvue=uni.getSubNVueById('apply');
				subNvue.show('slide-in-left',300,function(){})
			},1000)
		}
	}
</script>

<style lang="scss">
	.container{
		height: 100upx;
		width: 750upx;
		background-color: #FF0000;
	}
</style>
