<template>
	<view class="content">
		<view class="con">
			<view class="row b-b">
				<text class="tit">昵称</text>
				<input class="input" type="text" v-model="userData.nickname" placeholder="请填写昵称" placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">手机号</text>
				<input class="input1" type="number" v-model="userData.phone" placeholder="请填写手机号码" placeholder-class="placeholder" />
				<view class="getCode" :class="{white: isSend}" @click.stop="sendMsg">{{tipSend}}</view>
			</view>
			<view class="row b-b">
				<text class="tit">验证码</text>
				<input class="input" type="number" v-model="verificationCode" placeholder="请填写手机验证码" placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">地址</text>
				<text @click="chooseLocation" class="input">
					{{userData.addr || '在地图选择'}}
				</text>
				<text class="iconfont icon-jiantouyou"></text>
			</view>
			<view class="row1">
				<view class="title">自我介绍</view>
				<textarea v-model="userData.brief" placeholder="请填写自我介绍,大于10字小于50字" placeholder-class="placeholder" />
			</view>
			<view class="row1">
				<view class="title">标签</view>
				<view class="label-con">
					<view class="label-item" :class="{active: item.isChoose}" @click="chooseLabel(item, index)" v-for="(item, index) in labelsList" :key="index">{{item.label}}</view>
				</view>
			</view>
			<view class="row1">
				<view class="title">可服务项目</view>
				<view class="project-con">
					<view class="project-item" :class="{active: item.isChoose}" @click="chooseProject(item, index)" v-for="(item, index) in projectList" :key="index">
						<template>
							<view class="project-isCheck iconfont icon-gouxuan" :class="{active: item.isChoose}"></view>
						</template>
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="row1">
				<view class="title">上传身份证（正反面各一张）</view>
				<hlUploadImg ref="idCardImg" :imgList="idCardImg" @delImg="delImg($event, 1)" :autoUpload="true" :maxCount="2" :overSize="1024*1024*5" @uploaded="uploaded($event, 1)"></hlUploadImg>
			</view>
			<!-- <view class="row1">
				<view class="title">上传身份证（反面）</view>
				<hlUploadImg ref="idCardImgBack" :imgList="idCardImgBack" @delImg="delImg($event, 2)" autoUpload="true" maxCount="1" overSize="1024*500" @uploaded="uploaded($event, 2)"></hlUploadImg>
			</view> -->
			<view class="row1">
				<view class="title">健康证(非必传)</view>
				<hlUploadImg ref="healthImg" :imgList="healthImg" @delImg="delImg($event, 2)" :autoUpload="true" :maxCount="1" :overSize="1024*1024*5" @uploaded="uploaded($event, 2)"></hlUploadImg>
			</view>
			<view class="row1">
				<view class="title">技能证书(非必传)</view>
				<hlUploadImg ref="skillImg" :imgList="skillImg" @delImg="delImg($event, 3)" :autoUpload="true" :maxCount="9" :overSize="1024*1024*5" @uploaded="uploaded($event, 3)"></hlUploadImg>
			</view>
			<view class="row1">
				<view class="title">生活照（三张以上）</view>
				<hlUploadImg ref="photoImg" :sy='false' :imgList="photoImg" @delImg="delImg($event, 4)" :autoUpload="true" :maxCount="9" :overSize="1024*1024*5" @uploaded="uploaded($event, 4)"></hlUploadImg>
			</view>
			<view class="row1">
				<view class="title">用户头像</view>
				<hlUploadImg ref="headImg" :sy='false' :imgList="headImg" @delImg="delImg($event, 5)" :autoUpload="true" :maxCount="1" :overSize="1024*1024*5" @uploaded="uploaded($event, 5)"></hlUploadImg>
			</view>
		<!-- 技师注册协议 -->
		<view class="checkGroup">
			<evan-checkbox v-model="checked">
				我已经阅读并同意
				<template slot="icon">
					<view class="agree iconfont icon-gouxuan" :class="{active: checked}"></view>
					<!-- <image v-if="checked" style="width: 20px;height: 20px;display: block;" src="../../static/img/check_on.png"></image>
					<image v-else style="width: 20px;height: 20px;display: block;" src="../../static/img/check_off.png"></image> -->
				</template>
				<template slot="link">
					<navigator
						url= "/pages/user/agreement?type=ARTIFICER_AGREEMENT"
						class="link"
						@click.native.stop="empty"
					>
						《技师协议》
					</navigator>
				</template>
			</evan-checkbox>
		</view>
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
	import hlUploadImg from '@/components/hl-uploadImg/hlUploadImg.vue';
	export default {
		components: {
			hlUploadImg
		},
		data() {
			return {
				projectList: [],
				choosedProject: [],
				checked: false,
				labelsList: [],
				choosedLabel: [],
				isSend: false,
				countDown: 60, // 获取验证码倒计时
				intervalId: null, // 定时器
				verificationCode: '',
				idCardImg: [], // 身份证
				healthImg: [], // 健康证
				skillImg: [], // 技能证书
				photoImg: [], // 生活照
				headImg: [], // 头像
				showLocationBtn: false,
				userData: {
					nickname: '',
					phone: '',
					brief: '',
					addr: '',
					lngX: '', // 经度
					latY: '' // 纬度
				}
			}
		},
		onUnload() {
			clearTimeout(this.intervalId)
		},
		onLoad(option){
			Array.prototype.remove = function(val) { 
				var index = this.indexOf(val); 
				if (index > -1) { 
				this.splice(index, 1); 
				} 
			};
			this.getLabels()
			this.projectInfoList()
			this.initCountDown();
			// let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑地址'
				
				this.userData = JSON.parse(option.data)
			}
			this.manageType = option.type;
			// uni.setNavigationBarTitle({
			// 	title
			// })
		},
		computed:{
			tipSend() {
				if (this.isSend) {
					return this.countDown + "秒";
				} else {
					return "获取验证码";
				}
			},
		},
		methods: {
			empty() {
				//这是阻止冒泡的空方法
			},
			// 获取项目列表
			projectInfoList() {
				this.$api.projectInfoList({}).then(res => {
					if (res.code === 200) {
						this.projectList = res.data
					}
				})
			},
			// 勾选项目
			chooseProject(item, index) {
				if (this.choosedProject.includes(item.id)) {
					this.choosedProject.remove(item.id)
					item.isChoose = false
				} else {
					this.choosedProject.push(item.id)
					item.isChoose = true
				}
			},
			// 勾选标签
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
			// 发送短信验证码
			sendMsg() {
				if (!this.userData.phone) {
					this.$utils.msg('请输入您的手机号码！');
					return false;
				} else if (!/^1\d{10}$/.test(this.userData.phone)) {
					this.$utils.msg("请输入正确格式的手机号码！");
					return false;
				}
				if (this.isSend) {
					return;
				}
				let params = {
					phone: this.userData.phone,
					typeEnum: 'V_CODE'
				};
				this.$api.sendSms(params).then(res => {
					if (res.code === 200) {
						this.isSend = true
					} else {
						this.$utils.msg(res.message)
					}
				})
			},
			// 倒计时
			initCountDown() {
				this.intervalId = setInterval(() => {
					if (this.isSend) {
						if (this.countDown - 1 <= 0) {
							this.countDown = 60;
							this.isSend = false;
						} else {
							this.countDown--;
						}
					}
				}, 1000);
			},
			uploaded(e, index) {
				console.log(e)
				console.log(index)
				if (index === 1) {
					this.idCardImg = e.allImages
				} else if (index === 2) {
					this.healthImg = e.allImages
				} else if (index === 3) {
					this.skillImg = e.allImages
				} else if (index === 4) {
					this.photoImg = e.allImages
				} else if (index === 5) {
					this.headImg = e.allImages
				}
			},
			// 删除图片
			delImg(e, index) {
				console.log(e)
				console.log(index)
				if (index === 1) {
					this.idCardImg = e.allImages
				} else if (index === 2) {
					this.healthImg = e.allImages
				} else if (index === 3) {
					this.skillImg = e.allImages
				} else if (index === 4) {
					this.photoImg = e.allImages
				} else if (index === 5) {
					this.headImg = e.allImages
				}
			},
			getScopes(e) {
				this.showLocationBtn = false
			},
			switchChange(e){
				this.userData.default = e.detail;
			},
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						console.log(data)
						this.userData.addr = data.name;
						this.userData.lngX = data.longitude
						this.userData.latY = data.latitude
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
			//提交
			confirm(){
				let data = Object.assign({}, this.userData);
				if(!data.nickname){ 
					this.$utils.msg('请填写昵称');
					return;
				}
				if(!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(data.phone)){
					this.$utils.msg('请输入正确的手机号码');
					return;
				}
				if(!this.verificationCode){
					this.$utils.msg('请输入手机验证码');
					return;
				}
				if(!data.lngX || !data.latY || !data.addr){
					this.$utils.msg('请在地图选择所在位置');
					return;
				}
				if (!data.brief || data.brief.length < 10 || data.brief.length>50) {
					this.$utils.msg('自我介绍需要大于10字小于50字');
					return;
				}
				if (this.choosedLabel.length < 1) {
					this.$utils.msg('请至少选择一个标签');
					return;
				}
				if (this.choosedProject.length < 1) {
					this.$utils.msg('请至少选择一项可服务项目');
					return;
				}
				if (this.idCardImg.length<2) {
					this.$utils.msg('请上传身份证照片正反面各一张');
					return;
				}
				// if (this.healthImg.length<1) {
				// 	console.log(this.healthImg)
				// 	this.$utils.msg('请上传健康证');
				// 	return;
				// }
				// if (this.skillImg.length<=0) {
				// 	this.$utils.msg('请上传技能证书');
				// 	return;
				// }
				if (this.photoImg.length<3) {
					this.$utils.msg('请上传三张及以上生活照');
					return;
				}
				if (this.headImg.length<=0) {
					this.$utils.msg('请上传头像');
					return;
				}
				if (!this.checked) {
					this.$utils.msg('请勾选技师协议');
					return;
				}
				this.sureSub(data)
			},
			sureSub(data) {
				data.smsCode = this.verificationCode
				data.projectIds = this.choosedProject.join('|')
				data.label = this.choosedLabel.join('|')
				data.idImgs = this.idCardImg.join('|')
				data.healthCertificateImgs = this.healthImg.join('|')
				data.jobCertificateImgs = this.skillImg.join('|')
				data.photo = this.photoImg.join('|')
				data.headImg = this.headImg.join('|')
				this.$api.artificerSettleIn(data).then(res => {
					console.log(res)
					if (res.code === 200) {
						this.$utils.msg('提交成功，请耐心等待')
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 500)
					} else {
						this.$utils.msg(res.message)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		// background: $page-color-base;
		// padding-top: 16upx;
	}
	.con{
		padding-bottom: 120upx;
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		.getCode{
			border-radius: 5upx;
			position: absolute;
			right: 20upx;
			top: 50%;
			width: 180upx;
			height: 60upx;
			line-height: 60upx;
			text-align: center;
			transform: translateY(-50%);
			font-size: 26upx;
			border: 1px solid $color-gray;
			color: $base-color;
			z-index: 20;
			background-color: $color-btn-background;
			&.white{
				color: $color-white;
			}
		}
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input, .input1{
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.row1{
		padding:0 30upx;
		height: auto;
		background: #fff;
		.title{
			margin: 30upx 0 15upx;
			padding-left: 20upx;
			font-weight: bold;
			position: relative;
			&::before{
				content: '';
				width: 6upx;
				height: 30upx;
				position: absolute;
				top: 0;
				left: 0upx;
				transform: translateY(10upx);
				background: $base-color;
			}
		}
		.label-con,.project-con{
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
		.project-item{
			width: 100%;
			font-size: 30upx;
			display: flex;
			align-items: center;
			margin-bottom: 10upx;
			.project-isCheck{
				flex-shrink: 0;
				font-size: 30upx;
				margin-right: 15upx;
				color: $color-gray;
				&.active{
					color: $base-color;
				}
			}
		}
		textarea{
			width: 100%;
			padding: 10upx;
			border: 1upx solid $color-darkgray;
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
		position: fixed;
		bottom: 30upx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		// margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
	.checkGroup {
		margin: 34rpx auto 30rpx;
		color: #7A8091;
		.agree{
			font-size: 30upx;
			&.active{
				color: $base-color;
			}
		}
	}
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		.jurisdiction{
			width: 80%;
			padding: 50upx;
			background-color: $color-white;
			border-radius: 10upx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			.tips-title{
				text-align: center;
				margin-bottom: 50upx;
				font-size: 30upx;
				font-weight: bold;
			}
			.btns{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.btn {
					font-size: 26upx;
					width: 45%;
					line-height: 80upx;
					&.cancel{
						color: $color-gray;
					}
					&.sure{
						background-color: $base-color;
						color: $color-white;
					}
				}
			}
		}
	}
</style>
