<template>
	<view class="container">
		<!-- <uni-notice-bar v-if="radioDtosText" speed="50" showIcon="true" scrollable="true" single="true" :text="radioDtosText"></uni-notice-bar> -->
		<!-- 顶部定位栏 -->
		<view class="location-search">
			<view class="location">
				<text class="city-name">重庆</text>
				<text class="active iconfont icon-xia" style="font-size: 12px"></text>
			</view>
			<view class="location-map">
				<text class="iconfont icon-dingwei"></text>
			</view>
		</view>
		<!-- <button open-type="contact">客服</button> -->
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<swiper class="carousel" circular @change="swiperChange" interval="8000" autoplay="true">
				<swiper-item v-for="(item, index) in bannerDtos" :key="index" class="carousel-item"
					@click="navToPage(item)">
					<image :src="item.bannerImg" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{bannerDtos.length || 0}}</text>
			</view>
		</view>

		<!-- 推荐技师 -->
		<view class="technician-recommendation" v-if="artificerInfoDtos && artificerInfoDtos.length > 0">
			<view class="title">
				推荐技师
			</view>
			<scroll-view class="recommendation-list-con" scroll-x="true" :scroll-into-view="`id${index}`">
				<view class="recommendation-list">
					<view :id="`id${index}`" class="recommendation-item" v-for="(item, index) in artificerInfoDtos"
						:key="index" @click="toTechnicianDetail(item)">
						<image v-if="item.headImg" :src="item.headImg" mode="aspectFill"></image>
						<view class="item-intro">{{item.nickname}}</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 按摩项目 -->
		<view class="navbar navbar-index">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				<text>综合排序</text>
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				<text>价格</text>
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>销量</text>
			</view>
			<view class="nav-item" :class="{current: filterIndex === 3}" @click="tabClick(3)">
				<text>满意度</text>
			</view>
		</view>
		<view class="goods-list">
			<view v-for="(item, index) in projectList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.headImg" mode="aspectFill"></image>
					<!-- <view>可预约</view> -->
				</view>
				<view class="info-wrapper">
					<view class="title clamp">{{item.name}} <text
							class="order-number">{{`${item.totalOrderNum || 0}人选择`}}</text></view>
					<view class="intro">{{item.brief}}</view>
					<view class="price-box">
						<text class="line-price">￥{{item.linePrice}}</text>
						<text>
							<text class="trade-price">￥{{item.tradePrice}}</text>
							<text class="service-time">/{{item.serviceTime}}分钟</text>
						</text>
					</view>
					<view class="select-technician-btn" v-if="item.isOpen === 1" @click.stop="toTechnianList(item)">选择技师</view>
					<view class="select-technician-btn cant" v-else>选择技师</view>
				</view>
			</view>
		</view>
		<!-- <uni-load-more :status="loadingType"></uni-load-more> -->
	</view>
</template>

