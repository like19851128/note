<template>
	<view class="content">
		<view class="row b-b" @click="selectDatePicker(1)">
			<text class="tit">开始时间</text>
			<view class="time-text">
				{{timeData.startTime || '选择开始时间'}}
			</view>
			<date-time-picker ref='dateTimeStart' :type='type' :datestring='dateString' @change='changeStartTime'></date-time-picker>
			<view class="arrowR iconfont icon-jiantouyou"></view>
		</view>
		<view class="row b-b" @click="selectDatePicker(2)">
			<text class="tit">结束时间</text>
			<view class="time-text">
				{{timeData.endTime || '选择结束时间'}}
			</view>
			<date-time-picker ref='dateTimeEnd' :type='type' :datestring='dateString' @change='changeEndTime'></date-time-picker>
			<view class="arrowR iconfont icon-jiantouyou"></view>
		</view>
		<view class="row b-b">
			<text class="tit">类型</text>
			<lb-picker ref="timePicker" mode="selector" v-model="timeData.type" :list="typeList" @confirm="confirm">
				<text @click="showTimePicker" class="cell-tip">{{timeData.type?showType(timeData.type):'请选择修改类型'}}</text>
			</lb-picker>
			<view class="arrowR iconfont icon-jiantouyou"></view>
		</view>
		<button class="add-btn" @click="submit">提交</button>
	</view>
</template>

<script>
	import DateTimePicker from '@/components/bory-dateTimePicker/bory-dateTimePicker.vue'
	import LbPicker from '@/components/lb-picker'
	export default {
		components: {
			DateTimePicker,
			LbPicker
		},
		data() {
			return {
				dateString: '',
				type: 'hour-minute',
				typeList: [
				  {
				    label: '一天',
				    value: 'ONLY_ONCE'
				  },
				  {
				    label: '每天',
				    value: 'EVERY_DAY'
				  }
				],
				timeData: {
					endTime: "",
					startTime: "",
					status: "ENABLE",
					type: "",
				}
			}
		},
		onLoad(option){
			let title = '新增离线时间';	
			if(option.type==='edit'){
				title = '编辑离线时间'
				
				this.timeData = JSON.parse(option.data)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			showTimePicker() {
				// if (!this.addressData.id) return this.$utils.msg('请先选择地址')
				this.$refs.timePicker.show()
			},
			selectDatePicker(type) {
				let pType = type === 1 ? 'dateTimeStart': 'dateTimeEnd'
				console.log(pType)
			  console.log(this.$refs[pType])
				this.$refs[pType].show()
			},
			showType(val) {
				return val === 'EVERY_DAY' ? '每天' : '一天'
			},
			// 选择类型
			confirm(e) {
				this.timeData.type = e.value
			},
			// 开始时间选择器
			changeStartTime(e) {
				let validE = +(e.replace(':', '.'))
				let validEnd = this.timeData.endTime && +(this.timeData.endTime.replace(':', '.'))
				console.log(validE)
				console.log(validEnd)
				if (validEnd && validE >= validEnd) return this.$utils.msg('开始时间必须小于结束时间')
				this.timeData.startTime = e
				this.$forceUpdate()
			},
			// 结束时间选择器
			changeEndTime(e) {
				let validE = +(e.replace(':', '.'))
				let validStart = this.timeData.startTime && +(this.timeData.startTime.replace(':', '.'))
				console.log(validE)
				console.log(validStart)
				if (validStart && validE <= validStart) return this.$utils.msg('结束时间必须大于开始时间')
				this.timeData.endTime = e
				this.$forceUpdate()
			},
			//点击提交按钮
			submit(){
				let data = this.timeData;
				if(!data.startTime){
					this.$utils.msg('请选择开始时间');
					return;
				}
				if(!data.endTime){
					this.$utils.msg('请选择结束时间');
					return;
				}
				if(!data.type){
					this.$utils.msg('请选择类型');
					return;
				}
				this.artificerRestSave(data)
			},
			artificerRestSave(data) {
				console.log(data)
				this.$api.artificerRestSave(data).then(res => {
					if (res.code === 200) {
						console.log(res)
						this.$utils.msg(`离线时间${this.manageType=='edit' ? '修改': '添加'}成功`);
						setTimeout(()=>{
							uni.navigateBack()
						}, 800)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		.row{
			display: flex;
			align-items: center;
			position: relative;
			padding:0 30upx;
			height: 110upx;
			background: #fff;
			.arrowR{
				position: absolute;
				top: 50%;
				left: 90%;
				transform: translateY(-50%);
				width: 15upx;
				height: 28upx;
			}
			.tit{
				flex-shrink: 0;
				width: 120upx;
				font-size: 30upx;
				color: $font-color-dark;
			}
			.time-text{
				margin-left: 20upx;
				font-size: 30upx;
			}
			.cell-tip{
				font-size: 30upx;
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
	}
</style>
