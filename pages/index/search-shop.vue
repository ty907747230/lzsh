<template>
	<view class="container">
		<!-- 自定义导航栏需要防止内容进入状态栏的区域 -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- 头部 -->
		<view class="header">
			<view class="toback" @click="navigateToIndex">
				<text class="flicon">&#xe653;</text>
			</view>
			<view class="search">
				<input class="search-input" v-model="keywords" @confirm="handleSearch" confirm-type="search" placeholder="输入你要搜索的宝贝" />
				<!-- <text>立即搜索商品获取隐藏优惠券</text> -->
				<text v-show="keywords?true:false" @click="handleClear" class="flicon">&#xe615;</text>
			</view>
			<view class="search-btn" @click="handleSearch">
				<text class="search-btn-w">搜索</text>
			</view>
		</view>

		<!-- 空白区域，防止内容跑进导航栏（因为导航栏透明了）里 -->
		<view class="titleNview-placing"></view>
		<!-- 导航栏 -->
		<Nav @getType="getType"></Nav>

		<!-- nav空白区域 -->
		<view class="nav-space">

		</view>

		<!-- 是否有券 -->
		<view class="isyouquan">
			<view class="isyouquan-left">
				<text class="flicon">&#xe62e;</text>
				<text>是否筛选优惠券商品</text>
			</view>
			<switch @change="switchChange" style="transform:scale(0.7)" />
		</view>
		<!-- nav空白区域 -->
		<view class="nav-space">
		</view>
		
		<view :class="toggle?'no-show':''">
			<ShopListOne  :shopList="shopList" :userlevel="userlevel"></ShopListOne>
		</view>
		<view :class="!toggle?'no-show':''">
			<ShopListTwo :shopList="shopList" :userlevel="userlevel"></ShopListTwo>
		</view>
		<uniLoadMore v-if="!(loadingType=='nomore'&&shopList.length==0)" :status="loadingType"></uniLoadMore>
		<tui-scroll-top :scrollTop="scrollTop"></tui-scroll-top>
		<seizeSeat :typeimg='emptyType' @loadDataAgain='getType' v-if="loadingType=='nomore'&&shopList.length==0"></seizeSeat>

	</view>
</template>

