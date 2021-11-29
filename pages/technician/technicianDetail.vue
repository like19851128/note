<template>
	<view class="technician-detail-con">
		<!-- 头像信息及关注人数栏 -->
		<view class="technician-info" :style="{background: technicianDetail.headImg ? `url(${technicianDetail.headImg}) no-repeat center/cover` : ''}">
			<view class="info-mask"></view>
			<!-- 个人头像栏 -->
			<view class="photo-name-con">
				<view class="collection">
					<!-- 点击取消收藏 -->
					<text @click="toggleCollection" class="iconfont icon-hear-full" :class="{active: technicianDetail.isCollection}"></text>
					<!-- 点击收藏 -->
					<!-- <text @click="toggleCollection(2)" v-else class="iconfont icon-hear-full"></text> -->
				</view>
				<view class="photo-name">
					<!-- 左侧头像 -->
					<view class="photo">
						<view class="avatar">
							<image :src="technicianDetail.headImg" mode="aspectFill"></image>
						</view>
					</view>
					<!-- 右侧信息 -->
					<view class="sex-icon">
						<view class="name">{{technicianDetail.nickname}}</view>
						<!-- <view class="face-similarity">人脸对比相似度76%</view> -->
						<view class="distance" v-if="technicianDetail.distance">
							<text class="iconfont icon-dingwei"></text>
							<text>{{technicianDetail.distance}}km</text>
						</view>
					</view>
				</view>
				<!-- 认证信息 -->
				<view class="authentication">
					<view class="authentication-item" v-if="!technicianDetail.isHealthy">
						<text class="iconfont icon-renzheng1"></text>头像认证
					</view>
					<view class="authentication-item">
						<text class="iconfont icon-shimingrenzheng"></text>实名认证
					</view>
					<view class="authentication-item" v-if="technicianDetail.qualificationNum > 0" @click="toQualifications">
						<text class="iconfont icon-zizhi"></text>资质认证
					</view>
					<view class="authentication-item" v-if="technicianDetail.isHealthy">
						<text class="iconfont icon-zizhilianghaohangwei"></text>疫情验证
					</view>
				</view>
				<!-- 关注条 -->
				<view class="data-column">
					<view class="data-item">
						<view>关注人数</view>
						<view>{{technicianDetail.followNum || 0}}人</view>
					</view>
					<view class="data-item">
						<view>订单数量</view>
						<view>{{technicianDetail.totalOrderNum || 0}}单</view>
					</view>
					<view class="data-item" @click="torateList">
						<view>评分</view>
						<view>{{technicianDetail.score || 0}}分</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 照片栏 -->
		<view class="photo-list" @click="toTechnicianDetail">
			<template v-if="technicianDetail.photoList.length <= 3">
				<template v-for="(item, index) in technicianDetail.photoList">
					<view class="photo-item" v-if="index < 3" :key="index">
						<image :src="item" mode="aspectFill"></image>
					</view>
				</template>
			</template>
			<template v-if="technicianDetail.photoList.length > 3">
				<template v-for="(item, index) in technicianDetail.photoList">
					<view class="photo-item" v-if="index < 2" :key="index">
						<image :src="item" mode="aspectFill"></image>
					</view>
				</template>
				<view class="photo-item posi" v-if="technicianDetail.photoList[2]">
					<image :src="technicianDetail.photoList[2]" mode="aspectFill"></image>
					<view class="more-text">更多</view>
				</view>
			</template>
		</view>
		<!-- 自我介绍 -->
		<view class="introduction-con">
			<view class="introduction" :class="{hide: !showIntro}">
				<view class="brief-html" v-html="technicianDetail.brief"></view>
				<text style="color: #762654;margin-left: 10upx;" v-show="showMore && showIntro" @click="showIntro = false">收起</text>
			</view>
			<view class="show-btn" v-show="showMore && !showIntro" @click="showIntro = true">
				<text style="color: #909399">...</text>展开
			</view>
		</view>
		<!-- 平台担保 -->
		<view class="platform">
			<view class="platform-item"><text class="iconfont icon-approve"></text>平台担保</view>
			<view class="platform-item"><text class="iconfont icon-approve"></text>官方认证</view>
			<view class="platform-item"><text class="iconfont icon-approve"></text>收费透明</view>
			<view class="platform-item"><text class="iconfont icon-approve"></text>爽约包退</view>
		</view>
		<!-- 服务项目 -->
		<view class="service-items">
			<view class="tab-com">
				<ul class="order-status">
					<li :class="{current: currentSelect === 0}" @click="current(0)"><span>服务项目</span></li>
					<li :class="{current: currentSelect === 1}" @click="current(1)"><span>下单须知</span></li>
				</ul>
			</view>
			<template v-if="currentSelect === 0">
				<view class="goods-list">
					<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click.stop="toProductDetail(item)">
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
						  <view class="order-number">已售：{{technicianDetail.totalOrderNum || 0}}</view>
						</view>
						<view class="to-order" @click.stop="toCreateOrder(item)" v-if="technicianDetail.status != 'RESTING' && item.isOpen == 1">
							下单
						</view>
						<view class="to-order cant" v-else>
							下单
						</view>
					</view>
				</view>
				<!-- <uni-load-more bgColor="#f6f6f6" :status="loadingType"></uni-load-more> -->
			</template>
			<template v-else>
				<view class="order-notice" v-html="orderNotice"></view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showMore: false,
				orderNotice: '', // 下单须知
				pageNo: 1,
				pageSize: 10,
				technicianDetail: {}, // 技师详情
				id: '', // 技师id
				showIntro: false, // 展示自我介绍
				currentSelect: 0,
				goodsList: [],
				loadingType: 'more', //加载更多状态
			}
		},
		onLoad(e) {
			this.id = e.id
			this.getArtificerInfoDetail()
			this.getArtificerProjectList()
			this.getConfigValue()
		},
		//加载更多
		// onReachBottom(){
		// 	this.getArtificerProjectList();
		// },
		onShow() {
			this.artificerInfoPoint()
		},
		methods: {
			// 技师埋点
			artificerInfoPoint() {
				let params = {id: this.id}
				this.$api.artificerInfoPoint(params).then(res => {
					console.log(res)
				})
			},
			// 跳转技师评价
			torateList() {
				uni.navigateTo({
					url: `/pages/order/rateList?id=${this.technicianDetail.id}`
				})
			},
			// 收藏技师/取消收藏技师
			toggleCollection(type) {
				let params = {artificerId: this.technicianDetail.id, artificerName: this.technicianDetail.nickname, artificerPhoto: this.technicianDetail.headImg}
				// 收藏还是取消收藏
				// let apiRequest = type == 1?'artificerCollectionDeleteByArtificerId':'artificerCollectionSave'
				let apiRequest = this.technicianDetail.isCollection?'artificerCollectionDeleteByArtificerId':'artificerCollectionSave'
				this.$api[`${apiRequest}`](params).then(res => {
					if (res.code === 200) {
						this.getArtificerInfoDetail()
						uni.showToast({
							title: res.message,
							duration: 2000
						})
					}
				})
			},
			// 跳转查看技师照片
			toTechnicianDetail() {
				uni.navigateTo({
					url: `/pages/technician/technicianPhoto?photoList=${JSON.stringify(this.technicianDetail.photoList)}`
				})
			},
			toQualifications() {
				uni.navigateTo({
					url: `/pages/technician/qualificationsImg?id=${this.technicianDetail.id}`
				})
			},
			// 跳转下单
			toCreateOrder(item) {
				// #ifdef MP-WEIXIN
				if (!uni.getStorageSync('token')) {
					uni.navigateTo({
						url: '/pages/user/auth'
					})
					return
				}
				// #endif
				
				// #ifdef H5
				if (!sessionStorage.getItem('token')) {
					uni.navigateTo({
						url: '/pages/user/auth'
					})
					return
				}
				// #endif
				uni.navigateTo({
					url: `/pages/order/createOrder?id=${item.id}&artificerId=${this.technicianDetail.id}`
				})
			},
			// 跳转项目详情
			toProductDetail(item) {
				uni.navigateTo({
					url: `/pages/product/detail?id=${item.id}&btnHide=true`
				})
			},
			// 获取下单须知
			getConfigValue() {
				let params = {configKey: 'ORDER_NOTICE'}
				this.$api.getConfigValue(params).then(res => {
					if (res.code === 200) {
						this.orderNotice = res.data.configValue
					}
				})
			},
			// 点击选择tab
			current(index) {
				if (this.currentSelect === index) return
				this.currentSelect = index
			},
			// 请求技师详情数据
			async getArtificerInfoDetail() {
				let params = {}
				// #ifdef MP-WEIXIN
				params = {
					id: this.id, 
					lngX: uni.getStorageSync('longitude') || 0,  
					latY: uni.getStorageSync('latitude') || 0,
				}
				// #endif
				// #ifdef H5
				params = {
					id: this.id, 
					lngX: sessionStorage.getItem('longitude') || 0,  
					latY: sessionStorage.getItem('latitude') || 0,
				}
				// #endif
				let res = await this.$api.artificerInfoDetail(params);
				this.technicianDetail = res.data || []
				this.$nextTick(() => {
					let query = uni.createSelectorQuery().in(this);
					query.select('.brief-html').boundingClientRect(data => {
						this.showMore = data.height > 30
					}).exec();
				})
			},
			// 请求技师可服务项目列表或者上拉加载
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
				//筛选，测试数据直接前端筛选了
				// if(this.filterIndex === 1){
				// 	goodsList.sort((a,b)=>b.sales - a.sales)
				// }
				// if(this.filterIndex === 2){
				// 	goodsList.sort((a,b)=>{
				// 		if(this.priceOrder == 1){
				// 			return a.price - b.price;
				// 		}
				// 		return b.price - a.price;
				// 	})
				// }
				
				this.goodsList = this.goodsList.concat(goodsList);
				this.pageNo++
				console.log(res.data.total)
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
		}
	}
