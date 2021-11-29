<template>
	<view>
		<!-- 地址 -->
		<navigator url="/pages/address/address?source=1" class="address-section">
			<view class="order-content" v-if="JSON.stringify(addressData) !== '{}'">
				<text class="iconfont icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{addressData.name}}</text>
						<text class="mobile">{{addressData.tel}}</text>
					</view>
					<text class="address">{{addressData.address}} {{addressData.area || ''}}</text>
				</view>
				<text class="iconfont icon-jiantouyou"></text>
			</view>
			<view class="order-content" v-if="JSON.stringify(addressData) == '{}'">
				<text class="iconfont icon-shouhuodizhi"></text>
				<view class="cen">填写地址</view>
				<text class="iconfont icon-jiantouyou"></text>
			</view>
		</navigator>

		<view class="goods-section">
			<view class="g-item">
				<image :src="technicianDetail.headImg" mode="aspectFill"></image>
				<view class="right relative">
					<text class="title clamp">{{productDetail.name}}</text>
					<text class="spec">技师：{{technicianDetail.nickname}}</text>
					<view class="price-box">
						<text class="price">￥{{productDetail.tradePrice}}</text>
						<text class="number">x 1</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 优惠明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b" @click="serviceShowTime(1)">
				<text class="cell-tit clamp">服务时间</text>
				<text class="cell-tip disabled">{{serveTime || '请选择服务时间'}}</text>
			</view>
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					{{couponName || '选择优惠券'}}
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list bottom">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{productDetail.tradePrice}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">距离</text>
				<text class="cell-tip">{{trafficMile<=1?'&lt1':trafficMile}}公里</text>
			</view>
			<view class="yt-list-cell arrow">
				<text class="cell-tit clamp">交通费用</text>
				<lb-picker ref="trafficPicker" mode="selector" :list="trafficList" @confirm="confirm">
					<text @click="showTrafficPicker"
						class="cell-tip">{{trafficMoney?`${showTrafficType(trafficType)}  ￥${trafficMoney}`:'请选择交通方式'}}</text>
				</lb-picker>
				<view class="iconfont icon-jiantouyou"></view>
			</view>
			<view class="traffic-tips">注：3KM之内可选择公交/地铁，距离超出范围将默认为出租车/滴滴来计算出行费用。</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-￥{{discountPrice}}</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="remark" placeholder="请填写备注信息(非必填)"
					placeholder-class="placeholder" />
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{settlementPrice.toFixed(2)}}</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>

		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<view class="dont-use-con">
					<view v-if="couponList && couponList.length>0" class="dont-use" @click="resetCoupon">
						不使用优惠券
					</view>
				</view>
				<empty mart="true" v-if="couponList.length === 0 || couponList == null"></empty>
				<template v-else>
					<!-- 优惠券页面，仿mt -->
					<view :class="{active: item.isChoosed}" class="coupon-item" v-for="(item,index) in couponList"
						:key="index" @click="chooseCoupon(item, index)">
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
						<text class="tips">{{item.description}}</text>
					</view>
				</template>
			</view>
		</view>
		<w-time-picker ref="picker" @confirm="onConfirm" @cancel="onCancel" :afterDays="2" :projectId="id"
			:artificerId="artificerId"></w-time-picker>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'
	import wTimePicker from "@/components/w-time-picker.vue";
	import LbPicker from '@/components/lb-picker'
	import empty from "@/components/empty";
	export default {
		components: {
			uniNumberBox,
			wTimePicker,
			LbPicker,
			empty
		},
		filters: {
			// 优惠券有效期
			counponsYear(val) {
				return val.indexOf(' ') > 0 ? val.split(' ')[0] : val
			}
		},
		data() {
			return {
				trafficList1: [{
						label: '出租车/滴滴',
						value: 0
					},
					{
						label: '公交/地铁',
						value: 1
					}
				],
				trafficList: [], // 实际用来计算交通方式的
				trafficType: 0, // 交通方式
				trafficMoney: 0, // 交通金额
				trafficMile: 0, // 公里数
				discountPrice: 0, // 优惠金额
				couponName: '', // 优惠券名称
				couponId: 0, // 优惠券id
				serveTime: '', // 服务时间
				technicianDetail: {}, // 技师详情
				productDetail: {}, // 项目详情
				artificerId: '', // 技师id
				id: '', // 项目id
				// empty: false,
				// serviceNumber: 0, // 服务数量
				maskState: 0, //优惠券面板显示状态
				remark: '', //备注
				// payType: 1, //1微信 2支付宝
				couponList: [],
				addressData: {}
			}
		},
		computed: {
			// 最终价格
			settlementPrice() {
				return this.productDetail.tradePrice + (this.trafficMoney || 0) - this.discountPrice
			}
		},
		watch: {
			addressData: {
				handler: function(val) {
					if (val.id) {
						this.localTraveFare();
					}
				},
				deep: true
			}
		},
		onLoad(option) {
			this.id = option.id
			this.artificerId = option.artificerId
			// this.timeInterval()
			// this.$refs.picker.show()
			this.getArtificerInfoDetail()
			this.getProjectInfoDetail()
			this.getCouponAvailableList()
			this.customerAddress()
			//商品数据
			//let data = JSON.parse(option.data);
			//console.log(data);
		},
		onShow() {},
		methods: {
			// 不使用优惠券
			resetCoupon() {
				this.couponList.forEach((itm, idx) => {
					itm.isChoosed = false
					this.discountPrice = 0
					this.couponId = 0
					this.couponName = ''
				})
				this.toggleMask()
			},
			// 选择交通方式
			showTrafficPicker() {
				if (!this.addressData.id) return this.$utils.msg('请先选择地址')
				this.$refs.trafficPicker.show()
			},
			// 转换中文
			showTrafficType(val) {
				return val === 0 ? '出租车/滴滴' : '公交/地铁'
			},
			// 选择出行方式
			confirm(e) {
				this.trafficType = e.item.value
				this.localTraveFare()
			},
			localTraveFare() {
				let param = {
					typeEnums: this.trafficType === 0 ? "TAXI" : "SUBWAY",
					artificerId: this.artificerId,
					addressId: this.addressData.id,
				}
				this.$api.travelFare(param).then(res => {
					if (res.code === 200) {
						this.trafficMoney = res.data.rare || 0
						this.trafficMile = res.data.kilometre
					} else {
						this.trafficMoney = 0
						this.trafficMile = 0
						wx.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
					}
					if (this.trafficMile > 3) {
						this.trafficList = this.trafficList1.slice(0, 1)
					} else {
						this.trafficList = this.trafficList1
					}
				}).catch(err => {
					this.trafficMoney = 0
					this.trafficType = 0
				});
			},
			// 获取用户地址列表
			customerAddress() {
				this.$api.customerAddress({}).then(res => {
					if (res.code === 200 && res.data) {
						res.data.forEach(item => {
							console.log(item)
							item.isDefault && (this.addressData = item)
						})
					}
				})
			},
			// 选择优惠券
			chooseCoupon(item, index) {
				this.couponList.forEach((itm, idx) => {
					itm.isChoosed = idx === index ? true : false
					if (idx === index) {
						this.discountPrice = itm.money
						this.couponId = itm.id
						this.couponName = itm.name
					}
				})
				this.toggleMask()
			},
			// 获取卡券列表-不分页
			getCouponAvailableList() {
				let params = {
					projectId: this.id
				}
				this.$api.getCouponAvailableList(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						this.couponList = res.data
						this.couponList.forEach(item => {
							item.isChoosed = false
						})
					}
				})
			},
			// 获取技师可服务时间
			timeInterval() {
				let params = {
					artificerId: this.artificerId,
					day: 0,
					projectId: this.id
				}
				this.$api.timeInterval(params).then(res => {
					console.log(res)
				})
			},
			// 显示技师服务时间
			serviceShowTime(type) {
				type ? this.$refs.picker.show() : this.$refs.picker.hide()
			},
			// 技师时间选择确定
			onConfirm(e) {
				this.serveTime = e
			},
			// 技师时间选择取消
			onCancel(e) {},
			//数量
			// numberChange(data){
			// 	this.serviceNumber = data.number;
			// 	this.calcTotal();
			// },
			//计算总价
			// calcTotal(){
			// 	// let list = this.serviceList;
			// 	// if(list.length === 0){
			// 	// 	this.empty = true;
			// 	// 	return;
			// 	// }
			// 	let total = 0;
			// 	let checked = true;
			// 	// list.forEach(item=>{
			// 	// 	if(item.checked === true){
			// 			total += item.price * item.number;
			// 	// 	}else if(checked === true){
			// 	// 		checked = false;
			// 	// 	}
			// 	// })
			// 	// this.allChecked = checked;
			// 	this.total = Number(total.toFixed(2));
			// },
			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			// 获取技师详情
			async getArtificerInfoDetail() {
				let params = {}
				// #ifdef MP-WEIXIN
				params = {
					id: this.artificerId,
					lngX: uni.getStorageSync('longitude') || 0,
					latY: uni.getStorageSync('latitude') || 0
				}
				// #endif

				// #ifdef H5
				params = {
					id: this.artificerId,
					lngX: sessionStorage.getItem('longitude') || 0,
					latY: sessionStorage.getItem('latitude') || 0
				}
				// #endif

				let res = await this.$api.artificerInfoDetail(params);
				this.technicianDetail = res.data || {}
			},
			// 获取项目详情信息
			getProjectInfoDetail() {
				let params = {
					id: this.id
				}
				this.$api.projectInfoDetail(params).then(res => {
					if (res.code === 200) {
						this.productDetail = res.data
						console.log(this.imgList)
					}
				})
			},
			submit() {
				if (!this.addressData.id) {
					this.$utils.msg('请选择服务地址')
					return
				}
				if (!this.serveTime) {
					this.$utils.msg('请选择服务时间')
					return
				}
				if (!this.trafficMoney) {
					this.$utils.msg('请选择技师交通方式')
					return
				}
				console.log(this.productDetail)
				console.log(this.technicianDetail)
				let params = {
					appointmentStartTime: this.serveTime,
					projectId: this.productDetail.id,
					artificerId: this.technicianDetail.id,
					addressId: this.addressData.id,
					couponId: this.couponId || '',
					trafficMoney: this.trafficMoney,
					trafficMile: this.trafficMile,
					trafficType: this.trafficType === 0 ? "TAXI" : "SUBWAY",
					orderTypeEnum: 'APPOINTMENT', // 正常订单
					remake: this.remark,
					// #ifdef MP-WEIXIN
					wxPayChannelEnum: 'PROGRAM'
					// #endif
					// #ifdef H5
					wxPayChannelEnum: 'WEB'
					// #endif

				}
				this.$api.orderInfoDone(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						uni.redirectTo({
							url: `/pages/money/pay?orderNo=${res.data.orderNo}`
						})
					} else {
						this.$utils.msg(res.message)
					}
				})
			},
			stopPrevent() {}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;
		border-top: 1upx solid rgba(255, 255, 255, 0);

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;

				&.relative {
					position: relative;

					.service-number {
						width: 300upx;
						height: 70upx;
						position: absolute;
						bottom: 0;
						right: -30upx;
					}
				}
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					color: $price-color;
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.arrow {
			padding-right: 60upx;
			position: relative;

			.icon-jiantouyou {
				width: 30upx;
				height: 18upx;
				position: absolute;
				top: 15%;
				right: 20upx;
				// transform: translateY(-50%);
			}

			// &::after{
			// 	content: '';
			// 	width: 30upx;
			// 	height: 30upx;
			// 	border: 1upx solid red;
			// 	position: absolute;
			// 	top: 50%;
			// 	transform: translate(670upx, -50%);
			// }
		}

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
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
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

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		.dont-use-con {
			width: 100%;
			height: 80upx;
			display: flex;
			align-items: flex-end;
			justify-content: flex-end;
			padding-right: 30upx;

			.dont-use {
				color: $base-color;
				font-size: 26upx;
				border: 1upx solid $base-color;
				padding: 10upx 20upx;
				background-color: $color-btn-background;
				border-radius: 5upx;
			}
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		&.active {
			background-color: $color-btn-background;
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

	.traffic-tips {
		margin-left: 40upx;
		font-size: 24upx;
		padding: 10upx 20upx 10upx 0;
		color: $font-color-light;
		border-bottom: 1upx solid #F1F3F6;
	}
	.bottom{
		padding-bottom: 50upx;
	}
</style>
