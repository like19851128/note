<template>
	<view class="order-detail-container">
		<!-- 右侧悬浮窗-联系我们 -->
		<view class="contact">
			<button class="option-item btn" open-type='contact'>
				<text class="iconfont icon-service"></text>
				<view class="font">在线咨询</view>
			</button>
			<button class="option-item btn btn2" @click="callUs" v-if="orderDetail.customerServicePhone">
				<text class="iconfont icon-dianhualianxifangshi"></text>
				<view class="font">电话咨询</view>
			</button>
		</view>
		<!-- 订单状态图片 -->
		<view class="order-info" v-if="orderDetail.isShow">
			<view class="title">
				<view class="info-img title iconfont" :class="$utils.orderStatusImg(orderDetail.orderStatusInt)?'icon-xiaolian':'icon-frown'"></view>
				<view class="info-text title">
					{{$utils.statusText(orderDetail.orderStatusInt)}}
				</view>
			</view>
			<view class="order-status-con">
				<view class="order-status" v-for="(item, index) in serveStatus" :key="index">
					<view class="info-img" :class="[item.img, {active: (item.status <= orderDetail.orderStatusInt) && orderDetail.orderStatusInt < 8}]"></view>
					<view class="info-text" :class="{active: (item.status <= orderDetail.orderStatusInt) && orderDetail.orderStatusInt < 8}">{{item.name}}</view>
				</view>
			</view>
		</view>
		<view class="serve-info">
			<!-- 技师名字 -->
			<view class="technician-info">
				<image :src="orderDetail.artificerHeadImg" mode="aspectFill"></image>
				{{orderDetail.artificerNickname}}
			</view>
			<view class="items-info-con">
				<view class="items-title">订单信息</view>
				<view class="items-info">
					<text class="item-title">订单编号</text>
					<text class="item-info">{{orderDetail.orderNo}}</text>
				</view>
				<view class="items-info">
					<text class="item-title">联系方式</text>
					<text class="item-info">{{orderDetail.addrTel}}</text>
				</view>
				<view class="items-info">
					<text class="item-title">服务时间</text>
					<text class="item-info">{{orderDetail.appointmentStartTime}}</text>
				</view>
				<view class="items-info">
					<text class="item-title">车费详情</text>
					<text class="item-info">{{orderDetail.trafficName}} 全程{{orderDetail.trafficMile || 0}}公里</text>
				</view>
				<view class="items-info">
					<text class="item-title">服务地址</text>
					<text class="item-info">{{orderDetail.address}}</text>
				</view>
				<view class="items-info" v-if="orderDetail.remake">
					<text class="item-title">用户备注</text>
					<text class="item-info">{{orderDetail.remake}}</text>
				</view>
				<view class="items-info" v-if="orderDetail.exRemake">
					<text class="item-title">审核描述</text>
					<text class="item-info">{{orderDetail.exRemake}}</text>
				</view>
			</view>
			<view class="items-info-con">
				<view class="items-title">服务项目</view>
				<view class="items-info">
					<text class="item-title">服务项目</text>
					<text class="item-info" style="position: relative;">{{orderDetail.projectName}}<text class="price">￥{{orderDetail.projectMoney}}</text></text>
				</view>
				<view class="items-info">
					<text class="item-title">出行费用</text>
					<text class="item-info" style="position: relative;">{{orderDetail.trafficName}}<text class="price">￥{{orderDetail.trafficMoney || 0}}</text></text>
				</view>
				<view class="items-info" v-if="orderDetail.couponMoney">
					<text class="item-title">优惠券</text>
					<text class="item-info" style="position: relative;"><text style="opacity: 0;">优惠券</text><text class="price">-￥{{orderDetail.couponMoney}}</text></text>
				</view>
				<view class="items-info">
					<text class="item-title">服务时常</text>
					<text class="item-info">{{orderDetail.projectServiceTime}}分钟</text>
				</view>
				<view class="items-info">
					<text class="item-title">支付方式</text>
					<text class="item-info">微信支付</text>
				</view>
				<view class="total-price">合计：￥{{orderDetail.orderMoney}}</view>
			</view>
			<!-- <view class="order-number">
				<view class="items-title">订单编号 {{orderDetail.orderNo}}</view>
				<uni-steps :options="list2" active-color="#762654" :active="active" direction="column" />
			</view> -->
		</view>
		<!-- 底部支付按钮 -->
		<view class="btns" v-if="[0, 1, 2, 3, 4, 6, 7, 11].includes(orderDetail.orderStatusInt)">
			<button v-if="orderDetail.orderStatusInt == 0" class="action-btn" @click.stop="pay(orderDetail)">立即支付</button>
			<button v-if="orderDetail.orderStatusInt>0&&orderDetail.orderStatusInt<5" class="action-btn" @click.stop="cancelOrder(orderDetail)">取消订单</button>
			<button v-if="orderDetail.orderStatusInt == 6" class="action-btn" @click.stop="toEvaluate(orderDetail)">去评价</button>
			<button v-if="orderDetail.orderStatusInt == 11" class="action-btn" @click.stop="delOrder(orderDetail)">删除</button>
			<button v-if="orderDetail.orderStatusInt==6 || orderDetail.orderStatusInt==7" class="action-btn" @click.stop="addOrder(orderDetail)">加钟</button>
		</view>
	</view>
