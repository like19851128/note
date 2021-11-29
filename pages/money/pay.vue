<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{orderDetail.orderMoney}}</text>
		</view>

		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">服务项目：</text>
				<text class="cell-tip">{{orderDetail.projectName}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">技师姓名：</text>
				<text class="cell-tip">{{orderDetail.artificerNickname}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">服务地址：</text>
				<text class="cell-tip">{{orderDetail.address}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">服务时间：</text>
				<text class="cell-tip">{{orderDetail.appointmentStartTime}}</text>
			</view>
			<!-- <view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注：</text>
				<text class="cell-tip">备注</text>
			</view> -->
		</view>

		<view class="pay-type-list">
			<view class="type-item b-b" @click="changePayType(1)">
				<!-- <text class="icon yticon icon-weixinzhifu"></text> -->
				<view class="con">
					<text class="tit">微信支付</text>
					<text>使用微信支付</text>
				</view>
				<label class="radio">
					<radio color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view class="type-item" @click="changePayType(2)">
				<!-- <text class="icon yticon icon-erjiye-yucunkuan"></text> -->
				<view class="con">
					<text class="tit">余额支付</text>
					<text>可用余额 ¥{{availableBalance || 0}}</text>
				</view>
				<label class="radio">
					<radio color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view>
		</view>

		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	// #ifdef H5
	import swan from './../../utils/swan'
	// #endif
	export default {
		data() {
			return {
				payState: true, // 防重复点击
				availableBalance: '', // 用户余额
				orderNo: '',
				payType: 1,
				orderDetail: {}
			};
		},
		computed: {},
		onLoad(e) {
			this.orderNo = e.orderNo
			this.getorderDetail()
			this.userAccount()
		},

		methods: {
			// 获取用户余额
			userAccount() {
				this.$api.userAccount({}).then(res => {
					if (res.code === 200) {
						this.availableBalance = res.data.availableBalance
					}
				})
			},
			// 获取微信支付参数
			orderInfoPay() {
				let params = {
					orderNo: this.orderNo
				}
				this.$api.orderInfoPay(params).then(res => {
					if (res.code === 200) {
						console.log(res)
					}
				})
			},
			// 请求订单详情
			getorderDetail() {
				let params = {
					orderNo: this.orderNo
				}
				this.$api.orderDetail(params).then(res => {
					if (res.code === 200) {
						this.orderDetail = res.data
					}
				})
			},
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
			confirm: async function() {
				if (this.payType == 2 && this.availableBalance < this.orderDetail.orderMoney) return this.$utils.msg(
					'您的余额不足，请使用其他方式支付')
				if (!this.payState) return
				this.payState = false
				let _this = this
				let params = {
					orderNo: this.orderNo,
					payType: this.payType
				}
				this.$api.orderInfoPay(params).then(res => {
					if (res.code === 200) {
						console.log(res)
						if (this.payType == 1) { // 如果是微信支付，则唤起微信支付
						// #ifdef MP-WEIXIN
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: res.data.timeStamp,
								nonceStr: res.data.nonceStr,
								package: res.data.packageName,
								signType: res.data.signType,
								paySign: res.data.paySign,
								success(res) {
									_this.$utils.msg('支付成功！')
									uni.redirectTo({
										url: `/pages/money/paySuccess`
									})
								},
								fail(err) {
									_this.$utils.msg(err)
									uni.reLaunch({
										url: `/pages/order/order`
									})
								},
								complete(e) {
									_this.payState = true;
									_this.$forceUpdate();
									console.log('pay complete', e);
								}
							});
						// #endif
						
						// #ifdef H5
						console.log(swan)
						// uni.requestPayment({
						// 	provider: 'wxpay',
						// 	timeStamp: res.data.timeStamp,
						// 	nonceStr: res.data.nonceStr,
						// 	package: res.data.packageName,
						// 	signType: res.data.signType,
						// 	paySign: res.data.paySign,
						// 	success(res) {
						// 		_this.$utils.msg('支付成功！')
						// 		uni.redirectTo({
						// 			url: `/pages/money/paySuccess`
						// 		})
						// 	},
						// 	fail(err) {
						// 		_this.$utils.msg(err)
						// 		uni.reLaunch({
						// 			url: `/pages/order/order`
						// 		})
						// 	},
						// 	complete(e) {
						// 		_this.payState = true;
						// 		_this.$forceUpdate();
						// 		console.log('pay complete', e);
						// 	}
						// });
						// #endif
						
						} else if (this.payType == 2) { // 如果是余额，直接跳转订单列表
							_this.$utils.msg('支付成功！')
							uni.redirectTo({
								url: `/pages/money/paySuccess`
							})
						}
					} else {
						this.$utils.msg(res.message)
						this.payState = true;
					}
				})
			},
		}
	}
</script>

<style lang='scss' scoped>
	.app {
		width: 100%;
		background-color: $color-lightgray;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;

		.yt-list-cell {
			display: flex;
			align-items: flex-start;
			padding: 25upx 30upx 25upx 40upx;
			line-height: 40upx;
			position: relative;

			&.cell-hover {
				background: #fafafa;
			}

			&.b-b:after {
				left: 30upx;
			}

			.cell-icon {
				height: 32upx;
				width: 32upx;
				font-size: 22upx;
				color: #fff;
				text-align: center;
				line-height: 32upx;
				background: #f85e52;
				border-radius: 4upx;
				margin-right: 12upx;

				&.hb {
					background: #ffaa0e;
				}

				&.lpk {
					background: #3ab54a;
				}

			}

			.cell-more {
				align-self: center;
				font-size: 24upx;
				color: $font-color-light;
				margin-left: 8upx;
				margin-right: -10upx;
			}

			.cell-tit {
				flex-shrink: 0;
				font-size: 26upx;
				color: $font-color-light;
				margin-right: 20upx;
			}

			.cell-tip {
				font-size: 26upx;
				color: $font-color-dark;

				&.disabled {
					color: $font-color-light;
				}

				&.active {
					color: $base-color;
				}

				&.red {
					color: $base-color;
				}
			}

			&.desc-cell {
				.cell-tit {
					max-width: 90upx;
				}
			}

			.desc {
				flex: 1;
				font-size: $font-base;
				color: $font-color-dark;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 20upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0 20upx 20upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 20upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
