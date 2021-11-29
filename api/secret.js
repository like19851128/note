const CryptoJS = require('crypto-js'); //引用AES源码js
import JSEncrypt from '@/utils/jsencrypt.js'

//随机生成指定数量的16进制key
const getRandom = (num) => {
	let library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let key = "";
	for (var i = 0; i < num; i++) {
		let randomPoz = Math.floor(Math.random() * library.length);
		key += library.substring(randomPoz, randomPoz + 1);
	}
	return key;
	// console.log(CryptoJS.lib)
	// return CryptoJS.lib.WordArray.random(num).toString();
}

// 随机生成128字节（16位）的秘钥
const aesKey = getRandom(16);
// const aesKey = 'mytfYaaDBaFasZEJ';

const key = CryptoJS.enc.Utf8.parse(aesKey); //将秘钥转换成Utf8字节数组
const iv = CryptoJS.enc.Utf8.parse(aesKey.substr(0, 16)) // 偏移量

// 公钥
const pubKey =
	'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCd0x5KWJKH+99QIvadRgvaYxD1HXxwvy/v7H0AYLu/CCaKGGZERtNJiar8d2LcYeeD5FQ+/9bwX5pNnxefwMQgLHytxpGsKO/pIjrSytZX1bvNA6WIWbGH/an//md/cBXOQvq1hrNsKfwdZWIOgIj1N5MYcc7cLPLJToq2XqpP9QIDAQAB'
const publicKey = `-----BEGIN PUBLIC KEY-----${pubKey}-----END PUBLIC KEY-----`

/**
 * RSA公钥加密
 * @param {*} publicKey 
 * @param {*} key 
 */
const codeEncryptedStr = () => {
	// console.log('-------RSA公钥加密-------')
	// console.log('aesKey:', aesKey)
	var jse = new JSEncrypt()
	jse.setPublicKey(publicKey);
	return jse.encrypt(aesKey)
}

/**
 * AES加密
 * @param {Object} word
 */
const Encrypt = (word) => {
	// console.log('-------AES/CBC/PKCS5Padding加密-------')
	// console.log('aesKey:', aesKey)
	// base64序列化
	let srcs = CryptoJS.enc.Utf8.parse(word);
	let encrypted = CryptoJS.AES.encrypt(srcs, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});
	return encrypted.toString();
}

/**
 * AES解密
 */
const Decrypt = (pas, url) => {

	var decrypted = CryptoJS.AES.decrypt(pas, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	})


	if (decrypted.toString() == '') {
		return '';
	} else {
		console.log('解密接口地址：', url)
		console.log('解密数据：', JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)))
		return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

	}
}

/**
 * 签名
 */
const sign = (paramEncryptedStr, timestamp, type) => {
	let signStr = `${paramEncryptedStr}${timestamp}dj-!QAZ2wsx`
	// if (type == 1) { // 埋点接口
	// 	signStr = `${paramEncryptedStr}${timestamp}hyzh-unistar-12340101`
	// }
	let returnStr = CryptoJS.MD5(signStr).toString().toUpperCase()
	// console.log('时间戳：',timestamp)
	// console.log('签名字符串：',signStr)
	// console.log('生成的签名串：',returnStr)
	return returnStr
}

export default {
	Decrypt, // AES解密
	Encrypt, // AES加密
	codeEncryptedStr, // RSA公钥加密
	sign // 签名
}
