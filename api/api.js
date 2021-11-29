import fly from './request.js' // 一般接口请求
import newfly from './tokenRequest.js' // 注册登陆接口请求
/*ignoreToken: 为true：不校验token*/
// 首页数据
const indexInfo = params => {
	let ignoreToken = {ignoreToken: true}
	return fly.post('/api/index', params, ignoreToken)
}

// 项目列表
const projectInfoList = params => {
	let ignoreToken = {ignoreToken: true}
	return fly.post('/api/projectInfo/list', params, ignoreToken)
}

// 项目详情
const projectInfoDetail = params => {
	let ignoreToken = {ignoreToken: true}
	return fly.post('/api/projectInfo/detail', params, ignoreToken)
}

// 项目跳转到技师列表
const artificerPageList = params => {
	let ignoreToken = {ignoreToken: true}
	return fly.post('/api/artificerInfo/artificerPageList', params, ignoreToken)
}

// 技师列表跳转技师详情
const artificerInfoDetail = params => {
	let ignoreToken = {ignoreToken: true}
	return fly.post('/api/artificerInfo/artificerInfoDetail', params, ignoreToken)
}

// 技师可服务的项目列表
const getArtificerProjectList = params => {
	let ignoreToken = {ignoreToken: true}
	return fly.post('/api/projectInfo/getArtificerProjectList', params, ignoreToken)
}

// 基础配置
const getConfigValue = params => {
	let ignoreToken = {ignoreToken: true}
	return fly.post('/api/baseConfig/getConfigValue', params, ignoreToken)
}

// 获取临时token（该api使用newFly）
const getTempToken = params => {
	let ignoreToken = {ignoreToken: true}
	return newfly.post('/api/customer-user/getTempToken', params, ignoreToken)
}

// 用户登录/注册（该api使用newFly）
const login = params => {
	let ignoreToken = {ignoreToken: true}
	return newfly.post('/api/customer-user/login', params, ignoreToken)
}

// 技师详情-技师的认证资料
const artificerAuthInfoDetail = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerInfo/artificerAuthInfoDetail', params, ignoreToken)
}

// 技师入驻
const artificerSettleIn = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerInfo/settleIn', params, ignoreToken)
}

// 用户个人中心
const userCenter = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-user/center', params, ignoreToken)
}

// 获取标签列表
const getLabels = params => {
	let ignoreToken = {}
	return fly.post('/api/baseConfig/getLabels', params, ignoreToken)
}

// 创建或修改地址
const customerAddressSave = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-address/save', params, ignoreToken)
}
// 删除地址
const customerAddressDel = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-address/delete', params, ignoreToken)
}

// 可预约时间段
const timeInterval = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerInfo/reservation-available/time-interval', params, ignoreToken)
}

// 用户优惠券列表
const getCouponList = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-coupon/get/list', params, ignoreToken)
}

// 用户项目可使用优惠券列表
const getCouponAvailableList = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-coupon/get/available-list', params, ignoreToken)
}

// 用户地址 -不分页动态查询
const customerAddress = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-address/get/userId', params, ignoreToken)
}

// 用户订单分页列表
const userOrderPageList = params => {
	let ignoreToken = {ignoreToken: true}
	return fly.post('/api/orderInfo/userOrderPageList', params, ignoreToken)
}

// 订单详情
const orderDetail = params => {
	let ignoreToken = {}
	return fly.post('/api/orderInfo/orderDetail', params, ignoreToken)
}

// 出行价格
const travelFare = params => {
	let ignoreToken = {}
	return fly.post('/api/travel/fare', params, ignoreToken)
}

// 创建或修改评价
// const commentSave = params => {
// 	let ignoreToken = {}
// 	return fly.post('/api/customer-comment/save', params, ignoreToken)
// }

// 查询评价
const getComment = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-comment/get', params, ignoreToken)
}

// 技师端个人中心
const personCenter = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerInfo/personCenter', params, ignoreToken)
}

// 技师离线时间不分页
const artificerRest = params => {
	let ignoreToken = {}
	return fly.post('/api/artificer-rest-config/get/artificerId', params, ignoreToken)
}

// 技师离线时间创建或修改
const artificerRestSave = params => {
	let ignoreToken = {}
	return fly.post('/api/artificer-rest-config/save', params, ignoreToken)
}

// 下单
const orderInfoDone = params => {
	let ignoreToken = {}
	return fly.post('/api/orderInfo/done', params, ignoreToken)
}

// 技师端订单列表
const artificerOrderPageList = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerInfo/orderPageList', params, ignoreToken)
}

// 技师的评价提交
const artificerEvaluateSave = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerEvaluate/save', params, ignoreToken)
}

// 技师端资料管理
const updateArtificerInfo = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerInfo/updateInfo', params, ignoreToken)
}

// 技师端技师操作订单状态
const orderUpdate = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerInfo/orderUpdate', params, ignoreToken)
}

// 退款
const orderInfoRefund = params => {
	let ignoreToken = {}
	return fly.post('/api/orderInfo/refund', params, ignoreToken)
}

// 技师的评价列表
const evaluatePageList = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerEvaluate/evaluatePageList', params, ignoreToken)
}

