import secret from './secret.js'
import utils from '@/utils/index.js'
import app from '@/App'

	
console.log(app)
let Fly = require("flyio/dist/npm/wx")
let fly = new Fly()
fly.config.baseURL = utils.baseURL


fly.interceptors.request.use(async (request) => {
	request.timeout = 30000
	// const timestamp = new Date().getTime();
	// const paramEncryptedStr = secret.Encrypt(JSON.stringify(request.body));
	// const sign = secret.sign(JSON.stringify(request.body), timestamp, '')

	// request.headers = {
	// 	'content-type': 'application/json',
	// 	'token': wx.getStorageSync('token') || '',
	// 	'timestamp': timestamp,
	// 	// 'codeEncryptedStr': secret.codeEncryptedStr(),
	// 	'sign': sign,
	// }
	commonConfig(request)
	
	// #ifdef MP-WEIXIN
	if (!wx.getStorageSync('token') && !request.ignoreToken && app.globleData.resquestCount === 0) {
		app.globleData.resquestCount = 1
		// fly.lock()
		uni.navigateTo({
			url: '/pages/user/auth'
		})
		// loginAndToken()
	}
	// #endif
	
	// #ifdef H5
	if (!sessionStorage.getItem('token') && !request.ignoreToken && app.globleData.resquestCount === 0) {
		app.globleData.resquestCount = 1
		// fly.lock()
		uni.navigateTo({
			url: '/pages/user/auth'
		})
		// loginAndToken()
	}
	// #endif
	
	// console.log(request)
	return request
})

fly.interceptors.response.use(async (response) => {
	if (response.data.code === 401 && app.globleData.responseCount === 0) { // 如果接口返回401，则弹窗提示跳转登陆页面
		app.globleData.responseCount = 1
		removeUserData()
		toAuth()
		// uni.showModal({
		// 	title: '登录超时',
		// 	content: '尚未登陆，请重新登录后再进入',
		// 	showCancel: false,
		// 	confirmText: '登录',
		// 	success: function(res) {
		// 		if (res.confirm) {
		// 			let pages = getCurrentPages() 
		// 			let currentPage = pages[pages.length - 1]
		// 			if (currentPage.route == 'pages/user/auth') {
		// 				return 
		// 			} else {
		// 				uni.navigateTo({
		// 					url: '/pages/user/auth'
		// 				})
		// 			}
		// 		}
		// 	}
		// });
	}
	return response.data
}, (err) => {
	let title = ''
	if (err.status === 0) {
		title = '网络连接异常'
	} else if (err.status === 1) {
		title = '网络连接超时'
	} else if (err.status === 401) {
		removeUserData()
		// wx.removeStorageSync('token_expiration')
		title = '登录超时，请重试'
	} else {
		title = err.response.data.message ? err.response.data.message : '请求数据失败,请稍后再试'
	}
	return wx.showToast({
		title: title,
		icon: 'none',
		duration: 2000
	})
})

// 接口报401,就去登陆
function toAuth() {
	let pages = getCurrentPages()
	let currentPage = pages[pages.length - 1]
	if (currentPage.route == 'pages/user/auth') {
		return 
	} else {
		uni.navigateTo({
			url: '/pages/user/auth'
		})
	}
}


// 删除用户token, userId, 身份
function removeUserData() {
	// #ifdef MP-WEIXIN
	wx.removeStorageSync('token')
	wx.removeStorageSync('id')
	wx.removeStorageSync('identity')
	// #endif
	
	// #ifdef H5
	sessionStorage.removeItem('token')
	sessionStorage.removeItem('id')
	sessionStorage.removeItem('identity')
	// #endif
	
}

function commonConfig(res) {
	const timestamp = new Date().getTime();
	let sign = secret.sign(JSON.stringify(res.body), timestamp, '')
	
	// #ifdef MP-WEIXIN
	res.headers = {
		'content-type': 'application/json',
		'token': wx.getStorageSync('token') || '',
		'timestamp': timestamp,
		'sign': sign,
	}
	// #endif
	
	// #ifdef H5
	res.headers = {
		'content-type': 'application/json',
		'token': sessionStorage.getItem('token') || '',
		'timestamp': timestamp,
		'sign': sign,
	}
	// #endif
	
}

export default fly
