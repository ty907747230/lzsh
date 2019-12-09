<!-- 商品详情组件 -->
<template>
	<view class="container">
		<!--加载框 start-->
		<tui-loading :visible="isSuccess"></tui-loading>
		<seizeSeat :typeimg='emptyType' @loadDataAgain='loadData' v-if="!isSuccess&&!goods.goods_id"></seizeSeat>
		<view class="" v-show="!isSuccess&&goods.goods_id">
			<!-- 轮播图 -->
			<view class="carousel">
				<swiper indicator-dots circular="true" autoplay="true" duration="400">
					<swiper-item class="swiper-item" v-for="(item,index) in goods.picurls" :key="index">
						<view class="image-wrapper">
							<image mode="aspectFill" class="loaded" :src="item"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 商品内容 -->
			<view class="like-shop-content">
				<!-- 头部价格 -->
				<view class="good-tips">
					<view class="shop-price">
						券后 ￥<text class="price-num">{{goods.price_after}}</text>
					</view>
					<text>原价<text class="ago-price">￥{{goods.price_pg}}</text></text>
					<text>已售{{yishou(goods.sales)}}件</text>
				</view>
				<view class="shop-title" @longpress="copyTitle(goods.goods_short_name)">
					<!-- <image mode="aspectFit" src="/static/icons/pdd.jpg"></image> -->
					<span class="p-type">拼多多</span>
					<span class="title">{{goods.goods_short_name}}</span>
				</view>
				<!-- 升级 -->
				<view class="upgrade"  v-if="userlevel.on_off" @click="update">
					<view class="upgrade-left">
						<text class="xiadan">下单返<text>￥{{(goods.commission*userlevel.level_percent).toFixed(2)}}</text></text>
						<text v-if="!(userlevel.level==2||userlevel.level==3)">升级<text>{{userlevel.level==0?'合伙人':'运营董事'}}可返</text><text class="price">￥{{(goods.commission*userlevel.next_level_percent).toFixed(2)}}</text></text>
						<text v-if="userlevel.level==2">尊享荔枝金卡特权</text>
						<text v-if="userlevel.level==3">尊享联合创始人特权</text>
					</view>
					<text v-if="!(userlevel.level==2||userlevel.level==3)" class="flicon">立即升级 &#xe6ec;</text>
					<text class="top flicon" v-if="userlevel.level==2">运营董事 &#xe6ec;</text>
					<text class="top flicon" v-if="userlevel.level==3">联合创始人 &#xe6ec;</text>
				</view>
				<!-- 优惠券 -->
				<view class="shop-ticket" @click="toJD">
					<view class="left">
						<text class="ticket-size">优惠券: {{goods.discount}} 元</text>
						<!-- <text class="ticket-time"> 使用期限: {{goods.coupon_start_time}} 至 {{goods.coupon_end_time}}</text> -->
					</view>
					<view class="right">
						<text v-if="!(goods.discount==0)">立即领取</text>
						<text v-if="goods.discount==0">立即购买</text>
					</view>
				</view>

			</view>

			<!-- 宝贝详情 -->
			<view class="baby-detail" @click="babyClick">
				<view class="baby">
					<text>查看宝贝详情</text>
					<text v-show="isShow" class="flicon">&#xe602;</text>
					<text v-show="!isShow" class="flicon">&#xe6ec;</text>
				</view>
				<image v-if="isShow" mode="widthFix" class="baby-img" :src="goods.picurl" :key="index"></image>
			</view>

			<!-- 底部tab栏 -->
			<view class="footer">
				<!-- 底部操作菜单 -->
				<view class="page-bottom">
					<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
						<text class="flicon">&#xe638;
						</text>
						<text>首页</text>
					</navigator>
					<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
						<text v-if="!favorite" class="flicon">&#xe640;</text>
						<text v-if="favorite" class="flicon">&#xe61a;</text>
						<text>收藏</text>
					</view>

					<view class="action-btn-group">

						<view @click="sharePdd(goods.goods_desc,goods.price_pg,goods.price_after)" class="share">
							<!-- <view @click="totbweb" class="share"> -->
							<text class="flicon">&#xe620;</text>
							<text>分享</text></view>
						<view class="getticket" @click="toJD">
							<text class="flicon">&#xe66e;</text>
							<text v-if="!(goods.discount==0)">领券</text>
							<text v-if="(goods.discount==0)">购买</text>
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import seizeSeat from '@/components/seize-seat.vue'
	import shopNews from "../../components/shop-news.vue";
	import tuiLoading from "@/components/loading/loading";
	export default {
		data() {
			return {
				couponurl: "",
				//商品信息
				goods: {},
				//轮播图片
				carouselimg: [],
				//宝贝图片是否显示
				isShow: false,
				//猜你喜欢是否显示
				isLikeShow: true,
				//商品的优惠券信息
				shopTicket: "",
				//猜你喜欢商品列表
				shopList: [],
				//加载更多状态
				loadingType: "more",
				//序号
				//商品ID
				shopId: "",
				//商品类目ID
				categoryId: "",
				//收藏
				favorite: false,
				//页面是否加载完毕
				isSuccess: true,
				//是否授权
				isAuth: false,
				//是否失败授权窗口
				isTwo: false,
				userlevel: {}, //用户等级信息
				pdd_id: "",
				// iosisshow:false,
				emptyType:''
			}
		},
		components: {
			shopNews,
			tuiLoading,
			seizeSeat
		},
		methods: {
			sharePdd(desc,jdPrice,jdAprice){
				//转链
				this.$api.pdd_union_url(this.shopId, this.pdd_id).then(res=>{
					let{data,status_code}=res.data;
					console.log(data);
					if(status_code==200){
						
						var str=desc+'\n'+'拼多多价: '+jdPrice+'元\n'+'内购价: '+jdAprice+'元\n'+'入口: '+data.alldata.mobile_short_url;
						console.log(str);
						uni.setClipboardData({
							data:str,
							success:()=>{
								uni.showToast({
									title:'复制导语成功',
									icon:'none'
								})
							}
						})
					}else{
						this.$msg("转链失败，请联系客服")
					}
					uni.hideLoading()
				}).catch(()=>{
					uni.hideLoading();
					this.$msg("荔枝开小差了，请联系客服")
				})
				
			},
			//添加足迹
			AddMyTracks() {
				if (!this.$store.state.user.token) {
					return
				}
				
				this.$api.AddMyTracks(this.$store.state.user.token, this.shopId, this.goods.picurl, this.goods.goods_name, this.goods.price_after,3, this.goods.commission, this.goods.price_pg, this.goods.discount, this.goods.sales).then((res) => {
					console.log(res);
				})
			},
			//升级
			update() {
				uni.navigateTo({
					url: `/pages/user/update?code=${this.$store.state.user.invite_code}`
				})
			},
			yishou(data) {
				return this.$yishou(data)
			},
			//复制标题
			copyTitle(content) {
				uni.setClipboardData({
					data: content,
					success: () => {
						this.$msg("复制成功")
					}
				})

			},

			//分享点击
			async shareClick(id) {
				//判断用户是否登陆,如果未登录跳转登录页
				if (!this.$store.state.user) {
					uni.navigateTo({
						url: '/pages/user/login',
					});
					return;
				}
				//首次授权单独获取
				var reation_id = uni.getStorageSync("relation_id");
				console.log(reation_id, this.$store.state.user.relation_id)
				//已登录，判断是否淘宝授权
				if (!(this.$store.state.user.relation_id || reation_id)) {
					console.log("进入")
					//如果没授权，则请求授权接口
					this.isAuth = true;

					//授权成功获取reation_id
					return
				}

				//登录并授权之后跳转分享页面
				uni.navigateTo({
					url: `/pages/share/share?id=${id}&rid=${this.$store.state.user.relation_id || reation_id}&num=${(this.goods.tkfee3*this.userlevel.level_percent).toFixed(2)}`,
				});
			},

			//宝贝图片详情点击事件
			babyClick() {
				this.isShow = !this.isShow;
			},
			//点击优惠券跳转淘宝
			toJD() {
				//判断用户是否登陆,如果未登录跳转登录页
				if (!this.$store.state.user) {
					uni.navigateTo({
						url: '/pages/user/login',
					});
					return;
				}
				uni.showLoading({
					mask: true,
					title: "正在跳转"
				})	
				console.log(this.shopId, this.pdd_id)
				//转链
				this.$api.pdd_union_url(this.shopId, this.pdd_id).then(res => {
					let {
						data,
						status_code
					} = res.data;
					console.log(res);
					if (status_code == 200) {
						// this.shopTicket = data.alldata.mobile_url;
						// console.log(this.shopTicket)
						// var index = this.shopTicket.indexOf("/");
						 // console.log(decodeURIComponent(this.shopTicket));
						// console.log(this.shopTicket);
						
						uni.setStorage({
						    key: 'pdd-url',
						    data: data.alldata.mobile_url,
						    success: function () {
						       uni.navigateTo({
						       	url:'/pages/index/pddweb'
						       })
						    }
						});
						
						// var url = "pinduoduo:" + this.shopTicket.substring(index);
						
	
						// var _that=this;
						// plus.runtime.openURL(url, function(res) {
						// 	console.log(res,'错误信息')
						// 	uni.showModal({
						// 		content: "本机未检测到拼多多客户端，是否打开浏览器访问拼多多？",
						// 		success: function(res) {
						// 			//用户点击确定
						// 			if (res.confirm) {		
						// 				console.log(_that.shopTicket)
						// 				plus.runtime.openURL(_that.shopTicket, function(res) {
						// 				console.log(res);
						// 				})
						// 			}
						// 		}
						// 	})
						// });
					} else {
						this.$msg("转链失败，请联系客服")
					}
					uni.hideLoading()
				}).catch(() => {
					uni.hideLoading();
					this.$msg("荔枝开小差了，请联系客服")
				})
			},
			//加载数据
			async loadData(id) {
				if(!id){
					id=this.shopId
				}
				this.$api.pdd_goods_detail(id).then(res => {
					let {
						status_code,
						data
					} = res.data;
					console.log(res)
					if (data) {
						this.isSuccess = false;
						this.goods = data;
						
						this.couponurl = data.couponurl
						this.AddMyTracks();
					} else {
						
							this.emptyType='notpopular'
						
						this.isSuccess = false;
						// uni.showToast({
						// 	icon: 'none',
						// 	title: '商品未参与返利活动',
						// 	duration:4000
						// })
					}
				}).catch(res=>{
					this.isSuccess = false;
					console.log('断网')
					this.emptyType='nodata'
				})
			},
			//收藏点击 
			toFavorite() {
				//判断用户是否登陆,如果未登录跳转登录页
				if (!this.$store.state.user) {
					this.$msg("请先登录")
					uni.navigateTo({
						url: '/pages/user/login',
					});
					return;
				}
				uni.showLoading({
					mask: "true"
				})
				console.log(this.shopId)
				//收藏
				if (!this.favorite) {
					this.$api.AddMyCollections(this.$store.state.user.token, this.shopId, this.goods.picurl, this.goods.goods_short_name,
						this.goods
						.price_after, 3, this.goods.commission).then(res => {
						uni.hideLoading()
						let {
							code,
							msg
						} = res.data

						if (code == 2000) {
							this.favorite = true;
							this.$msg("收藏成功")
						} else {
							this.$msg("收藏失败")
						}
					}).catch(() => {
						uni.hideLoading()
					})
				}
				//删除收藏 
				if (this.favorite) {
					this.$api.DelMyCollections(this.$store.state.user.token, [this.shopId], 0).then(res => {
						console.log(res)
						uni.hideLoading()
						let {
							code,
							msg
						} = res.data

						if (code == 2000) {
							this.favorite = false;
							this.$msg("取消收藏")
						} else {
							this.$msg("取消收藏失败")
						}
					}).catch(() => {
						uni.hideLoading()
					})
				}
			}
		},
		onShow() {
			this.userlevel = this.$store.state.userlevel;
			console.log(this.$store.state.userpid.pdd_id)
			if(!this.$store.state.userpid.pdd_id){
				this.$api.GetAllPid(this.$store.state.user.token).then(res=>{
					let {code,data}=res.data;
					this.$store.commit('setAllpid',data);
					this.pdd_id=this.$store.state.userpid.pdd_id;
					console.log(this.pdd_id)
					console.log(this.userlevel,this.pdd_id)
				}).catch(()=>{
					this.$msg('获取拼多多推广位失败，请联系客服')
				})
			}else{
				this.pdd_id=this.$store.state.userpid.pdd_id;
			}	
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.id);
			// if(plus.os.name=='Android'){
			// 	this.iosisshow=true
			// }
			// else{
			// 	this.iosisshow=uni.getStorageSync('lzd-iosisshow');
			// 	console.log(this.iosisshow)
			// }
			this.shopId = option.id;
			this.loadData(option.id)
			if (this.$store.state.user.token) {
				this.$api.MyCollectionsExsit(this.$store.state.user.token, this.shopId).then(res => {
					let {
						code
					} = res.data;
					if (code == 2000) {
						this.favorite = true;
					}
				})
			}
		},


	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	//模态弹窗
	.auth-popup {
		background-color: rgba(0, 0, 0, 0.4);
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 999;

		.layer {
			border-radius: 30upx;
			position: fixed;
			background: #fff;
			margin: -300upx 15% 0;
			top: 50%;
			height: 600upx;
			width: 70%;
			// padding: 80upx 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;

			.exit {
				position: absolute;
				right: 0;
				height: 0;
				font-size: 50upx;
				padding: 30upx;
			}

			image {
				margin-top: 80upx;
				width: 120upx;
				height: 120upx;
				overflow: hidden;
				border-radius: 120upx;
			}

			.title {
				font-weight: bold;
				font-size: $font-lg+4upx;
				color: #545454;
			}

			.tips {
				width: 60%;
				color: #b3b3b0;
				font-size: $font-base;
				text-align: center;
			}

			.button-content {
				margin-bottom: 80upx;
				font-size: $font-base;
				color: #fff;
				width: 80%;
				height: 80upx;
				line-height: 80upx;
				border-radius: 80upx;
				text-align: center;
				background-image: linear-gradient(to right, #f29239, #ff4227)
			}
		}
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			width: 100%;
		}

	}

	.like-shop-content {
		background: #fff;
		padding: 20upx 20upx;
		margin-bottom: 10upx;

		.good-tips {
			height: 70upx;
			line-height: 70upx;
			display: flex;
			justify-content: space-between;
			font-size: $font-sm;
			color: $font-color-grey;
			margin-bottom: 10upx;
			.shop-price {
				color: #ef3d3d;
				font-size: $font-base;

				.price-num {
					font-weight: bold;
					font-size: $font-lg+8upx;
				}
			}

			.ago-price {
				text-decoration: line-through;
			}
		}

		.shop-title {
			margin-bottom: 30upx;
			// display: flex;
			position: relative;

			image {
				position: absolute;
				width: 30upx;
				height: 30upx;
			}
			
			.p-type{
				padding: 0upx 14upx;
				border-radius: 24upx;
				background-color: #FF0000;
				color: #FFFFFF;
				font-size: 22upx;
				position: absolute;
				top: 4upx;
			}

			.title {
				// font-weight: bold;
				color: #333333;
				flex: 1;
				text-indent: 100upx;
				font-size: 32upx;
				height: 80upx;
				line-height: 40upx;
				overflow: hidden;
				line-height: 40upx;
				display: -webkit-box;
				text-overflow: ellipsis;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}

		.upgrade {
			font-size: $font-sm;
			display: flex;
			justify-content: space-between;
			background-color: #fbefd8;
			padding: 16upx;
			border-radius: 8upx;
			margin-bottom: 20upx;
			color: #141414;

			.xiadan {
				margin-right: 16upx;
				padding: 12upx;
				border-radius: 8upx;
				background-color: #363740;
				color: #FFFFFF;
			}

			.price {
				color: #f21414;
				font-size: $font-base;
				font-weight: bold;
			}

			.flicon {
				font-size: $font-base;
			}

			.top {
				font-size: $font-base;
			}
		}

		.shop-ticket {
			height: 160upx;
			margin: 0 auto;
			color: #fff;
			background-image: url("~@/static/index/quan_bg.png");
			background-size: 100% 100%;
			display: flex;
			justify-content: space-between;
			padding: 10upx 20upx;

			.left {
				flex: 3;
				display: flex;
				text-align: center;
				flex-direction: column;
				justify-content: center;

				.ticket-size {
					font-weight: bold;
					font-size: $font-lg+4upx;

				}

				.ticket-time {
					font-size: $font-sm;
				}
			}

			.right {
				flex: 1;
				font-size: $font-lg+4upx;
				font-weight: bold;
				display: flex;
				flex-direction: column;
				justify-content: center;
				text-align: center;
			}
		}
	}

	//推荐
	.tuijian {
		margin-bottom: 10upx;
		background-color: #fff;
		display: flex;
		padding: 20upx;
		font-size: $font-base;
		justify-content: space-between;

		.tjtitle {
			width: 20%;
		}

		.jianjie {
			color: #939292;
			width: 78%;
			font-size: $font-base;
		}
	}

	// 宝贝详情
	.baby-detail {
		background-color: #fff;
		margin-bottom: 10upx;

		.baby {
			padding: 26upx;
			display: flex;
			font-size: $font-lg;
			justify-content: space-between;

		}

		image {
			width: 100%;
		}
	}

	// 店铺
	.store-news {
		margin: 10upx 0;
		background-color: #fff;
		padding: 14px 16upx;

		.store-header {
			font-size: $font-lg;
			display: flex;
			justify-content: space-between;
			height: 120upx;
			align-content: center;
			//border-bottom: 1upx solid #fff;

			.store-title {
				display: flex;
				justify-content: space-between;
				font-size: $font-lg;
				align-content: center;

				.title {
					margin-top: 10upx;
				}

				image {
					width: 90upx;
					height: 90upx;
					margin-right: 20upx;
				}
			}

			span {
				color: #ff8a5d;
				padding: 10upx;
				font-size: $font-base;
			}
		}

		.store-assess {
			display: flex;
			justify-content: space-between;
			font-size: $font-sm;
			color: #bbb;
			padding-top: 20upx;

			.store-service {
				flex: 1;
				display: flex;

				.wenzi {
					padding-right: 10upx;
				}

				.red {
					padding-left: 10upx;
					color: #ff6877;
				}

				.yellow {
					padding-right: 10upx;
					color: gold;
				}

				.green {
					padding-right: 10upx;
					color: #00d20c;
				}
			}
		}

	}

	//猜你喜欢
	.your-like {
		background-color: #fff;
		margin-bottom: 16upx;
		position: relative;

		.like-title {
			width: 100%;
			padding: 26upx;
			text-align: center;
			font-size: $font-lg;
			position: relative;

			.title-desc {
				padding: 0 20upx;
				position: relative;
				z-index: 1;
				background-color: #fff;
			}

			&::before {
				content: "";
				height: 1px;
				border-bottom: #ef3d3d solid 1px;
				width: 40%;
				position: absolute;
				top: 50%;
				left: 30%;
			}
		}

		.your-like-list {
			white-space: nowrap;

			.scoll-wrapper {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				padding-left: 20upx;

				.shop-item {
					width: 220upx;

					// margin-right: 16upx;
					.shop-img {
						width: 200upx;
						height: 200upx;
					}

					.shop-content {
						color: #fd3e14;

						.shop-title {
							font-size: $font-sm;
							overflow: hidden;
							line-height: 40upx;
							text-overflow: ellipsis;
							white-space: nowrap;
							color: #545454;
						}

						.hot-quan-price {
							font-size: 20upx;
							padding: 6upx 4upx 0;
							color: #FFFFFF;
							border-radius: 6upx;
							background-color: #fd3e14;
						}

						// 						.quan-box {
						// 							display: flex;
						// 
						// 							.quan {
						// 								display: flex;
						// 								height: 32upx;
						// 								line-height: 30upx;
						// 								font-size: $font-sm;
						// 								border: 1upx solid #f51515;
						// 
						// 								margin: 10upx 0;
						// 								position: relative;
						// 
						// 								image {
						// 									position: absolute;
						// 									left: -1upx;
						// 									width: 30upx;
						// 									height: 30upx;
						// 
						// 								}
						// 
						// 								.quan-price {
						// 									margin-left: 30upx;
						// 									padding: 0 6upx;
						// 
						// 								}
						// 							}
						// 						}

						.shop-price {
							font-size: $font-sm;

							.shop-price-wenzi {
								font-size: 22upx;
								color: #464646;
							}

							.shop-price-icon {
								color: #fd3e14;
							}

							.shop-price-num {
								font-size: $font-base;
								font-weight: bold;
							}
						}
					}
				}
			}
		}
	}

	/* 底部操作菜单 */
	.footer {
		background-color: #fff;
		width: 100%;
		height: 120upx;
		position: fixed;
		bottom: 0;
		z-index: 9;

		.page-bottom {
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 94%;
			height: 120upx;

			// box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
			// border-radius: 16upx;

			.p-b-btn {
				margin-top: 10upx;
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: $font-sm;
				height: 80upx;
				margin-bottom: 14upx;

				.flicon {
					font-size: 42upx;
				}

				&.active,
				&.active .flicon {
					color: #fa436a;
				}

				.icon-shoucang {
					font-size: 46upx;
				}
			}

			.action-btn-group {
				margin-left: 20upx;
				flex: 4;
				display: flex;
				height: 80upx;
				border-radius: 100px;
				overflow: hidden;
				// background: linear-gradient(to right, #ff8a5d, #ef3d3d);
				position: relative;
				color: #fff;
				font-size: $font-lg;

				.share {
					flex: 1;
					background-color: #ff8a5d;
					display: flex;
					justify-content: space-around;
					align-items: center;
					padding: 0 30upx;
				}

				.getticket {
					flex: 1;
					background-color: #ef3d3d;
					display: flex;
					justify-content: space-around;
					align-items: center;
					padding: 0 30upx;
				}
			}
		}
	}
</style>
