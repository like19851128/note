import api from '@/api/api.js'
// 常用公共方法

let baseURL = 'https://ylm.6plus7.cn'; // 正式环境：api请求接口
// let baseURL = 'https://ylm.6plus7.cn:8443'; // 测试环境：api请求接口

// #ifdef H5 
baseURL = '/'; // 重要：本次测试用，正式打包需要注释掉
// #endif

// 获取cdn加速 图片链接
const imgUrl = () => {
	return new Promise((resolve, reject) => {
		if (!uni.getStorageSync('imgUrl')) {
			let url = ''
			api.getCdn({}).then(res => {
				url = res.data;
				uni.setStorageSync('imgUrl', res.data);
				resolve(url);
			})
		} else {
			let url = uni.getStorageSync('imgUrl')
			resolve(url);
		}
	})
}

// 提示
const msg = (title, duration = 3000, mask = false, icon = 'none') => {
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

// 获取经纬度
const getLocation = () => {
	let count = 0
	// uni.getLocation({
	// 		type: 'wgs84',
	// 		altitude: true, 
	// success: (res) => {
	uni.startLocationUpdate({
		success(res) {
			console.log('开启后台定位', res)
			// console.log(this.$api.updateArtificerInfo)
			uni.onLocationChange(function(res) {
				console.log('location change', res)
				// uni.setStorageSync('longitude', res.longitude)
				// uni.setStorageSync('latitude', res.latitude)
				if (count == 0 || count % 10 === 0) {
					uni.setStorage({
						key: 'longitude',
						data: res.longitude
					})
					uni.setStorage({
						key: 'latitude',
						data: res.latitude
					})
				}
				// 如果有经纬度,并且是技师,才上传实时定位,获取经纬度是3秒一次,把请求接口频率调为3*count秒一次
				count++
				if (uni.getStorageSync('longitude') && uni.getStorageSync('latitude') && uni
					.getStorageSync('userId') && uni.getStorageSync('identity') == 'artificer' &&
					count % 20 === 0) {
					// if (uni.getStorageSync('longitude') && uni.getStorageSync('latitude') && count % 10 === 0) {
					let params = {
						lngX: uni.getStorageSync('longitude'),
						latY: uni.getStorageSync('latitude'),
						// id: uni.getStorageSync('userId')
					}
					api.updateArtificerInfo(params).then(res => {
						if (res.code === 200) {
							console.log(上传成功)
						} else {
							console.log(上传失败)
						}
					})
				}
			})
		},
		fail(res) {
			console.log('开启后台定位失败', res)
		}
	})
	// },
	// fail: (res) => {
	// 	console.log('res------------fail')
	// 	console.log(res)
	// }
	// });
}


const getLoc = () => {
	uni.showLoading({
		title: '正在获取当前地址信息...',
		mask: false
	});
	try {
		uni.getLocation({
			type: 'gcj02', // <map> 组件默认为国测局坐标gcj02
			altitude: true,
			success(res) {
				uni.hideLoading()
				console.log('返回的位置信息', res)
				sessionStorage.setItem('longitude', res.longitude)
				sessionStorage.setItem('latitude', res.latitude)
			},
			fail(err) {
				console.log(err)
				uni.hideLoading()
				let errMsg = err;
				uni.showToast({
					title: '地理位置获取失败，请退出后重试！',
				})
			},
			complete(e) {
			}
		})
	} catch (e) {
		uni.hideLoading();
		uni.showToast({
			title: JSON.stringify(e),
			icon: 'none'
		})
	}

}

// 获取用户信息
const getUserByToken = () => {
	return new Promise((resolve, reject) => {
		let params = {
			token: uni.getStorageSync('token')
		}
		api.getUserByToken(params)
			.then(res => {
				if (+res.code === 0) {
					let userinfo = res.data
					if (userinfo) {
						uni.setStorageSync('userinfo', JSON.stringify(userinfo));
					}
					resolve(userinfo)
				}
			})
	})
}

// 校验是否需要登陆
const verificationLogin = (fn) => {
	// #ifdef MP-WEIXIN
	let hasToken = uni.getStorageSync('token')
	// #endif

	// #ifdef H5
	let hasToken = sessionStorage.getItem('token')
	// #endif

	if (!hasToken) {
		uni.navigateTo({
			url: '/pages/user/auth'
		})
		return
	}
	fn()
}
// 埋点
const _uSystem = uni.getSystemInfoSync();

// 时间格式转化
// time: 时间戳或者时间对象 type：转换格式
const timeFormat = (time, type) => {
	var date;
	if (time instanceof Date) { //判断传入的是时间戳还是时间对象
		date = time;
	} else {
		date = new Date(time)
	}
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? "0" + m : m;
	var d = date.getDate();
	d = d < 10 ? "0" + d : d;
	var h = date.getHours();
	h = h < 10 ? "0" + h : h;
	var minute = date.getMinutes();
	minute = minute < 10 ? "0" + minute : minute;
	var second = date.getSeconds();
	second = second < 10 ? "0" + second : second;
	switch (type) {
		case 'yy-mm-dd hh:mm:ss':
			return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
			break;
		case 'yy/mm/dd hh:mm:ss':
			return y + "/" + m + "/" + d + " " + h + ":" + minute + ":" + second;
			break;
		case 'yy-mm-dd':
			return y + "-" + m + "-" + d;
			break;
		case 'yy.mm.dd':
			return y + "." + m + "." + d;
			break;
		case 'yy.mm.dd hh:mm:ss':
			return y + "." + m + "." + d + " " + h + ":" + minute + ":" + second;
			break;
		case 'yy.mm.dd hh:mm':
			return y + "." + m + "." + d + " " + h + ":" + minute;
			break;
		case 'mm-dd hh:mm':
			return m + "-" + d + " " + h + ":" + minute;
			break;
	}

}

// 脱敏
const nameDesensitization = (name) => {
	if (!name) return '**'
	name = name.slice(0, 1)
	name += '**'
	return name
}

function number_format(number, decimals, dec_point, thousands_sep, roundtag) {
	/*
	 * 参数说明：
	 * number：要格式化的数字
	 * decimals：保留几位小数
	 * dec_point：小数点符号
	 * thousands_sep：千分位符号
	 * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
	 * */
	number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	roundtag = roundtag || "ceil"; //"ceil","floor","round"
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function(n, prec) {

			var k = Math.pow(10, prec);
			console.log();

			return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
		};
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	var re = /(-?\d+)(\d{3})/;
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, "$1" + sep + "$2");
	}

	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

