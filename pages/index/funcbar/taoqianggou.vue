<template>
	<!-- 淘抢购 -->
	<view class="container">
		<Nav @getType="getType"></Nav>
		<!-- nav空白区域 -->
		<view class="nav-space">

		</view>
		<seizeSeat type='empty' v-if="shopList.length==0"></seizeSeat>
		<view :class="toggle?'no-show':''">
			<ShopListOne :userlevel="userlevel"  :shopList="shopList"></ShopListOne>
		</view>
		<view :class="!toggle?'no-show':''">
				<ShopListTwo  :shopList="shopList"></ShopListTwo>
		</view>
	<tui-scroll-top :scrollTop="scrollTop"></tui-scroll-top>
		<uniLoadMore :status="loadingType"></uniLoadMore>
	</view>
</template>

<script>
	import seizeSeat from '@/components/seize-seat.vue'
	import Nav from "@/components/nav.vue";
	import ShopListOne from "@/components/shop-news.vue";  //单列
	import ShopListTwo from "@/components/shop-two.vue";//双列
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
	import tuiScrollTop from "@/components/scroll-top/scroll-top.vue";
	export default {
		data() {
			return {
				pagesize:20,
				pageno:1,
				sort:"new",
				shopList:[],
				toggle:true, //单双列
				loadingType:"more",
				data:{},//子组件传回的数据
				userlevel:{},
				scrollTop: 0
			}
		},
		components: {
			Nav,
			ShopListOne,
			ShopListTwo,
			uniLoadMore,tuiScrollTop,seizeSeat
		},
		methods: {
			
			//获取导航栏点击的类型
			getType(data) {
				//单双列改变并保存状态
				if(data.ischange){
					 this.data.toggle=data.toggle;
					 this.toggle=data.toggle;		
					return
				}
				if (this.loadingType === "nomore") {
					return;
				}
				//如果不是加载操作就重置,clear为true加载
				if(!data.clear || this.data.refresh){
					this.shopList=[];
					this.pageno=1;
					this.loadingType="more";
				}
				this.loadingType = "loading";
				//没有传值就默认为初始状态
				// if(!type){
				// 	type="new";
				// }
				console.log(data)
				//刷新成功
				this.data.refresh=false;
				uni.stopPullDownRefresh();
				this.data=data;
				this.toggle=data.toggle;
				this.$api.HotPurchase(this.pagesize, this.pageno, data.type).then(res => {
					let {status,content}=res.data;
					this.pageno++;
					if(status==200){
						let list = content;
						this.shopList=this.shopList.concat(list);
						//判断是否还有数据
						this.loadingType = list.length == this.pagesize ? 'more' : "nomore";
					}
					
				})
			}
		},
		onLoad() {
			this.getType({type:"new",toggle:this.toggle});
		},
		onPullDownRefresh() {
			this.data.refresh=true;
			this.getType(this.data);
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
			
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: $page-color-base;
	}

	.container {
		height: 100%;

		.nav-space {
			width: 100%;
			height: 80upx;
		}
	}
	.no-show{
		display: none;
	}
</style>
