<template>
	<!-- 导航栏组件 -->
	<view>
		<view class="nav">
			<view class="column" @click="Show" :class="{active:currentType=='new'||currentType=='price_desc'||currentType=='price_asc'}">综合
				<text class="flicon">&#xe601;</text>
			</view>

			<view class="column" @click="clickXL" :class="{active:currentType=='sale_num_desc'}">销量</view>

			<view class="column yongjin" @click="clickYJ" :class="{active:currentType=='commission_rate_desc'||currentType=='commission_rate_asc'}">佣金
				<view class="icon-sx">
					<text class="flicon" :class="{active:currentType=='commission_rate_asc'}">&#xe600;
					</text>
					<text class="flicon" :class="{active:currentType=='commission_rate_desc'}">&#xe601;</text>
				</view>
			</view>
			<view class="column toggle" @click="istoggle">
				<text v-if="toggle" class="flicon">&#xe603;</text>
				<text v-if="!toggle" class="flicon">&#xe604;</text>
			</view>
		</view>

		<!-- 综合下拉模态框 -->
		<view class="popup" v-if="isShow" @click.stop="Show">
			<view class="layer">
				<view v-for="(item,index) in zonghe" class="row" @click="handleZH(item,index)" :class="{active:item.type==currentType}"
				 :key="index">
					{{item.val}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				zonghe: [{
						val: "综合排序",
						type: "new"
					},
					{
						val: "价格由高到低",
						type: "price_desc"
					},
					{
						val: "价格由低到高",
						type: "price_asc"
					},
				],
				//currentIndex:0,   //综合下拉默认选中
				currentType: "new", //当前点击的类型
				toggle: true, //true为双列,false为单列
				isAsc: false, //佣金的排序方式
			};
		},
		methods: {
			//综合店家模态框是否显示
			Show() {
				//console.log(this.isShow)
				// this.currentType="new";
				this.isShow = !this.isShow;
			},
			//综合下拉点击事件
			handleZH(item, index) {
				//修改类型
				this.currentType = item.type;
				console.log(this.currentType)
				this.$emit("getType", {
					type: this.currentType,
					toggle: this.toggle
				});
			},
			//销量点击
			clickXL() {
				this.currentType = "sale_num_desc";
				this.$emit("getType", {
					type: this.currentType,
					toggle: this.toggle
				});
			},
			//佣金点击
			clickYJ() {
				this.isAsc = !this.isAsc;
				//升序
				if (this.isAsc) {
					this.currentType = "commission_rate_asc"
				} else {
					this.currentType = "commission_rate_desc"
				}
				this.$emit("getType", {
					type: this.currentType,
					toggle: this.toggle
				});
			},
			//单双排切换
			istoggle() {
				this.toggle = !this.toggle;
				this.$emit("getType", {
					toggle: this.toggle,
					ischange:true
				});
			}
		}

	}
</script>

<style lang="scss">
	.active {
		color: #f5311b;
	}

	.nav {
		width: 100%;
		position: fixed;
		display: flex;
		font-size: $font-base;
		// color: #5a5757;
		height: 80upx;
		line-height: 80upx;
		
		justify-content: space-between;
		border-bottom: 1upx solid #eee;
		background-color: #fff;
		z-index: 2;

		.column {
			padding: 0 40upx;

			.flicon {
				font-size: 8upx;
				padding-left: 10upx;
				font-size: $font-sm;
			}

		}

		.yongjin {
			display: flex;

			.icon-sx {
				display: flex;
				height: 80upx;
				flex-direction: column;
				justify-content: center;
				line-height: 16upx;

				text {
					color: #b3b3b0;
				}

				.active {
					color: #f5311b;
				}
			}
		}

		.toggle {
			.flicon {
				font-size: $font-lg+14upx;
				color: #272626;
			}
		}
	}

	.popup {
		background-color: rgba(0, 0, 0, 0);
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 1000;

		.layer {
			position: fixed;
			background: #fff;
			margin-top: 80upx;
			width: 100%;
			padding: 30upx;
			font-size: $font-lg;
			color: #b3b3b0;

			.row {
				padding: 10upx 0;

			}
		}
	}
</style>