/** * 处理富文本里的图片宽度自适应 * 1.去掉img标签里的style、width、height属性 * 2.img标签添加style属性：max-width:100%;height:auto * 3.修改所有style里的width属性为max-width:100% * 4.去掉<br/>标签 * @param html * @returns {void|string|*} */
function formatRichText(html) {
	let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
		match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
		match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
		match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
		return match;
	});
	newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
		match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
		return match;
	});
	newContent = newContent.replace(/<br[^>]*\/>/gi, '');
	newContent = newContent.replace(/\<img/gi,
		'< img style="max-width:100%;height:auto;margin-top:0;margin-bottom:0;"');
	return newContent;
}
/**
 * 版本号比对
 * @param {Object} a
 * var _a=compareVersion(a),_b=compareVersion(b);   
	if(_a==_b) console.log("版本号相同！版本号为："+a);    
	if(_a>_b) console.log("版本号"+a+"是新版本！"); 
	if(_a<_b) console.log("版本号"+b+"是新版本！"); 
 */
// a > b
function compareVersion(a, b) {
	var _a = toNum(a),
		_b = toNum(b);
	if (_a > _b) {
		console.log("版本号" + a + "是新版本！")
		return true
	}
	if (_a < _b) {
		console.log("版本号" + b + "是新版本！");
		return false
	}
}

function toNum(a) {
	var a = a.toString();
	var c = a.split('.');
	var num_place = ["", "0", "00", "000", "0000"],
		r = num_place.reverse();
	for (var i = 0; i < c.length; i++) {
		var len = c[i].length;
		c[i] = r[len] + c[i];
	}
	var res = c.join('');
	return res;
}

function parseParams(data) {
	try {
		var tempArr = [];
		for (var i in data) {
			var key = encodeURIComponent(i);
			var value = encodeURIComponent(data[i]);
			tempArr.push(key + '=' + value);
		}
		var urlParamsStr = tempArr.join('&');
		return urlParamsStr;
	} catch (err) {
		return '';
	}
}

