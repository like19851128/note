<template>
	<view class="invitation-container">
		<view class="invitation-bg">
			<image class="title-img" :src="bgImg" mode="widthFix"></image>
			<view class="invitation-btn" @click="toggleMask">邀请有礼</view>
			<view class="rule-con">
				<view class="rule-title">---活动规则---</view>
				<view class="rule-text">{{rule}}</view>
			</view>
		</view>
		<view class="action-sheet-mask" v-if="showActionSheet" @click.self="toggleMask">
			<view class="action-sheet">
				<button class="action-item" type="default" open-type="share">
					<image class="img" src="../../static/img/invitation-friend.png" mode=""></image>
					<view class="text">分享好友</view>
				</button>
				<button class="action-item" @click.stop="toQr" type="default">
					<image class="img" src="../../static/img/invitation-qrcode.png" mode=""></image>
					<view class="text">生成二维码</view>
				</button>
			</view>
		</view>
		<view class="qr-mask" v-if="showQR" @click.self="toggleQR">
			<view class="qr-con">
				<view class="qr-title">扫描二维码</view>
				<view class="qr-text" v-if="qrCode">
					<image class="qrCode" :src="qrCode" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				qrCode: '',
				rule: '0',
				bgImg: '',
				showQR: false,
				showActionSheet: false
			}
		},
		onLoad() {
			uni.hideShareMenu()
			this.getConfigValue()
		},
		onShareAppMessage() {
			return {
				title: '邀请有礼',
				path: `pages/index/index?invite=${uni.getStorageSync('userId') || ''}`,
				imageUrl: './../../static/img/login.png'
			}
		},
		methods: {
			toggleQR() {
				this.showQR = !this.showQR
			},
			// 弹出二维码弹窗
			toQr() {
				// this.showActionSheet = false
				this.saveWxacodeunlimit()
				this.toggleMask()
				this.showQR = true
			},
			saveWxacodeunlimit() {
				let params = {}
				// #ifdef MP-WEIXIN
				params = {scene: `invite#${uni.getStorageSync('userId')}`, page: 'pages/index/index'}
				// #endif
				
				// #ifdef H5
				params = {scene: `invite#${sessionStorage.getItem('userId')}`, page: 'pages/index/index'}
				// #endif
				this.$api.saveWxacodeunlimit(params).then(res => {
					if (res.code === 200) {
						this.qrCode = res.data
						console.log(this.qrCode)
					}
				})
			},
			// 邀请有礼的配置
			getConfigValue() {
				let params = {configKey: 'INVITATION_RULES'}
				this.$api.getConfigValue(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						let result = JSON.parse(res.data.configValue)
						this.rule = result.content
						this.bgImg = result.background
					}
				})
			},
			// 开启,关闭弹窗
			toggleMask() {
				this.showActionSheet = !this.showActionSheet
			},
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: $color-lightgray;
	}
	.invitation-container{
		width: 100%;
		height: 100vh;
		background: $color-lightgray;
		.invitation-bg{
			border: 1rpx solid rgba(255, 255, 255, 0); // 这个border-top要保留 不然会出现空白条
			.title-img{
				width: 100%;
			}
			.invitation-btn{
				width: 80%;
				line-height: 100upx;
				text-align: center;
				background: $base-color;
				color: #fff;
				margin: 30upx auto;
				border-radius: 10upx;
				
			}
			.rule-con{
				background: #fff;
				width: 90%;
				margin: 0 auto 20upx;
				border-radius: 10upx;
				.rule-title{
					width: 100%;
					text-align: center;
					line-height: 80upx;
					color: $color-gray;
				}
				.rule-text{
					padding: 0 20upx 20upx;
				}
			}
		}
		.action-sheet-mask, .qr-mask{
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.2);
			z-index: 10;
			.action-sheet{
				width: 100%;
				position: absolute;
				background: #fff;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 220upx;
				display: flex;
				align-items: center;
				justify-content: space-around;
				padding: 20upx;
				.action-item{
					text-align: center;
					height: 140upx;
					background: none;
					&::after {
					   border: none;
					}
					.img{
						width: 80upx;
						height: 80upx;
					}
					.text{
						font-size: 28upx;
						margin-top: -40upx;
					}
				}
			}
		}
		.qr-mask{
			z-index: 20;
			.qr-con{
				width: 90%;
				position: absolute;
				background: #fff;
				top: 50%;
				left: 50%;
				transform: translate3d(-50%, -50%, 0);
				padding: 30upx;
				border-radius: 20upx;
				text-align: center;
				.qr-title{
					font-size: 32upx;
					font-weight: bold;
					margin-bottom: 30upx;
				}
				.qr-text{
					.qrCode{
						width: 200px;
						height: 200px;
					}
				}
			}
		}
	}
</style>
