<template>
	<web-view :src="img"></web-view>
</template>

<script>
	export default{
		data(){
			return{
				img:''
			}
		},
		onLoad(option){
			this.img=option.img
		}
	}
</script>

<style>
</style>
