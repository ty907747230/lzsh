<template>
	<!-- 我的团队 -->
	<view class="container">
		<!-- 您的推荐人 -->
		<view class="tuijian">
			<!-- 标题 -->
			<view class="tuijian-title title">
				<text>您的推荐人</text>
			</view>
			<view class="tuijian-content content">
				<view class="touxiang">
					<image :src="info.headimgurl" mode="widthFix"></image>
				</view>
				<view class="xinxi">
					<view class="xinxi-top">
						<text class="mingzi">{{info.name}}</text>
						<image v-if="info.level==2" class="user-level" src="/static/huiyuan/level-3.png" mode="widthFix"></image>
						<image v-if="info.level==1" class="user-level" src="/static/huiyuan/level-2.png" mode="widthFix"></image>
						<image v-if="info.level==0" class="user-level" src="/static/huiyuan/level-1.png" mode="widthFix"></image>
						
						
					</view>
					<text v-if="info.wechat_num" @click="copyName(info.wechat_num)" class="phone">微信号: {{info.wechat_num}}</text>
				</view>
			</view>
		</view>

		<!-- 我的团队 -->
		<view class="myteam">
			<!-- 标题 -->
			<view class="myteam-title title ">
				<text>我的团队</text>
				<text class="num">共有荔枝粉<text class="total-num">{{count}}</text>人</text>
			</view>
			<view class="myteam-content">
				<view class="myteam-content-title">
					<view class="myteam-content-item" :class="index==currentItem?'active':''" v-for="(item,index) in navlist" :key="index"
					 @click="clickNav(index)">
						{{item.val}}
					</view>
					<!-- <text class="intodata">加入时间</text> -->
				</view>
				<view class="myteam-content-content" v-if="index==currentItem" v-for="(item,index) in navlist" :key="index">
					<scroll-view scroll-y class="list-scroll-content" @scrolltolower="loadData">
						<view class="contenlist-item" v-for="(items,indexs) in navlist[currentItem].orderList" :key="indexs">
							<image :src="items.headimgurl" mode="widthFix"></image>
							<text>{{items.name}}</text>
							<text>{{items.ctime}}</text>
						</view>
						<uni-load-more :status="item.loadingType"></uni-load-more>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				count: 0,
				info: "",
				token: "",
				currentItem: 0,
				navlist: [{
						val: "全部",
						type: "all_user",
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
						count:0
					},
					{
						val: "直邀",
						type: "direct_invite",
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
						count:0
					},
					{
						val: "间邀",
						type: "indirect_invite",
						pageNo: 1,
						orderList: [],
						loadingType: 'more',
						loaded: false,
						count:0
					}
				]
			}
		},
		onLoad(option) {
			this.token = this.$store.state.user.token;
			console.log(this.token)
			this.loadData();
		},
		onPullDownRefresh() {
			this.loadData("refresh");
		},
		methods: {
			//复制名字
			copyName(data){
				uni.setClipboardData({
					data:data,
					success: () => {
						this.$msg("复制成功")
					}
				})
			},
			// nav点击事件
			clickNav(index) {
				console.log(index)
				this.currentItem = index;
				this.loadData("tabChange");
			},
			loadData(source) {
				
				var navItem = this.navlist[this.currentItem];
				//如果是类型变换,重置数据
				if (source == "refresh") {
					navItem.loadingType = 'more';
					navItem.loaded = false;
					navItem.pageNo = 1;
					navItem.orderList=[];
					uni.stopPullDownRefresh();
				}
				this.count=navItem.count
				//检测没有数据
				if (navItem.loadingType === "nomore") {
					
					return;
				}
				//检测是否是第一次加载，防止重复加载数据
				if (source == "tabChange" && navItem.loaded == true) {
					
					return
				}
				navItem.loadingType = "loading";
				console.log(navItem.type)
				this.$api.MyTeam(this.token, navItem.type, navItem.pageNo, 10).then(res => {
					
					
					console.log(this.token, navItem.type, navItem.pageNo)
					console.log(res)
					let {
						code,
						data
					} = res.data;
					//请求成功对应序号加一
					navItem.pageNo++;

					//请求成功
					if (code == 2000) {
						console.log(res)
						navItem.count = data.team_info.count_info.count;
						this.count=navItem.count
						let shopList = data.team_info.user_data;
						this.info = data.invite_me;
						// 添加新增数据		
						navItem.orderList = navItem.orderList.concat(shopList);
						console.log(navItem.orderList)
						//请求成功序号增加,并且修改对应得加载状态
						navItem.loaded = true;

						//判断是否还有数据
						navItem.loadingType = data.team_info.page_info.has_next ? 'more' : "nomore";
					}
					else if(code == 2001){
						navItem.loadingType ="nomore";
					}
					//token过期
					else {
						uni.switchTab({
							url: "/pages/user/user"
						})
						this.$store.commit("clearToken");
						uni.showToast({
							title: "你已在其他客户端登录，请重新登录",
							duration: 2000,
							icon: "none"
						})
					}
				}).catch(
					res => {
						
						uni.stopPullDownRefresh();
						this.$msg("荔枝开小差了，请联系客服")
					}
				)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
		height: 98%;
	}
	.list-scroll-content{
		height: 100%;
	}
	.container {
		padding: 0 16upx;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		justify-content: space-between;
		.tuijian {
			height: 18%;
			// margin-bottom: 10upx;
			.title {
				border-left: 6upx solid #f00;
				padding-left: 20upx;
				font-weight: bold;
				font-size: $font-lg;
				margin: 20upx 0;
				margin-bottom: 10upx;
			}
			
			.content {
				display: flex;
				align-items: center;
				border-radius: 10upx;
				padding: 20upx;
				background-color: #fff;
				.xinxi {
					padding: 10upx 0;
					display: flex;
					flex-direction: column;
					font-size: $font-base;
					justify-content: space-between;
					.xinxi-top {
						margin-bottom: 20upx;
						display: flex;
						align-items: center;
						.user-level{
							width: 160upx;
							height: 40upx;
							margin-left: 20upx;
						}
						.flicon {
							color: #bb9574;
							font-size: $font-sm;
							padding: 6upx 20upx;
							border-radius: 26upx;
							background-color: #434343;
							margin-left: 20upx;
						}
					}
					.phone{
						overflow: hidden;
						max-width: 500upx;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			
			}
			.tuijian-content {
				display: flex;
				
				.touxiang {
					width: 100upx;
					height: 100upx;
					border-radius: 100upx;
					background-color: #4bbae3;
					margin-right: 30upx;
					overflow: hidden;
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.myteam {
			border-radius: 10upx;
			padding: 10upx 10upx 0upx;
			height: 80%;
			background-color: #FFFFFF;
			overflow: hidden;
			.title {
				border-left: 6upx solid #f00;
				padding-left: 20upx;
				font-weight: bold;
				font-size: $font-lg;
				margin: 20upx 0;
			}
			.myteam-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.num {
					font-size: $font-sm;

					.total-num {
						font-size: $font-base;
						color: #f00;
					}
				}
			}

			.myteam-content {
				background-color: #fff;
				height: 100%;
				width: 100%;
				border-radius: 16upx;
				.myteam-content-content{
					height: 84%;
					overflow: hidden;
				}
				.myteam-content-title {
					width: 90%;
					margin: 0 auto;
					display: flex;
					height: 80upx;
					align-items: center;
					border-bottom: #f8f8f8 solid 1upx;

					.myteam-content-item {
						padding: 10upx 30upx;
						flex: 1;
						text-align: center;
					}

					.intodata {
						font-size: $font-sm;
						width: 120upx;
					}

					.active {
						color: #f00;
					}
				}

				.contenlist-item {
					padding: 0 10upx;
					background-color: #fbfbfb;
					margin-bottom: 10upx;
					font-size: $font-base;
					height: 100upx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					image {
						height: 80upx;
						width: 80upx;
						border-radius: 80upx;
						overflow: hidden;
					}
				}
			}
		}
	}
</style>
