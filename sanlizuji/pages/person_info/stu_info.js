// pages/person_info/stu_info.js
import {
    SaveInfo,
    checkPhone,
    checkName
} from '../../utils/text.js'
const areaList = require('../../utils/arealist.js');
const check_idnum = require('../../utils/text.js'); //路径根据自己的文件目录来
let user = wx.getStorageSync('user');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //用户信息
        user: user,
        //弹窗是否显示
        showModal: false,
        //监护人姓名和电话
        parent_name: '',
        parent_phone: '',
        trigger: '',
        stu_name: "",
        tmp: "",
        // 学历更改
        edu: ['小学', '初中', '高中', '专科', '本科', '硕士', '博士'],
        edu_idx: null,
        // 地区更改
        location: "",
        multiArray: [],
        multiIndex: [0, 0, 0],
        province: [],
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        user = wx.getStorageSync('user')
        this.setData({
            user: user,
            is_show: app.globalData.is_show,
        });
        this.GetParentsList();

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
        console.log("学生信息")
        console.log(user)
        this.setData({
            user: user
        });
        this.GetParentsList();
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

    /**
     * 获取监护人姓名输入值
     */
    nameInput: function(e) {
        this.setData({
            parent_name: e.detail.value
        })
    },
    /**
     * 获取监护人电话号码输入值
     */
    phoneInput: function(e) {
        this.setData({
            parent_phone: e.detail.value
        })
    },
    // 修改姓名
    stuName: function(e) {
        this.setData({
            tmp: e.detail.value
        })
        console.log("修改姓名");
        console.log(this.data.tmp);
    },
    // 身份证信息的修改
    stuIdNum: function(e) {

        this.setData({
            tmp: e.detail.value,
        })

    },
    // 手机号信息的修改
    stuPhone: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
    },
    // 学校信息的修改
    stuSchool: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("学校信息");
        console.log(this.data.tmp);
    },
    // 年级信息的修改
    stuGrade: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("年级信息");
        console.log(this.data.tmp);
    },
    // 备注信息的修改
    stuMark: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("备注信息");
        console.log(this.data.tmp);
    },
    // 学历选择器改变
    eduChange: function(e) {
        console.log("学历改变为: " + e.detail.value);
        var value = this.data.edu[e.detail.value];
        this.setData({
            edu_idx: e.detail.value,
            tmp: value,
        });
        console.log(this.data.tmp);
        this.checkInfo("education");
    },
    /**
     * 点击确定按钮获取input值并且关闭弹窗
     */
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
            user = wx.getStorageSync('user');
            var modelName = "Userinfo";
            var modelData = {
                name: user.name,
                nikename: user.nickname,
                header: user.header,
                openid: user.openid,
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
        console.log(that.data.parent_name);
        console.log(that.data.parent_phone);
        var trigger = that.data.trigger;
        console.log("trigger", trigger);
        // 绑定事件
        if (trigger == 'bind') {
            wx.request({
                url: app.globalData.url + 'WxUser/SearchParent',
                data: {
                    name: that.data.parent_name,
                    phone: that.data.parent_phone,
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    console.log("父母信息");
                    console.log(res)
                    if (res.data.data.msg == "请输入姓名和电话") {
                        wx.showModal({
                            content: res.data.data.msg,
                            showCancel: false,
                        })

                    } else {
                        if (res.data.data.length == 0) {
                            wx.showModal({
                                content: "监护人未注册",
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
        } else if (trigger == 'idnum') {
            that.setData({
                showModal: false,
            })
        }
        // 修改信息事件 
        // else if (trigger == 'name' || trigger == 'phone' || trigger == 'schoolname' || trigger == 'grade' || trigger == 'aller') {
        else if (trigger == 'name' || trigger == 'phone' || trigger == 'schoolname' || trigger == 'grade' || trigger == 'aller') {
            if (trigger == 'name') {
                var flag = check_idnum.checkName(this.data.tmp);
                if (flag) {
                    that.checkInfo(trigger);
                }
            } else if (trigger == 'phone') {
                if (checkPhone(this.data.tmp)) {
                    that.checkInfo(trigger);
                }
            } else {
                that.checkInfo(trigger);
            }
        }


        that.setData({
            user: user
        })
    },
    // 检查身份证号是否输入正确
    checkID: function() {
        var data = check_idnum.checkIdCard(this.data.tmp);
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
    //孩子绑定父母
    kidBindParent: function(pid) {
        let that = this;
        console.log("父母id", pid)
        wx.request({
            url: app.globalData.url + "WxUser/KidBindParent",
            data: {
                id: user.id,
                pid: pid,
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
    //获取已绑定的家长信息
    GetParentsList: function() {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxUser/GetParentList',
            data: {
                id: user.id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("成功获取绑定的家长信息11");
                console.log(res)
                var pname_list = [],
                    phone_list = [];
                if (res.data.msg == "获取列表信息成功") {
                    for (var key of res.data.data) {
                        pname_list.push(key.name);
                        phone_list.push(key.phone);
                    }
                    user.parents = pname_list.join(',');
                    user.p_phone = phone_list.join(',');

                } else {
                    user.parents = "未绑定监护人信息";
                    user.p_phone = "";
                }
                that.setData({
                    user: user
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
    //手机号码输入检查
    checkPhone: function(phNum, id) {
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(16[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
        if (phNum.length != 11 || !reg.test(phNum)) {
            wx.showModal({
                content: id + '输入有误', //提示的内容,
                showCancel: false, //是否显示取消按钮,
            });
            return false;
        } else {
            console.log("手机号填写格式正确");
            return true;
        }
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