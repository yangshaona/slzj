// pages/person_info/teacher_info.js
import {
    SaveInfo,
    checkPhone,
} from '../../utils/text.js';
const areaList = require('../../utils/arealist.js');
const check_idnum = require('../../utils/text.js'); //路径根据自己的文件目录来
let user = wx.getStorageSync('user');
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
        reg: ['北京', '北京', '东城'],
        //工作类型picker
        tp: ['企业', '学校', '兼职'],
        tp_idx: null,
        // 地区更改
        location: "",
        multiArray: [],
        multiIndex: [0, 0, 0],
        province: [],
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
        console.log(this.data.user);
        this.getArea();
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
    // 检查身份证号是否输入正确
    checkID: function(idnum) {
        var data = check_idnum.checkIdCard(idnum);
        console.log(data.idCardFlag);
        if (!data.idCardFlag) {
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800

            })
            return false;
        } else {
            var _user = wx.getStorageSync('user');
            _user.birthday = data.birth;
            _user.sex = data.sex;
            if (data.sex == '男') {
                _user.sexid = '1';
            } else {
                _user.sexid = '2';
            }
            wx.setStorageSync('user', _user);
            user = wx.getStorageSync('user');
            console.log("身份证信息");
            console.log(this.data.tmp);
            return true;
        }

    },
    // 手机号信息的修改
    teaPhone: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("手机号信息");
        console.log(this.data.tmp);

    },
    // 工作类型选择器改变
    typeChange: function(e) {
        console.log("类型改变为: " + e.detail.value);
        var type = parseInt(e.detail.value) + 1;
        console.log(type);
        this.setData({
            tp_idx: e.detail.value,
            tmp: type
        });
        this.checkInfo("type")
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
            if (trigger == 'region') {
                _user["province"] = that.data.tmp[0];
                _user["city"] = that.data.tmp[1];
                _user["district"] = that.data.tmp[2];
            } else _user[trigger] = that.data.tmp;

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
            console.log(user);
            that.setData({
                showModal: false,
                tmp: '',
                user: user,

            })

        }
    },
    ok: function() {
        let that = this;
        var trigger = that.data.trigger;
        console.log("trigger", trigger);
        // 修改信息事件 

        if (trigger == 'name') {
            var flag = check_idnum.checkName(this.data.tmp);
            if (flag) {
                that.checkInfo(trigger);

            }
        } else if (trigger == 'idnum') {
            if (that.checkID(this.data.tmp)) {
                that.checkInfo(trigger);
            }
        } else if (trigger == 'phone') {
            if (checkPhone(this.data.tmp)) {
                that.checkInfo(trigger);
            }
        }

        that.setData({
            user: user
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