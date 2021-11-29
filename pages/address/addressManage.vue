<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="请填写姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.tel" placeholder="请填写手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<text @click="chooseLocation" class="input">
				{{addressData.address || '在地图选择'}}
			</text>
			<text class="iconfont icon-jiantouyou"></text>
		</view>
		<view class="row b-b"> 
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.area" placeholder="请填写门楼牌号" placeholder-class="placeholder" />
		</view>
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.isDefault" color="#762654" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
		<!-- 前往打开权限 -->
		<view class="mask" v-if="showLocationBtn">
			<view class="jurisdiction">
				<view class="tips-title">地图需要开启您的定位功能</view>
				<view class="btns">
					<button class="btn cancel" @click="showLocationBtn = false" type="default">取消</button>
					<button class="btn sure" open-type="openSetting"  @opensetting="getScopes">前往设置</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showLocationBtn: false,
				addressData: {
					name: '',
					tel: '',
					address: '',
					lng: '', // 经度
					lat: '', // 纬度
					area: '',
					isDefault: false
				}
			}
		},
		onLoad(option){
			let title = '新增地址';	
			if(option.type==='edit'){
				title = '编辑地址'
				
				this.addressData = JSON.parse(option.data)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			getScopes(e) {
				console.log(e)
				this.showLocationBtn = false
			},
			switchChange(e){
				this.addressData.isDefault = e.detail.value;
			},
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						console.log(data)
						this.addressData.address = data.name;
						this.addressData.lng = data.longitude
						this.addressData.lat = data.latitude
					},
					fail:(e) => {
						console.log(e)
						if (e.errMsg == 'chooseLocation:fail auth deny') {
							this.showLocationBtn = true
							this.$forceUpdate()
						}
					}
				})
			},
			
			//点击提交按钮
			confirm(){
				let data = this.addressData;
				if(!data.name){
					this.$utils.msg('请填写联系人');
					return;
				}
				if(!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(data.tel)){
					this.$utils.msg('请输入正确的手机号码');
					return;
				}
				if(!data.address || !data.lng || !data.lat){
					this.$utils.msg('请在地图选择所在位置');
					return;
				}
				if(!data.area){
					this.$utils.msg('请填写门牌号信息');
					return;
				}
				this.addCustomerAddress(data)
			},
			// 提交接口
			addCustomerAddress(data) {
				//this.$utils.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				this.$api.customerAddressSave(data).then(res => {
					console.log(res)
					if (res.code === 200) {
						console.log(res)
						// this.$utils.prePage().refreshList(data, this.manageType);
						this.$utils.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
						setTimeout(()=>{
							uni.navigateBack()
						}, 800)
					} else {
						this.$utils.msg(res.message)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/styles/common.scss";
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
	// .mask{
	// 	position: fixed;
	// 	top: 0;
	// 	left: 0;
	// 	right: 0;
	// 	bottom: 0;
	// 	background-color: rgba(0, 0, 0, 0.5);
	// 	.jurisdiction{
	// 		width: 80%;
	// 		padding: 50upx;
	// 		background-color: $color-white;
	// 		border-radius: 10upx;
	// 		position: absolute;
	// 		top: 50%;
	// 		left: 50%;
	// 		transform: translate3d(-50%, -50%, 0);
	// 		.tips-title{
	// 			text-align: center;
	// 			margin-bottom: 50upx;
	// 			font-size: 30upx;
	// 			font-weight: bold;
	// 		}
	// 		.btns{
	// 			display: flex;
	// 			align-items: center;
	// 			justify-content: space-between;
	// 			.btn {
	// 				font-size: 26upx;
	// 				width: 45%;
	// 				line-height: 80upx;
	// 				&.cancel{
	// 					color: $color-gray;
	// 				}
	// 				&.sure{
	// 					background-color: $base-color;
	// 					color: $color-white;
	// 				}
	// 			}
	// 		}
	// 	}
	// }
</style>
