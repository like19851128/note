<template>
	<view class="records-container">
		<!-- 顶部tab -->
		<view class="navbar">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				提成
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				提现
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				退款
			</view>
		</view>
		<!-- 用来站位的空白栏 -->
		<view class="navbar-holder"></view>

		<!-- 空白页 -->
		<empty v-if="payRecordsList.length === 0 || payRecordsList == null"></empty>

		<view class="records-con" v-else>
			<view class="price-item" v-for="(item, index) in payRecordsList" :key="index">
				<view v-if="filterIndex == 1 && item.status == 2" class="del-record" @click="delRecord(item)">删除</view>
				<view class="item" v-if="item.accountUserName">
					<text class="item-left">账户</text>
					<text class="item-right">{{item.accountUserName}}</text>
				</view>
				<view class="item">
					<text class="item-left">金额</text>
					<text class="item-right">¥{{item.money}}</text>
				</view>
				<view class="item" v-if="item.typeMsg">
					<text class="item-left">方式</text>
					<text class="item-right">{{item.typeMsg}}</text>
				</view>
				<view class="item">
					<text class="item-left">状态</text>
					<text class="item-right">{{item.status | statusText}}</text>
				</view>
				<view class="item" v-if="item.trialRemake">
					<text class="item-left">{{filterIndex == 2?'退款原因':'失败原因'}}</text>
					<text class="item-right">{{item.trialRemake}}</text>
				</view>
				<!-- <view class="item" v-if="item.remake && filterIndex == 2">
					<text class="item-left">退款原因</text>
					<text class="item-right">{{item.remake}}</text>
				</view> -->
				<view class="item">
					<text class="item-left">创建时间</text>
					<text class="item-right">{{item.createTime}}</text>
				</view>
				<view class="item" v-if="item.trialTime">
					<text class="item-left">完成时间</text>
					<text class="item-right">{{item.trialTime}}</text>
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
				filterIndex: 0,
				id: '',
				pageIndex: 1,
				pageSize: 10,
				noMore: false,
				payRecordsList: []
			}
		},
		filters: {
			statusText(val) {
				return val === 0 ? '审核中' : val === 1 ? '成功' : '失败'
			}
		},
		onLoad(e) {
			this.id = e.id
			this.artificerPageStream()
		},
		computed: {
			filterText() {
				let filterText = 0
				switch (this.filterIndex) {
					case 0:
						filterText = '1';
						break;
					case 1:
						filterText = '2';
						break;
					case 2:
						filterText = '3';
						break;
				}
				return filterText
			}
		},
		methods: {
			// 重置noMore并且充值评论列表
			initList() {
				this.noMore = false
				this.payRecordsList.length = 0
				this.artificerPageStream('refresh');
			},
			// 删除失败记录
			delRecord(item) {
				uni.showModal({
					content: '确认删除该条记录吗？',
					success: (res) => {
						if (res.confirm) {
							let params = {id: item.id}
							this.$api.removeWithdrawalRecords(params).then(res => {
								this.$utils.msg(res.message)
								if (res.code === 200) {
									this.initList()
								}
							})
						}
					}
				})
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
				this.initList()
			},
			// 请求列表
			artificerPageStream(type) {
				if (this.noMore) {
					uni.showToast({
						title: '没有更多记录了',
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
							column: 'type',
							value: this.filterText,
						}
					]
				}
				this.$api.artificerPageStream(params).then(res => {
					if (res.code === 200) {
						let payRecordsList = res.data.data
						if (payRecordsList != null) {
							this.payRecordsList = this.payRecordsList.concat(payRecordsList)
						}
						if (this.payRecordsList.length == res.data.total) {
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

	.records-container {
		width: 100%;
		font-size: 24rpx;

		.records-con {
			padding: 20rpx 50rpx;

			.total-price {
				font-size: 32rpx;
				font-weight: bold;
				line-height: 100rpx;
				border-bottom: 1PX solid #E7E7E7;
			}

			.price-item {
				padding: 20rpx 0;
				line-height: 2;
				border-bottom: 1PX solid #E7E7E7;
				position: relative;
				.del-record{
					position: absolute;
					top: 20upx;
					right: 10upx;
					border: 1upx solid $base-color;
					color: $base-color;
					padding: 0upx 15upx;
					border-radius: 5upx;
				}
				.item {
					.item-left {
						width: 150rpx;
						display: inline-block;
						color: #71747B;
					}
				}
			}
		}
	}
</style>
