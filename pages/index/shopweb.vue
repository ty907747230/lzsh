<template>
	<view>
			<web-view :src="'http://store.taobao.com/shop/view_shop.htm?user_number_id='+shopId"></web-view>
	</view>
</template>
<script>
	var wv; //计划创建的webview
	export default {
		data() {
			return {
				isshow: true,
				timeId:"",
				shopId:"",
			}
		},
		onUnload() {
			if(this.timeId){
				clearTimeout(this.timeId)
			}
		},
		onLoad(option){
			console.log(option.title,option.id)
			//动态设置页面的标题
			uni.setNavigationBarTitle({
				title:option.title
			})
			this.shopId=option.id
		},
		onReady() {
			// #ifdef APP-PLUS
			var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			this.timeId = setTimeout(function() {
				wv = currentWebview.children()[0]
				wv.overrideUrlLoading({
					mode: "reject",
					 match: '.*(tbopen|[&?]id=).*'
					
				}, function(e) {
					if(e.url.indexOf("tbopen://m.taobao.com")!=-1){
						
						return
					}
					
					var arr = e.url.split("&");
					//判断是否存在渠道id
					arr.forEach(v => {
						//存在商品id
						if (v.indexOf("id") != -1 ) {
							var id = v.split("=")[1];
							if (id) {
								
								uni.navigateTo({
									url:"/pages/index/shopdetails?"+"id="+id,
								})
							}
						}
					})
				})
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif
		},
	};
</script>
<style lang="scss">
	.header {
		position: fixed;
		z-index: 9999;
		width: 100%;
		background-color: rgb(255, 223, 223);
		height: 100upx;
		line-height: 100upx;
		font-size: $font-lg;
		color: #f00;
		text-align: center;
	}

	.footer {
		background-color: #fff;
		padding-top: 20upx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 110upx;
		z-index: 999;

		.search-btn {
			display: flex;
			justify-content: center;
			width: 80%;
			width: 0 auto;
			height: 70upx;
			background-color: #f00;
			color: #fff;
			line-height: 70upx;
			border-radius: 70upx;
			font-size: $font-lg+8upx;
		}
	}
</style>
