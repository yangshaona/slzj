// pages/login/login.js
import {
    SaveInfo
} from '../../utils/text.js'
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //表单各个小标题
        formTitle: { 'name': '姓名', 'idNum': '身份证号', 'phone': '手机号' },
        // 姓名
        name: "",
        // 身份证号
        idNum: "",
        // 手机号
        phone: '',
        flag_identity: app.globalData.flag_identity,
        id_flag: "",
        openid: "",
    },

    //手机号码输入检查
    checkPhone: function(phNum, id) {
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(16[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
        if (phNum.length != 11) {
            wx.showToast({
                title: id + '有误',
                icon: 'error',
                duration: 800
            })
            return false;
        } else if (!reg.test(phNum)) {
            wx.showToast({
                title: id + '有误',
                icon: 'error',
                duration: 800
            })
            return false;
        } else {
            console.log("手机号填写格式正确");
            return true;
        }
    },
    // 身份证号输入验证
    checkID: function(id) {
        var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (id.length < 18) {
            console.log("身份证号输入位数不正确");
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800
            })
            return false;
        } else if (!reg.test(id)) {
            console.log("身份证格式错误");
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800
            })
            return false;
        } else {
            console.log("身份证号验证通过")
            return true;
        }
    },

    // 登录表单提交
    submit: function(e) {
        // 留空检查
        var data = e.detail.value;
        console.log(data);
        let that = this;
        for (var i in data) {
            if (data[i] == null || data[i] == "") {
                console.log(i);
                console.log(data[i]);
                console.log("表单有未填写部分");
                wx.showToast({
                    title: '请填写' + this.data.formTitle[i],
                    icon: 'error',
                    duration: 800
                })
                return;
            }
        }
        // 全部已填写
        // 电话号码格式检查
        if (this.checkPhone(data.phone, "手机号")) {
            // 身份证号格式检查
            if (this.data.id_flag != 'parent') {
                if (this.checkID(data.idNum)) {
                    console.log("身份证和手机号输入都正确")
                } else {
                    console.log("身份证号填写有误");
                    return;
                }

            }
            // 赋值
            this.setData({
                name: data.name,
                idNum: data.idNum,
                phone: data.phone
            })
            console.log(app.globalData.openid)
            console.log("身份", that.data.id_flag)
            wx.request({
                url: app.globalData.url + 'WxUser/GetUserInfo',
                data: {
                    // openid: app.globalData.openid,
                    name: data.name,
                    phone: data.phone,
                    id_flag: that.data.id_flag,
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    console.log("登录表单检查成功");
                    console.log(res);
                    if (res.data.data[0] == "该用户未注册") {
                        wx.showModal({
                            content: "该用户未注册",
                            showCancel: true,
                        })
                    } else {
                        wx.showToast({
                            title: '登录成功',
                            icon: 'success',
                            duration: 800,
                        });
                        //保存用户登录状态
                        wx.setStorageSync('user', res.data.data)
                        wx.setStorageSync('id_flag', that.data.id_flag)
                        let user = wx.getStorageSync('user')
                        let id_flag = wx.getStorageSync('id_flag')
                        wx.login({
                            success: function(res) {
                                // success
                                console.log("获取openid")
                                console.log(res)
                                wx.request({
                                    url: app.globalData.url + "WxUser/getOpenId",
                                    data: {
                                        code: res.code
                                    },
                                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                    // header: {}, // 设置请求的 header
                                    success: function(res) {
                                        // success
                                        console.log(res)
                                        that.setData({
                                            openid: res.data.openid
                                        })
                                        app.globalData.openid = res.data.openid
                                        console.log("app openid")
                                        console.log(app.globalData.openid);
                                        console.log(that.data.openid);
                                        console.log("用户数据")
                                        console.log(data)
                                        console.log(id_flag);
                                        var modelName = '';
                                        var modelData = {};
                                        if (id_flag == 'student') {
                                            modelName = "Userinfo";
                                            modelData = {
                                                name: user.name,
                                                nikename: user.nickname,
                                                header: user.header,
                                                openid: res.data.openid,
                                                idnum: user.idnum,
                                                birthday: user.birthday,
                                                sex: user.sex,
                                                sexid: user.sexid,
                                                education: user.education,
                                                phone: user.phone,
                                                schoolname: user.schoolname,
                                                grade: user.grade,
                                                class: user.class,
                                                province: user.province,
                                                city: user.city,
                                                district: user.district,
                                                parents: that.data.parent_name,
                                                p_phone: that.data.parent_phone,
                                                aller: user.aller,
                                                regsterdate: user.regsterdate,
                                            }
                                        } else if (id_flag == 'teacher') {
                                            modelName = "Teacher";
                                            modelData = {
                                                name: user.name,
                                                header: user.header,
                                                openid: res.data.openid,
                                                idnum: user.idnum,
                                                birthday: user.birthday,
                                                sex: user.sex,
                                                sexid: user.sexid,
                                                phone: user.phone,
                                                province: user.province,
                                                city: user.city,
                                                district: user.district,
                                                type: user.type,
                                                resume: user.exp,
                                            }
                                        } else if (id_flag == 'parent') {
                                            modelName = 'UserParent';
                                            modelData = {
                                                name: user.name,
                                                nikename: user.nickname,
                                                openid: res.data.openid,
                                                sex: user.sex,
                                                sexid: user.sexid,
                                                phone: user.phone,
                                                province: user.province,
                                                city: user.city,
                                                district: user.district,
                                                kids: user.kids,
                                                k_phone: user.k_phone,
                                            }

                                        }
                                        console.log("获取到的openid")
                                        console.log(that.data.openid);

                                        SaveInfo(modelData, modelName);
                                        var _user = user;
                                        _user.openid = that.data.openid;
                                        wx.setStorageSync('user', _user);
                                        user = wx.getStorageSync('user');
                                        console.log("用户：", user);
                                    },
                                    fail: function() {
                                        // fail
                                    },
                                    complete: function() {
                                        // complete
                                    }
                                })
                            },
                            fail: function() {
                                // fail
                            },
                            complete: function() {
                                // complete
                            }
                        })




                        console.log("用户信息", user)
                        setTimeout(function() {
                            wx.switchTab({
                                url: '../index/index'
                            })
                        }, 800);

                    }
                },
                fail: function() {
                    // fail
                    wx.showModal({
                        content: "登录失败",
                        showCancel: false
                    })
                },
                complete: function() {
                    // complete
                }
            })

            //授权成功后，跳转进入小程序首页
            // app.show_page('/pages/index/index');

        } else {
            console.log("手机号填写错误");
            return;
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("登录")
        console.log(options)
        this.setData({
            id_flag: options.id
        })
        this.setData({
            flag_identity: app.globalData.flag_identity
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // this.setData({
        //     id_flag: id_flag
        // })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})