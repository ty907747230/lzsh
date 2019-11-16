<template>
	<!-- 升级页面 -->
	<web-view :src="'http://m.lizhiduo.cn/q/upgrade.html?code='+code"></web-view>
</template>

<script>
	export default{
		data(){
			return{
				code:""
			}
		},
		onLoad(option) {
			this.code=option.code;
			console.log(this.code)
		}
	}
</script>

<style>
</style>
