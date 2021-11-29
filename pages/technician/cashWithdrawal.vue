<template>
	<view class="drawal-container">
		<view class="drawal-operation">
			<view class="title">可提现金额：¥{{drawalDetail.balanceMoney || 0}}</view>
			<template v-if="type == 'ALIPAY'">
				<view class="items">
					<view class="left">支付宝账号：</view>
					<view v-if="accountDisabled" class="right">{{drawalDetail.payAccount}}</view>
					<input v-else class="input" type="text" v-model="drawalDetail.payAccount" placeholder="请输入支付宝账号"/>
				</view>
				<view class="items">
					<view class="left">支付宝昵称：</view>
					<view v-if="nicknameDisabled" class="right">{{drawalDetail.appAccountName}}</view>
					<input v-else class="input" type="text" v-model="drawalDetail.appAccountName" placeholder="请输入支付宝昵称"/>
				</view>
				<view class="items">
					<view class="left">实名姓名：</view>
					<view v-if="usernameDisabled" class="right">{{drawalDetail.accountUserName}}</view>
					<input v-else class="input" type="text" v-model="drawalDetail.accountUserName" placeholder="请输入支付宝账号用户名"/>
				</view>
			</template>
			<view class="items">
				<view class="left">提现金额：</view>
				<!-- <view class="right">¥{{drawalDetail.price || 0}}</view> -->
				<input class="input input1" type="number" v-model="balanceMoney" placeholder="请输入提现金额"/>
				<view class="all" @click="allMoney">全部提现</view>
			</view>
			<view class="items bz" v-if="accountDisabled" style="border-bottom: none">
				<view class="left">备注：如需要更改提现账号，请联系客服。</view>
			</view>
		</view>
		<button type="default" class="btn" @click="drawal">提现</button>
	</view>
</template>
	
<script>
	export default {
		data() {
			return {
				type: '',
				id: '',
				balanceMoney: '',
				accountDisabled: false,
				nicknameDisabled: false,
				usernameDisabled: false,
				drawalDetail: {
					payAccount: '',
					appAccountName: '',
					accountUserName: '',
					balanceMoney: '',
					id: ''
				}
			}
		},
		onLoad(e) {
			this.id = e.id
			this.cashAccountInfo()
		},
		methods: {
			// 全部提现
			allMoney() {
				this.balanceMoney = this.drawalDetail.balanceMoney
			},
			cashAccountInfo() {
				let params = {artificerId: this.id}
				this.$api.cashAccountInfo(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						this.drawalDetail = res.data
						this.type = res.data.type
						if (this.drawalDetail.payAccount) {
							this.accountDisabled = true
						}
						if (this.drawalDetail.appAccountName) {
							this.nicknameDisabled = true
						}
						if (this.drawalDetail.accountUserName) {
							this.usernameDisabled = true
						}
					}
				})
			},
			drawal() {
				// 如果是支付宝提现,需要确认账号,昵称和用户名
				if (this.type == 'ALIPAY') {
					if (!this.drawalDetail.payAccount) {
						this.$utils.showToast('请输入支付宝账号', 'none')
						return
					}
					if (!this.drawalDetail.appAccountName) {
						this.$utils.showToast('请输入支付昵称', 'none')
						return
					}
					if (!this.drawalDetail.accountUserName) {
						this.$utils.showToast('请输入支付宝用户名', 'none')
						return
					}
				}
				
				if (!this.balanceMoney) {
					this.$utils.showToast('请输入提现金额', 'none')
					return
				}
				if (parseFloat(this.balanceMoney) > parseFloat(this.drawalDetail.balanceMoney)) {
					this.$utils.showToast('提现金额不能大于可提现金额', 'none')
					return
				}
				// 如果是第一次提现
				if (!this.accountDisabled && this.type == 'ALIPAY') {
					let _this = this
					uni.showModal({
						title:'',
						content: '提现成功后，本次输入的提现账号将默认为您的提现账号，如需修改请联系客服',
						confirmText: '确认提现',
						success(res) {
							if (res.confirm) {
								_this.saveDrawal()
							}
						}
					})
				} else { // 不是第一次提现
					this.saveDrawal()
				}
			},
			saveDrawal() {
				// 公共参数
				let params = {
					artificerId: this.id,
					type: 'CASH_OUT', 
					bindTypeEnum: this.type,
					money: this.balanceMoney, 
					bindId: this.drawalDetail.id || null,
					// payAccount: this.drawalDetail.payAccount,
					// appAccountName: this.drawalDetail.appAccountName,
					// accountUserName: this.drawalDetail.accountUserName,
					// bindId: this.drawalDetail.id || null
				}
				// 如果是支付宝提现，需要添加以下的参数
				if (this.type == 'ALIPAY') {
					params.payAccount = this.drawalDetail.payAccount
					params.appAccountName = this.drawalDetail.appAccountName
					params.accountUserName = this.drawalDetail.accountUserName
				}
				params = this.$utils.objTrime(params)
				this.$api.artificerSaveStream(params).then(res => {
					if (res.code === 200) {
						this.$utils.showToast(res.message, 'success')
						setTimeout(() => {
							uni.navigateBack({
								delta: -1
							}, 1000)
						})
					} else {
						this.$utils.showToast(res.message, 'none')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.drawal-container{
		background-color: #fff;
		width: 100%;
		padding: 50rpx;
		.drawal-operation{
			.title{
				font-size: 36rpx;
				font-weight: bold;
				color: $base-color;
				padding-bottom: 30rpx;
				border-bottom: 2rpx solid $color-lightgray;
			}
			.items{
				font-size: 26rpx;
				line-height: 100rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid $color-lightgray;
				&.bz{
						line-height: 40rpx;
						align-items: flex-start;
						margin-top: 30rpx;
						.left{
							width: 100%;
							color: $color-darkgray;
						}
				}
				.left{
					width: 200rpx;
					flex-shrink: 0;
				}
				.right{
					color: $color-darkgray;
				}
				.input{
					width: 100%;
					&.input1{
						// border: 1rpx solid red;
						width: 50%;
					}
				}
				.all{
					font-size: 24rpx;
					margin-left: 20rpx;
					color: $base-color;
				}
			}
		}
		.btn{
			margin-top: 100rpx;
			background-color: $base-color;
			color: #fff;
		}
	}
</style>
