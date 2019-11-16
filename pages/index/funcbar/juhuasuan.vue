<template>
	<!-- 聚划算 -->
	<view class="container">
		<Nav @getType="getType"></Nav>
		<!-- nav空白区域 -->
		<view class="nav-space">
		<tui-scroll-top :scrollTop="scrollTop"></tui-scroll-top>
		</view>
		<seizeSeat type='empty' v-if="shopList.length==0"></seizeSeat>
		<view :class="toggle?'no-show':''">
			<ShopListOne  :shopList="shopList" :userlevel="userlevel"></ShopListOne>
		</view>
		<view :class="!toggle?'no-show':''">
			<ShopListTwo :shopList="shopList" :userlevel="userlevel"></ShopListTwo>
		</view>
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
				pagesize:10,
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
			uniLoadMore,
			tuiScrollTop,
			seizeSeat
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
				//刷新成功
				this.data.refresh=false;
				uni.stopPullDownRefresh();
				this.data=data;
				this.toggle=data.toggle;
				this.$api.JuCheap(this.pagesize, this.pageno, data.type).then(res => {
					let {status,content}=res.data;
					this.pageno++;
					if(status==200){
						let list = content;
						this.shopList=this.shopList.concat(list);
						console.log(list[0])
						//判断是否还有数据
						this.loadingType = list.length == this.pagesize ? 'more' : "nomore";
					}
				})
			}
		},
		onLoad() {
			this.getType({type:"new",toggle:this.toggle});
		},
		onPageScroll(e) {
			// console.log(e)
			this.scrollTop = e.scrollTop
			
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
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
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