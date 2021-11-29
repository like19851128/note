<template>
	<view>
		<view class="goods-section">
			<view class="g-item">
				<image :src="headImg" mode="aspectFill"></image>
				<view class="right relative">
					<!-- <text class="title clamp">{{productDetail.name}}</text> -->
					<text class="spec">{{nickname}}</text>
				</view>
			</view>
		</view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" :class="{active: activeIndex === index}" @click.stop="chooseProject(item, index)">
				<view class="image-wrapper">
					<image :src="item.headImg" mode="aspectFill"></image>
				</view>
				<view class="info-wrapper">
					<view class="title clamp">{{item.name}}</view>
					<view class="intro">{{item.brief}}</view>
					<view class="price-box">
						<text class="line-price">价格：</text>
						<text>
							<text class="trade-price">￥{{item.tradePrice}}</text>
							<text class="service-time">/{{item.serviceTime}}分钟</text>
						</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{choosedProject.tradePrice || 0}}</text>
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
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-￥{{discountPrice}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">服务时长</text>
				<text class="cell-tip">{{choosedProject.serviceTime || 0}}分钟</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-￥{{discountPrice}}</text>
			</view> -->
		</view>

		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥{{ settlementPrice || 0 }}</text>
				<text class="price"></text>
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
	</view>
</template>

<script>
	import empty from "@/components/empty";
	export default {
		components: {
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
				trafficType: '',
				nickname: '',
				headImg: '',
				addressId: '', // 地址id
				activeIndex: -1,
				couponName: '', // 优惠券名称
				couponId: 0, // 优惠券id
				discountPrice: 0, // 优惠金额
				maskState: 0, //优惠券面板显示状态
				id: '', // 技师id
				pageNo: 1,
				pageSize: 10,
				goodsList:[],
				couponList: [],
				choosedProject: {}
			}
		},
		computed: {
			// 最终价格
			settlementPrice() {
				return this.choosedProject.tradePrice - this.discountPrice
			}
		},
		watch: {
			choosedProject: {
				handler(val) {
					console.log(val)
					this.couponName = ''
					this.couponId = 0
					this.discountPrice = 0
					this.getCouponAvailableList()
				},
				deep: true
			}
		},
		onLoad(option) {
			this.trafficType = option.trafficType
			this.id = option.id
			this.addressId = option.addressId
			this.nickname = option.nickname
			this.headImg = option.headImg
			this.getArtificerProjectList()
		},
		methods: {
			// 获取卡券列表-不分页
			getCouponAvailableList() {
				let params = {projectId: this.choosedProject.id}
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
			//显示优惠券面板
			toggleMask(type) {
				console.log()
				if (Object.keys(this.choosedProject).length == 0) return this.$utils.msg('请先选择服务项目')
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			// 获取项目列表
			async getArtificerProjectList(type='add', loading) {
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				let params = {artificerId: this.id, pageNo: this.pageNo, pageSize: this.pageSize}
				let res = await this.$api.getArtificerProjectList(params);
				let goodsList = res.data || []
				if(type === 'refresh'){
					this.goodsList = [];
					this.pageNo = 1
				}
				this.goodsList = this.goodsList.concat(goodsList);
				this.pageNo++
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType  = this.goodsList.length >= res.data.total ? 'nomore' : 'more';
				if(type === 'refresh'){
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
			},
			chooseProject(item, index) {
				if (this.activeIndex === index) return
				this.activeIndex = index
				this.choosedProject = item
			},
			submit() {
				if (Object.keys(this.choosedProject).length == 0) return this.$utils.msg('请先选择服务项目')
				let params = {
					trafficType: 0,
					trafficMoney: 0,
					trafficMile: 0,
					projectId: this.choosedProject.id,
					artificerId: this.id,
					addressId: this.addressId,
					couponId: this.couponId || '',
					orderTypeEnum: 'ADD_TIME',	 // 加钟订单
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

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;
		border-top: 1upx solid rgba(255, 255, 255, 0);
		.g-item {
			display: flex;
			margin: 20upx 30upx;
			align-items: center;
			image {
				flex-shrink: 0;
				display: block;
				width: 100upx;
				height: 100upx;
				border-radius: 50%;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
				&.relative {
					position: relative;
					.spec{
						font-size: 36upx;
						font-weight: bold;
					}
				}
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
	
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		background: #f6f6f6;
		
		.goods-item {
			display: flex;
			align-items: center;
			width: 100%;
			height: 250upx;
			margin-bottom: 20upx;
			background: #fff;
			padding: 0 30upx 0 120upx;
			position: relative;
			&:first-child {
				margin-top: 20upx;
			}
			&::before{
				content: '';
				width: 40upx;
				height: 40upx;
				background: url(../../static/select.png) no-repeat center/contain;
				position: absolute;
				top: 50%;
				left: 40upx;
				transform: translateY(-50%);
			}
			&.active::before{
				content: '';
				width: 40upx;
				height: 40upx;
				background: url(../../static/selected.png) no-repeat center/contain;
				position: absolute;
				top: 50%;
				left: 40upx;
				transform: translateY(-50%);
			}
		}
	
		.image-wrapper {
			background: #fff;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			margin-right: 20upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 20upx;
	
			image {
				width: 150upx;
				height: 150upx;
				opacity: 1;
				border-radius: 10upx;
				margin-bottom: 10upx;
			}
		}
	
		.info-wrapper {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			overflow: hidden;
			position: relative;
	
			.title {
				font-size: $font-lg;
				color: $font-color-dark;
				display: flex;
				justify-content: space-between;
	
				// line-height: 80upx;
				.order-number {
					font-size: 24upx;
					color: $color-gray;
				}
			}
	
			.intro {
				font-size: 26upx;
				color: $color-gray;
				margin: 15upx 0 10upx;
			}
		}
	
		.price-box {
			font-size: 24upx;
	
			// display: flex;
			// align-items: center;
			// justify-content: space-between;
			// padding-right: 10upx;
			// font-size: 24upx;
			// color: $font-color-light;
			.line-price {
				text-decoration: line-through;
				margin-right: 10upx;
				color: $color-darkgray;
			}
	
			.trade-price {
				font-size: 26upx;
				color: $price-color;
			}
	
			.service-time {
				color: $color-gray;
			}
		}
	
		.select-technician-btn {
			width: 150upx;
			height: 75upx;
			line-height: 75upx;
			background-color: $base-color;
			border-radius: 20upx;
			color: $color-white;
			font-size: 28upx;
			text-align: center;
			position: absolute;
			bottom: 0;
			right: 0;
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
		.dont-use-con{
			width: 100%;
			height: 80upx;
			display: flex;
			align-items: flex-end;
			justify-content: flex-end;
			padding-right: 30upx;
			.dont-use{
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
	
	// 优惠券列表
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
</style>
