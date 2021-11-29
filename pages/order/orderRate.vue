<template>
	<view class="order-rate-container">
		<view class="items-info-con">
			<view class="items-title">服务项目</view>
			<view class="items-info">
				<text class="item-title">服务项目</text>
				<text class="item-info">{{orderDetail.projectName}}</text>
			</view>
			<view class="items-info">
				<text class="item-title">技师名称</text>
				<text class="item-info">{{orderDetail.artificerNickname}}</text>
			</view>
		</view>
		<view class="title" style="font-size: 30rpx; font-weight: bold; margin-bottom: 10rpx;">请为服务评分</view>
		<view class="htz-item">
				<view class="htz-title">评价</view>
				<htz-rate v-model="pingjia" @change="ceshiChange" :size="rateSize" gutter="20"></htz-rate>
				<view class="htz-item-msg">{{pingjia | showRateText}}</view>
		</view>
		<view class="row1">
			<view class="title">标签</view>
			<view class="label-con">
				<view class="label-item" :class="{active: item.isChoose}" @click="chooseLabel(item, index)" v-for="(item, index) in labelsList" :key="index">{{item.label}}</view>
			</view>
		</view>
		<view class="opinion-area">
			<view class="title">其他意见</view>
			<textarea class="textarea" v-model="pinglun" maxlength="50" placeholder="请填写评论,最多50字" placeholder-class="area-placeholder" />
		</view>
		<button class="btn" @click="commentSave" type="default">提交</button>
	</view>
</template>

<script>
	import htzRate from '@/components/htz-rate/htz-rate.vue';
	export default {
		components:{
			htzRate
		},
		filters:{
			showRateText(val) {
				let text = '请打分'
				switch(val) {
					case 1: text = '很不满意';
					break;
					case 2: text = '不满意';
					break;
					case 3: text = '一般';
					break;
					case 4: text = '比较满意';
					break;
					case 5: text = '很满意';
					break;
				}
				return text
			}
		},
		data() {
			return {
				source: '',
				choosedLabel: [],
				labelsList: [],
				orderDetail: {}, // 订单详情
				orderNo: '', // 订单号
				rateSize: 40,
				pingjia: 0,
			}
		},
		onLoad(e) {
			Array.prototype.remove = function(val) {
				var index = this.indexOf(val); 
				if (index > -1) { 
				this.splice(index, 1); 
				} 
			};
			this.source = e.source || ''
			this.orderNo = e.orderNo
			this.getorderDetail()
			this.getLabels()
		},
		methods:{
			// 请求订单详情
			getorderDetail() {
				let params = {orderNo: this.orderNo}
				this.$api.orderDetail(params).then(res => {
					if (res.code === 200) {
						this.orderDetail = res.data
					}
				})
			},
			// 选择标签
			chooseLabel(item, index) {
				if (this.choosedLabel.includes(item.label)) {
					this.choosedLabel.remove(item.label)
					item.isChoose = false
				} else {
					this.choosedLabel.push(item.label)
					item.isChoose = true
				}
			},
			// 获取标签列表
			getLabels() {
				this.$api.getLabels({}).then(res => {
					if (res.code === 200) {
						// this.labelsList = res.data.labels
						this.labelsList = []
						res.data.labels.forEach(item => {
							let params = {label: item, isChoose: false}
							this.labelsList.push(params)
						})
						console.log(this.labelsList)
					}
				})
			},
			// 选择星级回调
			ceshiChange(e){
				this.pingjia = e
			},
			// 技师评价
			artificerEvaluateSave() {
				let params = {
					artificerId: this.orderDetail.artificerId,
					content: this.pinglun,
					label: this.choosedLabel.join('|'),
					orderNo: this.orderDetail.orderNo,
					score: this.pingjia
				}
				this.$api.artificerEvaluateSave(params).then(res => {
					if (res.code === 200) {
						this.$store.commit('setRefreshOrderList', Math.random())
						uni.showToast({
							title: res.message,
							duration: 2000
						})
						uni.navigateBack({
							delta: -1
						})
					} else {
						this.$utils.msg(res.msg)
					}
				})
			},
			// 提交评价
			commentSave() {
				if (!this.pingjia) {
					return this.$utils.msg('您还未对服务打分')
				}
				this.artificerEvaluateSave()
			}
		}
	}
</script>
	
<style lang="scss" scoped>
	.order-rate-container{
		padding: 30upx 50upx;
		.items-info-con{
			background-color: #fff;
			margin-bottom: 30upx;
			.items-title, .item-title, .item-info{
				font-size: 30upx;
				&.items-title{
					margin: 0 0 10upx 0;
					font-weight: bold;
				}
			}
			.items-info{
				margin-bottom: 15upx;
				display: flex;
				align-items: flex-start;
				font-size: 28upx;
				color: $color-darkgray;
				.item-title{
					flex-shrink: 0;
					margin-right: 30upx;
				}
				.item-info{
					width: 100%;
					word-break: break-all;
				}
			}
		}
		.htz-item {
			margin-bottom: 20upx;
			width: 100%;
			display: flex;
			align-items: center;
			.htz-title{
				margin-right: 20upx;
			}
			.htz-item-msg{
				font-size: 26upx;
				color: $color-gray;
			}
		}
		.row1{
			// padding:0 30upx;
			height: auto;
			background: #fff;
			.title{
				margin: 20upx 0 10upx;
				font-weight: bold;
			}
			.label-con{
				width: 100%;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.label-item{
					margin: 0 20upx 20upx 0;
					border: 1px solid $base-color;
					white-space: nowrap;
					padding: 10upx 20upx;
					border-radius: 10upx;
					&.active{
						background-color: $base-color;
						color: #fff;
					}
				}
			}
			textarea{
				width: 100%;
				padding: 10upx;
				border: 1upx solid $color-darkgray;
			}
		}
		.opinion-area{
			.title{
				margin: 30upx 0 20upx;
			}
			.textarea{
				width: 100%;
				border: 1upx solid $base-color;
				padding: 5upx 10upx;
			}
		}
		.btn{
			margin-top: 50upx;
			background-color: $base-color;
			color: $color-white;
		}
	}
</style>
