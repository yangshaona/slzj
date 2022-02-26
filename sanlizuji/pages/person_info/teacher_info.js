// pages/person_info/teacher_info.js
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
        tmp: '',
        //弹窗是否显示
        showModal: false,
        trigger: '',
    },
    //退出登录
    logout: function() {
        wx.setStorageSync('user', null);
        wx.setStorageSync('id_flag', null);
        wx.setStorageSync('avator', null);
        app.globalData.flag_identity = [1, 0, 0];
        wx.switchTab({
            url: '../person/person',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        user = wx.getStorageSync('user')
        this.setData({
            user: user
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
        user = wx.getStorageSync('user')
        this.setData({
            user: user
        })
        console.log("教师")
        console.log(user)
        console.log(this.data.user)
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

    },

    // 修改姓名
    teaName: function(e) {
        this.setData({
            tmp: e.detail.value
        })
        console.log("修改姓名");
        console.log(this.data.tmp);
    },
    // 身份证信息的修改
    teaIdNum: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("身份证信息");
        console.log(this.data.tmp);
    },
    // 手机号信息的修改
    teaPhone: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("手机号信息");
        console.log(this.data.tmp);
    },
    /**
     * 控制显示
     */
    Bind: function(e) {
        this.setData({
            showModal: true,
            trigger: e.currentTarget.dataset.trigger,

        });
        console.log("点击哪里");
        console.log(e)

    },
    /**
     * 点击返回按钮隐藏
     */
    back: function() {
        this.setData({
            showModal: false
        })
    },
    //修改信息
    checkInfo: function(trigger) {
        var _user = user;
        var that = this;
        if (that.data.tmp == '') {
            wx.showModal({
                content: "请输入内容",
                showCancel: false,
            })
        } else {
            _user[trigger] = that.data.tmp;

            wx.setStorageSync('user', _user);
            var modelName = "Teacher";
            var modelData = {
                name: user.name,
                header: user.header,
                openid: user.openid,
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
            SaveInfo(modelData, modelName);

            console.log("2222222");
            console.log(user);
            that.setData({
                showModal: false,
                tmp: '',
            })

        }
    },
    ok: function() {
        let that = this;
        var trigger = that.data.trigger;
        console.log("trigger", trigger);
        // 修改信息事件 
        if (trigger == 'name' || trigger == 'idnum' || trigger == 'phone') {
            that.checkInfo(trigger);
        }
        that.setData({
            user: user
        })
    }
})