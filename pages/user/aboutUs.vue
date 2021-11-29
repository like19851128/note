<template>
	<view class="aboutUs-container">
		<view class="logo">
			<image src="../../static/logo.png" mode="widthFix"></image>
		</view>
		<view class="drawal-operation">
			<view class="items">
				<view class="left">客服电话：</view>
				<view class="right" @click="callP(configValue.customerService)">{{configValue.customerService}}</view>
			</view>
			<view class="items" @click="toNext('USER_AGREEMENT')">
				<view class="left">用户协议：</view>
				<view class="right">查看 <text class="iconfont icon-jiantouyou"></text></view>
			</view>
			<view class="items" @click="toNext('PRIVACY_AGREEMENT')">
				<view class="left">隐私政策：</view>
				<view class="right">查看 <text class="iconfont icon-jiantouyou"></text></view>
			</view>
			<view class="items">
				<view class="left">商业合作：</view>
				<view class="right" @click="callP(configValue.business)">{{configValue.business}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				hzPhone: '',
				configValue: {}
			}
		},
		onLoad() {
			this.getConfigValue()
		},
		methods: {
			// 拨打电话
			callP(tel) {
				// tel需要为字符串
				uni.makePhoneCall({
					phoneNumber: tel + '',
					success: function() {
						console.log('成功拨打电话')
					}
				})
			},
			// 跳转协议
			toNext(type) {
				uni.navigateTo({
					url: `/pages/user/agreement?type=${type}`
				})
			},
			// 获取客服电话和商业合作
			getConfigValue() {
				let params = {configKey: 'ABOUT_TEL'}
				this.$api.getConfigValue(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						this.configValue = JSON.parse(res.data.configValue)
						console.log(this.configValue)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.aboutUs-container{
		background: $color-lightgray;
		border: 1upx solid rgba(255, 255, 255, 0);
		width: 100%;
		height: 100vh;
		.logo{
			width: 200upx;
			margin: 50upx auto;
			text-align: center;
			image{
				width: 100%;
			}
		}
		.drawal-operation{
			background: #fff;
			.items{
				padding: 0 20upx;
				font-size: 26rpx;
				line-height: 100rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid $color-lightgray;
				&.bz{
						line-height: 40rpx;
						align-items: flex-start;
						margin-top: 30rpx;
						.left{
							width: 100%;
							color: $color-darkgray;
						}
				}
				.left{
					width: 200rpx;
					flex-shrink: 0;
				}
				.right{
					flex: 1;
					color: $color-darkgray;
					text-align: right;
				}
				.input{
					width: 100%;
				}
			}
		}
	}
</style>
