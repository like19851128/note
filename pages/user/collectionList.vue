<template>
	<view class="content">

		<!-- 空白页 -->
		<empty v-if="technicianList.length === 0 || technicianList == null"></empty>

		<template v-else>
			<!-- 用来站位的空白栏 -->
			<view class="navbar-holder" v-if="technicianList.length == 0 || technicianList.length == null"></view>
			<view class="goods-list" v-if="technicianList && technicianList.length>0">
				<view v-for="(item, index) in technicianList" :key="index" class="goods-item"
					@click="toTechnicianDetail(item)">
					<image :src="item.artificerPhoto" mode="aspectFill"></image>
					<view class="item-intro">{{item.artificerName}}</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import empty from "@/components/empty";
	export default {
		components: {
			empty
		},
		data() {
			return {
				pageNo: 1, // 第几页
				pageSize: 10, // 一页几条
				loadingType: 'more', //加载更多状态
				technicianList: []
			};
		},
		onLoad(options) {
			// this.artificerCollection();
		},
		onShow() {
			this.artificerCollection('refresh');
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
			this.artificerCollection('refresh');
		},
		//加载更多
		onReachBottom() {
			this.artificerCollection();
		},
		methods: {
			screen() {
				this.cateMaskState = !this.cateMaskState
			},
			//加载商品 ，带下拉刷新和上滑加载
			async artificerCollection(type = 'add', loading) {
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
					this.technicianList = [];
					this.pageNo = 1
				}
				let params = {}
				let res = await this.$api.artificerCollection(params);
				let technicianList = res.data
				if (technicianList != null) {
					this.technicianList = this.technicianList.concat(technicianList);
				}
				this.pageNo++

				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				// this.loadingType = this.technicianList.length >= res.data.total ? 'nomore' : 'more';
				if (type === 'refresh') {
					if (loading == 1) {
						uni.hideLoading()
					} else {
						uni.stopPullDownRefresh();
					}
				}
			},
			//详情
			toTechnicianDetail(item) {
				uni.navigateTo({
					url: `/pages/technician/technicianDetail?id=${item.artificerId}`
				})
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

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 30upx 50upx;

		// background: #fff;
		.goods-item {
			position: relative;
			background-color: #fff;
			width: 300upx;
			height: 300upx;
			margin-bottom: 40upx;
			box-shadow: 0 0 5upx 5upx rgba(0, 0, 0, 0.2);
			border-radius: 10upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
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
		}
	}
</style>
