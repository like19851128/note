<script>
	/**
	 * vuex管理登陆状态，具体可以参考官方登陆模板示例
	 */
	import {
		mapMutations
	} from 'vuex';
	export default {
		globleData: {
			resquestCount: 0,
			responseCount: 0
		},
		methods: {
			// ...mapMutations(['login'])
		},
		onLoad() {
			// this.$utils.getLocation()
		},
		// onLaunch: function() {
		// 	// if (!uni.getStorageSync('token')) {
		// 	// 	uni.setStorageSync('token', 'user:wx:login:token:uuu')
		// 	// }
		// 	console.log('token--------------------')
		// 	console.log(uni.getStorageSync('token'))
		// 	uni.getSetting({
		// 		success: (res) => {
		// 			console.log('getSetting---------')
		// 			console.log(res)
		// 		},
		// 		fail: (res) => {
		// 			console.log('getSetting---------f')
		// 			console.log(res)
		// 		}
		// 	})
			 
			
		// 	// uni.getLocation({
		// 	// 	type: 'wgs84',//wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
		// 	// 	 success (res) {
		// 	// 	   console.log(res)
		// 	// 	 }
		// 	// })
		// 	// let userInfo = uni.getStorageSync('userInfo') || '';
		// 	// if(userInfo.id){
		// 	// 	//更新登陆状态
		// 	// 	uni.getStorage({
		// 	// 		key: 'userInfo',
		// 	// 		success: (res) => {
		// 	// 			this.login(res.data);
		// 	// 		}
		// 	// 	});
		// 	// }
		// },
		created() {
			// #ifdef MP-WEIXIN
				this.$utils.getLocation()
			// #endif
			
			// #ifdef H5
				this.$utils.getLoc()
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang='scss'>
    @import "./styles/iconfont.css";
	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
	/* 骨架屏替代方案 */
	.Skeleton {
		background: #f3f3f3;
		padding: 20upx 0;
		border-radius: 8upx;
	}

	/* 图片载入替代方案 */
	.image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		border-radius: 4px;

		image {
			width: 100%;
			height: 100%;
			transition: .6s;
			opacity: 0;

			&.loaded {
				opacity: 1;
			}
		}
	}

	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}

	.common-hover {
		background: #f5f5f5;
	}

	/*边框*/
	.b-b:after,
	.b-t:after {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 0;
		content: '';
		transform: scaleY(.5);
		border-bottom: 1px solid $border-color-base;
	}

	.b-b:after {
		bottom: 0;
	}

	.b-t:after {
		top: 0;
	}

	/* button样式改写 */
	uni-button,
	button {
		height: 80upx;
		line-height: 80upx;
		font-size: $font-lg + 2upx;
		font-weight: normal;

		&.no-border:before,
		&.no-border:after {
			border: 0;
		}
	}

	uni-button[type=default],
	button[type=default] {
		color: $font-color-dark;
	}

	/* input 样式 */
	.input-placeholder {
		color: #999999;
	}

	.placeholder {
		color: #999999;
	}
</style>
