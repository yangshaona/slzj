let app = getApp();
import CONFIG from '../../config.js';
import * as utils from '../../utils/util.js';
let okayapi = require('../../utils/okayapi.js');

Page({
    data: {
        openid: '',
        hasUserInfo: false,
        canIUseGetUserProfile: false,
    },
    onLoad: function(options) {
        console.log('denglu');
        console.log("Id是：", options)
        var that = this;
        var wid = 'wx791fd821e91ee574'; //wx4bd62f19c4a1769f
        var wsec = '04dd18d0aff379a76a33b6e691533564'; //624a0c326e55595c1fad52293fe1e760
        var url1 = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + wid;
        url1 = url1 + '&secret=' + wsec;
        // 查看是否授权

        wx.login({
            success: function(res) {
                // success
                console.log("返回code")
                console.log(res)
                    // let that = this;
                wx.request({
                    url: app.globalData.url + "WxUser/getOpenId",
                    data: {
                        code: res.code
                    },
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    success: function(res) {
                        // success
                        console.log("获取到的openid")
                        console.log(res)
                        that.setData({
                            openid: res.data.openid
                        })
                        app.globalData.openid = res.data.openid
                        console.log("app openid")
                        console.log(app.globalData.openid)
                        console.log("学生数据")
                        wx.request({
                            url: app.globalData.url + 'WxUser/GetUserInfo2',
                            data: {
                                openid: res.data.openid,
                                id_flag: options.id,
                            },
                            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                            // header: {}, // 设置请求的 header
                            success: function(res) {
                                // success
                                console.log("登录表单检查成功");
                                console.log(res);
                                if (res.data.data[0] == "该用户未注册") {

                                    setTimeout(function() {
                                        wx.redirectTo({
                                            url: '../login1/login?id=' + options.id,

                                        })

                                    }, 100)
                                } else {

                                    //保存用户登录状态
                                    wx.setStorageSync('user', res.data.data)
                                    wx.setStorageSync('id_flag', options.id)
                                    let user = wx.getStorageSync('user')
                                    let id_flag = wx.getStorageSync('id_flag')
                                    console.log("用户信息1111", user)
                                    console.log(id_flag);
                                    that.getUserProfile();
                                    // setTimeout(function() {
                                    //     wx.switchTab({
                                    //         url: '../index/index'
                                    //     })
                                    // }, 800);

                                }
                            },
                        })
                    },
                })
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
                    // var _user = wx.getStorageSync('user');
                    // _user.header = avator;
                    // wx.setStorageSync('user', _user);
                    // var isLoaded=wx.getStorageSync('isLoaded');
                    // if(isLoaded==false){
                    //     wx.navigateBack({
                    //         delta: 2, // 回退前 delta(默认为1) 页面

                    //     })
                    // }else{
                    setTimeout(function() {
                        wx.switchTab({
                            url: '../index/index'
                        })
                    }, 500);
                    // }
                    //授权成功后，跳转进入小程序首页
                    // app.show_page('../index/index');

                } else {
                    //用户按了拒绝按钮
                    wx.showModal({
                        title: '警告',
                        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                        showCancel: false,
                        confirmText: '返回授权',
                        success: function(res) {
                            if (res.confirm) {
                                //  app.show_msg('登录成功！！');

                                // console.log('用户点击了“返回授权”')
                            }
                        }
                    })
                }
            }
        })

    },


})