</template>

<script>
	export default {
		filters: {
			trafficType(val) {
				return val === 1 ? '出租' : '公交'
			}
		},
		computed: {
			settlementPrice() {
				return this.orderDetail.trafficMoney + this.orderDetail.payMoney - this.orderDetail.couponMoney
			}
		},
		data() {
			return {
				orderDetail: {}, // 订单详情
				orderNo: '', // 订单号
				serveStatus: [{
					id: 1,
					img: 'iconfont icon-zaixianjiedan2mian',
					name: '技师接单',
					status: 2
				}, {
					id: 2,
					img: 'iconfont icon-car-full',
					name: '技师出发',
					status: 3
				}, {
					id: 3,
					img: 'iconfont icon-dingwei1',
					name: '技师到达',
					status: 4
				}, {
					id: 4,
					img: 'iconfont icon-anmospa',
					name: '技师服务',
					status: 5
				}, {
					id: 5,
					img: 'iconfont icon-wancheng',
					name: '服务完成',
					status: 6
				}]
			}
		},
		onLoad(e) {
			this.orderNo = e.orderNo
		},
		onShow() {
			this.getorderDetail()
		},
		methods: {
			// 电话联系我们
			callUs() {
				uni.makePhoneCall({
					phoneNumber: this.orderDetail.customerServicePhone + '',
					success: function() {
						console.log('成功拨打电话')
					}
				})
			},
			// 加钟
			addOrder(item) {
				uni.showModal({
					title: '温馨提示',
					content: '确认已与技师沟通好了吗？',
					success: (confirmRes)=> {
						if (confirmRes.confirm) {
							uni.navigateTo({
								url: `/pages/order/overtime?id=${item.artificerId}&addressId=${item.addressId}&nickname=${item.artificerNickname}&headImg=${item.artificerHeadImg}&trafficType=${item.trafficType}`
							})
						} 
					}
				});
			},
			// 去支付
			pay(item) {
				uni.navigateTo({
					url: `/pages/money/pay?orderNo=${item.orderNo}`
				})
			},
			// 去评价
			toEvaluate(item) {
				uni.navigateTo({
					url: `/pages/order/orderRate?orderNo=${item.orderNo}`
				})
			},
			// 删除订单
			delOrder(item) {
				let _this = this
				uni.showModal({
					title: '确认删除订单吗？',
					success(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							let params = {orderNo: item.orderNo}
							_this.$api.orderInfoDelete(params).then(res => {
								uni.hideLoading()
								if (res.code === 200) {
									_this.$store.commit('setRefreshOrderList', Math.random())
									uni.navigateBack({
										delta: -1
									})
								} else {
									_this.$utils.msg(res.message)
								}
							})
						}
					}
				})
			},
			//取消订单
			cancelOrder(item){
				let _this = this
				uni.showModal({
					title: '确认取消订单吗？',
					success(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							let params = {orderNo: item.orderNo}
							_this.$api.orderInfoRefund(params).then(res => {
								uni.hideLoading()
								if (res.code === 200) {
									_this.getorderDetail()
									_this.$store.commit('setRefreshOrderList', Math.random())
								} else {
									_this.$utils.msg(res.message)
								}
							})
						}
					}
				})
			},
			
			// 请求订单详情
			getorderDetail() {
				let params = {orderNo: this.orderNo}
				this.$api.orderDetail(params).then(res => {
					if (res.code === 200) {
						this.orderDetail = res.data
						this.$forceUpdate()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-detail-container {
		padding-bottom: 100rpx;
		width: 100%;
		.contact{
			position: fixed;
			top: 30%;
			right: 0;
			z-index: 5;
			.iconfont{
				color: $base-color;
			}
			.option-item{
				width: 100upx;
				&.btn{
					width: 100%;
					background: rgba(240, 240, 240, .3);
					height: 100upx;
					margin-left: 0;
					margin-right: 0;
					border-radius: 0;
					.font{
						margin-top: -50upx;
						font-size: 24upx;
						color: $base-color;
					}
					&.btn2{
						margin-top: 20upx;
					}
				}
			}
		}
		.order-info{
			background: #fff;
			padding: 10upx;
			.info-img{
				height: 50upx;
				margin: 10upx 0;
				color: $color-gray;
				font-size: 40upx;
				&.title{
					height: 80upx;
					/* #ifdef H5 */
					height: 180upx;
					/* #endif */
					font-size: 80upx;
					color: $base-color;
				}
				&.active{
					color: #333;
				}
			}
			.info-text{
				font-size: 26upx;
				color: #ABABAB;
				&.title{
					color: $base-color;
					font-weight: bold;
					margin-bottom: 20upx;
					font-size: 30upx;
					/* #ifdef H5 */
					margin-top: -80upx;
					/* #endif */
				}
			}
			.title{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
			.order-status-con{
				display: flex;
				align-items: center;
				.order-status{
					text-align: center;
					flex: 1;
					.info-text.active{
						color: #333;
					}
				}
			}
		} 
		.serve-info{
			background-color: #F0F0F0;
			padding: 20upx;
			>view{
				border-radius: 20upx;
				background: #fff;
				padding: 5upx 10upx;
			}
			.technician-info{
				font-weight: bold;
				padding: 10upx;
				image{
					width: 60upx;
					height: 60upx;
					border-radius: 50%;
					vertical-align: middle;
					margin-right: 30upx;
				}
			}
			.items-info-con{
				margin: 20upx 0;
				background-color: #fff;
				padding: 20upx;
			}
			.items-title, .item-title, .item-info{
				font-size: 26upx;
				&.items-title{
					margin: 0 0 20upx 10upx;
					font-weight: bold;
				}
			}
			.items-info{
				margin-bottom: 15upx;
				display: flex;
				align-items: flex-start;
				.item-title{
					flex-shrink: 0;
					margin-right: 30upx;
					color: #ABABAB;
				}
				.item-info{
					width: 100%;
					color: #737373;
					word-break: break-all;
					.price{
						position: absolute;
						top: 50%;
						right: 0;
						transform: translateY(-50%);
						color: $price-color;
					}
				}
			}
			.total-price{
				border-top: 1upx solid $color-lightgray;
				padding-top: 15upx;
				text-align: right;
				color: $price-color;
				font-size: 28upx;
			}
			.order-number{
				.items-title{
					padding-top: 15upx;
				}
			}
		}
		.btns{
			width: 100%;
			position: fixed;
			height: 120upx;
			padding: 0 20upx;
			background: #fff;
			bottom: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.action-btn{
				width: 160upx;
				height: 60upx;
				margin: 0;
				margin-left: 24upx;
				padding: 0;
				text-align: center;
				line-height: 60upx;
				font-size: $font-sm + 2upx;
				color: $base-color;
				background: #fff;
				border-radius: 100px;
				border: 1upx solid $base-color;
			}
		}
	}
</style>
