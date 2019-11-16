<template>
	<view class="container">
		<!-- 滚动栏 -->
		<scroll-view class="cid-list">
			<view class="scoll-wrapper">
				<view @click="tabClick(cidindex)" class="cid-list-item" :class="{activecid:cidindex==tabCurrentIndex}" :key="cidindex"
				 v-for="(ciditem,cidindex) in cidList">
					<text>{{ciditem.desc}}</text>
				</view>
			</view>
		</scroll-view>
		<!-- 空白区域 -->
		<view class="white-place"></view>
		<!-- 滚动轮播 -->
		<swiper :current="tabCurrentIndex" @animationfinish="changeTab" duration="300" class="swiper-box">
			<swiper-item :key="tabindex" class="tab-content" v-for="(tabitem,tabindex) in cidList">
				<!-- 滚动商品列表 -->
				<scroll-view scroll-y class="list-scroll-content" @scrolltolower="loadData">
					<shop-two :shopList="tabitem.orderList"></shop-two>
					<uni-load-more :status="tabitem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import shopTwo from "@/components/shop-two.vue";
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
	export default {
		data() {
			return {
				//商品类目列表
				cidList:[
					{
											desc: "精选好货",
											loaded: false,
											loadingType: "more",
											orderList: [],
											pageNo: 1,
											lowprice:0,
											highprice:9.9,
											sort:"sale_num_desc",
										},
										{
											desc: "3.9元区",
											loaded: false,
											loadingType: "more",
											orderList: [],
											pageNo: 1,
											lowprice:0,
											highprice:3.9
										},
										{
											desc: "6.9元区",
											loaded: false,
											loadingType: "more",
											orderList: [],
											pageNo: 1,
											lowprice:3.9,
											highprice:6.9
										},
										{
											desc: "19.9元区",
											loaded: false,
											loadingType: "more",
											orderList: [],
											pageNo: 1,
											lowprice:6.9,
											highprice:19.9
										},
					
				],
				//商品类目列表
// 				cidList: [{
// 						desc: "母婴",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 3,
// 					},
// 					{
// 						desc: "食品",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 4,
// 					},
// 					{
// 						desc: "女装",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 5,
// 					},
// 
// 					{
// 						desc: "彩妆",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 6,
// 					},
// 					{
// 						desc: "洗护",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 7,
// 					},
// 					{
// 						desc: "内衣",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 8,
// 					},
// 					{
// 						desc: "男装",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 9,
// 					},
// 					{
// 						desc: "百货",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 10,
// 					},
// 					{
// 						desc: "家电",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 11,
// 					},
// 					{
// 						desc: "家居",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 12,
// 					},
// 					{
// 						desc: "数码",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 13,
// 					},
// 					{
// 						desc: "车品",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 14,
// 					},
// 					{
// 						desc: "鞋子",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 15,
// 					},
// 
// 					{
// 						desc: "箱包",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 16,
// 					},
// 
// 					{
// 						desc: "其他",
// 						loaded: false,
// 						loadingType: "more",
// 						orderList: [],
// 						pageNo: 1,
// 						cat: 17,
// 					}
// 				],
				tabCurrentIndex: 0, //tab当前选中得索引	
			};
		},
		components: {
			uniLoadMore,
			shopTwo
		},
		methods: {
			//加载数据
			loadData(source) {
				let cidItem = this.cidList[this.tabCurrentIndex]
				//检测是否还有更多数据
				if (cidItem.loadingType == 'nomore') {
					return;
				}
				//防止相同类型下重复加载
				if (source == 'tabChange' && cidItem.loaded == true) {
					return;
				}
				cidItem.loadingType = "loading";
				
				this.$api.NineShop(20, cidItem.pageNo, cidItem.lowprice,cidItem.highprice,cidItem.sort).then(res => {
					let {
						content,
						status
					} = res.data;
					cidItem.loaded = true;
					//请求成功对应序号加一
					cidItem.pageNo++;
					if (status == 200) {
						let shopList = content;
						cidItem.orderList = cidItem.orderList.concat(shopList);


						//判断是否还有数据
						cidItem.loadingType = shopList.length > 0 ? 'more' : 'nomore';

					} else {
						//请求失败无更多数据
						cidItem.loadingType = 'nomore';
					}
				});
				// 				uni.request({
				// 					url: 'http://api.tbk.dingdanxia.com/spk/top?apikey=VNyxX3uZHc1WPAf62tVTfuB6dDESZS7f&sale_type=' + this.typeCurrent +
				// 						'&cid='+this.tabCurrentIndex+'&back=10&min_id=' + cidItem.pageNo,
				// 					method: 'GET',
				// 					success: res => {
				// 						let {
				// 							data,
				// 							code
				// 						} = res.data;
				// 						cidItem.loaded=true;
				// 						//请求成功对应序号加一
				// 						cidItem.pageNo++;
				// 						if (code == 200) {
				// 							let shopList = data;
				// 							cidItem.orderList = cidItem.orderList.concat(shopList);
				// 
				// 							
				// 							//判断是否还有数据
				// 							cidItem.loadingType = shopList.length > 0 ? 'more' : 'nomore';
				// 							
				// 						}
				// 						else{
				// 							//请求失败无更多数据
				// 							cidItem.loadingType = 'nomore';
				// 						}
				// 					},
				// 				});
			},

			//滚动栏切换按钮
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//轮播图滚动
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			}
		},
		onLoad() {
			this.loadData();
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $page-color-base;
		height: 100%;
	}

	.container {
		height: 100%;

		// 滚动栏
		.cid-list {
			background-color: #fff;
			white-space: nowrap;
			position: fixed;
			z-index: 1;

			.scoll-wrapper {
				display: flex;
				justify-content: space-between;
				padding: 20upx 20upx 10upx;

				.cid-list-item {
					font-size: $font-sm;
					// width: 180upx;
					padding: 16upx 20upx;
				}

				.activecid {
					// font-size: $font-lg;
					color: #ff6621;
					border-bottom: #ff6621 4upx solid;
				}

			}
		}

		.white-place {
			height: 80upx;
			width: 100%;
		}

		.swiper-box {
			height: 100%;
		}

		.list-scroll-content {
			height: 100%;
		}
	}
</style>
