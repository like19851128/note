<template>
	<view class="container">
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box" @click="login">
				<view class="portrait-box"><image class="portrait" :src="customerUser.avatarUrl || '/static/missing-face.png'"></image></view>
				<view class="info-box">
					<text class="username" v-if="customerUser.nickName">{{customerUser.nickName}}</text>
					<text class="username" v-else>登录</text>
				</view>
			</view>
			<!-- <view class="vip-card-box">
				<image class="card-bg" src="/static/vip-card-bg.png" mode=""></image>
				<view class="b-btn">
					立即开通
				</view>
				<view class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					DCloud会员
				</view>
				<text class="e-m">DCloud Union</text>
				<text class="e-b">开通会员开发无bug 一测就上线</text>
			</view> -->
		</view>

		<view class="cover-container">
			<!-- <image class="arc" src="/static/arc.png"></image> -->

			<!-- 余额，充值 -->
			<view class="sction-recharge">
				<!-- 余额、优惠券 -->
				<view class="tj-sction">
					<view class="tj-item">
						<text class="num">{{userInfo.account || 0}}</text>
						<text>余额</text>
					</view>
					<view class="tj-item" @click="checkLogin(toCouponList)">
						<text class="num">{{userInfo.couponCount || 0}}</text>
						<text>优惠券</text>
					</view>
					<!-- <view class="tj-item">
						<text class="num">20</text>
						<text>积分</text>
					</view> -->
				</view>

				<!--邀请、充值 -->
				<view class="tj-sction tj-recharge">
					<!-- 邀请 -->
					<view class="invitation" @click="checkLogin(toInvitation)">
						<view class="item">
							<text class="iconfont icon-liwu"></text>
							<text>邀请有礼</text>
						</view>
						<view>邀请好友，得更多奖励</view>
					</view>
					<!-- 充值 -->
					<view class="recharge" @click="checkLogin(toRecharge)">
						<view class="item">
							<text class="iconfont icon-chongzhi01"></text>
							<text>充值</text>
						</view>
						<view>余额充值，更享优惠</view>
					</view>
				</view>
			</view>

			<!-- 收藏等按钮 -->
			<view class="option-btn">
				<view class="option-item" @click.stop="checkLogin(toCollectionList)">
					<text class="iconfont icon-shoucang"></text>
					<text class="font">我的收藏</text>
				</view>
				<view class="option-item" @click.stop="checkLogin(toAddress)">
					<text class="iconfont icon-dingwei"></text>
					<text class="font">地址管理</text>
				</view>
				<view class="option-item" @click="toSuggestion">
					<text class="iconfont icon-jianyi"></text>
					<text class="font">操作指南</text>
				</view>
				<button class="option-item btn" open-type='contact'>
					<text class="iconfont icon-service"></text>
					<view class="font">在线咨询</view>
				</button>
				<view class="option-item" @click.stop="callUs(configValue.customerService)">
					<text class="iconfont icon-dianhualianxifangshi"></text>
					<text class="font">电话咨询</text>
				</view>
				<view class="option-item" @click.stop="toAboutUs">
					<text class="iconfont icon-guanyuwomen"></text>
					<text class="font">关于我们</text>
				</view>
				<!-- <button class="option-item btn" open-type='openSetting'>
					<text class="iconfont icon-shezhi"></text>
					<view class="font">设置</view>
				</button> -->
				<view class="option-item" v-if="!userInfo.artificer" @click.stop="checkLogin(technicianRegister)">
					<text class="iconfont icon-dashiruzhu"></text>
					<text class="font">入驻</text>
				</view>
				<view class="option-item" v-else @click.stop="toTechnicianCenter">
					<text class="iconfont icon-dashiruzhu"></text>
					<text class="font">技师入口</text>
				</view>
			</view>

			<view class="polite-invitation">
				<image src="../../static/invitation-img.jpg" mode="widthFix" @click.stop="checkLogin(toInvitation)"></image>
			</view>
		</view>
	</view>
</template>
<script>
import { mapState } from 'vuex';
let startY = 0,
	moveY = 0,
	pageAtTop = true;