</script>

<style lang="scss" scoped>
	$color-white: #F5F5F5;

	.technician-detail-con {
		width: 100%;
		.technician-info {
			background-color: $base-color;
			padding: 30upx 0 0;
			position: relative;
			.info-mask{
				position: absolute;
				width: 100%;
				height: 100%;
				top:0;
				left: 0;
				background: linear-gradient(to right, $base-color, rgba(0, 0, 0, 0));
			}
			.photo-name-con{
				position: relative;
				z-index: 10;
				.collection{
					position: absolute;
					top: 0upx;
					right: 30upx;
					.iconfont{
						font-size: 50rpx;
						&.icon-hear-full{
							color: $color-gray;
							&.active{
								color: $base-color;
							}
						}
					}
				}
			}
			.photo-name {
				margin: 0 30upx;
				display: flex;
				align-items: center;
				.photo {
					margin-right: 50upx;
					.avatar {
						flex-shrink: 0;
						width: 200upx;
						height: 200upx;
						border-radius: 50%;
						overflow: hidden;
						display: flex;
						justify-content: center;
						align-items: center;
						background: #C0C4CC;

						image {
							width: 90%;
							height: 90%;
						}
					}
				}

				.sex-icon {
					font-size: 28upx;
					color: #fff;
					.face-similarity {
						margin: 20upx 0;
					}
					.distance{
						margin-top: 20upx;
					}
				}
			}

			.authentication {
				margin: 0 30upx;
				display: flex;
				align-items: center;

				.authentication-item {
					padding: 10upx;
					border: 2upx solid $color-white;
					border-radius: 10upx;
					font-size: 24upx;
					color: $color-white;
					margin: 30upx 0 50upx;

					.iconfont {
						width: 50upx;
						height: 30upx;
						vertical-align: middle;
						margin-right: 8upx;
					}

					&:not(:last-child) {
						margin-right: 20upx;
					}
				}
			}

			.data-column {
				background: rgba(0, 0, 0, 0.2);
				width: 100%;
				padding: 15upx;
				display: flex;

				.data-item {
					font-size: 26upx;
					color: $color-white;
					flex: 1;
					text-align: center;
				}
			}
		}

		.photo-list {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 20upx 30upx;

			.photo-item {
				width: 220upx;
				height: 220upx;
				border-radius: 10upx;
				margin-right: 25upx;
				image {
					width: 100%;
					height: 100%;
				}
				&.posi{
					position: relative;
					.more-text{
						background: linear-gradient(to right, $base-color, rgba(0, 0, 0, 0));
						position: absolute;
						line-height: 220upx;
						text-align: center;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						z-index: 5;
						font-size: 26upx;
						color: #fff;
						font-weight: bold;
					}
				}
			}
		}

		.introduction-con {
			display: flex;
			align-items: center;
			font-size: 28upx;
			padding: 0 30upx;
			.introduction {
				color: #909399;
				word-break: break-all;
				line-height: 35upx;

				&.hide {
					height: 35upx;
					overflow: hidden;
				}
			}

			.show-btn {
				flex-shrink: 0;
				height: 35upx;
				color: $base-color;
			}
		}
		.platform{
			display: flex;
			align-items: center;
			padding: 0 30upx 20upx;
			margin-top: 30upx;
			.platform-item{
				font-size: 24upx;
				color: $base-color;
				padding: 5upx;
				border: 1upx solid $base-color;
				border-radius: 10upx;
				display: flex;
				align-items: center;
				&:not(:last-child){
					margin-right: 30upx;
				}
				.iconfont{
					margin-right: 5upx;
				}
			}
		}
		.service-items{
			.tab-com {
				width: 100%;
				.order-status {
					box-sizing: border-box;
					width: 100%;
					height: 100upx;
					padding: 0 10upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-top: 15upx solid #F6F6F6;
					border-bottom: 5upx solid #F6F6F6;
					color: $color-gray;
					.current {
						span {
							color: $base-color;
							// border-bottom: 5upx solid $base-color;
						}
					}
			
					li {
						font-size: 28upx;
						flex: 1;
						text-align: center;
						&:last-child {
							margin-right: 0;
						}
						span {
							display: inline-block;
							height: 100upx;
							line-height: 100upx;
						}
					}
				}
			}
			.goods-list{
				display:flex;
				flex-wrap:wrap;
				// padding: 0 30upx;
				background: #f6f6f6;
				.goods-item{
					position: relative;
					display:flex;
					align-items: center;
					width: 100%;
					height: 250upx;
					margin-bottom: 20upx;
					background: #fff;
					padding: 0 30upx;
					&:first-child{
						margin-top: 20upx;
					}
					.to-order{
						position: absolute;
						width: 140upx;
						line-height: 60upx;
						border-radius: 40upx;
						background: linear-gradient(to right bottom, #fff, $base-color);
						top: 50%;
						transform: translateY(-50%);
						right: 30upx;
						text-align: center;
						color: $color-white;
						font-size: 28upx;
						&.cant{
							background: $color-gray;
						}
					}
				}
				.image-wrapper{
					background: #fff;
					flex-shrink: 0;
					width: 200upx;
					height: 200upx;
					margin-right: 20upx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					font-size: 20upx;
					image{
						width: 200upx;
						height: 200upx;
						opacity: 1;
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
					}
					.intro{
						font-size: 26upx;
						color: $color-gray;
						margin: 15upx 0 10upx;
					}
					.order-number{
						margin-top: 20upx;
						font-size: 24upx;
						color: $color-gray;
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
					.line-price{
						// text-decoration: line-through;
						margin-right: 10upx;
						color: $color-darkgray;
					}
					.trade-price{
						font-size: 26upx;
						color: $price-color;
					}
					.service-time{
						color: $color-gray;
					}
				}
			}
			.order-notice{
				padding-bottom: 30upx;
				width: 100%;
				overflow: hidden;
				word-break: break-all;
			}
		}
	}
</style>
