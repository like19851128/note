<template>
	<view class="rate-list-container">
		<!-- 顶部tab -->
		<view class="navbar">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				全部
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				好评
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				差评
			</view>
		</view>
		<!-- 用来站位的空白栏 -->
		<view class="navbar-holder"></view>

		<!-- 空白页 -->
		<empty v-if="commentList.length === 0 || commentList == null"></empty>

		<!-- 评价列表 -->
		<view class="rate-list" v-else>
			<view class="rate-items" v-for="(item, index) in commentList" :key="index">
				<view class="user-info">
					<view class="user-avatar">
						<image :src="item.evaluateAvatarUrl" mode="aspectFill"></image>
					</view>
					<view class="user-right">
						<view class="user-name">
							<text class="name">{{$utils.nameDesensitization(item.evaluateUserNickname)}}</text>
							<text class="date">{{showTime(item.createTime)}}</text>
						</view>
						<!-- <view class="rate-level-text">
							<text>好评</text>
						</view> -->
					</view>
				</view>
				<template v-if="item.labelList && item.labelList.length > 0">
					<view class="lable-con">
						<view class="lable-item" v-for="(itm, idx) in item.labelList" :key="idx">
							{{itm}}
						</view>
					</view>
				</template>
				<view class="rate-text">
					{{item.content || ''}}
				</view>
				<view class="rate-level">
					<view class="leve-item">
						体验评价： {{item.score || 0}}星
					</view>
					<!-- <view class="leve-item">
						服务技能： 5星
					</view>
					<view class="leve-item">
						服务态度： 5星
					</view> -->
				</view>
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
		data() {
			return {
				score: 5, // 按此分数为标准
				filterIndex: 0,
				noMore: false,
				pageIndex: 1,
				pageSize: 10,
				id: '', // 技师id
				commentList: []
			}
		},
		onLoad(e) {
			this.id = e.id
			this.evaluatePageList()
		},
		//加载更多
		onReachBottom() {
			this.evaluatePageList();
		},
		computed: {
			filterStatus() {
				let filterStatus = 0
				switch (this.filterIndex) {
					case 1:
						filterStatus = 'eq';
						break;
					case 2:
						filterStatus = 'lt';
						break;
				}
				return filterStatus
			}
		},
		methods: {
			showTime(time) {
				if (!time) return
				return time.split(' ')[0]
			},
			//筛选点击
			tabClick(index, type) {

				if (this.filterIndex === index) {
					return;
				}

				// 重置noMore并且充值评论列表
				this.noMore = false
				this.commentList.length = 0


				this.filterIndex = index;
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.evaluatePageList('refresh');
			},
			// 请求评价列表
			evaluatePageList(type) {
				console.log(this.noMore)
				if (this.noMore) {
					uni.showToast({
						title: '没有更多评论了',
						icon: 'none',
						duration: 2000
					})
					return false
				}
				if (type == 'refresh') {
					this.pageIndex = 1
				}
				let params = {
					pageIndex: this.pageIndex,
					pageSize: this.pageSize,
					terms: [{
							column: 'artificerId',
							value: this.id,
						},
						{
							column: 'score',
							termType: this.filterStatus,
							value: this.score,
						}
					]
				}
				// 如果是全部,不需要传termType字段
				if (this.filterIndex == 0) {
					params.terms.pop()
				}
				this.$api.evaluatePageList(params).then(res => {
					if (res.code === 200) {
						let commentList = res.data.data
						if (commentList != null) {
							this.commentList = this.commentList.concat(commentList)
						}
						if (this.commentList.length == res.data.total) {
							this.noMore = true
						}
						this.pageIndex++
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/styles/common.scss';

	.rate-list-container {
		background-color: $color-lightgray;

		.rate-list {
			.rate-items {
				background-color: #fff;
				font-size: 24upx;
				color: $color-darkgray;
				margin-top: 15upx;

				.user-info,
				.rate-text {
					margin: 0 30upx;
				}

				.user-info {
					padding: 20upx 0 10upx;
					display: flex;
					align-items: center;

					.user-avatar {
						width: 100upx;
						height: 100upx;
						margin-right: 30upx;
						flex-shrink: 0;

						image {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}

					.user-right {
						width: 100%;

						.user-name {
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 10upx;

							.name {
								color: #333;
								font-size: 28upx;
							}
						}

						.date,
						.rate-level-text {
							color: $color-gray;
						}
					}
				}

				.lable-con {
					width: 100%;
					padding: 0 30upx;
					display: flex;
					align-items: center;
					flex-wrap: wrap;

					.lable-item {
						margin: 10upx 20upx 10upx 0;
						background-color: $base-color;
						padding: 10upx 20upx;
						border-radius: 10upx;
						color: #fff;
					}
				}

				.rate-text {
					padding: 20upx 0;
				}

				.rate-level {
					padding: 20upx 30upx;
					border-top: 1upx solid $color-lightgray;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
		}
	}
</style>