export default {
	data() {
		return {
			configValue: {}, 
			userInfo: {}, // 个人其他信息
			customerUser: {}, // 个人信息
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false
		};
	},
	onLoad() {},
	onShow() {
		// #ifdef MP-WEIXIN
		uni.getStorageSync('token') && this.userCenter()
		// #endif
		
		// #ifdef H5
		sessionStorage.getItem('token') && this.userCenter()
		// #endif
		
		this.getConfigValue()
	},
	// #ifndef MP
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			this.navTo('/pages/set/set');
		} else if (index === 1) {
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			uni.navigateTo({
				url: '/pages/notice/notice'
			});
		}
	},
	// #endif
	computed: {
		// ...mapState(['hasLogin', 'userInfo'])
	},
	methods: {
		// 打电话
		callUs(tel) {
			if (!tel) return
			// tel需要为字符串
			uni.makePhoneCall({
				phoneNumber: tel + '',
				success: function() {
					console.log('成功拨打电话')
				}
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
		// 跳转地址管理
		toAddress() {
			uni.navigateTo({
				url: `/pages/address/address`
			})
		},
		// 跳转操作建议
		toSuggestion() {
			uni.navigateTo({
				url: `/pages/user/suggestion?configKey=OPERATION_PROPOSAL`
			})
		},
		// 跳转邀请页面
		toInvitation() {
			uni.navigateTo({
				url: `/pages/user/invitation`
			})
		},
		// 跳转充值
		toRecharge() {
			uni.navigateTo({
				url: `/pages/user/recharge`
			})
		},
		// 收藏列表
		toCollectionList() {
			uni.navigateTo({
				url: `/pages/user/collectionList`
			})
		},
		// 关于我们
		toAboutUs() {
			uni.navigateTo({
				url: `/pages/user/aboutUs`
			})
		},
		// 优惠券列表
		toCouponList() {
			uni.navigateTo({
				url: '/pages/user/couponList'
			})
		},
		// 技师中心
		toTechnicianCenter() {
			uni.navigateTo({
				url: '/pages/technician/technicianCenter'
			})
		},
		// 跳转之前先验证是否登录
		checkLogin(fn) {
			this.$utils.verificationLogin(fn)
		},
		// 入驻
		technicianRegister() {
			if (this.userInfo.isAddSettleInInfo) return this.$utils.msg('您已提交资料，请耐心等待平台审核')
			uni.navigateTo({
				url: '/pages/technician/technicianUploadImg'
			})
		},
		// 跳转登录页
		login() {
			// 如果没有用户信息,说明该token已经失效,需要清除token信息, 这样用户才能点击登陆
			if (Object.keys(this.userInfo).length == 0) {
				wx.removeStorageSync('token')
				wx.removeStorageSync('userId')
				wx.removeStorageSync('identity')
			}
			// #ifdef MP-WEIXIN
			if (uni.getStorageSync('token')) return
			// #endif
			// #ifdef H5
			if (sessionStorage.getItem('token')) return
			// #endif
			uni.navigateTo({
				url: '/pages/user/auth'
			})
		},
		// 用户中心数据
		userCenter() {
			this.$api.userCenter({}).then(res => {
				if (res.code === 200) {
					this.userInfo = res.data
					console.log(this.userInfo)
					this.customerUser = res.data.customerUser
					// #ifdef MP-WEIXIN
					uni.setStorageSync('identity', res.data.customerUser.identity)
					// #endif
					
					// #ifdef H5
					sessionStorage.setItem('identity', res.data.customerUser.identity)
					// #endif
					
					console.log(this.customerUser)
				}
			})
		},
		/**
		 * 统一跳转接口,拦截未登录路由
		 * navigator标签现在默认没有转场动画，所以用view
		 */
		navTo(url) {
			if (!this.hasLogin) {
				url = '/pages/public/login';
			}
			uni.navigateTo({
				url
			});
		},

		/**
		 *  会员卡下拉和回弹
		 *  1.关闭bounce避免ios端下拉冲突
		 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
		 *    transition设置0.1秒延迟，让css来过渡这段空窗期
		 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
		 */
		coverTouchstart(e) {
			if (pageAtTop === false) {
				return;
			}
			this.coverTransition = 'transform .1s linear';
			startY = e.touches[0].clientY;
		},
		coverTouchmove(e) {
			moveY = e.touches[0].clientY;
			let moveDistance = moveY - startY;
			if (moveDistance < 0) {
				this.moving = false;
				return;
			}
			this.moving = true;
			if (moveDistance >= 80 && moveDistance < 100) {
				moveDistance = 80;
			}

			if (moveDistance > 0 && moveDistance <= 80) {
				this.coverTransform = `translateY(${moveDistance}px)`;
			}
		},
		coverTouchend() {
			if (this.moving === false) {
				return;
			}
			this.moving = false;
			this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
			this.coverTransform = 'translateY(0px)';
		}
	}
};
</script>
<style lang="scss">
page {
	background: $page-color-base;
}
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
%section {
	display: flex;
	justify-content: space-around;
	align-content: center;
	background: #fff;
	border-radius: 10upx;
}

.user-section {
	height: 460upx;
	padding: 100upx 30upx 0;
	position: relative;
	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		// filter: blur(1px);
		// opacity: 0.7;
	}
}
.user-info-box {
	height: 180upx;
	display: flex;
	align-items: center;
	position: relative;
	z-index: 1;
	.portrait {
		width: 130upx;
		height: 130upx;
		border: 5upx solid #fff;
		border-radius: 50%;
	}
	.username {
		font-size: $font-lg + 10upx;
		color: #fff;
		margin-left: 20upx;
	}
}

.cover-container {
	padding: 0 30upx;
	position: relative;
	padding-bottom: 20upx;
}
.sction-recharge {
	margin-top: -200upx;
	position: relative;
	z-index: 10;
	.tj-sction {
		background: none;
		@extend %section;
		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #fff;
		}
		.num {
			font-size: $font-lg + 6upx;
			color: #fff;
			margin-bottom: 8upx;
		}
	}
	.tj-recharge {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.invitation,
		.recharge {
			text-align: center;
			font-size: 22upx;
			width: 45%;
			padding: 10upx 30upx;
			background: #fff;
			line-height: 2;
			border-radius: 15upx;
			.item {
				display: flex;
				align-items: center;
				justify-content: center;
				text:first-child {
					font-size: 36upx;
					margin-right: 10upx;
				}
			}
		}
	}
}

.option-btn {
	margin: 30upx 0;
	border-radius: 15upx;
	padding: 30upx;
	background: #fff;
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	.option-item {
		width: 25%;
		margin-top: 30upx;
		&.btn{
			width: 25%!important;
			background: none;
			height: 120upx;
			margin-left: 0;
			margin-right: 0;
			&::after{
				border: none;
			}
			.font{
				margin-top: -30upx;
			}
		}
		&:nth-child(-n + 4) {
			margin-top: 0;
		}
		text {
			display: inline-block;
			width: 100%;
			text-align: center;
		}
		.iconfont {
			font-size: 32upx;
		}
		.font {
			font-size: 24upx;
		}
	}
}

.polite-invitation {
	width: 100%;
	image{
		width: 100%;
	}
}
</style>
