// pages/person_info/parent_info.js
import {
    SaveInfo
} from '../../utils/text.js'
let user = wx.getStorageSync('user')
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: user,
        //弹窗是否显示
        showModal: false,
        //孩子姓名、电话和身份证
        k_name: '',
        k_phone: '',
        k_idnum: "",
        tmp: "",
    },
    /**
     * 控制显示
     */
    Bind: function(e) {
        this.setData({
            showModal: true,
            trigger: e.currentTarget.dataset.trigger,

        })
    },

    /**
     * 点击返回按钮隐藏
     */
    back: function() {
        this.setData({
            showModal: false
        })
    },

    /**
     * 获取孩子姓名输入值
     */
    nameInput: function(e) {
        this.setData({
            k_name: e.detail.value
        })
    },
    /**
     * 获取孩子电话号码输入值
     */
    phoneInput: function(e) {
        this.setData({
            k_phone: e.detail.value
        })
    },
    /**
     * 获取孩子身份号码输入值
     */
    idInput: function(e) {
        this.setData({
            k_idnum: e.detail.value
        })
    },
    // 修改姓名
    parentName: function(e) {
        this.setData({
            tmp: e.detail.value
        })
        console.log("修改姓名");
        console.log(this.data.tmp);
    },
    /**
     * 点击确定按钮获取input值并且关闭弹窗
     */

    ok: function() {
        let that = this;
        console.log(that.data.k_name);
        console.log(that.data.k_phone);
        console.log(that.data.k_idnum);
        var trigger = that.data.trigger;
        console.log("trigger", trigger);
        // 绑定事件
        if (trigger == 'bind') {
            wx.request({
                url: app.globalData.url + 'WxUser/SearchKids',
                data: {
                    name: that.data.k_name,
                    phone: that.data.k_phone,
                    idnum: that.data.k_idnum,
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    console.log("孩子信息");
                    console.log(res)
                    if (res.data.data.msg == "请输入姓名、身份证和电话") {
                        wx.showModal({
                            content: res.data.data.msg,
                            showCancel: false,
                        })

                    } else {
                        if (res.data.data.length == 0) {
                            wx.showModal({
                                content: "该用户未注册",
                                showCancel: false,
                            })
                        } else {
                            that.kidBindParent(res.data.data[0].id);

                        }
                    }
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })
        } else if (trigger == 'name') {
            that.checkInfo(trigger);
        }
        that.setData({
            user: user,
        })
    },
    //退出登录
    logout: function() {
        wx.setStorageSync('user', null);
        wx.setStorageSync('id_flag', null);
        wx.setStorageSync('avator', null);
        app.globalData.flag_identity = [1, 0, 0];
        this.setData({
            user: '',
        })
        wx.switchTab({
            url: '../person/person',
        })

    },

    //父母绑定孩子
    kidBindParent: function(kid) {
        let that = this;
        console.log("孩子id", kid)
        wx.request({
            url: app.globalData.url + "WxUser/KidBindParent",
            data: {
                pid: user.id,
                id: kid,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("绑定数据")
                console.log(res)
                console.log(res.data.code)
                that.setData({
                    showModal: false
                })
                if (res.data.code == 200) {
                    that.SaveInfo();

                    wx.showToast({
                        title: "绑定成功",
                        icon: "success",
                        duration: 1000,
                    })
                } else {
                    wx.showToast({
                        title: "绑定失败",
                        icon: "success",
                        duration: 1000,
                    })
                }

            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    //获取绑定的孩子
    GetKidsName: function() {

        let that = this;
        wx.request({
            url: app.globalData.url + 'WxUser/GetKidsName',
            data: {
                id: user.id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("成功获取孩子信息")
                console.log(res);
                var _user = wx.getStorageSync('user');
                // success
                if (res.data.data.msg == "获取成功") {
                    _user.kids = res.data.data.data.join(',');
                    wx.setStorageSync('user', _user)

                } else {
                    user.kids = "未绑定孩子信息"
                }
                that.setData({
                    user: user
                });
                console.log("家长信息", user)
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
        this.setData({
            user: user,
        })
    },
    //修改信息
    checkInfo: function(trigger) {
        var _user = user;
        var that = this;
        var id = 'id';
        if (that.data.tmp == '') {
            wx.showModal({
                content: "请输入内容",
                showCancel: false,
            })
        } else {
            _user[trigger] = that.data.tmp;

            wx.setStorageSync('user', _user);
            var modelName = "UserParent";
            var modelData = {
                name: user.name,
                nikename: user.nickname,
                openid: user.openid,
                sex: user.sex,
                sexid: user.sexid,
                phone: user.phone,
                province: user.province,
                city: user.city,
                district: user.district,
                kids: that.data.k_name,
                k_phone: that.data.k_phone,
            }
            SaveInfo(modelData, modelName);
            console.log("2222222");
            console.log(user);
            that.setData({
                showModal: false,
                tmp: '',
            })

        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        user = wx.getStorageSync('user')
            // that.GetKidsList();
        that.GetKidsName();
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
        this.setData({
            user: user
        })
        let that = this;
        // that.GetKidsList();
        that.GetKidsName();
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