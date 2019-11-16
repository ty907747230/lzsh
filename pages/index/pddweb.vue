<template>
	<view class="">
		<web-view :src="url" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	var wv;
	export default {
		data(){
			return{
				url:""
			}
		},
		onLoad(){
			this.url=uni.getStorageSync("pdd-url")
		},
		methods: {
			
		}
	}
</script>

<style>
</style>
