<template>
	<view class="content">
		<!-- 顶部定位搜索栏 -->
		<view class="location-search technician" :style="{position:headerPosition,top:headerTop + 'px'}">
			<view class="location">
				<text class="city-name">重庆</text>
				<text class="active iconfont icon-xia" style="font-size: 12px"></text>
			</view>
			<view class="search-box">
				<input class="ser-input" v-model="kw" type="text" placeholder="输入关键字搜索"
					placeholder-class="place-holder" />
			</view>
			<view class="location-map">
				<text class="iconfont icon-dingwei"></text>
			</view>
		</view>
		<view class="navbar" :style="{position:headerPosition,top:(headerTop + 40)+'px'}">
			<view class="nav-item">
				<text @click.stop="screen">{{cateList[cateCurrentIndex].name}}</text>
				<text class="iconfont icon-xia"></text>
			</view>
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				全部技师
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				可服务
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				休息中
			</view>
			<!-- <text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text> -->
		</view>
		
		<!-- 空白页 -->
		<empty v-if="technicianList.length === 0 || technicianList == null"></empty>
		
		<template v-else>
			<scroll-view class="goods-list" v-if="technicianList && technicianList.length>0" :scroll-y="true"
				:refresher-enabled="refresher" :refresher-threshold="threshold" :refresher-triggered="triggered"
				@refresherrefresh="refreshing" :scroll-anchoring="anchoring" @scrolltolower="infinite"
				:style="{height: `${goodListHeight}px`}">
				<view v-for="(item, index) in technicianList" :key="index" class="goods-item"
					@click="toTechnicianDetail(item)">
					<view class="image-wrapper">
						<image :src="item.headImg" mode="aspectFill"></image>
						<view v-if="item.statusMsg" class="serve-status" :class="{cant: item.statusMsg == '休息中'}">{{item.statusMsg}}</view>
					</view>
					<view class="info-wrapper">
						<view class="title clamp">
							<view class="nickname">{{item.nickname}}</view>
							<view class="serve-years">
								<text>{{item.title || '初级技师'}}</text>
								<text>{{item.titleYear || 0}}年</text>
							</view>
						</view>
						<view class="serve-number">
							<view class="star-num">评分：{{item.score || 0}}</view>
							<view class="views-num">
								<text style="margin-right: 30rpx;">
									{{item.totalOrderNum || 0}}单 
								</text>
								<text>
									浏览量：{{item.totalPointNum || 0}}
								</text>
							</view>
							<view class="distance" :style="{opacity: item.distance?'1':'0'}">
								<text></text>{{item.distance ||0}}公里</view>
						</view>
						<view class="evaluate-box">
							<template v-for="(itm, idx) in item.labelList">
								<text class="evaluate-item" v-if="idx<=3" :key="idx">{{itm}}</text>
							</template>
						</view>
					</view>
				</view>
			</scroll-view>
		</template>

		<!-- <uni-load-more :status="loadingType"></uni-load-more> -->

		<view class="cate-mask" :class="!cateMaskState ? 'none' : 'show'" @click.self="screen">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="(item, index) in cateList" :key="item.id">
						<view @click="changeCate(item, index)" class="cate-item b-b two"
							:class="{active: item.id==cateId}">{{item.name}}</view>
						<!-- <view 
							v-for="tItem in item.child" :key="tItem.id" 
							class="cate-item b-b" 
							:class="{active: tItem.id==cateId}"
							@click="changeCate(tItem)">
							{{tItem.name}}
						</view> -->
					</view>
				</scroll-view>
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
				goodListHeight: 0,
				isRefreshing: false, // 是否在刷新中
				isInfiniting: this.infiniting, // 是否在加载中
				// infiniteDisabled: true, // 是否禁用上拉加载
				triggered: true,
				anchoring: true,
				refresher: true,
				threshold: 100,
				triggered: false,
				timer: null,
				pageNo: 1, // 第几页
				pageSize: 5, // 一页几条
				id: '', // 项目id
				cateMaskState: false, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: 0,
				loadingType: 'more', //加载更多状态
				filterIndex: 0, // 筛选的条件
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				cateCurrentIndex: 0, // 排序当前值
				technicianList: [],
				kw: '', // 关键字查询
			};
		},
		computed: {
			status() {
				let status = 0
				switch (this.filterIndex) {
					case 0:
						status = null;
						break;
					case 1:
						status = 0;
						break;
					case 2:
						status = 3;
						break;
				}
				return status
			}
		},
		watch: {
			kw(val) {
				if (this.timer) {
					clearTimeout(this.timer) //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
					this.timer = setTimeout(() => {
						this.getArtificerPageList('refresh')
					}, 600)
				} else {
					this.timer = setTimeout(() => {
						this.getArtificerPageList('refresh')
					}, 600) // 进入该分支说明当前并没有在计时，那么就开始一个计时
				}
			}
		},
		onLoad(options) {
			// #ifdef H5
			this.headerTop = 40
			// #endif
			this.id = options.id
			this.loadCateList(options.fid, options.sid);
			this.getArtificerPageList();
		},
		onShow() {
			let _that = this
			// 设置swiper高度
			uni.getSystemInfo({
				success(res) {
					console.log(res)
					_that.goodListHeight = res.windowHeight - 80;
				}
			})
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getArtificerPageList('refresh');
		},
		//加载更多
		// onReachBottom() {
		// 	this.getArtificerPageList();
		// },
		methods: {
			// 下拉刷新
			refreshing() {
				if (this.isRefreshing) return;
				this.isRefreshing = true
				this.triggered = true;
				this.isInfiniting = false; // 若下拉刷新和上拉加载同时存在，则每次刷新需要重置上拉加载状态
				this.triggered = false;
				// this.infiniteDisabled = false;
				this.getArtificerPageList('refresh')
			},
			// 上拉加载
			infinite() {
				console.log(123123)
				this.getArtificerPageList();
			},
			screen() {
				this.cateMaskState = !this.cateMaskState
			},
			//加载分类
			async loadCateList(fid, sid) {
				this.cateList = [{
						id: 1,
						name: '按距离排序',
						condition: 'ai.distance asc'
					},
					{
						id: 2,
						name: '按接单量排序',
						condition: 'ai.order_num desc'
					},
					{
						id: 3,
						name: '按浏览量排序',
						condition: 'ai.point_num desc'
					}
				];
				// let cateList = list.filter(item=>item.pid == fid);

				// cateList.forEach(item=>{
				// 	let tempList = list.filter(val=>val.pid == item.id);
				// 	item.child = tempList;
				// })
				// this.cateList = cateList;
			},
			//加载商品 ，带下拉刷新和上滑加载
			async getArtificerPageList(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}
				// 如果是刷新,则页码重置为1
				if (type === 'refresh') {
					this.isRefreshing = false;
					this.isInfiniting = true;
					this.technicianList = [];
					this.pageNo = 1
				}
				let params = {
					pageIndex: this.pageNo,
					pageSize: this.pageSize,
					queryParams: {
						condition: `ai.is_hot desc,${this.cateList[this.cateCurrentIndex].condition}`,
						projectId: this.id,
						status: this.status,
						// #ifdef MP-WEIXIN
						lngX: uni.getStorageSync('longitude') || 0,
						latY: uni.getStorageSync('latitude') || 0,
						// #endif
						
						// #ifdef H5
						lngX: sessionStorage.getItem('longitude') || 0,
						latY: sessionStorage.getItem('latitude') || 0,
						// #endif
						kw: this.kw
					}
				}
				let res = await this.$api.artificerPageList(params);
				let technicianList = res.data.data
				if (technicianList != null) {
					this.technicianList = this.technicianList.concat(technicianList);
				}
				this.pageNo++

				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType = this.technicianList.length >= res.data.total ? 'nomore' : 'more';
				if (type === 'refresh') {
					if (loading == 1) {
						uni.hideLoading()
					} else {
						uni.stopPullDownRefresh();
					}
				}
			},
			//筛选点击
			tabClick(index, type) {
				if (this.filterIndex === index) {
					return;
				}
				this.filterIndex = index;
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.getArtificerPageList('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item, index) {
				// if (this.cateCurrentIndex == index) return
				this.cateCurrentIndex = index
				this.cateId = item.id;
				this.cateMaskState = false;
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.getArtificerPageList('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//详情
			toTechnicianDetail(item) {
				if (this.id) {
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
						url: `/pages/order/createOrder?id=${this.id}&artificerId=${item.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/technician/technicianDetail?id=${item.id}`
					})
				}
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	@import '~@/styles/common.scss';

	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 80px;
	}

	.navbar {
		position: relative;
		left: 0;
		// top: var(calc(--window-top + 80upx));
		display: flex;
		width: 100%;
		height: 30px;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			font-size: 26upx !important;
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			text {
				font-size: 26upx !important;
			}

			.icon-xia {
				width: 25upx;
				height: 25upx;
				font-size: 24upx !important;
				color: $base-color!important;
			}

			&.current {
				color: $base-color;
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: 70px;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.4);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 100%;
			max-height: 400upx;
			overflow: hidden;
			background: #fff;
			// float:left;
			// transform: translateY(80upx);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			// background: rgba(0,0,0,.4);

			.cate-content {
				// transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 26upx;
			background: #fff;
		}

		.active {
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;

		.goods-item {
			width: calc(100% - 60upx);
			margin: 5upx auto 35upx;
			background-color: #fff;
			display: flex;
			align-items: center;
			height: 250upx;
			box-shadow: 0 0 5upx 5upx rgba(0, 0, 0, 0.2);
			border-radius: 10upx;
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
				border-radius: 20upx;
				margin-bottom: 10upx;
				flex-shrink: 0;
			}

			.serve-status {
				width: 150upx;
				background-color: $base-color;
				padding: 8upx 0;
				text-align: center;
				border-radius: 30upx;
				color: $color-white;
				&.cant{
					background-color: $color-lightgray;
					color: $color-darkgray;
				}
			}
		}

		.info-wrapper {
			width: 100%;
			height: 180upx;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			overflow: hidden;
		}

		.title {
			flex-shrink: 0;
			width: 95%;
			height: 50upx;
			font-size: $font-lg;
			color: $font-color-dark;
			// line-height: 60upx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.nickname {
				font-size: 28upx;
				font-weight: bold;
			}

			.serve-years {
				font-size: 22upx;
				color: $base-color;

				text {
					padding: 5upx 10upx;
					border: 1upx solid $base-color;
				}

				text:first-child {
					background-color: $base-color;
					color: #fff;
				}
			}
		}

		.serve-number {
			margin: 10upx 0 20upx;
			padding-right: 10upx;
			font-size: 24upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: $color-gray;
		}

		.evaluate-box {
			margin-top: 20upx;
			display: flex;
			align-items: center;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;

			.evaluate-item {
				background-color: $color-lightgray;
				padding: 10upx 15upx;
				border-radius: 5upx;

				// color: #fff;
				&:not(:last-child) {
					margin-right: 15upx;
				}
			}
		}
	}
</style>
