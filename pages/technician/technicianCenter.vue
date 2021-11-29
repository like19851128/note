<template>
	<view class="technician-center-container">

		<view class="user-section">
			<image class="bg" mode="aspectFill"
				:src="technicianInfo.headImg ? technicianInfo.headImg : `/static/user-bg.jpg`"></image>
			<view class="info-mask" v-if="technicianInfo.headImg"></view>
			<view class="user-info-box">
				<view class="portrait-box">
					<image mode="aspectFill" class="portrait"
						:src="technicianInfo.headImg || '/static/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<text class="username">{{technicianInfo.nickname || '您好'}}</text>
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
					<view class="tj-item" @click="toCashWithDrawal">
						<text class="num">{{technicianInfo.balanceMoney || 0}}</text>
						<text>余额（提现）</text>
					</view>
					<view class="tj-item" @click.stop="toTechnicianOrder">
						<text class="num">{{technicianInfo.receiveOrderWaiteGetNum || 0}}</text>
						<text>待接单</text>
					</view>
					<!-- <view class="tj-item">
						<text class="num">20</text>
						<text>积分</text>
					</view> -->
				</view>

				<!--邀请、充值 -->
				<view class="tj-sction tj-recharge">
					<!-- 邀请 -->
					<view class="invitation" @click="showDrawer">
						<view class="item">
							<text class="iconfont icon-shijian1"></text>
							<text>离线时段管理</text>
						</view>
						<!-- <view style="opacity: 0">离线时段管理</view> -->
					</view>
					<!-- 充值 -->
					<view class="recharge" @click="onlineOrDown">
						<view class="item">
							<text class="iconfont icon-radio-on-full"
								:class="{active: technicianInfo.status !== 'RESTING'}"></text>
							<text>{{technicianInfo.status == 'RESTING'?'上线': '下线'}}</text>
						</view>
						<!-- <view style="opacity: 0">在线情况</view> -->
					</view>
				</view>
			</view>

			<!-- 各类按钮 -->
			<view class="option-btn" @click.stop="toTechnicianOrder">
				<view class="option-item">
					<text class="iconfont icon-dingdan"></text>
					<text class="font">我的订单</text>
				</view>
				<view class="option-item" @click.stop="toWithdrawalRecords">
					<text class="iconfont icon-tixian1"></text>
					<text class="font">提现记录</text>
				</view>
				<view class="option-item" @click.stop="toSuggestion">
					<text class="iconfont icon-jianyi"></text>
					<text class="font">操作指南</text>
				</view>
				<view class="option-item" @click.stop="toNext('ARTIFICER_AGREEMENT')">
					<text class="iconfont icon-fuwuxieyi"></text>
					<text class="font">技师协议</text>
				</view>
				<view class="option-item" @click.stop="refreshLocation">
					<text class="iconfont icon-dingwei"></text>
					<text class="font">刷新定位</text>
				</view>
				<view class="option-item baojing" @click.stop="callPolice">
					<text class="iconfont icon-baojing"></text>
					<text class="font">双击报警</text>
				</view>
			</view>
		</view>
		<!-- 前往打开权限 -->
		<view class="mask" v-if="showLocationBtn">
			<view class="jurisdiction">
				<view class="tips-title">刷新定位需要开启您的定位功能</view>
				<view class="btns">
					<button class="btn cancel" @click="showLocationBtn = false" type="default">取消</button>
					<button class="btn sure" open-type="openSetting"  @opensetting="getScopes">前往设置</button>
				</view>
			</view>
		</view>
		
		<uni-drawer ref="uniDrawer" :width="300">
			<view class="drawer-con">
				<view>请选择离线时段</view>
				<view class="time-picker">
					<view v-for="(item, index) in times" :key="index">

						<view class="picker-item">
							<text class="picker-title">开始时间：</text>
							<hTimePicker sTime="0" cTime="23" interval="30" @changeTime="change1($event, item, index)">
								<view slot="pCon" class="changeTime">
									{{item.startTime || '选择开始时间'}}
								</view>
							</hTimePicker>
						</view>
						<view class="picker-item">
							<text class="picker-title">结束时间：</text>
							<hTimePicker sTime="0" cTime="23" interval="30" @changeTime="change2($event, item, index)">
								<view slot="pCon" class="changeTime">
									{{item.endTime || '选择结束时间'}}
								</view>
							</hTimePicker>
						</view>
					</view>
				</view>
			</view>
			<button @click="subTime" class="sub-btn" type="default">确定</button>
			<button @click="Offline" class="sub-btn" type="default">下线</button>
		</uni-drawer>
	</view>
