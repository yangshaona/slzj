// pages/register/register_parent.js
var app = getApp();
const areaList = require('../../utils/arealist.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 能否获得用户微信昵称
        cangetUserInfo: false,
        //表单各个小标题
        formTitle: { 'name': '姓名', 'sex': '性别', 'nickName': '昵称', 'phone': '手机号', 'region': '地区' },
        // 生日picker
        birth_idx: null,
        // 地区picker
        reg: ['北京', '北京', '东城'],
        reg_idx: null,
        // 姓名
        name: "",
        //opeind
        openid: "",
        //性别
        sex: "",
        sexid: 0,
        //用户昵称
        nickName: "",
        //手机号
        phone: "",
        // 地区
        region: [], //地区
        location: "",
        multiArray: [],
        multiIndex: [0, 0, 0],
        province: [],
        header: "",
        //是否显示用户协议
        isTipTrue: false,
        isAgree: false,
    },
    // 同意协议
    tipAgree: function() {
        this.setData({
            isTipTrue: false,
            isAgree: true,
        })
    },
    tipCancel: function() {
        this.setData({
            isTipTrue: false,
            isAgree: false,
        })
        wx.showToast({
            title: "请先同意服务协议",
            duration: 1000,
        })
    },
    // 跳转到用户协议
    toProtocol: function() {
        wx.navigateTo({
            url: '../protocol/protocol',

        })
    }, // 跳转到用户隐私
    toPrivacy: function() {
        wx.navigateTo({
            url: '../privacy_policy/privacy_policy',

        })
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
        this.setData({
            reg: tmp,
        })
    },
    //获取用户昵称
    getNickName: function(e) {
        if (!this.data.isAgree) {
            this.setData({
                isTipTrue: true,
            })
        }
        if (this.data.isAgree) {
            wx.getUserProfile({
                desc: '获取用户昵称',
                success: (res) => {
                    console.log("获取用户微信昵称成功");
                    console.log(res);
                    this.setData({
                        cangetUserInfo: true,
                        nickName: res.userInfo.nickName,
                        header: res.userInfo.avatarUrl,
                    })

                    wx.setStorageSync('avator', res.userInfo.avatarUrl)
                },
                fail: (res) => {
                    console.log(res.errMsg)
                }
            })
        }
    },

    // 地区选择器改变
    regionChange: function(e) {
        console.log("地区改变为" + e.detail.value);
        this.setData({
            reg: e.detail.value,
            reg_idx: 1
        })
    },

    //手机号码输入检查
    checkPhone: function(phNum) {
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(16[0-9]{1})|(14[0-9]{1}))+\d{8})$/;

        if (phNum.length != 11 || !reg.test(phNum)) {
            wx.showModal({
                content: '手机号输入有误',
                showCancel: false,
            })
            return false;
        } else {
            console.log("手机号填写格式正确");
            return true;
        }
    },

    // 注册表单提交
    submit: function(e) {
        // 留空检查
        var data = e.detail.value;
        console.log(data);
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
        if (this.checkPhone(data.phone)) {
            let that = this;
            // 赋值
            this.setData({
                name: data.name,
                sex: data.sex,
                phone: data.phone,
                region: data.region,
            })
            if (data.sex == '男') {
                that.setData({
                    sexid: "1",
                })
            } else {
                that.setData({
                    sexid: "2",
                })
            }
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
                            console.log(app.globalData.openid)
                            console.log("家长数据")
                            console.log(data)
                            wx.request({
                                url: app.globalData.url + 'WxUser/Register&modelName=UserParent',
                                data: {
                                    UserParent: {


                                        name: data.name,
                                        nikename: data.nickname,
                                        openid: that.data.openid,
                                        header: that.data.header,
                                        sex: data.sex,
                                        sexid: that.data.sexid,
                                        phone: data.phone,
                                        province: data.region[0],
                                        city: data.region[1],
                                        district: data.region[2],
                                    }
                                },
                                success(res) {
                                    console.log(that.data.openid)
                                    console.log("注册信息")
                                    console.log(res)
                                    if (res.data.data.msg == "该手机号已注册") {
                                        wx.showModal({
                                            content: '该手机号已注册',
                                            showCancel: false,
                                        })
                                    } else {
                                        wx.showModal({
                                            content: '成功添加个人信息',
                                            showCancel: false,
                                        })
                                        console.log("表单检查成功");
                                        console.log(that.data.stu_info)
                                        setTimeout(function() {
                                            wx.navigateTo({
                                                url: '../login/login?id=parent'
                                            })
                                        }, 800);
                                    }

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
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })

        } else {
            console.log("手机号填写错误");
            return;
        }
    },
    // 绑定已有数据
    login: function(e) {

        app.globalData.flag_identity = [0, 0, 1];
        wx.navigateTo({
            url: '../login/login?id=parent',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
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
        let user = wx.getStorageSync('user')
        app.globalData.flag_identity = [0, 0, 1];
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