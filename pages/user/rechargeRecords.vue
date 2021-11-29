<template>
	<view class="records-container">
		<!-- 顶部tab -->
		<view class="navbar">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				充值
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				消费
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
			<view class="price-item" v-if="item.operateState == 'COMPLETED'" v-for="(item, index) in payRecordsList" :key="index">
				<view class="item">
					<text class="item-left">金额</text>
					<text class="item-right">¥{{item.operateAmount}}</text>
				</view>
				<view class="item" v-if="item.operateMode">
					<text class="item-left">方式</text>
					<text class="item-right">{{item.operateMode | payText}}</text>
				</view>
				<!-- <view class="item">
					<text class="item-left">状态</text>
					<text class="item-right">{{item.operateState | statusText}}</text>
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
				let statusText = ''
				switch (val) {
					case 'WAIT_PAY':
						statusText = '待支付';
						break;
					case 'COMPLETED':
						statusText = '已完成';
						break;
					case 'UNDER_REVIEW':
						statusText = '审核中';
						break;
					case 'REJECTED':
						statusText = '已拒绝';
						break;
					case 'CANCELLED':
						statusText = '已取消';
						break;
				}
				return statusText
			},
			payText(val) {
				let str = ''
				switch(val) {
					case 'WECHAT': str = '微信';
					break;
					case 'ALIPAY': str = '支付宝';
					break;
					case 'BALANCE': str = '余额';
					break;
					case 'SYS': str = '系统赠送';
					break;
				}
				return str
			}
		},
		onLoad(e) {
			this.id = e.id
			this.customerAccountRecordList()
		},
		computed: {
			filterText() {
				let filterText = 0
				let termType = ''
				switch (this.filterIndex) {
					case 0:
						filterText = [1,3];
						termType = 'in'
						break;
					case 1:
						filterText = '5';
						termType = 'eq'
						break;
					case 2:
						filterText = '4';
						termType = 'eq';
						break;
				}
				return {filterText, termType}
			}
		},
		methods: {
			//筛选点击
			tabClick(index, type) {
				if (this.filterIndex === index) {
					return;
				}
				// 重置noMore并且充值评论列表
				this.noMore = false
				this.payRecordsList.length = 0
				this.filterIndex = index;
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.customerAccountRecordList('refresh');
			},
			// 请求列表
			customerAccountRecordList(type) {
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
						column: 'operateType',
						termType: this.filterText.termType,
						value: this.filterText.filterText
					}]
				}
				this.$api.customerAccountRecordList(params).then(res => {
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
