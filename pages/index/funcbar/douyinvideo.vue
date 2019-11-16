<template>
	<!-- 抖音视频页面 -->
	
		<!-- <video v-show="isPlayVideo" id="myVideo" class="myVideo"  :src="url"   autoplay show-fullscreen-btn="false" objectFit="fill" @fullscreenchange="viderFullscreen" loop="true" enable-progress-gesture="false"> -->
			<!-- <cover-image class="stopPlayVideoBtn" src="/static/index/close.png"></cover-image>
		</video> -->
		<video id="myVideo" :src="url" @click="exit"
		 @error="videoErrorCallback" autoplay="true" objectFit="fill"  @fullscreenchange="viderFullscreen" loop="true"></video>
</template>

<script>
	export default {
		data() {
			return {
				
				info: [],
				url:"",
				videoContext:""
			}
		},
		methods:{
			stopPlayVideo(){ 
				this.videoContext.pause();
			},
			viderFullscreen(e){
				if(e.detail.fullScreen){
					this.videoContext.play();
				}else{
					uni.navigateBack({
						delta:1
					})
				}
			},
		},

		onLoad(option) {
			this.videoContext = uni.createVideoContext('myVideo')
			this.url=option.url
			 	this.videoContext = uni.createVideoContext('myVideo')
			 	this.videoContext.requestFullScreen({direction:0});
		}
	}
</script>

<style>
	.myVideo {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	
</style>