<script>
	import seizeSeat from '@/components/seize-seat.vue'
	import Nav from "@/components/nav.vue";
	import ShopListOne from "@/components/shop-news.vue"; //单列
	import ShopListTwo from "@/components/shop-two.vue"; //双列
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
	import tuiScrollTop from "@/components/scroll-top/scroll-top.vue";
	export default {
		data() {
			return {
				pagesize: 12,
				pageno: 1,
				sort: "new",
				shopList: [],
				toggle: true, //单双列
				loadingType: "more",
				data: {}, //子组件传回的数据
				keywords: "", //查询关键字
				youquan: 2, //是否有券
				userlevel:{},
				cursor:0,
				scrollTop: 0,
				emptyType:''
			}
		},
		components: {
			Nav,
			ShopListOne,
			ShopListTwo,
			uniLoadMore,
			tuiScrollTop,
			seizeSeat
		},
		onLoad(option) {
			if (option.keywords) {
				this.keywords = option.keywords;
				this.getType({
					// type: "new",
					toggle: this.toggle
				});
			}
		},
		//上拉加载
		onReachBottom() {
			this.data.clear=true;
			this.getType(this.data);
		},
		onShow() {
			console.log(this.$store.state.userlevel)
			this.userlevel = this.$store.state.userlevel;
		},
		onPageScroll(e) {
			// console.log(e)
			this.scrollTop = e.scrollTop
			
		},
		methods: {
			handlefocus(index){
				this.cursor=index
			},
			//搜索按钮
			handleSearch() {
				console.log(1)
				if(!this.keywords){
					this.$msg("请输入关键字");
					return;
				}
				
				this.getType({
					toggle: this.toggle,
					clear:false
				});
			},
			//清空导航栏
			handleClear() {
				this.keywords = "";
			},
			//跳转到首页
			navigateToIndex() {
				uni.navigateBack({});
			},
			switchChange(e) {
				console.log(e.target.value)
				if (e.target.value) {
					this.youquan = 1;
				} else {
					this.youquan = 2;
				}
				this.getType({
					type: this.data.type,
					toggle: this.toggle
				});
			},
			//获取导航栏点击的类型
			getType(data) {
				if(!data){
					data={
					type: 0,
					toggle: this.toggle
				}
				}
				if (!this.keywords) {
					this.$msg("请输入关键字");
					return;
				}
				//单双列改变并保存状态
				if(data.ischange){
					 this.data.toggle=data.toggle;
					 this.toggle=data.toggle;		
					return
				}
				
				//如果不是加载操作就重置,false为重置
				if (!data.clear) {
					this.shopList = [];
					this.pageno = 1;
					this.loadingType='more'
				}
				if (this.loadingType === "nomore") {
					return;
				}
				this.loadingType = "loading";
				//没有传值就默认为初始状态
				if (!data.type) {
					data.type = "new";
				}
				console.log(data)
				this.data = data;
				//单双列切换
				this.toggle = data.toggle;
				if(this.data.ischange){
					return
				}
				this.$api.SearchCoupons(this.pageno, this.pagesize, data.type, this.keywords, this.youquan).then(res => {
					console.log(this.pageno, this.pagesize, data.type, this.keywords, this.youquan)
					let {
						status,
						content
					} = res.data;
					this.pageno++;
					if (status == 200) {
						let list = content;
						
						this.shopList = this.shopList.concat(list);
						
						//判断是否还有数据
						this.loadingType = list.length == this.pagesize ? 'more' : "nomore";
						if(this.shopList.length==0){
							this.emptyType='notpopular'
						}
					}
				}).catch(res=>{
					this.loadingType = "nomore";
					console.log('断网')
					this.emptyType='nodata'
				})
			}
		}
	}
</script>

<style lang="scss">
	.no-show{
		display: none;
	}
	page {
		background-color: $page-color-base;
		height: 100%;
	}

	.container {
		height: 100%;

		.nav-space {
			width: 100%;
			height: 80upx;
		}
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
		z-index: 999;
	}


	.header {
		box-sizing: border-box;
		padding: 60upx 20upx 60upx;
		width: 100%;
		display: flex;
		height: 100upx;
		position: fixed;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1upx solid #eee;
		align-items: center;
		z-index: 9;
		font-size: $font-base;
		color: #5b5b5b;

		.toback {
			flex: 1;
			margin-right: 10upx;
			.flicon {
				font-size: $font-lg+10upx;
			}
		}

		.search {
			width: 76%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #ededed;
			padding: 6upx 0 6upx 20upx;
			border-radius: 40upx;
			.search-input{
				flex: 1;
			}
			.flicon {
				width: 80upx;
				text-align: center;
				padding-right: 20upx;
			}
		}

		.search-btn {
			width: 16%;		
			height: 50upx;
			// padding-top: 6upx;
			box-sizing: border-box;
			font-size: $font-base;
			background-color: #ff3300;
			border-radius: 50upx;
			margin-left: 20upx;
			color: #fff;
			.search-btn-w{
				height: 50upx;
				// background-color: #000000;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.titleNview-placing {
		height: 110upx;
		// padding-top: 70upx;
		box-sizing: content-box;
	}


	.nav-space {
		width: 100%;
		height: 80upx;
	}

	.isyouquan {
		z-index: 9;
		height: 80upx;
		line-height: 80upx;
		position: fixed;
		display: flex;
		width: 100%;
		justify-content: space-between;
		// border-top: 1px solid #ededed;
		background-color: #fff;

		.isyouquan-left {
			margin-left: 20upx;
			font-size: $font-lg;
			color: #5f5e5e;

			.flicon {
				margin-right: 20upx;
				font-size: $font-lg+10upx;
			}
		}
	}
</style>
