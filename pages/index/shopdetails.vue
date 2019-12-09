<!-- 商品详情组件 -->
<template>
	<view class="container">
		<!--加载框 start-->
		<tui-loading :visible="isSuccess"></tui-loading>
		<!-- 授权弹窗 -->
		<view class="auth-popup" v-if="isAuth">
			<view class="layer">
				<text class="flicon exit" @click="exitPopup">
					&#xe615;
				</text>
				<!-- 图 -->
				<image src="/static/index/tb.jpg" mode="widthFix"></image>
				<view class="title">
					{{isTwo?'授权失败':'请完成淘宝授权'}}
				</view>
				<view class="tips">
					{{isTwo?'淘宝授权失败将无法通过下单或分享产品获得收益':'淘宝授权后下单或分享产品可获得收益哦'}}
				</view>

				<view @click="btnclick" class="button-content">
					{{isTwo?'重新授权':'去授权'}}
				</view>

			</view>
		</view>
		
		<seizeSeat :typeimg='emptyType' @loadDataAgain='loadData' v-if="!isSuccess&&!goods.tao_id"></seizeSeat>
		<view class="" v-show="!isSuccess&&goods.tao_id">
			<!-- 轮播图 -->
			<view class="carousel">
				<swiper indicator-dots circular="true" autoplay="true" duration="400">
					<swiper-item class="swiper-item" v-for="(item,index) in carouselimg" :key="index">
						<view class="image-wrapper">
							<image mode="aspectFill" class="loaded" :src="item+'_540x540.jpg'"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 商品内容 -->
			<view class="like-shop-content">
				<!-- 头部价格 -->
				<view class="good-tips">
					<view class="shop-price">
						券后 ￥<text class="price-num">{{goods.quanhou_jiage}}</text>
					</view>

					<text>原价<text class="ago-price">￥{{goods.size}}</text></text>
					<text>已售{{yishou(goods.volume)}}件</text>
				</view>
				<view class="shop-title" @longpress="copyTitle(goods.tao_title)">
					<!-- <image mode="aspectFit" :src="goods.user_type==0?'/static/index/icon_tb.png':'/static/index/icon_tm_s.png'"></image> -->
					<span class="p-type">{{goods.user_type==0?'淘宝':'天猫'}}</span>
					<span class="title">{{goods.tao_title}}</span>
				</view>
				<!-- 升级 -->
				<view class="upgrade" v-if="userlevel.on_off" @click="update">
					<view class="upgrade-left">
						<text class="xiadan">下单返<text>￥{{(goods.tkfee3*userlevel.level_percent).toFixed(2)}}</text></text>
						<text v-if="!(userlevel.level==2||userlevel.level==3)">升级<text>{{userlevel.level==0?'合伙人':'运营董事'}}可返</text><text class="price">￥{{(goods.tkfee3*userlevel.next_level_percent).toFixed(2)}}</text></text>
						<text v-if="userlevel.level==2">尊享荔枝金卡特权</text>
						<text v-if="userlevel.level==3">尊享联合创始人特权</text>
					</view>
					<text v-if="!(userlevel.level==2||userlevel.level==3)" class="flicon">立即升级 &#xe6ec;</text>
					<text class="top flicon" v-if="userlevel.level==2">运营董事 &#xe6ec;</text>
					<text class="top flicon" v-if="userlevel.level==3">联合创始人 &#xe6ec;</text>
				</view>
				<!-- 优惠券 -->
				<view class="shop-ticket" @click="toTaobao">
					<view v-if="(goods.coupon_info_money==0)" class="left">
						暂无优惠券
					</view>
					<view v-if="!(goods.coupon_info_money==0)" class="left">
						<text class="ticket-size">{{goods.coupon_info_money}} 元</text>
						<text class="ticket-time"> 使用期限: {{goods.coupon_start_time}} 至 {{goods.coupon_end_time}}</text>
					</view>
					<view class="right">
						<text v-if="!(goods.coupon_info_money==0)">立即领取</text>
						<text v-if="goods.coupon_info_money==0">立即购买</text>
					</view>
				</view>

			</view>

			<!-- 推荐理由 -->
			<view class="tuijian" @click="copyTuijian(goods.jianjie)">
				<text class="tjtitle">推荐理由:</text>
				<text class="jianjie">{{goods.jianjie}}</text>
			</view>
			<!-- 店铺 -->
			<view class="store-news">
				<!-- 店铺头部 -->
				<view class="store-header">
					<view class="store-title">
						<image :src="goods.shopIcon" mode="aspectFill"></image>
						<text class="title">{{goods.shop_title}}</text>
					</view>
					<span @click="toShop" class="info">进入店铺
						<span class="flicon">&#xe6ec;</span>
					</span>

				</view>
				<!-- 店铺评价 -->
				<view class="store-assess">
					<view class="store-service">
						<text class="wenzi">宝贝描述</text>
						<text :class="goods.score1>4.7?'red':(goods.score1==4.7?'yellow':'green')">{{goods.score1}} {{goods.score1>4.7?"高":(goods.score1==4.7?"平":"低")}}</text>
					</view>
					<view class="store-service">
						<text class="wenzi">卖家服务</text>
						<text :class="goods.score2>4.7?'red':(goods.score2==4.7?'yellow':'green')">{{goods.score2}} {{goods.score2>4.7?"高":(goods.score2==4.7?"平":"低")}}</text>
					</view>
					<view class="store-service">
						<text class="wenzi">物流服务</text>
						<text :class="goods.score3>4.7?'red':(goods.score3==4.7?'yellow':'green')">{{goods.score3}} {{goods.score3>4.7?"高":(goods.score3==4.7?"平":"低")}}</text>
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
				<image v-if="isShow" mode="widthFix" class="baby-img" v-for="(item,index) in goodImg" :src="item" :key="index"></image>
			</view>



			<!-- 猜你喜欢 -->
			<view class="your-like">
				<view class="like-title">
					<text class="title-desc">猜你喜欢</text>
					<!-- <text v-show="isLikeShow" class="flicon">&#xe602;</text>
					<text v-show="!isLikeShow" class="flicon">&#xe6ec;</text> -->
				</view>
				<scroll-view scroll-x class="your-like-list">
					<view class="scoll-wrapper">
						<view @click="navToDetail(item.tao_id)" :key="index" class="shop-item" v-for="(item,index) in shopList">
							<view class="shop-img">
								<image class="big-pict" mode="widthFix" :src="item.white_image+'_260x260.jpg'"></image>
							</view>
							<view class="shop-content">
								<view class="shop-title">
									<text>{{item.title}}</text>
								</view>

								<!-- <view class="quan-box">
									<view class="quan">
										<image src="/static/index/quanzi.png" mode="">
										</image>
										<text class="quan-price"> ￥{{item.youhuiquan||item.coupon_info_money}}</text>
									</view>
								</view> -->
								<text class="hot-quan-price"> {{Math.floor(item.youhuiquan||item.coupon_info_money)}}元券</text>

								<view class="shop-price">
									<text class="shop-price-wenzi">券后价
										<text class="shop-price-icon">￥</text></text>
									<text class="shop-price-num">{{item.quanhou_jiage}}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
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

						<view @click="shareClick(shopId)" class="share">
							<!-- <view @click="totbweb" class="share"> -->
							<text class="flicon">&#xe620;</text>
							<text>分享</text></view>
						<view class="getticket" @click="toTaobao">
							<text class="flicon">&#xe66e;</text>
							<text v-if="!(goods.coupon_info_money==0)">领券</text>
							<text v-if="(goods.coupon_info_money==0)">购买</text>
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
	// const bcPlugin = uni.requireNativePlugin('dahui-alibaichuan');
	const plug = uni.requireNativePlugin('Html5app-Baichuan');
	export default {
		data() {
			return {
				// 商品图片
				goodImg: [],
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
				// iosisshow: false,
				emptyType:''
			}
		},
		components: {
			shopNews,
			tuiLoading,
			seizeSeat
		},
		methods: {
			//添加足迹
			AddMyTracks() {
				if (!this.$store.state.user.token) {
					return
				}
				this.$api.AddMyTracks(this.$store.state.user.token, this.shopId, this.goods.pict_url, this.goods.title, this.goods.quanhou_jiage,
					this.goods.user_type, this.goods.tkfee3, this.goods.size, this.goods.coupon_info_money, this.goods.volume).then((
					res) => {
					console.log(res);
				})
			},
			//升级
			update() {
				uni.navigateTo({
					url: `/pages/user/update/update?code=${this.$store.state.user.invite_code}`
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
			//关闭授权
			exitPopup() {
				plug.logout({}, result => {
					console.log(result);
				});
				this.isAuth = false;
			},
			//进入商铺
			toShop() {
				uni.navigateTo({
					url: '/pages/index/shopweb?id=' + this.goods.seller_id + "&title=" + this.goods.title,
				});
			},
			
			//授权
			btnclick: function() {
				if(!plug){
					plug=uni.requireNativePlugin('Html5app-Baichuan');
				}
				this.isTwo = false;
				console.log(plus.device.vendor)
				plug.checkSession({}, result => {
					console.log(result);
					if (result.code == '0') {
						this.TBOauth();
					} else {
						plug.login({}, result => {
							if (result.code == '0') {
								uni.showToast({
									title: '正在跳往授权',
									icon: "none"
								});
								this.TBOauth();
								// this.isAuth = false;
							} else {
								this.isTwo = true;
								this.isAuth = true;
								this.$msg("淘宝登录失败,请重试,或者联系荔枝客服")
								plug.logout({}, result => {
									console.log(result);
								});

							}
						});
					}
				});

			},

			TBOauth() {
				this.$msg('正在跳转授权');
				plug.taobaoOauth({
					url: "https://oauth.taobao.com/authorize?response_type=code&client_id=27711073&redirect_uri=http://m.baidu.com/oauth/&state=1212&view=wap"
				}, ret => {
					console.log(JSON.stringify(ret));
					if (ret.retcode == "0") {
						uni.request({
							url: `http://39.100.111.131/sr/2.php?code=${ret.code}`,
							success: (res) => {
								if (res.data.relation_id) {
									this.$api.GetAuth(this.$store.state.user.token, res.data.relation_id['0'], 1).then(res => {
										console.log(res)
										let {
											code,
											msg,
											data
										} = res.data;

										if (code == 2000) {
											if (data.relation_id) {
												uni.setStorageSync("relation_id", data.relation_id);
											}
											this.$msg("已授权");
											this.isAuth = false; //成功关掉窗口
										} else if (code == 4039) {
											uni.showToast({
												title: msg,
												icon: "none",
												duration: 3000
											});
											this.isAuth = false;
											plug.logout({}, result => {
												console.log(result);
											});
											this.isTwo = true; //第一次授权失败改为第二次授权提示内容
										} else {
											this.isAuth = true;
											this.isTwo = true;
											this.$msg(msg);
											plug.logout({}, result => {
												console.log(result);
											});
										}
									}).catch(() => {
										this.isAuth = true;
										this.isTwo = true;
										plug.logout({}, result => {
											console.log(result);
										});
										this.$msg("授权信息保存失败，请联系客服")
									})
								} else {
									this.isAuth = true;
									this.isTwo = true;
									plug.logout({}, result => {
										console.log(result);
									});
									this.$msg("找不到授权渠道id，请联系客服")
								}
							},
							fail: () => {
								this.isAuth = true;
								this.isTwo = true;
								plug.logout({}, result => {
									console.log(result);
								});
								this.$msg("授权请求失败，请联系客服")
							}
						})
					} else {
						this.isAuth = true;
						this.isTwo = true;
						this.$msg("用户取消授权")
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

				//已登录，判断是否淘宝授权
				if (!(reation_id)) {
					console.log("进入")
					//如果没授权，则请求授权接口
					this.isAuth = true;
					// await this.btnclick();
					//授权成功获取reation_id
					return
				}

				//登录并授权之后跳转分享页面
				uni.navigateTo({
					url: `/pages/share/share?id=${id}&rid=${reation_id}&num=${(this.goods.tkfee3*this.userlevel.level_percent).toFixed(2)}`,
				});
			},
			//猜你喜欢点击事件
			handlelike() {
				this.isLikeShow = !this.isLikeShow;
			},
			//宝贝图片详情点击事件
			babyClick() {
				this.isShow = !this.isShow;
			},
			//点击优惠券跳转淘宝
			toTaobao() {
				//判断用户是否登陆,如果未登录跳转登录页
				if (!this.$store.state.user) {
					uni.navigateTo({
						url: '/pages/user/login',
					});
					return;
				}
				//判断是否淘宝授权
				if (uni.getStorageSync("relation_id")) {
					uni.showLoading({
						title: "正在跳转",
						mask: true
					});

					//转链
					this.$api.relation_tkl_q(this.shopId, uni.getStorageSync("relation_id")).then(
						res => {
							uni.hideLoading()
							let {
								tbk_privilege_get_response
							} = res.data;
							console.log(res);
								this.shopTicket = this.goods.coupon_info_money == 0 ? tbk_privilege_get_response.result.data.item_url : tbk_privilege_get_response.result.data.coupon_click_url;
								// console.log(this.shopTicket)
								// var index = this.shopTicket.indexOf("/");

								// var url = "taobao:" + this.shopTicket.substring(index);
								console.log(this.shopTicket);
								//由于方法里得this不是原生得this实例，所以需要再外面绑定this

								// bcPlugin.BCGetCoupons(this.shopTicket, result => {});
								plug.detailPage({
									url: this.shopTicket,
									"openType": 0
								}, result => {
									console.log(res)
								});							
						}).catch(
						res => {
							uni.hideLoading()
							this.$msg("高佣转链失败，请联系客服")
						}
					)
				} else {
					this.isAuth = true;
				}
			},
			//加载数据
			async loadData(id) {
				if(!id){
					id=this.shopId
				}
				this.$api.getDetailCommon(id).then(res => {
					let {
						status,
						content
					} = res.data;
					console.log(res)
					if (status == 200) {
						this.isSuccess = false;
						this.goods = content[0];
						if(!this.goods.tao_id){
							this.emptyType='notpopular'
						}
						
						this.AddMyTracks();
						this.carouselimg = content[0].small_images.split("|");
						// console.log(this.carouselimg)
						//加载完毕
						this.goodImg = content[0].pcDescContent.split("|");

						//获取猜你喜欢商品
						this.$api.SimilarGoods(9, 1, content[0].tao_id).then(res => {
							let {
								status,
								content
							} = res.data;
							if (status == 200) {
								this.shopList = content;
							}
						})
					} else {
						this.isSuccess = false;
						this.emptyType='notpopular'
						uni.showToast({
							title: '商品不存在或已下架',
							icon: 'none',
							duration: 4000
						})
					}
				}).catch(()=>{
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
					mask: true
				})
				console.log(this.shopId)
				//收藏
				if (!this.favorite) {
					this.$api.AddMyCollections(this.$store.state.user.token, this.shopId, this.goods.pict_url, this.goods.title,
						this.goods
						.quanhou_jiage, this.goods.user_type, this.goods.tkfee3).then(res => {

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

			},
			//复制推荐
			copyTuijian(data) {
				uni.setClipboardData({
					data,
					success: () => {
						uni.showToast({
							title: "复制成功",
							icon: "none"
						})
					}
				})
			},
			//商品详情页面
			navToDetail(id) {
				uni.navigateTo({
					url: "/pages/index/shopdetails?id=" + id
				})
			},
		},
		onShow() {
			this.userlevel = this.$store.state.userlevel;
			console.log(this.userlevel)
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			plug.logout({}, result => {
				console.log(result);
			});
			// if (plus.os.name == 'Android') {
			// 	this.iosisshow = true
			// } else {
			// 	this.iosisshow = uni.getStorageSync('lzd-iosisshow');
				
			// }
			
			this.shopId = option.id;
			console.log(this.shopId);
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

			// image {
			// 	position: absolute;
			// 	width: 50upx;
			// 	height: 30upx;
			// }
			
			.p-type{
				// margin-top: 2upx;
				padding: 0upx 14upx;
				border-radius: 24upx;
				background-color: #FF0000;
				color: #FFFFFF;
				font-size: 22upx;
				position: absolute;
				top: 4upx;
			}
			
			.title {
				// letter-spacing:4upx;
				// font-weight: bold;
				color: #333333;
				flex: 1;
				text-indent: 80upx;
				font-size: 34upx;
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
				font-size: $font-lg+4upx;

				.ticket-size {
					font-weight: bold;
					font-size: $font-lg+4upx;
				}

				.ticket-time {
					font-size: $font-base;
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
