let app = getApp();
import CONFIG from '../../config.js';
import * as utils from '../../utils/util.js';
let okayapi = require('../../utils/okayapi.js');
import { getOpenId, GetUserInfo2 } from '../../utils/apis.js';
Page({
    data: {
        openid: '',
        hasUserInfo: false,
        canIUseGetUserProfile: false,
    },
    onLoad: function(options) {
        var that = this;
        var wid = 'wx791fd821e91ee574';
        var wsec = '04dd18d0aff379a76a33b6e691533564';
        var url1 = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + wid;
        url1 = url1 + '&secret=' + wsec;
        // 查看是否授权
        wx.login({
            success: function(res) {
                // success
                console.log("返回code", res);
                const p = getOpenId({
                    code: res.code,
                }).then(value => {
                    that.setData({
                        openid: value.data.openid
                    })
                    app.globalData.openid = value.data.openid;
                    GetUserInfo2({
                        openid: value.data.openid,
                        id_flag: options.id,
                    }).then(value => {
                        console.log("登录表单检查成功", value);
                        if (value.data.data[0] == "该用户未注册") {
                            setTimeout(function() {
                                wx.redirectTo({
                                    url: '../login1/login?id=' + options.id,
                                })
                            }, 100)
                        } else {
                            //保存用户登录状态
                            wx.setStorageSync('user', value.data.data)
                            wx.setStorageSync('id_flag', options.id)
                            let user = wx.getStorageSync('user')
                            let id_flag = wx.getStorageSync('id_flag')
                            console.log("用户信息", user)
                            console.log(id_flag);
                            that.getUserProfile();
                        }
                    })
                }).catch(function(err) {
                    wx.showToast({
                        title: "登录失败",
                        icon: 'error',
                        duration: 800,
                    });
                    console.log("登录失败", err)
                });
            },
        })
    },

    getUserProfile: function(e) {
        console.log("登录");
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
                if (res.userInfo) {
                    //用户按了允许授权按钮
                    wx.setStorageSync('avator', res.userInfo.avatarUrl)
                    var avator = wx.getStorageSync('avator');
                    console.log(avator);
                    setTimeout(function() {
                        wx.switchTab({
                            url: '../index/index'
                        })
                    }, 500);
                } else {
                    //用户按了拒绝按钮
                    wx.showModal({
                        title: '警告',
                        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                        showCancel: false,
                        confirmText: '返回授权',
                        success: function(res) {
                            if (res.confirm) {}
                        }
                    })
                }
            }
        })
    },
})