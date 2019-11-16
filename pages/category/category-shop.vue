<template>
	<!-- 分类详情 -->
	<view class="container">
		<Nav @getType="getType"></Nav>
		<!-- nav空白区域 -->
		<view class="nav-space">

		</view>
		<view class="cu-load load-modal" v-if="isSuccess">
			<!-- <view class="cuIcon-emojifill text-orange"></view> -->
			<image src="/static/login/logo-liziduo.jpg" mode="aspectFit"></image>
			<view class="gray-text">加载中...</view>
		</view>
		<view class="" v-if="!isSuccess">
			<view :class="toggle?'no-show':''">
				<ShopListOne :userlevel="userlevel"  :shopList="shopList"></ShopListOne>
			</view>
			<view :class="!toggle?'no-show':''">
					<ShopListTwo  :shopList="shopList"></ShopListTwo>
			</view>
			<uniLoadMore :status="loadingType"></uniLoadMore>
			<tui-scroll-top :scrollTop="scrollTop"></tui-scroll-top>
		</view>
	</view>
</template>

<script>
	import Nav from "@/components/nav-c.vue";
	import ShopListOne from "@/components/shop-news.vue";  //单列
	import ShopListTwo from "@/components/shop-two.vue";//双列
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
import tuiScrollTop from "@/components/scroll-top/scroll-top.vue";
	export default {
		data() {
			return {
				isSuccess:true,
				
				pageno:1,
				sort:"new",
				shopList:[],
				toggle:true, //单双列
				loadingType:"more",
				data:{},//子组件传回的数据
				cid:"",  //传入参数
				q:"", //传入参数
				userlevel:{},
				scrollTop:0
			}
		},
		components: {
			Nav,
			ShopListOne,
			ShopListTwo,
			uniLoadMore,
			tuiScrollTop
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			//获取导航栏点击的类型
			getType(data) {
				console.log(data)
				//单双列改变并保存状态
				if(data.ischange){
					 this.data.toggle=data.toggle;
					 this.toggle=data.toggle;		
					return
				}
				//如果不是加载操作就重置
				if(!data.clear || this.data.refresh){
					this.shopList=[];
					this.pageno=1;
					this.loadingType="more";
				}
				if (this.loadingType === "nomore") {
					return;
				}
				
				this.loadingType = "loading";
				//刷新成功
				this.data.refresh=false;
				uni.stopPullDownRefresh();
				this.data=data;
				this.toggle=data.toggle;
			console.log(data.type, this.pageno,this.q)
				this.$api.classify_search(data.type, this.pageno,this.q).then(res => {
					let {code,data}=res.data;
					this.pageno++;
					if(code==1){
						let list = data;
						this.shopList=this.shopList.concat(list);
						console.log( list.length)
						//判断是否还有数据
						this.loadingType = list.length ==10? 'more' : "nomore";	
					}
					else{
						this.loadingType ="nomore";	
					}
					this.isSuccess=false;
				})
			}
		},
		onPullDownRefresh() {
			this.data.refresh=true;
			this.getType(this.data);
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title:option.q
			})
			this.q=option.q;
			
			this.getType({type:0,toggle:this.toggle});
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