</template>
<script>
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import hTimePicker from "@/components/h-timePicker/h-timePicker.vue";
	import {
		mapState
	} from 'vuex';
	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		components: {
			uniDrawer,
			hTimePicker
		},
		data() {
			return {
				showLocationBtn: false,
				technicianInfo: {},
				times: [{}, {}],
				startTime: '',
				endTime: '',
				drawerShow: false,
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				touchStartTime: 0,
			}
		},
		onLoad() {
			// uni.startLocationUpdate({
			// 	success(res) {  
			// 		console.log('开启后台定位', res)  
			// 		uni.onLocationChange(function(res) {  
			// 			console.log('location change', res)  
			// 		})  
			// 	},  
			// 	fail(res) {  
			// 		console.log('开启后台定位失败', res)  
			// 	}  
			// })
			// uni.startLocationUpdate({
			// 	success(res) {  
			// 		console.log('开启后台定位', res)  
			// 		uni.onLocationChange(function(res) {  
			// 			console.log('location change', res)  
			// 		})  
			// 	},  
			// 	fail(res) {  
			// 		console.log('开启后台定位失败', res)  
			// 	}  
			// })
		},
		onShow() {
			this.technicianCenter()
		},
		computed: {
			// ...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			// 开启定位回调
			getScopes(e) {
				console.log(e)
				this.showLocationBtn = false
			},
			// 刷新定位
			refreshLocation() {
				let _this = this
				uni.getLocation({
					type: 'gcj02', // <map> 组件默认为国测局坐标gcj02
					altitude: true,
					success(res) {
						uni.showLoading({
							title: '更新中，请稍候'
						})
						let params = {}
						// #ifdef MP-WEIXIN
						uni.setStorageSync('longitude', res.longitude)
						uni.setStorageSync('latitude', res.latitude)
						params = {
							lngX: uni.getStorageSync('longitude'),
							latY: uni.getStorageSync('latitude')
						}
						// #endif
						
						// #ifdef H5
						sessionStorage.setItem('longitude', res.longitude)
						sessionStorage.setItem('latitude', res.latitude)
						params = {
							lngX: sessionStorage.getItem('longitude'),
							latY: sessionStorage.getItem('latitude')
						}
						// #endif
						
						_this.$api.updateArtificerInfo(params).then(res => {
							if (res.code === 200) {
								_this.$utils.msg('更新成功')
							} else {
								_this.$utils.msg('更新失败')
							}
						})
					},
					fail(err) {
						console.log(err)
						if (err.errMsg.includes('wx.onLocationChange')) {
							_this.$utils.msg('点击过于频繁，请稍候')
							return
						}
						_this.showLocationBtn = true
					},
					// complete() {
					// 	uni.hideLoading()
					// }
				})
			},
			// 双击报警
			callPolice(e) {
				if (e.timeStamp - this.touchStartTime < 300) {
					let params = {
						phone: this.technicianInfo.phone,
						linkId: this.technicianInfo.id,
						typeEnum: 'ARTIFICER_WARNING'
					};
					this.$api.sendSms(params).then(res => {
						this.$utils.msg(res.message)
					})
				}
				this.touchStartTime = e.timeStamp;
			},
			// 跳转协议
			toNext(type) {
				uni.navigateTo({
					url: `/pages/user/agreement?type=${type}`
				})
			},
			// 技师上下线管理
			onlineOrDown() {
				let status = this.technicianInfo.status == 'RESTING' ? 'SERVICEABLE' : 'RESTING'
				let params = {
					id: this.technicianInfo.id,
					status
				}
				this.$api.onlineOrDown(params).then(res => {
					if (res.code === 200) {
						this.$utils.msg(res.message)
						this.technicianCenter()
					}
				})
			},
			// 跳转技师订单列表
			toTechnicianOrder() {
				uni.navigateTo({
					url: `/pages/technician/technicianOrderList`
				})
			},
			// 跳转操作建议
			toSuggestion() {
				uni.navigateTo({
					url: `/pages/user/suggestion?configKey=ARTIFICER_OPERATION_PROPOSAL`
				})
			},
			// 跳转提现记录
			toWithdrawalRecords() {
				uni.navigateTo({
					url: `/pages/user/withdrawalRecords?id=${this.technicianInfo.id}`
				})
			},
			// 提现跳转技师提现
			toCashWithDrawal() {
				uni.navigateTo({
					url: `/pages/technician/cashWithdrawal?id=${this.technicianInfo.id}`
				})
			},
			technicianCenter() {
				this.$api.personCenter({}).then(res => {
					if (res.code === 200) {
						this.technicianInfo = res.data
					}
				})
			},
			// 选择时间后提交
			subTime() {
				if (new Date(this.endTime) <= new Date(this.startTime)) {
					uni.showToast({
						title: '结束时间不能小于开始时间',
						icon: 'none'
					})
					return false
				}
				this.$refs.uniDrawer.close()
			},
			// 下线
			Offline() {
				console.log('下线！！')
				this.$refs.uniDrawer.close()
			},
			// 开始时间选择器
			change1(e, item, index) {
				item.startTime = e
				this.$forceUpdate()
			},
			// 结束时间选择器
			change2(e, item, index) {
				item.endTime = e
				this.$forceUpdate()
			},
			// 抽屉插件
			showDrawer() {
				uni.navigateTo({
					url: `/pages/technician/offlineTime`
				})
				// this.$refs.uniDrawer.open()
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
				})
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
	}
