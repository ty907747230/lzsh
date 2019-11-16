<template>
	<!-- 收藏 -->
	<view>
		<!--加载框 start-->
		<tui-loading :visible="isSuccess"></tui-loading>
		<seize-seat typeimg='nocollect'  v-if="!isSuccess&&goodsList.length==0"></seize-seat>
		<view class="" v-show="!isSuccess&&goodsList.length!=0">
			<!-- 商品列表 -->
			<view class="goods-list">
				
				<view class="row" v-for="(row,index) in goodsList" :key="index">
					<!-- 删除按钮 -->
					<view class="menu" @tap.stop="deleteGoods(row.item_id,index)">
						<view class="flicon shanchu">&#xe696;</view>
					</view>
					<!-- 商品 -->
					<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)"
					 @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
						<!-- checkbox -->
						<view class="checkbox-box" @tap="selected(index)">
							<view class="checkbox">
								<view :class="[row.selected?'on':'']"></view>
							</view>
						</view>
						<!-- 商品信息 -->
						<view class="goods-info" @tap="toGoods(row.type_one_id,row.item_id)">
							<view class="img">
								<image v-if="row.type_one_id==2" class="shop-jd-icn" :src="row.pict_url"></image>
								<image v-if="row.type_one_id==3" class="shop-jd-icn" :src="row.pict_url"></image>
								<image v-if="row.type_one_id==0 ||row.type_one_id== 1" :src="row.pict_url+'_310x310.jpg'"></image>
							</view>
							<view class="info">
								<!-- 标题 -->
								<view class="shop-title">
									<image v-if="row.type_one_id==0 ||row.type_one_id== 1" class="shop-icn" :src="row.user_type==0?'/static/index/icon_tb.png':'/static/index/icon_tm_s.png'" mode="aspectFit"></image>
									<image v-if="row.type_one_id==2" class="shop-jd-icn" src="/static/index/jd-icon.png" mode="aspectFit"></image>
									<image v-if="row.type_one_id==3" class="shop-jd-icn" src="/static/icons/pdd.jpg" mode="aspectFit"></image>
									<span class="til">{{row.title}}</span>
								</view>

								<!-- 价格 -->
								<view class="shop-price">
									<view class="now-price">
										<text class="now-price-icon">￥</text>
										<text class="now-price">{{row.quanhou_jiage}}</text>
									</view>
									<view class="shop-price-right">
										<text class="yugu">
											奖:￥{{tofix(row.tkfee3*userlevel.level_percent)}}
										</text>
									</view>
								</view>
							</view>
						</view>
					</view>

				</view>

			</view>

			<!-- 脚部菜单 -->
			<view class="footer">
				<view class="checkbox-box" @tap="allSelect">
					<view class="checkbox">
						<view :class="[isAllselected?'on':'']"></view>
					</view>
					<view class="text">全选</view>
				</view>
				<view class="delBtn" @tap="deleteList">批量删除</view>
			</view>
			<uni-load-more v-if="goodsList.length!=0" :status="loadingType"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import seizeSeat from '@/components/seize-seat.vue'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
	import tuiLoading from "@/components/loading/loading";
	export default {
		data() {
			return {
				isAllselected: false,
				goodsList: [],
				pageNo: 1,
				loadingType: "more",
				//控制滑动效果
				theIndex: null,
				oldIndex: null,
				isStop: false,
				selectedList: [],
				//页面是否加载完毕
				isSuccess: true,
				userlevel:{}
			}
		},
		components: {
			uniLoadMore,
			tuiLoading,
			seizeSeat
		},
		methods: {
			tofix(data){
				return data.toFixed(2)
			},
			//控制左滑删除效果-begin
			touchStart(index, event) {
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
			},
			touchMove(index, event) {
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];

				if (this.isStop || Math.abs(moveX) < 5) {
					return;
				}
				if (Math.abs(moveY) > Math.abs(moveX)) {
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}

				if (moveX < 0) {
					this.theIndex = index;
					this.isStop = true;
				} else if (moveX > 0) {
					if (this.theIndex != null && this.oldIndex == this.theIndex) {
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(() => {
							this.oldIndex = null;
						}, 150)
					}
				}
			},
			touchEnd(index, $event) {
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end

			//商品跳转
			toGoods(type,id) {
				if(type==2){
					uni.navigateTo({
						url: `/pages/index/shopdetails-j?id=${id}`
					});
				}else if(type==3){
					uni.navigateTo({
						url: `/pages/index/shopdetails-p?id=${id}`
					});
				}else{
					uni.navigateTo({
						url: `/pages/index/shopdetails?id=${id}`
					});
				}
				
			},
			//删除商品
			deleteGoods(id, index) {	
				this.$api.DelMyCollections(this.$store.state.user.token, [id], 0).then(res => {
					console.log(res)
					uni.hideLoading()
					let {
						code,
						msg
					} = res.data
					if (code == 2000) {
						this.$msg("删除成功");
						this.goodsList.splice(index, 1);
						this.oldIndex = null;
						this.theIndex = null;
					} else {
						this.$msg("删除失败")
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
				
			// 删除商品s
			deleteList() {
				if(0){
					console.log("cehsi")
				}
				else{
					console.log("cehsi1")
				}
				if (this.selectedList.length == 0) {
					this.$msg("请选择需要删除的商品")
					return
				}
				if (this.goodsList.length != this.selectedList.length) {
					console.log(this.selectedList)
					this.$api.DelMyCollections(this.$store.state.user.token, this.selectedList, 0).then(res => {
						console.log(res)
						uni.hideLoading()
						let {
							code,
							msg
						} = res.data
						if (code == 2000) {
							this.$msg("删除成功")
							this.goodsList = this.goodsList.filter(v => {
								if (this.selectedList.indexOf(v.item_id) == -1) {
									return v
								}
							})
						} else {
							this.$msg("删除失败")
						}
					}).catch(() => {
						uni.hideLoading()
					})
					return
				};
				this.$api.DelMyCollections(this.$store.state.user.token, [], "1").then(res => {
					console.log(res)
					uni.hideLoading()
					let {
						code,
						msg
					} = res.data
					if (code == 2001) {
						this.$msg("删除成功")
						this.goodsList = []
					} else {
						this.$msg("删除失败")
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			// 选中商品
			selected(index) {
				this.goodsList[index].selected = this.goodsList[index].selected ? false : true;
				let i = this.selectedList.indexOf(this.goodsList[index].item_id);
				console.log(i, this.selectedList.length)
				i > -1 ? this.selectedList.splice(i, 1) : this.selectedList.push(this.goodsList[index].item_id);
				this.isAllselected = this.selectedList.length == this.goodsList.length;

			},
			//全选
			allSelect() {
				let len = this.goodsList.length;
				let arr = [];
				for (let i = 0; i < len; i++) {
					this.goodsList[i].selected = this.isAllselected ? false : true;
					arr.push(this.goodsList[i].item_id);
				}
				this.selectedList = this.isAllselected ? [] : arr;
				this.isAllselected = this.isAllselected || this.goodsList.length == 0 ? false : true;
			},
			loadData(type) {
				if (this.loadingType === "nomore") {
					return;
				}
				//如果不是加载操作就重置,clear为true加载
				if (type == "refresh") {
					this.goodsList = [];
					this.pageNo = 1;
					this.loadingType = "more";
				}
				this.loadingType = "loading";
				this.$api.MyCollections(this.$store.state.user.token, this.pageNo, 7).then(res => {
					this.isSuccess = false;
					let {
						code,
						data
					} = res.data;
					this.pageNo++;
					if (code == 2000) {
						let list = data.goods_info;
						
						this.goodsList = this.goodsList.concat(list);
						console.log(this.goodsList.length)
						//判断是否还有数据
						this.loadingType = list.length == 7 ? 'more' : "nomore";
					} else {
						this.loadingType = "nomore"
					}
				}).catch(() => {
					this.loadingType = "nomore"
				})
			}
		},
		onReachBottom() {
			this.loadData()
		},
		onLoad() {
			this.loadData()
		},
		onShow(){
			this.userlevel = this.$store.state.userlevel;
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
	}
	.shanchu {
		font-size: $font-lg+8upx;
	}

	.checkbox-box {
		display: flex;
		align-items: center;

		.checkbox {
			width: 50upx;
			height: 50upx;
			border-radius: 100%;
			border: solid 2upx #f06c7a;
			display: flex;
			justify-content: center;
			align-items: center;

			.on {
				width: 35upx;
				height: 35upx;
				border-radius: 100%;
				background-color: #f06c7a;
			}
		}

		.text {
			font-size: 28upx;
			margin-left: 10upx;
		}
	}

	.goods-list {
		width: 100%;
		padding: 20upx 0 0;

		.tis {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			image{
				width: 500px;
				height: 332px;
			}
		}

		.row {
			width: calc(92%);
			height: calc(22vw + 40upx);
			margin: 20upx auto;

			border-radius: 15upx;
			box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;

			.menu {
				.icon {
					color: #fff;
					// font-size: 25upx;
				}

				position: absolute;
				width: 30%;
				height: 100%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}

			.carrier {
				@keyframes showMenu {
					0% {
						transform: translateX(0);
					}

					100% {
						transform: translateX(-30%);
					}
				}

				@keyframes closeMenu {
					0% {
						transform: translateX(-30%);
					}

					100% {
						transform: translateX(0);
					}
				}

				&.open {
					animation: showMenu 0.25s linear both;
				}

				&.close {
					animation: closeMenu 0.15s linear both;
				}

				background-color: #fff;

				.checkbox-box {
					padding-left: 20upx;
					flex-shrink: 0;
					height: 22vw;
					margin-right: 20upx;
				}

				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;

				.goods-info {
					width: 100%;
					display: flex;
					padding-right: 20upx;

					.img {
						width: 22vw;
						height: 22vw;
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 10upx;

						image {
							width: 22vw;
							height: 22vw;
						}
					}

					.info {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}

					.shop-title {
						margin-top: 10upx;
						color: #454545;

						.shop-icn {
							position: absolute;
							width: 50upx;
							height: 30upx;
						}
						.shop-jd-icn{
							position: absolute;
							width: 30upx;
							height: 30upx;
						}
						.til {
							text-indent: 60upx;
							font-size: $font-base;
							height: 40upx;
							overflow: hidden;
							line-height: 40upx;
							display: -webkit-box;
							text-overflow: ellipsis;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
					}

					.shop-price {
						padding-right: 26upx;
						font-size: $font-mi;
						display: flex;
						justify-content: space-between;

						.now-price {
							color: #F51515;
							.now-price-icon {
								font-size: $font-base;
							}
							font-weight: bold;
							font-size: $font-lg+8upx;
							padding-right: 10upx;
						}

						.shop-price-right{
							display: flex;
							align-items: center;
							.yugu {
								border:solid 1upx #ea3424;
								color: #ea3424;
								background-color: #fdf6f2;
								padding: 0 6upx;
								border-radius: 10upx;
								font-size: $font-sm;
							}
						}
						
					}
				}
			}
		}
	}

	.footer {
		position: fixed;
		padding: 0 30upx;
		left: 30upx;
		bottom: 10upx;
		z-index: 95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .3);
		border-radius: 16upx;

		.delBtn {
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.settlement {
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 600;
				}
			}

			.btn {
				padding: 0 30upx;
				height: 50upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;

				border-radius: 30upx;
			}
		}
	}
</style>
