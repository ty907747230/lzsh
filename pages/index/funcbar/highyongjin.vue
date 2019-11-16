<template>
	<view class="container">
		<!-- 商品列表 -->
		<high-shop :shopList="shopList"></high-shop>
		<seizeSeat type='empty' v-if="shopList.length==0"></seizeSeat>
		<tui-scroll-top :scrollTop="scrollTop"></tui-scroll-top>
		<!-- 懒加载 -->
		<uni-load-more :status="loadingType"></uni-load-more>
		
	</view>
</template>

<script>
	
	import seizeSeat from '@/components/seize-seat.vue'
	import highShop from '@/components/high-shop.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import tuiScrollTop from "@/components/scroll-top/scroll-top.vue";
	export default {
		data() {
			return {
				shopList: [],
				pageno: 1,
				loadingType: "more",
				scrollTop: 0
			}
		},
		components: {
			highShop,
			uniLoadMore,
			tuiScrollTop,
			seizeSeat
		},
		methods: {
			loadData(source) {
				//刷新
				if(source=="refresh"){
					this.shopList=[];
					this.pageno=1;
					this.loadingType="more";
				}
				if (this.loadingType === "nomore") {
					return;
				}
				this.loadingType = "loading";
				uni.stopPullDownRefresh();
				this.$api.HighCommission(this.pageno, 12).then(res => {
					let {
						status,
						content
					} = res.data;
					this.pageno++;
					// 请求成功
					if (status == 200) {
						let list = content;
						this.shopList = this.shopList.concat(list);
						//判断是否还有数据
						this.loadingType = this.shopList.length > 0 ? 'more' : "nomore";
					}
				})
			}
		},
		onLoad() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.loadData("refresh")
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		onPageScroll(e) {
			// console.log(e)
			this.scrollTop = e.scrollTop
			
		}
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
