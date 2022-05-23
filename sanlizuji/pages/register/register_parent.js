// pages/register/register_parent.js
var app = getApp();
const areaList = require('../../utils/arealist.js');
const check_idnum = require('../../utils/function.js'); //路径根据自己的文件目录来
import { getOpenId, Register } from '../../utils/apis.js';
import { areaColumnChange, initArea, checkPhone } from '../../utils/function.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusHeight: app.globalData.statusHeight,
        //标题高度
        top_width: 0,
        top_height: 0,
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
        this.getNickName();
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
            "multiArray": this.data.multiArray,
            "multiIndex": this.data.multiIndex,
            "province": this.data.province,
            "e": e,
        }
        let res = areaColumnChange(data);
        this.setData({
            reg: res.tmp,
            multiArray: res.data.multiArray,
            multiIndex: res.data.multiIndex
        });
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
                    console.log("获取用户微信昵称成功", res);
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

    // 身份证号输入验证
    checkID: function(id) {
        var data = check_idnum.checkIdCard(id);
        console.log("检查结果", data);
        if (!data.idCardFlag) {
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800
            })
            return false;
        } else {
            this.setData({
                sex: data.sex,
            })
            return true;
        }
    },

    // 检查姓名是否正确
    InputName: function(e) {
        check_idnum.checkName(e.detail.value);
    },
    // 检查身份证是否正确
    InputIdNum: function(e) {
        this.checkID(e.detail.value);
    },
    // 检查手机号是否输入正确
    InputPhone: function(e) {
        checkPhone(e.detail.value);
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
        if (checkPhone(data.phone)) {
            let that = this;
            // 身份证号格式检查
            if (that.checkID(data.idnum)) {
                console.log("格式无误")
            } else {
                console.log("身份证号填写有误");
                return;
            }
            // 赋值
            this.setData({
                name: data.name,
                sex: data.sex,
                phone: data.phone,
                region: data.region,
                idnum: data.idnum,
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
                    const p = getOpenId({
                        code: res.code
                    }).then(value => {
                        console.log(value)
                        that.setData({
                            openid: value.data.openid
                        })
                        app.globalData.openid = value.data.openid
                        console.log("app openid", app.globalData.openid)
                        Register({
                            modelName: 'UserParent',
                            UserParent: {
                                name: data.name,
                                idnum: data.idnum,
                                nikename: data.nickName,
                                openid: that.data.openid,
                                header: that.data.header,
                                sex: data.sex,
                                sexid: that.data.sexid,
                                phone: data.phone,
                                province: that.data.reg[0],
                                city: that.data.reg[1],
                                district: that.data.reg[2],
                            }
                        }).then(value => {
                            console.log("注册信息", value)
                            if (value.data.data.msg == "该微信已注册") {
                                wx.showModal({
                                    content: '该微信已注册',
                                    showCancel: false,
                                })
                            } else if (value.data.data.msg == "该手机号已注册") {
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
                                console.log(that.data.stu_info);
                                setTimeout(function() {
                                    wx.navigateTo({
                                        url: '../login/login?id=parent'
                                    })
                                }, 800);
                            }
                        })
                    }).catch(err => {
                        console.log("注册失败", err);
                    });
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
    // 获取标题栏高度
    getTopHeight: function() {
        let that = this;
        wx.createSelectorQuery().selectAll('#top').boundingClientRect(function(rect) {
            that.setData({
                top_height: rect[0].height,
                top_width: rect[0].width,
            });
            console.log("高度是：", that.data.top_height);
        }).exec();
    },
    // 初始化数据
    Init: function() {
        let that = this;
        that.getTopHeight();
        let data = initArea();
        this.setData({
            is_show: app.globalData.is_show,
            multiArray: [data.provinceList, data.cityList, data.quyuList],
            province: data.province,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.Init();
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
        let that = this;
        that.Init();
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

    },
    Return: function() {
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function(res) {
                // success
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    }
})