<template>
	<view class="auth-wrapper">
		<image class="logo" src="../../static/img/login.png" mode="widthFix"></image>
		<!-- <view class="txt">{{ isAuth ? '使用微信快捷登录约了摩' : '约了摩需要绑定您的手机号码' }}</view> -->
		<!-- <button v-show="isAuth" class="btn-phone" type="default" open-type="getUserProfile" @getUserProfile="getUserInfo">
			<i class="ico-weixin"></i>
			授权登录
		</button> -->
		<button v-show="isAuth" class="btn-phone" type="default" @click="getUserInfo">
			<i class="ico-weixin"></i>
			授权登录
		</button>
		<button v-show="!isAuth" class="btn-phone" type="default" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
			<i class="ico-phone"></i>
			绑定手机号码
		</button>
		<button type="default" class="btn-phone cancel" @click="cancel">取消</button>
	</view>
</template>

<script>
import fly from '@/api/request.js';
import app from '@/App';
export default {
	onLoad(e) {
		// if (uni.getStorageSync('hasUserInfo')) {
		// 	// 有用户信息，直接让用户注册
		// 	this.isAuth = false;
		// 	uni.getUserProfile({
		// 		success: res => {
		// 			console.log(res);
		// 			if (res.errMsg.includes('ok')) {
		// 				this.iv = res.iv;
		// 				this.encryptedData = res.encryptedData;
		// 			}
		// 		},
		// 		fail: res => {
		// 			console.log('getUserProfile----------fail');
		// 			console.log(res);
		// 		}
		// 	});
		// } else {
		// 	// 没有用户信息，先授权，再注册
		// 	this.isAuth = true;
		// }
		// let that = this;
		// uni.getSetting({
		// 	success: res => {
		// 		console.log(res);
		// 		if (res.authSetting['scope.userInfo']) {
		// 			// 有用户信息，直接让用户注册
		// 			this.isAuth = false;
		// 			uni.getUserInfo({
		// 				success: res => {
		// 					console.log(res);
		// 					if (res.errMsg.includes('ok')) {
		// 						this.iv = res.iv;
		// 						this.encryptedData = res.encryptedData;
		// 					}
		// 				},
		// 				fail: res => {
		// 					console.log('getUserProfile----------fail');
		// 					console.log(res);
		// 				}
		// 			});
		// 		} else {
		// 			// 没有用户信息，先授权，再注册
		// 			this.isAuth = true;
		// 		}
		// 	}
		// });
	},
	onShow() {},
	onUnload() {
		// fly.unlock()
		app.globleData.resquestCount = 0;
		app.globleData.responseCount = 0;
	},
	data() {
		return {
			isAuth: true, // 是否已授权
			params: '' //页面接参
		};
	},
	methods: {
		// 返回
		cancel() {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		},
		// 点击获取电话号码后,先获取code换临时token,再用临时token,iv和encryptedData换正是token
		register(encryptedDataPhone, ivPhone) {
			uni.showLoading({
				title: '请稍候'
			});
			uni.login({
				success: loginRes => {
					if (loginRes.code) {
						console.log(loginRes.code);
						let params = { code: loginRes.code };
						this.$api.getTempToken(params).then(res => {
							if (res.code === 200) {
								const { token, openid, sessionKey, loginRegisterEnum } = res.data;
								let params = {
									tempToken: token,
									iv: this.iv,
									encryptedData: this.encryptedData,
									encryptedDataPhone,
									ivPhone,
									openid,
									loginRegisterEnum,
									inviteesUserId: uni.getStorageSync('invite')
								};
								this.$api.login(params).then(res => {
									if (res.code === 200) {
										// 存入正式token,用户id和身份标识
										uni.setStorageSync('token', res.data.token);
										uni.setStorageSync('userId', res.data.id);
										uni.setStorageSync('identity', res.data.identity);
										uni.setStorageSync('hasUserInfo', true)
										// 注册成功后,删除推荐人ID
										uni.removeStorageSync('invite');
										// 解锁接口请求队列
										// fly.unlock()
										// 返回上一页
										// uni.navigateBack({
										// 	delta: 1
										// })
										uni.hideLoading();
										uni.reLaunch({
											url: '/pages/index/index'
										});
										app.globleData.resquestCount = 0;
										app.globleData.responseCount = 0;
									}
								});
							} else {
								uni.hideLoading();
								console.log('登录失败！' + loginRes.errMsg);
							}
						});
					}
				},
				fail(err) {
					console.log(err);
					uni.hideLoading();
				},
				complete() {
					// uni.hideLoading();
				}
			});
		},
		// 获取用户信息回调
		getUserInfo() {
			uni.showLoading({
				title: '请稍候'
			});
			console.log('getUserInfo-----------')
			let that = this;
			uni.getUserProfile({
				desc : '用于获取用户资料',  
				lang : 'zh_CN', 
				success: res => {
					console.log(res)
					if (res.userInfo && res.errMsg.includes('ok')) {
						this.isAuth = false;
						const { userInfo, errMsg, encryptedData, iv } = res;
						this.encryptedData = encryptedData;
						this.iv = iv;
						console.log(this.encryptedData)
						console.log(this.iv)
					} else {
						console.log('获取userInfo失败！！');
					}
				},
				complete() {
					uni.hideLoading();
				}
			})
			
		},
		// 获取电话号码回调，再请求接口注册
		getPhoneNumber(res) {
			let result = res.detail;
			if (result && result.errMsg.includes('ok')) {
				this.register(res.target.encryptedData, res.target.iv);
			} else {
				console.log(res);
			}
		},
		// 绑定用户信息
		bindMinUser(data) {
			let that = this;
			let pas = {
				bindType: 'min',
				token: uni.getStorageSync('token')
			};
			let params = Object.assign(data, pas);
			that.$api.bindMinUser(params).then(res => {
				if (+res.code === 0) {
					that.showPopup = false;

					uni.navigateBack({});
					// 获取用户信息
					that.getUserByToken();
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
				}
			});
		},
		// 获取用户信息
		getUserByToken() {
			this.$utils
				.getUserByToken()
				.then(result => {
					if (result) {
						if (result.avatar) {
							if (result.avatar.includes('http')) {
								this.avatar = result.avatar;
							} else {
								this.$utils.imgUrl().then(img => {
									this.avatar = img + result.avatar;
								});
							}
						}
						// this.avatar = this.$utils.imgUrl() + result.avatar;
						this.nickname = result.nickname || '';
						this.brief = result.brief || '';
						this.phone = result.phone || '';
					}
					uni.hideLoading();
				})
				.catch(() => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
// @import '@/common/common.less';
.auth-wrapper {
	margin: 0 30rpx;
	text-align: center;
	.logo {
		width: 254rpx;
		margin-top: 320rpx;
	}
	.txt {
		font-size: 30rpx;
		color: #666;
		margin-top: 30rpx;
	}
	.btn-phone,
	.cancel {
		width: 513rpx;
		height: 90rpx;
		// line-height: 90rpx;
		border-radius: 45rpx;
		background: $base-color;
		color: #fff;
		font-size: 30rpx;
		margin-top: 155rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		&.cancel {
			background-color: #fff;
			border: 1rpx solid #333;
			color: #333;
			margin-top: 20rpx;
		}
		.ico-phone {
			width: 29rpx;
			height: 35rpx;
			background: url(../../static/img/ico_phone.png) no-repeat;
			background-size: 100% 100%;
			margin-right: 20rpx;
		}
		.ico-weixin {
			width: 42rpx;
			height: 34rpx;
			background: url(../../static/img/ico_weixin.png) no-repeat;
			background-size: 100% 100%;
			margin-right: 20rpx;
		}
	}
}
</style>
