/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
const app = getApp();
let user = wx.getStorageSync('user');

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
    newContent = newContent.replace(/(\s*<[^>]+>)([^<>]*)(<\/[^>]+>\s*)/g, function(str, $1, $2, $3) {
        return [$1.trim(), $2.replace(/\s/gi, '\xa0'), $3.trim()].join('')
    })
    newContent = newContent.replace(/<br[^>]*\/>/gi, '');
    newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
    return newContent;
}

// export function formatRichText(html) {
//     let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
//       match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
//       match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
//       match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
//       return match;
//     });
//     newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
//       match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
//       return match;
//     });
//     newContent = newContent.replace(/(\s*<[^>]+>)([^<>]*)(<\/[^>]+>\s*)/g, function (str, $1, $2, $3) {
//       return [$1.trim(), $2.replace(/\s/gi, '\xa0'), $3.trim()].join('')
//     })
//     newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
//     return newContent;
//   }


// 保存更改信息
function SaveInfo(modelData, modelName) {
    console.log("保存信息");
    user = wx.getStorageSync('user');
    console.log(user);
    wx.request({
        url: app.globalData.url + 'WxUser/UpdateUserInfo',
        // data: data,

        data: {
            id: user.id,
            modelName: modelName,
            [`${modelName}`]: modelData,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res) {
            // success
            console.log("更改个人信息")
            console.log(res)

        },
        fail: function() {
            // fail
        },
        complete: function() {
            // complete
        }

    })
}

// 检查姓名是否输入有误
function checkName(name) {
    var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/;
    if (name.match(reg)) {
        console.log("111");
        // that.setData({ allow_name: true });
        wx.setStorageSync("name", name);
        return true;
    } else {
        wx.showToast({
            title: "姓名有误",
            icon: 'error',
            duration: 800
        })
        return false;
    }
}
/**
 * 去掉字符串头尾空格
 */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 身份证号验证
 */
function checkIdCard(idCard) {
    var sex = '',
        birth = '',
        idCardFlag = false;
    var data = {
        'idCardFlag': false,
        'birth': '',
        'sex': '',
    }
    idCard = trim(idCard.replace(/ /g, "")); //去掉字符串头尾空格
    if (idCard.length == 15) {
        return isValidityBrithBy15IdCard(idCard); //进行15位身份证的验证
    } else if (idCard.length == 18) {
        var a_idCard = idCard.split(""); // 得到身份证数组
        if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) { //进行18位身份证的基本验证和第18位的验证
            idCardFlag = true;
            // if (num == 1) {   //获取出生日期
              
            birth = idCard.substring(6, 10) + "-" + idCard.substring(10, 12) + "-" + idCard.substring(12, 14);
            //    return birth;
            //   }
            // if (num == 2) {   //获取性别
              
            if (parseInt(idCard.substr(16, 1)) % 2 == 1) {    //男
                sex = '男';
                //     return "男";
                  
            } else {    //女
                sex = '女';
                //     return "女";
                  
                // } 
            }
            data = {
                'idCardFlag': idCardFlag,
                'birth': birth,
                'sex': sex,
            }
            return data;
        } else {
            return data;
        }
    } else {
        return data;
    }
}

/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param a_idCard 身份证号码数组
 * @return
 */
function isTrueValidateCodeBy18IdCard(a_idCard) {
    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
    var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    var sum = 0; // 声明加权求和变量
    if (a_idCard[17].toLowerCase() == 'x') {
        a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
    }
    for (var i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i]; // 加权求和
    }
    var valCodePosition = sum % 11; // 得到验证码所位置
    if (a_idCard[17] == ValideCode[valCodePosition]) {
        return true;
    } else {
        return false;
    }
}

/**
 * 验证18位数身份证号码中的生日是否是有效生日
 * @param idCard 18位书身份证字符串
 * @return
 */
function isValidityBrithBy18IdCard(idCard18) {
    var year = idCard18.substring(6, 10);
    var month = idCard18.substring(10, 12);
    var day = idCard18.substring(12, 14);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题
    if (temp_date.getFullYear() != parseFloat(year) ||
        temp_date.getMonth() != parseFloat(month) - 1 ||
        temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 验证15位数身份证号码中的生日是否是有效生日
 * @param idCard15 15位书身份证字符串
 * @return
 */
function isValidityBrithBy15IdCard(idCard15) {
    var year = idCard15.substring(6, 8);
    var month = idCard15.substring(8, 10);
    var day = idCard15.substring(10, 12);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
    if (temp_date.getYear() != parseFloat(year) ||
        temp_date.getMonth() != parseFloat(month) - 1 ||
        temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}
// 更新订单信息
function UpdateOrder(id, payState, status) {
    let that = this;
    wx.request({
        url: app.globalData.url + 'WxSign/UpdateOneOrder',
        data: {
            id: id,
            payState: payState,
            status: status,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res) {
            // success
            console.log("修改结果");
            console.log(res);
        },

    })
}
// 手机号码的验证
function checkPhone(phNum) {
    var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(16[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    if (phNum.length != 11 || !reg.test(phNum)) {
        wx.showModal({
            content: '手机号输入有误', //提示的内容,
            showCancel: false, //是否显示取消按钮,
        });
        return false;
    } else {
        console.log("手机号填写格式正确");
        return true;
    }
}

//  地里信息位置获取工具类

/**
 * 获取用户当前所在的位置 【适应微信新版本获取地里位置信息，旧getLocation方法频繁调用有性能问题，并且30秒只能获得一次成功】 
 */
const getLocation = () => {
    return new Promise((resolve, reject) => {
        let _locationChangeFn = (res) => {
            resolve(res) // 回传地里位置信息
            wx.offLocationChange(_locationChangeFn) // 关闭实时定位
            wx.stopLocationUpdate(_locationChangeFn); // 关闭监听 不关闭监听的话，有时获取位置时会非常慢
        }
        wx.startLocationUpdate({
            success: (res) => {
                wx.onLocationChange(_locationChangeFn)
            },
            fail: (err) => {
                // 重新获取位置权限
                wx.openSetting({
                    success(res) {
                        res.authSetting = {
                            "scope.userLocation": true
                        }
                    }
                })
                reject(err)
            }
        })
    })
}

// 这个属性是将方法名暴露出来，否则需要引用的页面取不到
module.exports = {
    formatRichText,
    SaveInfo,
    checkIdCard,
    UpdateOrder,
    checkPhone,
    checkName,
    getLocation

}