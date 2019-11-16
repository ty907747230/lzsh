<template>
	<view class="container">
		<!-- 商品列表 -->
		<shop-two :shopList="shopList"></shop-two>
		<!-- 懒加载 -->
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import shopTwo from "@/components/shop-two.vue";
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				shopList: [],
				page_no: 1,
				loadingType: "more",
			}
		},
		components:{
			shopTwo,
			uniLoadMore
		},
		methods: {
			loadData() {
				if (this.loadingType === "nomore") {
					return;
				}
				this.loadingType = "loading";
				uni.request({
					url: 'http://api.tbk.dingdanxia.com/spk/optimus?apikey=VNyxX3uZHc1WPAf62tVTfuB6dDESZS7f&material_id=3756&page_size=20&page_no=' +
						this.page_no + '&device_type=' + plus.device.uuid + '&item_id',
					method: 'GET',

					success: res => {
						let {
							code,
							data
						} = res.data;
						this.page_no++;
						// 请求成功
						if (code == 200) {
							let list = data;
							this.shopList = this.shopList.concat(list);
							//判断是否还有数据
							this.loadingType = this.shopList.length > 0 ? 'more' : "nomore";
						}
					},
				});
			}
		},
		onLoad() {
			this.loadData();
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #f7f7fa;
	}

	.container {
		height: 100%;
	}
</style>
