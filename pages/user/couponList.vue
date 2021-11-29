<template>
	<view class="coupon-list-container">
		<!-- 空白页 -->
		<empty v-if="couponList.length === 0 || couponList == null"></empty>

		<template v-else>
			<view class="mask-content">
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<template v-if="item.status !== 'UNUSED'">
						<view v-if="item.status == 'USED'" class="iconfont icon-yishiyong"></view>
						<view v-if="item.status == 'EXPIRED'" class="iconfont icon-yiguoqi"></view>
					</template>
					<view class="con">
						<view class="left">
							<text class="title">{{item.name}}</text>
							<text class="time">有效期至{{item.expireTime | counponsYear}}</text>
						</view>
						<view class="right">
							<text class="price">{{item.money}}</text>
							<text>满{{item.useThresholdMoney}}可用</text>
						</view>

						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips" :style="{opacity: item.description?'1':'0'}">{{item.description}}</text>
				</view>
			</view>
		</template>

	</view>
</template>

<script>
	import empty from "@/components/empty";
	export default {
		components: {
			empty
		},
		data() {
			return {
				couponList: []
			}
		},
		onLoad() {
			this.getCouponList()
		},
		filters: {
			// 优惠券有效期
			counponsYear(val) {
				return val.indexOf(' ') > 0 ? val.split(' ')[0] : val
			}
		},
		methods: {
			getCouponList() {
				let params = {}
				this.$api.getCouponList(params).then(res => {
					if (res.code === 200) {
						this.couponList = res.data
						this.couponList.forEach(item => {
							item.unused = item.status == 'UNUSED'
							item.used = item.status == 'USED'
						})
						console.log(this.couponList)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-list-container {
		border-top: 1px solid rgba(255, 255, 255, 0); // 这个border必须要
		width: 100%;
		height: 100vh;
		background: #f3f3f3;

		.mask-content {
			width: 100%;
			height: 100%;
			background: #f3f3f3;
			transition: .3s;
			overflow-y: scroll;

			/* 优惠券列表 */
			.coupon-item {
				display: flex;
				flex-direction: column;
				margin: 20upx 24upx;
				background: #fff;
				position: relative;
				.iconfont{
					position: absolute;
					top: 20%;
					right: 100upx;
					z-index: 10;
					font-size: 150upx;
					color: $color-gray;
				}
				.con {
					display: flex;
					align-items: center;
					position: relative;
					height: 120upx;
					padding: 0 30upx;

					&:after {
						position: absolute;
						left: 0;
						bottom: 0;
						content: '';
						width: 100%;
						height: 0;
						border-bottom: 1px dashed #f3f3f3;
						transform: scaleY(50%);
					}
				}

				.left {
					display: flex;
					flex-direction: column;
					justify-content: center;
					flex: 1;
					overflow: hidden;
					height: 100upx;
				}

				.title {
					font-size: 32upx;
					color: $font-color-dark;
					margin-bottom: 10upx;
				}

				.time {
					font-size: 24upx;
					color: $font-color-light;
				}

				.right {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 26upx;
					color: $font-color-base;
					height: 100upx;
				}

				.price {
					font-size: 44upx;
					color: $base-color;

					&:before {
						content: '￥';
						font-size: 34upx;
					}
				}

				.tips {
					font-size: 24upx;
					color: $font-color-light;
					line-height: 60upx;
					padding-left: 30upx;
				}

				.circle {
					position: absolute;
					left: -6upx;
					bottom: -10upx;
					z-index: 10;
					width: 20upx;
					height: 20upx;
					background: #f3f3f3;
					border-radius: 100px;

					&.r {
						left: auto;
						right: -6upx;
					}
				}
			}
		}
	}
</style>
