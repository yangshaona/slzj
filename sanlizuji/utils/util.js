var app = getApp();

import md5 from '../resource/js/md5.js';

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

module.exports = {
    formatTime: formatTime
}

//生成请求头
const getRequestHeader = () => {
    let date = new Date();
    let version = 251;
    let time = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString();
    let token = md5(md5('c1c9214c1b7565c90903dcb959401c89' + version + time));
    let requestHeader = {
        'version': version,
        'deviceidfa': '7F14FA23-1C97-4E53-9B81-D4C22B770421',
        'token': token,
        'time': time
    };
    return requestHeader;
};

//替换换行符\n
const replaceSpace = (str) => {
    // var result = str.replace(/\s+/g, "<br/>");
    let result = [],
        strArr = str.split(/\r\n/g);
    for (var i = 0; i < strArr.length; i++) {
        if (strArr[i] != "") {
            result.push(strArr[i]);
        }
    }
    return result;
};

const isArray = (obj) => {
    return Object.prototype.toString.call(obj) === "[object Array]";
};

module.exports = {
        formatTime: formatTime,
        requestHeader: getRequestHeader,
        replaceSpace: replaceSpace,
        isArray: isArray,
        md5: md5
    }
    // 验证手机号
function checkPhone(phone) {
    var reg = /^1[34578]\d{9}$/;
    if (reg.test(phone)) {
        return true
    } else {
        return false
    }
}
module.exports = { checkPhone: checkPhone }