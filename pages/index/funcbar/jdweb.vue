<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default{
		data(){
			return{
				url:''
			}
		},
		onLoad(option){
			this.url=option.url;
			this.url='http://item.jd.com/56999146583.html'
			console.log(this.url)
		}
	}
</script>

<style>
</style>
