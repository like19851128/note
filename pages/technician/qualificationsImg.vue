<template>
	<view class="qualificationsImg-container">
		<!-- 抬头 -->
		<view class="certificates-con">
			<view class="title">认证信息</view>
			<view class="certificates-items">
				<view class="certificates-item">
					<view class="img">
						<text class="iconfont icon-shimingrenzheng"></text>
					</view>
					<view class="text">
						实名认证
					</view>
				</view>
				<view class="certificates-item">
					<view class="img">
						<text class="iconfont icon-shimingrenzheng"></text>
					</view>
					<view class="text">
						健康证
					</view>
				</view>
				<view class="certificates-item">
					<view class="img">
						<text class="iconfont icon-zizhilianghaohangwei"></text>
					</view>
					<view class="text">
						从业资格证
					</view>
				</view>
			</view>
		</view>
		<view class="holder"></view>
		<!-- 照片 -->
		<view class="img-con" v-if="qualificationsImgs.length>0">
			<view class="title">证件照片</view>
			<view class="imgs" v-for="(item, index) in qualificationsImgs" :key="index">
				<image :src="item" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				qualificationsImgs: [],
				idImgs: [], // 身份证
				healthCertificateImgs: [], // 健康证
				jobCertificateImgs: [] // 职业证书
			}
		},
		onLoad(e) {
			this.id = e.id
			this.artificerAuthInfoDetail()
		},
		methods: {
			artificerAuthInfoDetail() {
				let params = {id: this.id}
				this.$api.artificerAuthInfoDetail(params).then(res => {
					if (res.code === 200) {
						let result = res.data
						// this.idImgs = this.segmentation(result.idImgs)
						// this.healthCertificateImgs = this.segmentation(result.healthCertificateImgs)
						// this.jobCertificateImgs = this.segmentation(result.jobCertificateImgs)
						this.qualificationsImgs = [...result.idImgList, ...result.jobCertificateImgList, ...result.healthCertificateImgList]
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.qualificationsImg-container{
		.certificates-con{
			padding: 30upx 50upx;
			.certificates-items{
				font-size: 26upx;
				color: $color-darkgray;
				display: flex;
				align-items: center;
				// padding: 10upx 0 10upx;
				.certificates-item{
					text-align: center;
					flex: 1;
					.img{
						margin-bottom: 10upx;
					}
					.text{
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
	}
	.img-con{
		padding: 30upx 50upx;
		.imgs{
			margin-bottom: 20upx;
		}
	}
	image{
		width: 100%;
	}
	.title{
		font-size: 30upx;
		font-weight: bold;
		margin-bottom: 20upx;
	}
	.holder{
		width: 100%;
		height: 10upx;
		background-color: $color-lightgray;
	}
</style>