// 技师收藏列表
const artificerCollection = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-artificer-collection/get/userId', params, ignoreToken)
}

// 技师收藏创建或修改
const artificerCollectionSave = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-artificer-collection/save', params, ignoreToken)
}

// 技师收藏删除数据
const artificerCollectionDeleteByArtificerId = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-artificer-collection/deleteByArtificerId', params, ignoreToken)
}

// 技师账户信息
const cashAccountInfo = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerStream/cashAccountInfo', params, ignoreToken)
}

// 技师提现
const artificerSaveStream = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerStream/saveStream', params, ignoreToken)
}
// 流水记录分页查询
const artificerPageStream = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerStream/pageStream', params, ignoreToken)
}

// 客户流水
const customerAccountRecordList = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-account-record/get/list', params, ignoreToken)
}

// 用户余额
const userAccount = params => {
	let ignoreToken = {}
	return fly.post('/api/customer-user/userAccount', params, ignoreToken)
}

// 获取微信支付参数
const orderInfoPay = params => {
	let ignoreToken = {}
	return fly.post('/api/orderInfo/pay', params, ignoreToken)
}

// 获取用户可充值列表
const getRechargeTemplateList = params => {
	let ignoreToken = {}
	return fly.post('/api/baseConfig/getRechargeTemplateList', params, ignoreToken)
}

// 用户充值
const orderInfoRecharge = params => {
	let ignoreToken = {}
	return fly.post('/api/orderInfo/recharge', params, ignoreToken)
}

// 获取推荐二维码
const saveWxacodeunlimit = params => {
	let ignoreToken = {}
	return fly.post('/api/wxController/saveWxacodeunlimit', params, ignoreToken)
}

// 技师上线下线
const onlineOrDown = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerInfo/onlineOrDown', params, ignoreToken)
}

// 技师时间删除
const artificerRestDelete = params => {
	let ignoreToken = {}
	return fly.post('/api/artificer-rest-config/delete', params, ignoreToken)
}

// 技师详情页面埋点
const artificerInfoPoint = params => {
	let ignoreToken = {ignoreToken: true}
	return fly.post('/api/artificerInfo/point', params, ignoreToken)
}

// 删除订单
const orderInfoDelete = params => {
	let ignoreToken = {}
	return fly.post('/api/orderInfo/delete', params, ignoreToken)
}

// 获取验证码
const sendSms = params => {
	let ignoreToken = {}
	return fly.post('/api/sms/sendSms', params, ignoreToken)
}

// 技师提现列表-删除
const removeWithdrawalRecords = params => {
	let ignoreToken = {}
	return fly.post('/api/artificerStream/remove', params, ignoreToken)
}

const api = {
	indexInfo, // 首页数据
	projectInfoList, // 项目列表
	projectInfoDetail, // 项目详情
	artificerPageList, // 项目跳转到技师列表
	artificerInfoDetail, // 技师列表跳转技师详情
	getArtificerProjectList, // 技师可服务的项目列表
	getConfigValue, // 基础配置
	getTempToken, // 获取临时token
	login, // 用户登录/注册
	artificerAuthInfoDetail, // 技师详情-技师的认证资料
	userCenter, // 用户个人中心
	artificerSettleIn, // 技师入驻
	getLabels, // 获取标签列表
	customerAddressSave, // 创建或修改地址
	timeInterval, // 技师可预约时间段
	getCouponList, // 用户优惠券列表
	getCouponAvailableList, // 用户项目可使用优惠券列表
	customerAddress, // 用户地址 -不分页动态查询
	userOrderPageList, // 用户订单分页列表
	orderDetail, // 订单详情
	// commentSave, // 提交评价
	getComment, // 查询评价
	personCenter, // 技师端个人中心
	customerAddressDel, // 删除地址
	travelFare, // 出行价格
	artificerRest, // 技师离线时间不分页
	artificerRestSave, // 技师离线时间创建或修改
	orderInfoDone, // 下单
	artificerOrderPageList, // 技师端订单列表
	artificerEvaluateSave, // 技师的评价提交
	updateArtificerInfo, // 更新技师信息
	orderInfoRefund, // 用户退款
	evaluatePageList, // 技师的评价列表
	orderUpdate, // 技师端技师操作订单状态
	artificerCollection, // 技师收藏列表
	artificerCollectionSave, // 技师收藏创建或修改
	artificerCollectionDeleteByArtificerId, // 技师收藏删除数据
	cashAccountInfo, // 技师账户信息
	artificerSaveStream, // 技师提现
	artificerPageStream, // 技师流水
	customerAccountRecordList, // 客户流水
	userAccount, // 用户余额
	orderInfoPay, // 获取微信支付参数
	getRechargeTemplateList, // 获取用户充值列表
	orderInfoRecharge, // 用户充值
	saveWxacodeunlimit, // 获取推荐二维码
	onlineOrDown, // 技师上线下线
	artificerRestDelete, // 技师时间删除
	artificerInfoPoint,
	orderInfoDelete,
	sendSms, // 获取验证码
	removeWithdrawalRecords // 技师提现列表-删除
}
export default api