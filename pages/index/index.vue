<template>
	<view class="container">
		<!-- 自定义导航栏需要防止内容进入状态栏的区域 -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- 头部 -->
		<view class="header">
			<view class="search" @click="navigateToSearch">
				<text class="flicon icon-fangdajing1"></text>
				<text>点击搜索隐藏优惠</text>
			</view>
			<view class="news">
				<text class="flicon icon-xiaoxi1"></text>
			</view>
		</view>

		<!-- 顶部选项卡 -->
		<scroll-view scroll-x scroll-with-animation class="tab-view" :scroll-left="scrollLeft">
			<view v-for="(item,index) in channelList" :key="index" class="tab-bar-item" :class="[currentTab==index ? 'active' : '']"
			 :data-current="index" @tap.stop="tabClick">
				<text class="tab-bar-title">{{item.desc}}</text>
			</view>
		</scroll-view>

		<!-- 空白区域，防止内容跑进导航栏（因为导航栏透明了）里 -->
		<view class="titleNview-placing"></view>
		<!-- 滚动轮播 -->
		<swiper class="tab-content" :current="currentTab" duration="300" @animationfinish="changeTab">
			<swiper-item class="tab-content" v-for="(itemtab,indextab) in channelList" :key="indextab">

				<!-- 轮播模板频道 -->
				<scroll-view class="scoll-y" scroll-y="true" @scrolltolower="loadData">
					<!-- 首页 -->
					<view class="zonghe" v-if="indextab==0">
						<!-- 头部轮播区域 -->
						<view class="carousel-section">
							<!-- 轮播图 -->
							<swiper class="card-swiper swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
							 :autoplay="true" interval="3000" duration="1000" @change="cardSwiper" indicator-color="#F8F8F8"
							 indicator-active-color="#F8F8F8">
								<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
									<view class="swiper-item">
										<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
										<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
									</view>
								</swiper-item>
							</swiper>
						</view>

						<!-- 功能栏 -->
						<view class="function-bar">
							<view class="function-item" v-for="(itembar,indexbar) in functionList" :key="indexbar" @click="funbarClick(indexbar)">
								<image :src="itembar.imgurl" mode="widthFix"></image>
								<text class="desc">{{itembar.desc}}</text>
							</view>
						</view>
						<!-- 好券直播 -->
						<view class="ticket-list">
							<view class="block">
								<!-- 标题区 -->
								<view class="ticket-title">
									<text class="title flicon">&#xe62d; 领券直播</text>
									<text class="save-num">今日为用户省下8888,8888元</text>
								</view>
							</view>
						</view>
					</view>

					<!-- 其他页功能 -->
					<view class="other">
						<!-- 空白区域，防止内容跑进导航栏（因为导航栏透明了）里 -->
						<!-- 商品列表组件-->
						<shop-news :shopList="itemtab.orderList"></shop-news>
						<!-- 懒加载 -->
						<!-- <uni-load-more status="more"></uni-load-more> -->
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import shopNews from '@/components/shop-news.vue';
	//import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		components: {

			shopNews,
		},
		data() {
			return {
				cardCur: 0,
				ishow: false,
				dotStyle: false,
				scrollLeft: 0,
				currentTab: 0, //预设当前项的值


				//滚动栏频道列表数据
				channelList: [{
						val: "zonghe",
						desc: "综合",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "neiyi",
						desc: "内衣",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "nvzhuang",
						desc: "女装",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "muying",
						desc: "母婴",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "nanzhuang",
						desc: "男装",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "shipin",
						desc: "食品",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "jiajujiazhuang",
						desc: "家居",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "shumajiadian",
						desc: "数码",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "meizhuanggehu",
						desc: "美妆",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "yundonghuwai",
						desc: "运动",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
					{
						val: "xiebaopeishi",
						desc: "鞋包",
						orderList: [],
						loadingType: 'more',
						loaded: false,
						pageNo: 1,
					},
				],
				// 轮播图数据

				circular: true,
				swiperList: [{
						id: 0,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
					},
					{
						id: 0,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
					},
					{
						id: 0,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
					},
				],



				//每次请求数据的数量
				pagesize: 6,

				// 功能栏
				functionList: [{
						url: "/pages/index/funcbar/nine-nine",
						desc: "9.9包邮",
						imgurl: "/static/index/nine.png",
					},
					{
						url: "/pages/index/funcbar/juhuasuan",
						desc: "聚划算",
						imgurl: "/static/index/juhuasuan.png",
					},
					{
						url: "",
						desc: "新人专享",
						imgurl: "/static/index/xinrenzx.png",
					},
					{
						url: "/pages/index/funcbar/tmcs",
						desc: "天猫超市",
						imgurl: "/static/index/tianmao.png",
					},
					{
						url: "",
						desc: "天猫国际",
						imgurl: "/static/index/tianmaoguoji.png",
					},
					{
						url: "/pages/index/funcbar/tblist",
						desc: "淘宝榜单",
						imgurl: "/static/index/home_search_tc_icon_pdd.png",
					},
					{
						url: "/pages/index/funcbar/taoqianggou",
						desc: "淘抢购",
						imgurl: "/static/index/taoqianggou.png",
					},
					{
						url: "",
						desc: "拼多多",
						imgurl: "/static/index/pingdd.png",
					},
					{
						url: "",
						desc: "京东",
						imgurl: "/static/index/jd.png",
					},
					{
						url: "/pages/index/funcbar/highyongjin",
						desc: "高佣金",
						imgurl: "/static/index/high.png",
					},
				],

			}
		},
		//请求页面加载商品
		onReady() {
			// 每次加载初始化数据
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh() {

		},
		onTabItemTap() {
			console.log("dianji")
			this.currentTab = 0;
		},
		methods: {
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			onPulldownReresh() {

			},
			//跳转搜索页面
			navigateToSearch() {
				uni.navigateTo({
					url: '/pages/index/search',
					success: res => {},
				});
			},
			//加载数据
			loadData(source) {
				//获取当前轮播图得索引
				let index = this.currentTab;
				//获取当前轮播面板对象
				let navItem = this.channelList[index];
				if (source == "refresh") {
					navItem.loadingType = 'more';
					navItem.loaded = false;
					navItem.pageNo = 1;
				}
				//检测没有数据
				if (navItem.loadingType === "nomore") {
					return;
				}

				//检测是否是第一次加载，防止重复加载数据
				if (source == "tabChange" && navItem.loaded == true) {
					return
				}
				navItem.loadingType = "loading";
				//获取商品列表
				this.$api.getGood(navItem.val, this.pagesize, navItem.pageNo).then(res => {
					let {
						code,
						data
					} = res.data;
					//请求成功对应序号加一
					navItem.pageNo++;
					//结束下拉
					if (source == "refresh") {
						navItem.orderList = [];
					}
					//请求成功
					if (code == 200) {
						// console.log("请求")
						let shopList = data;

						// 添加新增数据		
						navItem.orderList = navItem.orderList.concat(shopList);
						//请求成功序号增加,并且修改对应得加载状态

						navItem.loaded = true;

						if (this.isPull) {
							this.isPull = false
							this.mescroll.endSuccess();
						}
						//判断是否还有数据
						navItem.loadingType = shopList.length > 0 ? 'more' : "nomore";
					}

				})
			},

			// 滚动切换标签样式
			changeTab(e) {
				this.currentTab = e.detail.current;
				this.loadData('tabChange');
				this.checkCor();
			},

			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				if (this.currentTab > 4 && this.currentTab <= 8) {
					//这里距离按实际计算
					this.scrollLeft += 100
					console.log(this.scrollLeft)

				} else if (this.currentTab > 8) {
					this.scrollLeft = 300

				} else {
					this.scrollLeft = 0
				}
			},

			// 点击标题切换当前页时改变样式
			tabClick(e) {
				let cur = e.currentTarget.dataset.current;
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur
				}
			},

			//轮播图片点击事件
			handleClickPage() {

			},
			//功能栏点击事件
			funbarClick(index) {
				var funcItem = this.functionList[index];
				uni.navigateTo({
					url: funcItem.url,
					success: res => {},
				});
			}
		}
	}
