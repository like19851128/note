<template>
	<view class="content b-t">
		<!-- 空白页 -->
		<empty v-if="addressList.length === 0 || addressList == null"></empty>
		
		<template v-else>
			<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
				<view class="wrapper">
					<view class="address-box">
						<text v-if="item.isDefault" class="tag">默认</text>
						<text class="address">{{item.address}} {{item.area || ''}}</text>
					</view>
					<view class="u-box">
						<text class="name">{{item.name}}</text>
						<text class="mobile">{{item.tel}}</text>
					</view>
				</view>
				<text class="iconfont icon-bianji-copy" @click.stop="addAddress('edit', item)"></text>
				<text style="margin-left: 10rpx;" class="iconfont icon-delete" @click.stop="delAddress('del', item)"></text>
			</view>
		</template>
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
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
				source: 0,
				addressList: []
			}
		},
		onLoad(option){
			console.log(option.source);
			this.source = option.source;
		},
		onShow() {
			this.customerAddress()
		},
		methods: {
			// 获取用户地址列表
			customerAddress() {
				this.$api.customerAddress({}).then(res => {
					if (res.code === 200 && res.data) {
						this.addressList = res.data
					}
				})
			},
			// 删除地址
			delAddress(type, item){
				let _this = this
				uni.showModal({
					title: '确认删除？',
					success(res) {
						if (res.confirm) {
							let address = {id: item.id};
							_this.$api.customerAddressDel(address).then(res =>{
								if (res.code === 200) {
									_this.$utils.msg(res.message)
									_this.customerAddress();
								}
							});
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$utils.prePage()获取上一页实例，在App.vue定义
					this.$utils.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				console.log(type)
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);
				
				console.log(data, type);
			}
		}
	}
</script>

<style lang='scss' scoped>
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
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			flex-shrink: 0;
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
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