<script>
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		components: {
			uniNoticeBar
		},
		data() {
			return {
				noMore: false,
				pageIndex: 1,
				pageSize: 10,
				showLocationBtn: false,
				radioDtosText: '',
				artificerInfoDtos: [], // 首页推荐技师集合
				bannerDtos: [], // 首页轮播Banner集合
				projectList: [], // 项目列表
				cateMaskState: false,
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				swiperCurrent: 0
			};
		},

		onLoad(e) {
			// 首页获取参数
			let params = {}
			if (e.scene && Object.keys(e.scene).length > 0) {
				e.scene = decodeURIComponent(e.scene)
				let keyValue = e.scene.split('&')
				for (let i = 0; i < keyValue.length; i++) {
					let arr = keyValue[i].split('#')
					params[arr[0]] = arr[1]
				}
			}
			e.invite && uni.setStorageSync('invite', e.invite)
			params.invite && uni.setStorageSync('invite', params.invite)

			this.getIndexInfo()
			this.projectInfoList()
		},
		//加载更多
		// onReachBottom() {
		// 	this.getLprojectInfoListist();
		// },
		computed: {
			filterText() {
				let filterText = ''
				switch (this.filterIndex) {
					case 0:
						filterText = 'real_order_num desc,trade_price asc';
						break;
					case 1:
						filterText = 'trade_price asc';
						break;
					case 2:
						filterText = 'real_order_num desc';
						break;
					case 3:
						filterText = 'sort desc';
						break;
				}
				return filterText
			}
		},
		methods: {
			//跳转技师详情
			toTechnicianDetail(item) {
				uni.navigateTo({
					url: `/pages/technician/technicianDetail?id=${item.id}`
				})
			},
			// 从项目列表跳转技师列表
			toTechnianList(item) {
				if (item.isOpen == 0) return
				uni.navigateTo({
					url: `/pages/technician/technicianListInner?id=${item.id}`
				})
			},
			//筛选点击
			tabClick(index) {
				if (this.filterIndex === index) {
					return;
				}
				// this.projectList.length = 0

				this.filterIndex = index;
				this.projectInfoList('refresh');
			},
			// 获取项目列表
			projectInfoList() {
				let params = {
					condition: this.filterText
				}
				this.$api.projectInfoList(params).then(res => {
					if (res.code === 200) {
						let projectList = res.data
						this.projectList = projectList
					}
				})
			},
			// 获取首页信息(banner,推荐技师,广播)
			getIndexInfo() {
				this.$api.indexInfo({}).then(res => {
					if (res.code === 200) {
						this.artificerInfoDtos = res.data.artificerInfoDtos
						this.bannerDtos = res.data.bannerDtos
						if (res.data.radioDtos && res.data.radioDtos.length > 0) {
							this.radioDtosText = ''
							res.data.radioDtos.forEach(item => {
								this.radioDtosText += `${item.content}\t`
							})
						}
					}
				})
			},
			scroll(e) {
				console.log(e)
			},
			onConfirm() {

			},
			onCancel() {

			},
			// banner跳转页面
			navToPage(item) {
				if (item.isLogin == 1) { // 如果需要登陆
					// #ifdef MP-WEIXIN
					if (!uni.getStorageSync('token')) { // 如果没有token
						uni.navigateTo({
							url: `/pages/user/auth`
						})
						return
						if (item.jumpUrl == '/pages/technician/technicianUploadImg' && uni.getStorageSync('identity') == 'artificer') { // 如果跳转技师并且是技师了
							return
						}
					}
					// #endif
					
					// #ifdef H5
					if (!sessionStorage.getItem('token')) { // 如果没有token
						uni.navigateTo({
							url: `/pages/user/auth`
						})
						return
						if (item.jumpUrl == '/pages/technician/technicianUploadImg' && sessionStorage.getItem('identity') == 'artificer') { // 如果跳转技师并且是技师了
							return
						}
					}
					// #endif
					
				}
				item.jumpUrl && uni.navigateTo({
					url: item.jumpUrl
				})
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			//详情页
			navToDetailPage(item) {
				if (item.isOpen == 0) return
				//测试数据没有写id，用title代替
				let id = item.title;
				uni.navigateTo({
					url: `/pages/product/detail?id=${item.id}`
				})
			},
		},
		// 分享
		onShareAppMessage() {
			let shareObj = {
				title: '约了摩',
				path: '/pages/index/index',
				imageUrl: '../../static/img/login.png'
			};
			return shareObj;
		},
		
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			this.$api.msg('点击了搜索框');
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.$api.msg('点击了扫描');
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
				})
			}
		}
		// #endif
	}
</script>

<style lang="scss" scoped>
	@import '~@/styles/common.scss';

	page {
		background: #f5f5f5;

		.carousel-section {
			padding: 0;
			position: relative;

			.titleNview-placing {
				padding-top: 0;
				height: 0;
				box-sizing: content-box;
			}

			.carousel {
				width: 100%;
				height: 350upx;

				.carousel-item {
					width: 100%;
					height: 100%;
					padding: 0;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.swiper-dots {
				display: flex;
				position: absolute;
				left: 60upx;
				bottom: 15upx;
				width: 72upx;
				height: 36upx;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
				background-size: 100% 100%;

				.num {
					width: 36upx;
					height: 36upx;
					border-radius: 50px;
					font-size: 24upx;
					color: #fff;
					text-align: center;
					line-height: 36upx;
				}

				.sign {
					position: absolute;
					top: 0;
					left: 50%;
					line-height: 36upx;
					font-size: 12upx;
					color: #fff;
					transform: translateX(-50%);
				}
			}
		}

		.technician-recommendation {
			width: 100%;
			padding: 30upx;

			.title {
				font-size: 26upx;
				margin-bottom: 20upx;
			}

			.recommendation-list {
				width: 100%;
				display: flex;
				align-items: center;

				.recommendation-item {
					position: relative;
					flex: 0 0 260upx;
					height: 260upx;
					border-radius: 10upx;
					border: 1px solid $base-color;

					image {
						width: 100%;
					}

					.item-intro {
						width: 100%;
						line-height: 46upx;
						position: absolute;
						left: 0;
						bottom: 0upx;
						font-size: 24upx;
						text-align: center;
						background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
						color: #fff;
					}

					&:not(:last-child) {
						margin-right: 30upx;
					}
				}
			}
		}

		.navbar-index {
			// top: var(calc(--window-top + 80upx));
			position: relative;
			border-top: 2upx solid $color-lightgray;

			&.current {
				color: $base-color;
			}
		}

		.goods-list {
			display: flex;
			flex-wrap: wrap;
			// padding: 0 30upx;
			background: #f6f6f6;

			.goods-item {
				display: flex;
				align-items: center;
				width: 100%;
				height: 250upx;
				margin-bottom: 20upx;
				background: #fff;
				padding: 0 30upx;

				&:first-child {
					margin-top: 20upx;
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
				&.cant{
					background-color: $color-gray;
					color: $color-white;
				}
			}

			// .price {
			// 	font-size: $font-lg;
			// 	color: $uni-color-primary;
			// 	line-height: 1;

			// 	&:before {
			// 		content: '￥';
			// 		font-size: 26upx;
			// 	}
			// }
		}

	}
</style>
