// pages/person_info/parent_info.js
import { SaveInfo, checkPhone, Unbound, initArea } from '../../utils/function.js';
import { SearchKids, GetKidsName, KidBindParent } from '../../utils/apis.js';
const areaList = require('../../utils/arealist.js');
const check_idnum = require('../../utils/function.js'); //路径根据自己的文件目录来

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
        });
        check_idnum.checkName(e.detail.value);
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

    // 身份证信息的修改
    checkIdNum: function(e) {
        var data = check_idnum.checkIdCard(e.detail.value);
        console.log(data.idCardFlag);
        if (!data.idCardFlag) {
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800,
            })
            return false;
        } else {
            this.setData({
                tmp: e.detail.value,
            })
            return true;
        }
    },
    checkInputName: function(e) {
        this.setData({
            tmp: e.detail.value
        })
        console.log("输入的数据是：", e.detail.value);
        check_idnum.checkName(e.detail.value);
    },
    // 检查手机号是否输入正确
    checkPhone: function(e) {
        checkPhone(e.detail.value);
    },

    /**
     * 点击确定按钮获取input值并且关闭弹窗
     */

    ok: function() {
        let that = this;
        console.log(that.data.k_name, that.data.k_phone, that.data.k_idnum);
        var trigger = that.data.trigger;
        console.log("trigger", trigger);
        // 绑定事件
        if (trigger == 'bind') {
            const p = SearchKids({
                name: that.data.k_name,
                phone: that.data.k_phone,
                idnum: that.data.k_idnum,
            })
            p.then(value => {
                console.log("孩子信息", value)
                if (value.data.data.msg == "请输入姓名、身份证和电话") {
                    wx.showModal({
                        content: value.data.data.msg,
                        showCancel: false,
                    })
                } else {
                    if (value.data.data.length == 0) {
                        wx.showModal({
                            content: "该用户未注册",
                            showCancel: false,
                        })
                    } else {
                        that.kidBindParent(value.data.data[0].id);
                    }
                }
            }, reason => {
                console.log("获取孩子信息数据失败", reason);
            });
        } else if (trigger == 'idnum') {
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
                var sexid = data.sex == '男' ? 1 : 2;
                this.setData({
                    birthday: data.birth,
                    sex: data.sex,
                    sexid: sexid,
                })
                that.checkInfo(trigger);
                return true;
            }
        } else if (trigger == 'name') {
            var flag = check_idnum.checkName(this.data.tmp);
            if (flag) {
                that.checkInfo(trigger);
            }
        }
        that.setData({
            user: user,
        })
    },
    //退出登录
    logout: function() {
        let user = wx.getStorageSync('user');
        Unbound(user.id, 'UserParent');
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
        console.log("孩子id", kid);
        const p = KidBindParent({
            pid: user.id,
            id: kid,
        }).then(value => {
            console.log("绑定数据", value);
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
        }, reason => {
            console.log("绑定失败", reason);
        });
    },
    //获取绑定的孩子
    GetKidsName: function() {

        let that = this;
        GetKidsName({
            id: user.id
        }).then(value => {
            console.log("成功获取孩子信息", value);
            var _user = wx.getStorageSync('user');
            if (value.data.data.msg == "获取成功") {
                _user.kids = value.data.data.data.join(',');
                wx.setStorageSync('user', _user)
                user = wx.getStorageSync('user');
            } else {
                user.kids = "未绑定孩子信息"
            }
            that.setData({
                user: user
            });
            console.log("家长信息", user)
        }, reason => {
            console.log("获取孩子信息失败", reason);
        });
    },
    //修改信息
    checkInfo: function(trigger) {
        var _user = user,
            that = this;
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
            } else if (trigger == 'idnum') {
                _user[trigger] = that.data.tmp;
                _user["birthday"] = that.data.birthday;
                _user["sex"] = that.data.sex;
                _user["sex_id"] = that.data.sexid;
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
                idnum: user.idnum
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
            "multiArray": this.data.multiArray,
            "multiIndex": this.data.multiIndex,
            "province": this.data.province,
            "e": e,
        }
        let res = areaColumnChange(data);
        this.setData({
            reg: res.tmp,
            tmp: res.tmp,
            multiArray: res.data.multiArray,
            multiIndex: res.data.multiIndex
        });
        this.checkInfo("region");
    },
    getArea: function() {
        let data = initArea();
        this.setData({
            multiArray: [data.provinceList, data.cityList, data.quyuList],
            province: data.province
        });
    },
})