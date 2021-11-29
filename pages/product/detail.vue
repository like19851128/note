<template>
	<view class="container">
		<!-- 顶部banner -->
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 标题 -->
		<view class="introduce-section" v-if="productDetail.name">
			<view class="section-box">
				<text class="title">{{productDetail.name}}</text>
				<text class="price">￥{{productDetail.tradePrice}}</text>
			</view>
			<view class="section-box two">
				<text class="person-choosed">({{productDetail.totalOrderNum || 0}}人选择)</text>
				<text class="serve-times"><text class="iconfont icon-shijian"></text>{{productDetail.serviceTime}}分钟</text>
			</view>
		</view>
		<!-- 选择tab -->
		<view class="tab-com">
			<ul class="order-status">
				<li :class="{current: currentSelect === 0}" @click="current(0)"><span>项目介绍</span></li>
				<li :class="{current: currentSelect === 1}" @click="current(1)"><span>禁忌说明</span></li>
				<li :class="{current: currentSelect === 2}" @click="current(2)"><span>下单须知</span></li>
			</ul>
		</view>
		<!-- 显示介绍 -->
		<view class="intro-con">
			<view class="intro-detail" v-show="currentSelect === 0">
				<rich-text :nodes="productDetail.introduce"></rich-text>
			</view>
			<view class="intro-detail" v-show="currentSelect === 1">
				<rich-text :nodes="productDetail.taboo"></rich-text>
			</view>
			<view class="intro-detail" v-show="currentSelect === 2">
				<rich-text :nodes="productDetail.notice"></rich-text>
			</view>
		</view>
		<!-- 底部点击按钮 -->
		<view v-if="!btnHide" @click="toTechnicianList" class="btn">选择技师</view>
	</view>
</template>

<script>
	import share from '@/components/share';
	export default {
		components: {
			share
		},
		data() {
			return {
				btnHide: false, // 是否隐藏底部找技师按钮
				productDetail: {},
				id: 0, // 项目id
				currentSelect: 0,
				imgList: []
			};
		},
		onLoad(options) {
			this.id = options.id
			this.btnHide = options.btnHide || false
			this.getProjectInfoDetail()
		},
		methods: {
			// 跳转技师列表
			toTechnicianList() {
				uni.navigateTo({
					url: `/pages/technician/technicianListInner?id=${this.id}`
				})
			},
			// 获取项目详情信息
			getProjectInfoDetail() {
				let params = {id: this.id}
				this.$api.projectInfoDetail(params).then(res => {
					if (res.code === 200) {
						this.productDetail = res.data
						this.imgList = res.data.bannerImgList || []
						console.log(this.imgList)
					}
				})
			},
			// 点击选择tab
			current(index) {
				if (this.currentSelect === index) return
				this.currentSelect = index
			},
			buy() {
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			stopPrevent() {}
		},

	}
</script>

<style lang='scss' scoped>
	@import '~@/styles/common.scss';

	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 422upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.section-box {
			font-size: 30upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title,
			.price {
				color: #D28751;

				&.title {
					font-weight: bold;
					color: #6A6A6A;
				}
			}

			&.two {
				font-size: 24upx;
				margin-top: 10upx;

				.person-choosed {
					color: $base-color;
				}

				.serve-times {
					color: #B1B3AD;

					.icon-shijian {
						font-size: 24upx;
						margin-right: 10upx;
						color: $base-color;
					}
				}
			}
		}
	}

	.tab-com {
		width: 100%;
		.order-status {
			box-sizing: border-box;
			width: 100%;
			height: 80upx;
			padding: 0 10upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border: 5upx solid #F6F6F6;

			.current {
				span {
					color: $base-color;
					border-bottom: 5upx solid $base-color;
				}
			}

			li {
				font-size: 28upx;
				flex: 1;
				text-align: center;
				&:last-child {
					margin-right: 0;
				}
				span {
					display: inline-block;
					height: 80upx;
					line-height: 80upx;
				}
			}
		}
	}
	.intro-con{
		width: 100%;
		padding: 15upx 30upx 100upx;
		word-break: break-all;
		/* margin-bottom: 100upx; */
	}
	.btn{
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 10upx;
		width: 90%;
		line-height: 80upx;
		border-radius: 10upx;
		text-align: center;
		background: $base-color;
		font-size: 30upx;
		color: #fff;
	}
</style>
