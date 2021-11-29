"use strict";function getDayArr(e,t){for(var r=e%4==0&&e%100!=0&&e%400!=0,a=[31,r?29:28,31,30,31,30,31,31,30,31,30,31],n=[],o=0;o<a[t-1];o++)n.push(fmt(o+1)+"日");return n}function getArr(e){var t=[],r=1,a=13,n="月";e>2&&(r=0,3==e&&(a=24,n="时"),e>3&&(a=60,4==e&&(n="分"),5==e&&(n="秒")));for(var o=r;o<a;o++)t.push(fmt(o)+n);return t}function fmt(e){return e>9?e:"0"+e}function checkShowValue(e,t){if("date"!=e&&"dateTime"!=e&&"time"!=e)throw Error("mode无"+e+"该选项配置");if("date"==e&&10!=t.length||"time"==e&&8!=t.length||"dateTime"==e&&19!=t.length)throw Error("'showValue'有误，请根据当前mode 正确设置格式")}function getDateTimeValue(e,t){var r=fmt(parseInt(e[0])),a=fmt(parseInt(e[1])),n=fmt(parseInt(e[2])),o=fmt(parseInt(e[3])),m=fmt(parseInt(e[4])),u=fmt(parseInt(e[5]));return"date"==t?r+"-"+a+"-"+n:"dateTime"==t?r+"-"+a+"-"+n+" "+o+":"+m+":"+u:r+":"+a+":"+n}function getLocalTime(e){var t=new Date;switch(e){case"dateTime":return t.getFullYear()+"-"+fmt(t.getMonth()+1)+"-"+fmt(t.getDate())+" "+fmt(t.getHours())+":"+fmt(t.getMinutes())+":"+fmt(t.getSeconds());case"time":return fmt(t.getHours())+":"+fmt(t.getMinutes())+":"+fmt(t.getSeconds());default:return t.getFullYear()+"-"+fmt(t.getMonth()+1)+"-"+fmt(t.getDate())}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.getDayArr=getDayArr,exports.getArr=getArr,exports.checkShowValue=checkShowValue,exports.getDateTimeValue=getDateTimeValue,exports.getLocalTime=getLocalTime;