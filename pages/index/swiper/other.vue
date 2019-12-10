<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			}
		},
		methods: {
			
		},
		onLoad(){
			var str = uni.getStorageSync('swiper-data');
			this.url=str.link;
			uni.setNavigationBarTitle({
				title:str.title
			})
		}
	}
</script>

<style>

</style>
