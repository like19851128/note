import secret from './secret.js'
import utils from '@/utils/index.js'
let Fly = require("flyio/dist/npm/wx")
let newfly = new Fly()
newfly.config.baseURL = utils.baseURL


newfly.interceptors.request.use(async (request) => {
	request.timeout = 30000
	commonConfig(request)
	return request
})

newfly.interceptors.response.use(async (response) => {
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


// 删除用户token, userId, 身份
function removeUserData() {
	wx.removeStorageSync('token')
	wx.removeStorageSync('userId')
	wx.removeStorageSync('identity')
}

function commonConfig(res) {
	const timestamp = new Date().getTime();
	let sign = secret.sign(JSON.stringify(res.body), timestamp, '')
	res.headers = {
		'content-type': 'application/json',
		'token': wx.getStorageSync('token') || '',
		'timestamp': timestamp,
		'sign': sign,
	}
}


const loginAndToken = async () => {
	console.log('loginAndToken--------------')
	fly.lock()
	const login = await getToken()
	wx.setStorageSync('token', login.data.data)
	request.headers = {
		'token': login.data.data
	}
	fly.unlock()
}

const getToken = async () => {
	return new Promise((resolve) => {
		wx.login({
			async success(loginRes) {
				console.log(loginRes)
				if (loginRes.code) {
					await newfly.post('login/getToken', {
						code: loginRes.code
					}).then((flyReq) => {
						console.log('token请求成功' + flyReq)
						resolve(flyReq)
					})
				} else {
					console.log('登录失败！' + loginRes.errMsg)
				}
			},
			fail(err) {
				console.log(err)
			}
		})
	})
}
export default newfly
