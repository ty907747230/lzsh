<template>
	<view class="">
		<web-view src="https://api.zhetaoke.com:10001/api/open_sc_publisher_save.ashx?inviter_code=2NSU95&backurl=http://www.baidu.com&s_note=sssssssssss&type=0"
		 @message="handleMessage"></web-view>
	</view>
</template>

<script>
	var wv;
	export default {
		data(){
			return{
				type:""
			}
		},
		onReady() {

			// #ifdef APP-PLUS
			var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			var _that = this;
			var timeId=setTimeout(function() {
				wv = currentWebview.children()[0]
				wv.overrideUrlLoading({
					mode: "reject",
					match: "http://www.baidu.com.*"
				}, function(e) {
					console.log(e)
					var arr = e.url.split("&");
					var desc="";
					//判断是否存在渠道id
					arr.forEach(v => {
						//存在relation_id
						if (v.indexOf("relation_id") != -1) {
							console.log(v)
							var relation_id = v.split("=")[1];
							if (relation_id) {
								console.log(_that.$store.state.user.token,relation_id)
								_that.$api.GetAuth(_that.$store.state.user.token,relation_id,1).then(res => {
									console.log(res)
									let {
										code,
										msg,
										data
									} = res.data;
									if(code==2000){
										if(data.relation_id){
											uni.setStorageSync("relation_id",relation_id)
										}
										_that.$msg("已授权");
									}
									else if(code==4039){
										uni.showToast({
											title:msg,
											icon:"none",
											duration:3000
										})
									}
									else{
										_that.$msg("授权失败，请重试")
									}
								}).catch(()=>{
									_that.$msg("授权失败，请重试")
								})
							}
						}else{
								if(v.indexOf("desc")!=-1){
									 desc = decodeURI(v.split("=")[1]);
									
								}
							}
					})
					if(timeId){
						clearTimeout(timeId)
					}
					if(_that.type){
						uni.navigateBack({
							delta:2,
						
						})
						if(desc){
							uni.showToast({
								title:desc,
								icon:"none",
								duration:3000
							})
						}
						return
					}
					uni.navigateBack({
						delta:1
					})
					if(desc){
						uni.showToast({
							title:desc,
							icon:"none",
							duration:3000
						})
					}
				})
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif
		},

		onLoad(option){
			this.type=option.type
		},
		methods: {
			handleMessage(e) {

			}
		}
	}
</script>

<style>
</style>
