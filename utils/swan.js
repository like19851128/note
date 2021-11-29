// 自己封装的 uni.request 工具类
import fly from './../api/api.js' // 一般接口请求
import swan from 'weixin-js-sdk' // 一般接口请求

export default {
    //判断是否在微信中  
    isWechat: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/micromessenger/i) == 'micromessenger') {
            // console.log('是微信客户端')
            return true;
        } else {
            // console.log('不是微信客户端')
            return false;
        }
    },
    //初始化sdk配置  
    initJssdkShare: function(callback, url) {
        console.log("init Url : "+url)
        // 这是我这边封装的 request 请求工具，实际就是 uni.request 方法。
        request.post(
            'http://127.0.0.1:8080/mptask/api/getSignPackage',
            {
                url: url
            },
            "form",
            function(res){
                let success = res["success"];
                let result = res["result"];
                if(success){
                    swan.config({
                        debug: false,
                        appId: result.appId,
                        timestamp: result.timestamp,
                        nonceStr: result.nonceStr,
                        signature: result.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
														'checkWxPay'
                        ]
                    });
                    //配置完成后，再执行分享等功能  
                    if (callback) {
                        callback(result);
                    }
                }
            }
        );
    },
    //在需要自定义分享的页面中调用  
    share: function(data, url) {
        url = url ? url : window.location.href;
        console.log("url:"+url)
        if (!this.isWechat()) {
            return;
        }
        //每次都需要重新初始化配置，才可以进行分享  
        this.initJssdkShare(function(signData) {
            swan.ready(function() {
                var shareData = {
                    title: data && data.title ? data.title : signData.site_name,
                    desc: data && data.desc ? data.desc : signData.site_description,
                    link: url,
                    imgUrl: data && data.img ? data.img : signData.site_logo,
                    success: function(res) {
                        // 分享后的一些操作,比如分享统计等等
                    },
                    cancel: function(res) {}
                };
                //分享给朋友接口  
                swan.onMenuShareAppMessage(shareData);
                //分享到朋友圈接口  
                swan.onMenuShareTimeline(shareData);
            });
        }, url);
    },
		checkWxPay: function(data) {
			this.initJssdkShare(() => {
				console.log(data)
			})
		}
}