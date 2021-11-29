<template>
	<view class="suggestion-container">
		<image :src="configValue" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				configKey: '',
				configValue: ''
			}
		},
		onLoad(e) {
			this.configKey = e.configKey
			this.getConfigValue()
		},
		methods:{
			// 获取操作建议
			getConfigValue() {
				let params = {
					configKey: this.configKey
				}
				this.$api.getConfigValue(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						this.configValue = res.data.configValue
						console.log(this.configValue)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.suggestion-container{
		width: 100%;
		image{
			width: 100%;
		}
	}
</style>
