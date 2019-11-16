<template>
	<!-- 导航栏组件 -->
	<view>
		<view class="nav">
			<view class="column" @click="Show" :class="{active:currentType==0||currentType==1}">综合
				<text class="flicon">&#xe601;</text>
			</view>

			<view class="column" @click="clickXL" :class="{active:currentType==4}">销量</view>

			<view class="column yongjin" @click="clickYJ" :class="{active:currentType==2}">佣金</view>
			<view class="column toggle" @click="istoggle">
				<text v-if="toggle" class="flicon">&#xe603;</text>
				<text v-if="!toggle" class="flicon">&#xe604;</text>
			</view>
		</view>

		<!-- 综合下拉模态框 -->
		<view class="popup" v-if="isShow" @click.stop="Show">
			<view class="layer">
				<view v-for="(item,index) in zonghe" class="row" @click="handleZH(item,index)" :class="{active:item.type==currentType&&item.moren==moren}"
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
				moren:'desc',
				zonghe: [{
						val: "综合排序",
						type: 0,
						moren:'desc'
					},
					{
						val: "价格由高到低",
						type: 1,
						moren:'desc'
					},
					{
						val: "价格由低到高",
						type: 1,
						moren:'asc '
					},
				],
				currentType: 0, //当前点击的类型
				toggle: true, //true为双列,false为单列
				isAsc: false, //佣金的排序方式
			};
		},
		methods: {
			//综合店家模态框是否显示
			Show() {
				this.isShow = !this.isShow;
			},
			//综合下拉点击事件
			handleZH(item, index) {
				//修改类型
				this.currentType = item.type;
				this.moren=item.moren;
				this.$emit("getType", {
					type: this.currentType,
					toggle: this.toggle,
					moren:this.moren
				});
			},
			//销量点击
			clickXL() {
				this.currentType = "4";
				this.$emit("getType", {
					type: this.currentType,
					toggle: this.toggle,
					moren:'desc'
				});
			},
			//佣金点击
			clickYJ() {
				this.currentType = 2;
				this.$emit("getType", {
					type: this.currentType,
					toggle: this.toggle,
					moren:'desc'
				});
			},
			//单双排切换
			istoggle() {
				this.toggle = !this.toggle;
				this.$emit("getType", {
					toggle: this.toggle,
					ischange: true
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
