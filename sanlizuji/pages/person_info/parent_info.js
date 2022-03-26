// pages/person_info/parent_info.js
import {
    SaveInfo
} from '../../utils/text.js';
const areaList = require('../../utils/arealist.js');

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
        // 地区更改
        location: "",
        multiArray: [],
        multiIndex: [0, 0, 0],
        province: [],
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
                var modelName = "UserParent";
                if (res.data.code == 200) {
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

                    wx.showToast({
                        title: "绑定成功",
                        icon: "success",
                        duration: 1000,
                    })
                    that.GetKidsName();

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
                    user = wx.getStorageSync('user');

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
            if (trigger == 'region') {
                _user["province"] = that.data.tmp[0];
                _user["city"] = that.data.tmp[1];
                _user["district"] = that.data.tmp[2];
            } else _user[trigger] = that.data.tmp;


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
                user: user,
            })

        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        user = wx.getStorageSync('user')
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
        that.GetKidsName();
        that.getArea();
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
    //获取地区
    bindMultiPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            multiIndex: e.detail.value,
            reg_idx: 1
        })
    },
    bindMultiPickerColumnChange: function(e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        const provinceName = data.multiArray[0][data.multiIndex[0]];
        let provinceId = "";
        let province = this.data.province;
        let quyuList = [],
            cityList = [],
            provinceList = [],
            city = [],
            area = [];
        try {
            province.forEach(item => {
                if (item.name === provinceName) {
                    provinceId = item.id;
                    throw (new Error('find item'))
                }
            })
        } catch (err) {}
        city = areaList.filter(item => {
            return item.pid == provinceId;
        })
        if (e.detail.column == 0) {
            data.multiIndex = [e.detail.value, 0, 0];
            try {
                area = areaList.filter(item => {
                    return item.pid == city[data.multiIndex[1]].id;
                })
            } catch (err) {}
        } else if (e.detail.column == 1) {
            data.multiIndex[2] = 0;
            area = areaList.filter(item => {
                return item.pid == city[e.detail.value].id;
            })
        } else {
            const cityName = data.multiArray[1][data.multiIndex[1]];
            let cityId = '';
            try {
                areaList.forEach(item => {
                    if (item.name === cityName) {
                        cityId = item.id;
                        throw (new Error('find item'));
                    }
                })
            } catch (err) {}
            area = areaList.filter(item => {
                return item.pid == cityId;
            })
        }
        provinceList = province.map(item => {
            return item.name
        })
        cityList = city.map(item => {
            return item.name;
        })
        quyuList = area.map(item => {
            return item.name;
        })
        data.multiArray = [provinceList, cityList, quyuList],
            this.setData(data);
        var tmp = [];
        for (var i = 0; i < 3; i++) {

            tmp[i] = data.multiArray[i][data.multiIndex[i]];
        }
        if (tmp[1] == '北京市') {
            tmp[1] = '北京';

        } else if (tmp[1] == '天津市') {
            tmp[1] = '天津';
        }
        console.log("选中的是：", tmp)
        this.setData({
            reg: tmp,
            tmp: tmp,
        })
        this.checkInfo("region");
    },
    getArea: function() {
        var province = [],
            city = [],
            area = [];
        province = areaList.filter(item => {
            return item.pid == 0;
        })
        city = areaList.filter(item => {
            return item.pid == province[0].id;
        })
        area = areaList.filter(item => {
            return item.pid == city[0].id;
        })
        var provinceList = province.map(item => {
            return item.name
        })
        var cityList = city.map(item => {
            return item.name;
        })
        var quyuList = area.map(item => {
            return item.name;
        })
        this.setData({
            multiArray: [provinceList, cityList, quyuList],
            province
        });
    }
})