</script>

<style lang="scss">
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.tab-view::before {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.tab-view {
		width: 100%;
		height: 80upx;
		overflow: hidden;
		box-sizing: border-box;
		position: fixed;
		top: 140upx;
		left: 0;
		z-index: 99;
		background: #fff;
		white-space: nowrap;
	}

	.tab-bar-item {
		padding: 0;
		height: 80upx;
		min-width: 70upx;
		line-height: 80upx;
		margin: 0 28upx;
		display: inline-block;
		text-align: center;
		box-sizing: border-box;
	}

	.tab-bar-title {
		height: 80upx;
		line-height: 80upx;
		font-size: 32upx;
		color: #999;
		font-weight: 400;
	}

	.active {
		border-bottom: 6upx solid #5677fc;
	}

	.active .tab-bar-title {
		color: #5677fc !important;
		font-size: 36upx;
		font-weight: bold;
	}

	page {
		height: 100%;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #F8F8F8;
	}

	.top_view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #F8F8F8;
		top: 0;
		z-index: 9;
	}

	.scoll-y {
		height: 82%;
	}

	.container {
		height: 100%;

		.header {
			box-sizing: border-box;
			padding: 0 60upx;
			width: 100%;
			display: flex;
			height: 100upx;
			position: fixed;
			justify-content: space-between;
			background-color: #F8F8F8;
			align-items: center;
			z-index: 9;

			.search {
				color: #5b5b5b;
				width: 90%;
				font-size: $font-base;
				background-color: #d2d2d2;
				padding: 16upx 30upx;
				border-radius: 40upx;

				.flicon {
					padding-right: 20upx;
				}
			}

			.news {
				.flicon {
					font-size: $font-lg+20upx;
				}
			}
		}

		// 设置空白区域防止内容进入导航栏区域
		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 120upx;
			box-sizing: content-box;
		}

		//轮播区域
		.tab-content {
			height: 100%;
		}

		.swiper {}

		//功能栏
		.function-bar {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: -20upx;

			.function-item {
				width: 20%;
				//height: 100upx;
				display: flex;
				margin-top: 20upx;
				flex-direction: column;
				align-items: center;
				font-size: $font-base;
				color: #757575;
				margin-bottom: 10upx;

				image {
					width: 100upx;
					height: 100upx;
				}

				.desc {
					margin-top: 20upx;
				}
			}
		}

		// 好券直播
		.ticket-list {
			margin-top: 50upx;

			.ticket-title {
				.save-num {
					color: #757575;
					font-size: 20upx;
					float: right;
					padding-right: 30upx;
					font-weight: 500;
				}
			}
		}

		// 每一个块级标题的样式
		.block {
			background-color: #fff;
			height: 100upx;
			line-height: 100upx;

			.title {

				padding: 0 20upx;
				font-size: 34upx;
				font-weight: bold;
				color: #e74b45;
			}
		}
	}
</style>
