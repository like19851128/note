import Vue from 'vue'
import store from './store'
import App from './App'
import api from './api/api.js'
import utils from './utils'
/** 
 *  css部分使用了App.vue下的全局样式和iconfont图标。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}



Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.prototype.$utils = utils
Vue.prototype.$api = api
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()