function getParams(url) {
	try {
		var index = url.indexOf('?');
		url = url.match(/\?([^#]+)/)[1];
		var obj = {},
			arr = url.split('&');
		for (var i = 0; i < arr.length; i++) {
			var subArr = arr[i].split('=');
			var key = decodeURIComponent(subArr[0]);
			var value = decodeURIComponent(subArr[1]);
			obj[key] = value;
		}
		return obj;

	} catch (err) {
		return null;
	}
}
// 倒计时转换
function eventProcessNodeTimeComputed(time) {
	let timeDiff = time;
	let days = Math.floor((timeDiff / (1000 * 60 * 60 * 24)));
	let hours = Math.round(parseInt((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
	let minutes = Math.round(parseInt((timeDiff % (1000 * 60 * 60)) / (1000 * 60)));
	let seconds = Math.round((timeDiff % (1000 * 60)) / 1000);
	console.log('天数', days)
	days > 0 ? hours = days * 24 + hours : hours; //小时格式化
	hours < 10 ? hours = '0' + hours : hours; //小时格式化

	minutes < 10 ? minutes = '0' + minutes : minutes; //分钟格式化
	seconds < 10 ? seconds = '0' + seconds : seconds; //秒钟格式化
	let k = hours + ':' + minutes + ':' + seconds;
	// return k;
	if ("0" > seconds) {
		return "--"
	} else {
		return k;
	}
};

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

const showToast = (text, icon = 'success', duration = 2000) => {
	uni.showToast({
		title: text,
		icon: icon,
		duration: duration
	})
}

// 去除空格
const objTrime = (obj) => {
	if (Object.keys(obj).length === 0) return
	for (let key in obj) {
		if (typeof obj[key] === "object" && obj[key] !== null) {
			objTrime(obj[key])
		} else {
			if (obj[key]) {
				let reg = new RegExp("[\\s]*", 'g');
				if (typeof obj[key] == 'number') {
					obj[key] += ''
				}
				obj[key] = obj[key].replace(reg, "");
			}
		}
	}
	return obj
}

const statusText = (status) => {
	let statusText = ''
	switch (status) {
		case 0:
			statusText = '待付款';
			break;
		case 1:
			statusText = '待接单';
			break;
		case 2:
			statusText = '技师接单';
			break;
		case 3:
			statusText = '技师出发';
			break;
		case 4:
			statusText = '技师到达';
			break;
		case 5:
			statusText = '开始服务';
			break;
		case 6:
			statusText = '待评价';
			break;
		case 7:
			statusText = '已评价';
			break;
		case 8:
			statusText = '退款中';
			break;
		case 9:
			statusText = '退款成功';
			break;
		case 10:
			statusText = '退款失败';
			break;
		case 11:
			statusText = '已取消';
			break;
	}
	return statusText
}

// 订单失败状态
const orderStatusImg = (status) => {
	return status >= 8 ? false : true
}

// 存入缓存
const setSession = (key, val) => {
	// #ifdef MP-WEIXIN
	uni.setStorage(key, val)
	// #endif
	
	// #ifdef H5
	sessionStorage.setItem(key, JSON.stringify(val))
	// #endif
}

// 取出缓存
const getSession = (key) => {
	// #ifdef MP-WEIXIN
	uni.getStorageSync(key)
	// #endif
	
	// #ifdef H5
	let val = sessionStorage.getItem(key) && JSON.parse(sessionStorage.getItem(key))
	return val
	// #endif
}

// 删除缓存
const removeSession = (key) => {
	// #ifdef MP-WEIXIN
	uni.removeStorageSync(key)
	// #endif
	// #ifdef H5
	sessionStorage.removeItem(key)
	// #endif
}

// 取出经纬度

const utils = {
	baseURL, // 请求地址
	imgUrl, // 图片地址
	msg, // 提示
	getLoc, //获取地理位置
	getUserByToken, // 获取用户信息
	timeFormat, // 时间格式转化
	formatRichText,
	number_format,
	compareVersion, // 版本号比对
	parseParams, //JSON转URL参数
	getParams, //
	eventProcessNodeTimeComputed, //倒计时
	verificationLogin, // 校验是否需要登陆
	prePage,
	getLocation, // 获取经纬度
	nameDesensitization, // 脱敏
	showToast, // toast
	objTrime, // 去除空格
	statusText, // 订单状态
	orderStatusImg,
	setSession, // 存入session
	getSession, // 取出session
	removeSession // 删除session
}
export default utils
