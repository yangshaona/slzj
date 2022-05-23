// pages/register/register_teacher.js
const app = getApp();
const check_idnum = require('../../utils/function.js'); //路径根据自己的文件目录来
const areaList = require('../../utils/arealist.js');
import { Register, GetUserInfo2, getOpenId } from '../../utils/apis.js';
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
        filepath: '',
        // 能否获得用户微信昵称
        cangetUserInfo: false,
        //表单各个小标题
        formTitle: { 'name': '姓名', 'idNum': '身份证号', 'birth': '生日', 'sex': '性别', 'type': '类型', 'nickName': '昵称', 'phone': '手机号', 'region': '地区', 'exp': '简历' },
        // 类型picker
        tp: ['企业', '学校', '兼职'],
        tp_idx: null,
        // 生日picker
        birth_idx: null,
        // 地区picker
        reg: ['北京', '北京', '东城'],
        reg_idx: null,
        // 姓名
        name: "",
        // 身份证号
        idNum: "",
        // 生日
        birth: "",
        // 类型
        type: 0,
        //性别
        sex: "",
        sexid: "",
        //用户昵称
        nickName: "",
        //手机号
        phone: "",
        // 地区
        region: [],
        // 简历
        exp: [],
        //头像
        header: "",
        openid: "",
        //地区
        multiArray: [],
        multiIndex: [0, 0, 0],
        province: [],
        //是否显示用户协议
        isTipTrue: false,
        isAgree: false,
        is_show: 0,
    },
    // 同意协议
    tipAgree: function() {
        this.setData({
            isTipTrue: false,
            isAgree: true,
        })
        this.getNickName()

    },
    tipCancel: function() {
        this.setData({
                isTipTrue: false,
                isAgree: false,
            })
            // setTimeout(function() {
        wx.showToast({
                title: "请先同意协议",
                duration: 1000,
            })
            // }, 800)
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
                    console.log("获取用户微信昵称成功"),
                        console.log(res)
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

    // 类型选择器改变
    typeChange: function(e) {
        console.log("类型改变为: " + e.detail.value)
        this.setData({
            tp_idx: e.detail.value
        })
    },
    // 生日选择器改变
    birthChange(e) {
        this.setData({
            birth_idx: e.detail.value
        })
        console.log("生日改变为" + e.detail.value)
    },
    // 地区选择器改变
    regionChange: function(e) {
        console.log("地区改变为" + e.detail.value);
        this.setData({
            reg: e.detail.value,
            reg_idx: 1
        })
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
                birth: data.birth,
                sex: data.sex,
            })
            return true;
        }
    },
    // 检查身份证是否正确
    InputIdNum: function(e) {
        this.checkID(e.detail.value);
    },
    // 检查姓名是否正确
    InputName: function(e) {
        check_idnum.checkName(e.detail.value);
    },
    // 检查手机号是否输入正确
    InputPhone: function(e) {
        checkPhone(e.detail.value);
    },
    // 选择简历文件
    chooseFiles: function(e) {
        console.log("上传文件");
        wx.chooseMessageFile({
            count: 1,
            type: "file",
            success: (res) => {
                console.log("上传文件返回的结果", res);
                var files = res.tempFiles;
                var fileExtension = files[0]['name'].substring(files[0]['name'].lastIndexOf('.') + 1);
                console.log("文件后缀名", fileExtension);
                if (fileExtension != "pdf") {
                    wx.showModal({
                        title: '上传失败',
                        content: "请上传pdf文件",
                        showCancel: false,
                    });
                } else {
                    this.setData({
                        filepath: files,
                    })
                    console.log(files[0].path);
                    wx.setStorageSync('exp', files[0].path);
                    var exp = [];
                    for (var idx in files) {
                        exp.push(files[idx].path);
                    }
                    console.log(exp);
                    this.setData({
                        exp: exp
                    })
                }
            },
            fail: (res) => {
                console.log(res);
                wx.showToast({
                    title: '上传失败',
                    icon: 'error',
                    duration: 800
                })
            }
        })
    },

    upLoadFiles(data) {
        let that = this;
        console.log
        var exp = wx.getStorageSync('exp');
        console.log("简历路径");
        console.log(exp);
        wx.uploadFile({
            //请求后台的路径
            url: app.globalData.url + 'WxUser/SaveImg',
            //小程序本地的路径
            filePath: exp,

            name: 'file',
            formData: {
                //图片命名：用户id-商品id-1~9
                newName: data.openid + "of resume",
                id: data.id,
                modelName: 'Teacher',
                file_type: 'pdf',
            },
            success(res) {
                console.log(res);
                if (res.statusCode == 200) {
                    console.log("成功上传简历");
                    wx.showToast({
                        title: "文件保存成功",
                        icon: 'success',
                        duration: 800,
                    });
                } else {
                    wx.showToast({
                        title: "文件保存失败",
                        icon: 'success',
                        duration: 800,
                    });
                }
            },
            fail(res) {
                wx.showModal({
                    title: '提示',
                    content: '上传失败',
                    showCancel: false
                })
            }
        })
    },
    // 查看上传的简历文件
    View: function(e) {
        console.log("文件预览", e);
        let url = e.currentTarget.dataset.file_path[0];
        wx.downloadFile({
            // 示例 url，并非真实存在
            url: url,
            success: function(res) {
                const filePath = res.tempFilePath
                wx.openDocument({
                    filePath: filePath,
                    success: function(res) {
                        console.log('打开文档成功')
                    }
                })
            }
        })
    },
    // 获取用户信息
    getUserInfo: function(e) {
        let that = this;
        //  'WxUser/GetUserInfo2'
        GetUserInfo2({
            openid: app.globalData.openid,
            id_flag: 'teacher',
        }).then(value => {
            console.log("获取成功", value);
            that.upLoadFiles(value.data.data);
        }, reason => {
            console.log("获取用户信息失败", reason);
        });
    },

    // 注册表单提交
    submit: function(e) {
        // 留空检查
        let that = this;
        var data = e.detail.value;
        console.log(data);
        for (var i in data) {
            if (data[i] == null || data[i] == "") {
                console.log(i, data[i]);
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
            // 身份证号格式检查
            if (this.checkID(data.idNum)) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 800
                })
            } else {
                console.log("身份证号填写有误");
                return;
            }
            // 赋值
            this.setData({
                name: data.name,
                idNum: data.idNum,
                birth: data.birth,
                sex: data.sex,
                type: this.data.tp[data.type],
                phone: data.phone,
                region: data.region,
                exp: data.exp,
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
                    console.log("获取openid", res);
                    // WxUser/getOpenId
                    getOpenId({
                        code: res.code,
                    }).then(value => {
                        console.log(value);
                        that.setData({
                            openid: value.data.openid
                        });
                        var type = parseInt(data.type) + 1;
                        console.log(type)
                        app.globalData.openid = value.data.openid;
                        //  "WxUser/Register"
                        Register({
                            modelName: "Teacher",
                            Teacher: {
                                header: that.data.header,
                                openid: value.data.openid,
                                birthday: data.birth,
                                idnum: data.idNum,
                                resume: data.exp,
                                name: data.name,
                                sex: data.sex,
                                sexid: that.data.sexid,
                                type: parseInt(data.type) + 1,
                                phone: data.phone,
                                province: that.data.reg[0],
                                city: that.data.reg[1],
                                district: that.data.reg[2],
                            }
                        }).then(value => {
                            console.log("表单检查成功");
                            that.getUserInfo();
                            console.log(value)
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
                                setTimeout(function() {
                                    wx.navigateTo({
                                        url: '../login/login?id=teacher'
                                    })
                                }, 800);
                            }
                        }, reason => {
                            console.log("获取失败", reason);
                        });
                    }, reason => {
                        console.log("获取信息失败", reason);
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
        app.globalData.flag_identity = [0, 1, 0];
        console.log("数据")
        wx.navigateTo({
            url: '../login/login?id=teacher',
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
    Init: function() {
        let that = this;
        that.getTopHeight();
        let data = initArea();
        this.setData({
            is_show: app.globalData.is_show,
            multiArray: [data.provinceList, data.cityList, data.quyuList],
            province: data.province,
        });
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
        app.globalData.flag_identity = [0, 1, 0];
        this.Init();
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
        })
    }
})