<template>
	<view class="photo-container">
		<view class="dots">{{currentIndex}}/{{picList.length}}</view>
		<swiper class="photo-swiper" :indicator-dots="false" :autoplay="false" interval="5000" duration="1000" @change="change">
			<block v-for="(item, index) in picList" :key="index">
				<swiper-item>
					<view class="img-con">
						<image :src="item" class="slide-image" mode="aspectFit" />
					</view>
				</swiper-item>
			</block>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentIndex: 1,
				picList: []
			}
		},
		onLoad(e) {
			this.picList = JSON.parse(e.photoList)
		},
		methods: {
			change(e) {
				this.currentIndex = e.detail.current + 1
			},
			previewImg(e) {
				if (this.picList.length == 0) return
				let imgArr = [];
				this.picList.forEach(item => {
					imgArr.push(item)
				})
				//预览图片
				uni.previewImage({
					urls: imgArr,
					current: e
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.photo-container {
		height: 100vh;
		background-color: #000;
		.photo-swiper{
			height: 100vh;
		}
		.dots {
			position: fixed;
			bottom: 50upx;
			left: 50upx;
			z-index: 50;
			color: #A71D5D;
		}
		.img-con{
			width: 100%;
			height: 100%;
			.slide-image {
				width: 100%;
				height: 100%;
				display: block;
				margin: 0 auto;
			}
		}
	}
</style>