</script>
<style lang='scss' scoped>
	page {
		background: $page-color-base;
	}

	.technician-center-container {
		height: 100vh;
		background: $page-color-base;

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
				/* filter: blur(1px);
				opacity: .7; */
			}

			.info-mask {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: 20;
				background: linear-gradient(to right, $base-color, rgba(0, 0, 0, 0));
			}
		}

		.user-info-box {
			height: 180upx;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 25;

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
			z-index: 30;
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
						height: 100upx;

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

				&:nth-child(-n+4) {
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

		.option-item.baojing {

			.icon-baojing,
			.font {
				color: red;
			}
		}

		.polite-invitation {
			width: 100%;
		}

		/* 抽屉组件样式 */
		.drawer-con {
			padding: 30upx;
		}

		.sub-btn {
			margin-top: 30upx;
			width: 80%;
		}

		.time-picker {
			.picker-item {
				border-bottom: 1upx solid $base-color;
				padding: 20upx 0;
				margin-bottom: 10upx;
				display: flex;
				align-items: center;

				.picker-title {
					font-size: 24upx;
				}

				/* /deep/.rui-picker{
					width: 50%!important;
				} */
			}
		}

		.icon-radio-on-full,
		.icon-shijian1 {
			font-size: 28upx !important;

			&.icon-radio-on-full {
				color: $color-gray;

				&.active {
					color: $base-color;
				}
			}
		}
	}
	 .mask{
	 	position: fixed;
	 	top: 0;
		left: 0;
	 	right: 0;
	 	bottom: 0;
	 	background-color: rgba(0, 0, 0, 0.5);
		z-index: 50;
	 	.jurisdiction{
	 		width: 80%;
	 		padding: 50upx;
	 		background-color: $color-white;
	 		border-radius: 10upx;
	 		position: absolute;
	 		top: 50%;
	 		left: 50%;
	 		transform: translate3d(-50%, -50%, 0);
	 		.tips-title{
	 			text-align: center;
	 			margin-bottom: 50upx;
	 			font-size: 30upx;
	 			font-weight: bold;
	 		}
	 		.btns{
	 			display: flex;
	 			align-items: center;
	 			justify-content: space-between;
	 			.btn {
	 				font-size: 26upx;
	 				width: 45%;
	 				line-height: 80upx;
	 				&.cancel{
	 					color: $color-gray;
	 				}
	 				&.sure{
	 					background-color: $base-color;
	 					color: $color-white;
	 				}
	 			}
	 		}
	 	}
	 }
</style>
