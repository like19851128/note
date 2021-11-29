<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab" :style="{height: `${swiperHeight}px`}">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.orderList.length === 0 || tabItem.orderList == null"></empty>
					
					<template v-else>
						<!-- 订单列表 -->
						<view
							v-for="(item,index) in tabItem.orderList" :key="index"
							class="order-item"
							@click="toDetail(item)"
						>
							<view class="i-top b-b">
								<text class="time">{{item.projectName}}</text>
								<text class="state" :style="{color: item.stateTipColor}">{{$utils.statusText(item.orderStatusInt)}}</text>
								<!-- <text 
									v-if="item.state===9" 
									class="del-btn yticon icon-iconfontshanchu1"
									@click="deleteOrder(index)"
								></text> -->
							</view>
							<view class="price-box">
								<view class="img-con">
									<image class="img" :src="item.projectHeadImg" mode="aspectFill"></image>
								</view>
								<view class="price-con">
									<view class="timeCount">服务时长：{{item.projectServiceTime}}分钟</view>
									<view style="text-align: right;">订单总金额：<text class="price">{{item.orderMoney}}</text></view>
								</view>
							</view>
							<view class="action-box b-t" v-if="[0, 1, 2, 3, 4, 6, 7, 11].includes(item.orderStatusInt)">
								<button v-if="item.orderStatusInt==0" class="action-btn" @click.stop="toPay(item)">去支付</button>
								<button v-if="item.orderStatusInt>0&&item.orderStatusInt<5" class="action-btn" @click.stop="cancelOrder(item)">取消订单</button>
								<button v-if="item.orderStatusInt==6" class="action-btn" @click.stop="toEvaluate(item)">去评价</button>
								<button v-if="item.orderStatusInt==11" class="action-btn" @click.stop="delOrder(item)">删除</button>
								<button v-if="item.orderStatusInt==6 || item.orderStatusInt==7" class="action-btn" @click.stop="addOrder(item)">加钟</button>
							</view>
						</view>
					</template>
					
					 
					<!-- <uni-load-more :status="tabItem.loadingType"></uni-load-more> -->
					
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 前往打开权限 -->
		<view class="mask" v-if="showLocationBtn">
			<view class="jurisdiction">
				<view class="tips-title">地图需要开启您的定位功能</view>
				<view class="btns">
					<button class="btn cancel" @click="showLocationBtn = false" type="default">取消</button>
					<button class="btn sure" open-type="openSetting"  @opensetting="getScopes">前往设置</button>
				</view>
			</view>
		</view>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				swiperHeight: 0,
				showLocationBtn: false,
				pageSize: 100,
				pages: 1,
				tabCurrentIndex: 0,
				navList: [{
						pageNo: 1,
						state: 1,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						pageNo: 1,
						state: 2,
						text: '进行中',
						loadingType: 'more',
						orderList: []
					},
					{
						pageNo: 1,
						state: 3,
						text: '已完成',
						loadingType: 'more',
						orderList: []
					},
					{
						pageNo: 1,
						state: 4,
						text: '退款',
						loadingType: 'more',
						orderList: []
					},
					{
						pageNo: 1,
						state: 5,
						text: '已取消',
						loadingType: 'more',
						orderList: []
					}
				],
			};
		},
		
		onLoad(options){
			this.loadData()
		},
		onShow() {
			let _that = this
			// 设置swiper高度
			uni.getSystemInfo({
				success(res) {
					console.log(res)
					_that.swiperHeight = res.windowHeight - 40;
				}
			})
		},
		computed: {
			refreshOrderList() {
				return this.$store.state.refreshOrderList
			}
		},
		watch: {
			// 订单详情状态改变, 订单列表需要同步刷新
			refreshOrderList() {
				try {
					let backPage = ''
					if (getCurrentPages().length <= 0) return
					let currentPagsList = getCurrentPages()
					currentPagsList.forEach(item => {
						if (item.route=='pages/order/order') {
							backPage = item
						}
					})
					if (!backPage) return
					let navList = backPage.$vm._data.navList
					navList.forEach(item => {
						item.loadingType = 'more'
						item.orderList.length = 0
					})
					backPage.$vm.loadData()
				} catch(err) {
					console.log(err)
				}
			}
		},
		methods: {
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
			getScopes(e) {
				this.showLocationBtn = false
				this.$utils.getLocation()
			},
			// 跳转支付
			toPay(item) {
				uni.navigateTo({
					url: `/pages/money/pay?orderNo=${item.orderNo}`
				})
			},
			//获取订单列表
			loadData(source){
				console.log('调用成功')
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let pageNo = navItem.pageNo;
				let state = navItem.state;
				// if(source === 'tabChange' && navItem.loaded === true){
				// 	//tab切换只有第一次需要加载数据
				// 	return;
				// }
				// if(navItem.loadingType === 'loading'){
				// 	//防止重复加载
				// 	return;
				// }
				// navItem.loadingType = 'loading';
				let termType = '', value = ''
				if (state == 2) {
					termType = 'lte',
					value = '5'
				} else if (state == 3) {
					termType = 'in',
					value = [6,7]
				} else if (state == 4) {
					termType = 'in',
					value = [8,9,10]
				} else if (state == 5) {
					termType = 'gt',
					value = '10'
				}
				let params = {
					pageIndex: 1,
					pageSize: this.pageSize,
					terms:[
						{
							column: 'orderStatus',
							termType: termType,
							value: value
						}
					]
				}
				if (state == 1) {
					delete params.terms
				}
				this.$api.userOrderPageList(params).then(res => {
					if (res.code === 200 && res.data.data) {
						let orderList = res.data.data
						navItem.orderList.length = 0
						orderList.forEach(item=>{
							navItem.orderList.push(item);
						})
					}
				})
			}, 
			// 跳转订单详情
			toDetail(item) {
				uni.navigateTo({
					url: `/pages/order/orderDetail?orderNo=${item.orderNo}`
				})
				console.log(item)
			},
			//swiper 切换
			changeTab(e){
				console.log(e)
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
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
									_this.$store.commit('setRefreshOrderList', Math.random())
								} else {
									_this.$utils.msg(res.message)
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/styles/common.scss";
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		.price-box{
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.img-con{
				width: 150upx;
				height: 150upx;
				.img{
					width: 100%;
					height: 100%;
				}
			}
			.timeCount{
				margin-bottom: 10upx;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
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
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
