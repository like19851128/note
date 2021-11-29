<template>
	<view class="content b-t">
		
		<!-- 空白页 -->
		<empty v-if="artificerRestList.length === 0 || artificerRestList == null"></empty>
		<template v-else>
			<view class="list b-b" v-for="(item, index) in artificerRestList" :key="index" @click="checkOfflineTime(item)">
				<view class="wrapper">
					<view class="address-box">
						<view class="address">开始时间：{{item.startTime}}</view>
						<view class="address">结束时间：{{item.endTime}}</view>
					</view>
					<view class="u-box">{{item.type | showType}}</view>
				</view>
				<view class="switch-con">
					<switch :checked="isCheck[`${item.status}`]" color="#762654" @change="switchChange($event, item)" />
				</view>
				<text class="iconfont icon-bianji-copy" @click.stop="addTime('edit', item)"></text>
				<text style="margin-left: 20rpx;" class="iconfont icon-delete" @click.stop="delTime('del', item)"></text>
			</view>
		</template>
		<button class="add-btn" @click="addTime('add')">新增离线时间</button>
	</view>
</template>

<script>
	import empty from "@/components/empty";
	export default {
		components: {
			empty
		},
		filters: {
			showType(val) {
				return val === 'EVERY_DAY' ? '每天' : '当天'
			},
		},
		data() {
			return {
				isCheck: {'DISABLE': 0, 'ENABLE': 1},
				source: 0,
				artificerRestList: []
			}
		},
		onLoad(option){
			console.log(option.source);
			this.source = option.source;
		},
		onShow() {
			this.artificerRest()
		},
		methods: {
			// 请求接口
			artificerRestSave(data) {
				this.$api.artificerRestSave(data).then(res => {
					if (res.code === 200) {
						this.$utils.msg(`设置成功`);
					}
					this.artificerRest()
				})
			},
			// 启用,停用
			switchChange(e, item) {
				item.status = e.detail.value === true ? 'ENABLE': 'DISABLE'
				this.artificerRestSave(item)
			},
			// 获取技师休息列表
			artificerRest() {
				this.$api.artificerRest({}).then(res => {
					if (res.code === 200 && res.data) {
						this.artificerRestList = res.data
					}
				})
			},
			//选择地址
			checkOfflineTime(item){
				if(this.source == 1){
					//this.$utils.prePage()获取上一页实例，在App.vue定义
					this.$utils.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			// 删除时间
			delTime(type, item){
				let _this = this
				uni.showModal({
					title: '确认删除？',
					success(res) {
						if (res.confirm) {
							let params = {id: item.id}
							_this.$api.artificerRestDelete(params).then(res => {
								if (res.code === 200) {
									_this.$utils.msg(res.message)
									_this.artificerRest()
								}
							})
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			// 修改时间
			addTime(type, item){
				console.log(type)
				uni.navigateTo({
					url: `/pages/technician/offlineTimeManage?type=${type}&data=${JSON.stringify(item)}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		border: 1upx solid rgba(255, 255, 255, 0);
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		width: 65%;
	}
	.switch-con{
		transform: scale(0.8);
	}
	.address-box{
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
