<template>
	<view class="recharge-container">
		<view class="balance">
			<view class="title">当前余额(元)</view>
			<view class="balance-money">{{account}}</view>
		</view>
		<view class="records-detail" @click="toRechargeRecords">
			<view class="item">充值记录</view>
			<view class="item">消费明细</view>
		</view>
		<view class="recharge-con">
			<view class="need-recharge">
				<view class="text-title">---我要充值---</view>
				<view class="money-items" v-for="(item, index) in configValue" :key="index" @click="recharge(item)">
					<view class="left">
						<view class="money">¥<text class="num">{{item.money}}</text></view>
						<view class="reward">{{item.content}}</view>
					</view>
					<view class="right">立即充值</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payState: true,
				configValue: [],
				account: 0
			}
		},
		onLoad() {
			this.getRechargeTemplateList()
			this.userAccount()
		},
		methods:{
			// 获取用户余额
			userAccount() {
				this.$api.userAccount({}).then(res => {
					if (res.code === 200) {
						this.account = res.data.availableBalance
					}
				})
			},
			// 获取充值券列表
			getRechargeTemplateList() {
				this.$api.getRechargeTemplateList({}).then(res => {
					console.log(res)
					if (res.code === 200) {
						this.configValue = res.data
						console.log(this.configValue)
					}
				})
			},
			toRechargeRecords() {
				uni.navigateTo({
					url: '/pages/user/rechargeRecords'
				})
			},
			recharge(item) {
				let _this = this
				if (!this.payState) return
				this.payState = false
				uni.showLoading({
					title: '请稍候',
					mask:true,
				})
				let params = {code: item.code}
				this.$api.orderInfoRecharge(params).then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.data.timeStamp,
							nonceStr: res.data.nonceStr,
							package: res.data.packageName,
							signType: res.data.signType,
							paySign: res.data.paySign,
							success(res) {
								_this.$utils.msg('支付成功！')
								uni.switchTab({
									url: '/pages/user/user'
								})
							},
							fail(err) {
								_this.$utils.msg(err)
								console.log('pay err', err);
							},
							complete(e) {
								_this.$forceUpdate();
								console.log('pay complete', e);
							}
						})
					}
					setTimeout(() => {
						this.payState = true;
					}, 1000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.recharge-container {
		height: 100vh;
		background-color: $color-lightgray;
		width: 100%;
		.balance{
			border-radius: 10rpx;
			margin: 10rpx 20rpx;
			background-color: $base-color;
			padding: 50rpx;
			color: #fff;
			font-size: 36rpx;
			>view{
				width: 100%;
				text-align: center;
			}
			.balance-money{
				margin-top: 20rpx;
				font-size: 40rpx;
			}
		}
		.records-detail{
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: space-around;
			line-height: 60rpx;
			font-size: 26rpx;
			.item {
				position: relative;
				&::before{
					content: '';
					width: 20rpx;
					height: 20rpx;
					background-color: $base-color;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translate3d(-150%, -50%, 0);
				}
			}
		}
		.recharge-con{
			.need-recharge{
				padding: 0 20rpx;
				background-color: $color-lightgray;
				.text-title{
					width: 100%;
					line-height: 50px;
					text-align: center;
					font-size: 26rpx;
					color: $color-gray;
				}
				.money-items{
					border-radius: 10rpx;
					overflow: hidden;
					height: 100%;
					display: flex;
					align-items: center;
					background-color: #fff;
					font-size: 26rpx;
					margin-bottom: 20rpx;
					.left{
						width: 70%;
						height: 150rpx;
						align-items: center;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						text-align: center;
						padding: 0 30rpx;
						.money{
							width: 100%;
							border-bottom: 1rpx solid $color-lightgray;
							padding-bottom: 10rpx;
							margin-bottom: 10rpx;
							.num{
								font-size: 34rpx;
								font-weight: bold;
							}
						}
						.reward{
							color: $base-color;
						}
					}
					.right{
						width: 30%;
						line-height: 150rpx;
						text-align: center;
						color: #fff;
						background: linear-gradient(to right, #9B6483, $base-color);
					}
				}
			}
		}
	}
</style>
