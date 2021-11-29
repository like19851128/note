<template>
	<view class="agreement-container">
		<rich-text :nodes="configValue"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '',
				configValue: ''
			}
		},
		onLoad(e) {
			this.type = e.type
			this.getConfigValue()
		},
		computed: {
			titleText() {
				let titleText = ''
				switch (this.type) {
					case 'USER_AGREEMENT':
						titleText = '用户协议';
						break;
					case 'PRIVACY_AGREEMENT':
						titleText = '隐私协议';
						break;
					case 'ARTIFICER_AGREEMENT':
						titleText = '技师协议';
						break;
				}
				uni.setNavigationBarTitle({
					title: titleText
				});
			}
		},
		methods: {
			// 获取协议内容
			getConfigValue() {
				let params = {
					configKey: this.type
				}
				this.$api.getConfigValue(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						this.configValue = res.data.configValue
						console.log(this.configValue)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.agreement-container {
		width: 100%;
	}
</style>
