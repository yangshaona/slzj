// pages/register/register_stu.js
import {
    checkPhone

} from '../../utils/text.js'
const formatTime = require('../../utils/text.js');
import WeCropper from '../dev/we-cropper.js';
import GlobalConfig from '../dev/config.js';

// const app = getApp();
const config = new GlobalConfig();

config.init();

const device = wx.getSystemInfoSync()
const width = device.windowWidth
    // const height = device.windowHeight - 50
const height = device.windowHeight - 50;
const windowHeight = device.windowHeight - 50;

var app = getApp();
const areaList = require('../../utils/arealist.js');
const check_idnum = require('../../utils/text.js'); //路径根据自己的文件目录来
// const checkPhone = require('../../utils/text.js'); //路径根据自己的文件目录来

Page({

    /**
     * 页面的初始数据
     */

    data: {
        windowHeight: windowHeight,
        cropperOpt: {
            id: 'cropper',
            targetId: 'targetCropper',
            pixelRatio: device.pixelRatio,
            width,
            height,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: (width - 300) / 2,
                y: (height - 300) / 2,
                width: 300,
                height: 300
            },
            boundStyle: {
                color: config.getThemeColor(),
                mask: 'rgba(0,0,0,0.8)',
                lineWidth: 1
            }
        },
        // 能否获得用户微信昵称
        cangetUserInfo: false,
        //表单各个小标题
        formTitle: { 'name': '姓名', 'idnum': '身份证号', 'birthday': '生日', 'sex': '性别', 'education': '在读学历', 'nikename': '昵称', 'phone': '手机号', 'schoolname': '学校名称', 'region': '地区', 'grade': '年级', 'class': '班级', 'parents': '监护人姓名', 'p_phone': '监护人手机', 'aller': '备注', 'avatar': '头像' },
        // 学历picker
        edu: ['小学', '初中', '高中', '专科', '本科', '硕士', '博士'],
        edu_idx: null,
        // 生日picker
        birth_idx: null,
        // 年级picker
        grd: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        grd_idx: null,
        // 班级picker
        cls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        cls_idx: null,
        // 地区picker
        reg: ['北京', '北京', '东城'],
        reg_idx: null,
        stu_info: {
            // 姓名
            name: "",
            // 身份证号
            idnum: "",
            // 生日
            birthday: "",
            // 学历
            education: "",
            //性别
            sex: "",
            sexid: "0",
            //手机号
            phone: "",
            // 学校
            schoolname: "",
            //年级
            grade: "",
            // 班级
            class: "",
            // 监护人姓名/电话
            parents: "",
            p_phone: "",
            // 地区
            region: [],
            // 备注
            remark: "",
            // 注册时间
            time: ""
        },
        //头像
        header: "",
        //实名头像
        avator: "",
        //openid
        openid: "",
        //用户昵称
        nickName: "",
        //地区
        location: "",
        multiArray: [],
        multiIndex: [0, 0, 0],
        province: [],
        //是否显示用户协议
        isTipTrue: false,
        isAgree: false,

        // 是否显示头像剪裁框
        showCut: false,
        // 身份切换
        title: "身份切换密码校验",
        showModal: false,
        pwd: '',
        register_role: '',
        user_group: '',
        is_show: 0, //是否显示注册按钮
    },
    newCut(src) {
        const { cropperOpt } = this.data

        cropperOpt.boundStyle.color = config.getThemeColor()

        this.setData({ cropperOpt })

        if (src) {
            cropperOpt.src = src
            this.cropper = new WeCropper(cropperOpt)
                .on('ready', (ctx) => {
                    console.log(`wecropper is ready for work!`)
                })
                .on('beforeImageLoad', (ctx) => {
                    console.log(`before picture loaded, i can do something`)
                    console.log(`current canvas context:`, ctx)
                    wx.showToast({
                        title: '上传中',
                        icon: 'loading',
                        duration: 20000
                    })
                })
                .on('imageLoad', (ctx) => {
                    console.log(`picture loaded`)
                    console.log(`current canvas context:`, ctx)
                    wx.hideToast()
                })
                .on('beforeDraw', (ctx, instance) => {
                    console.log(`before canvas draw,i can do something`)
                    console.log(`current canvas context:`, ctx)
                })
        }
    },

    touchStart(e) {
        this.cropper.touchStart(e)
    },
    touchMove(e) {
        this.cropper.touchMove(e)
    },
    touchEnd(e) {
        this.cropper.touchEnd(e)
    },
    // 用户点击确认剪裁
    getCropperImage() {
        const that = this;
        this.cropper.getCropperImage(function(path, err) {
            if (err) {
                wx.showModal({
                    title: '温馨提示',
                    content: err.message
                })
            } else {
                // wx.previewImage({
                //   current: '', // 当前显示图片的 http 链接
                //   urls: [path] // 需要预览的图片 http 链接列表
                // })
                console.log(path);
                that.setData({
                        avator: path,
                        showCut: false,
                    })
                    /*
                        path中包含临时图像文件的url，用其上传后台
                        此路径仅在用户下一次点击此按钮时有效
                    */
                console.log(that.data.avator);
            }
        })

    },
    uploadTap() {
        const self = this

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0]
                    //  获取裁剪图片资源后，给data添加src属性及其值

                self.cropper.pushOrign(src)
            }
        })
    },

    // 选择图像
    chooseImg: function(e) {
        console.log("上传实名头像");
        console.log(e);

        const that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0];
                that.setData({
                    showCut: true,
                })
                that.newCut(src);
            }
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
        })
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
        wx.showToast({
            title: "请先同意协议",
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
                    console.log(res)
                    this.setData({
                        cangetUserInfo: true,
                        nickName: res.userInfo.nickName,
                    })
                },
                fail: (res) => {
                    console.log(res.errMsg)
                }
            })
        }
    },

    // 学历选择器改变
    eduChange: function(e) {
        console.log("学历改变为: " + e.detail.value)
        this.setData({
            edu_idx: e.detail.value
        })
    },
    // 生日选择器改变
    birthChange(e) {
        this.setData({
            birth_idx: e.detail.value
        })
        console.log("生日改变为" + e.detail.value)
    },
    // 年级选择器改变
    gradeChange: function(e) {
        console.log("年级改变为" + this.data.grd[e.detail.value])
        this.setData({
            grd_idx: e.detail.value
        })
    },
    //班级选择器改变
    classChange: function(e) {
        console.log("班级改变为" + this.data.cls[e.detail.value])
        this.setData({
            cls_idx: e.detail.value
        })
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
                content: '手机号输入有误', //提示的内容,
                showCancel: false, //是否显示取消按钮,
            });
            return false;
        } else {
            console.log("手机号填写格式正确");
            return true;
        }
    },
    // 身份证号输入验证
    checkID: function(id) {
        console.log("检查结果");
        var data = check_idnum.checkIdCard(id);
        console.log(data.idCardFlag);
        if (!data.idCardFlag) {
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800

            })
            return false;
        } else {
            // wx.showToast({
            //     title: '通过了',
            // })
            var birthday = "stu_info.birthday";
            this.setData({
                [birthday]: data.birth,
                sex: data.sex,
            })
            console.log(data);
            console.log(data.sex);
            return true;
        }
    },
    // 检查身份证是否正确
    InputIdNum: function(e) {
        this.checkID(e.detail.value);
    },
    // 检查姓名是否正确
    InputName: function(e) {
        var that = this;
        console.log(e);
        var name = e.detail.value
        var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/;

        if (name.match(reg)) {
            console.log("111");
            // that.setData({ allow_name: true });
            wx.setStorageSync("name", name)
        } else {
            wx.showToast({
                title: "姓名有误",
                icon: 'error',
                duration: 800
            })
        }
        console.log(name)
    },
    // 检查手机号是否输入正确
    InputPhone: function(e) {
        // this.checkPhone(e.detail.value);
        checkPhone(e.detail.value);
    },

    // 注册表单提交
    submit: function(e) {
        // 留空检查
        var data = e.detail.value;
        console.log(data);
        let that = this;
        for (var i in data) {

            console.log("地区")
            console.log(data.region)
            console.log(data.region[0])
            if (data[i] == null || data[i] == "") {
                console.log(i);
                console.log(data[i]);
                console.log("表单有未填写部分");
                wx.showToast({
                    title: '请填写' + that.data.formTitle[i],
                    icon: 'fail',
                    duration: 800
                })
                return;
            }
        }

        // 全部已填写
        // 电话号码格式检查
        if (checkPhone(data.phone)) {
            // 身份证号格式检查
            if (that.checkID(data.idnum)) {

                console.log("格式无误")
            } else {

                console.log("身份证号填写有误");
                return;
            }
            // 自动获取注册时间
            var now = new Date;
            var time = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
            console.log(time);
            console.log("数据")
            console.log(data)
            var register_time = 'stu_info.time'

            // 赋值
            that.setData({
                stu_info: data,
                [register_time]: time
            })
            var sexid = "stu_info.sexid"
            if (data.sex == '男') {
                that.setData({
                    [sexid]: "1",
                })
            } else {
                that.setData({
                    [sexid]: "2",
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
                            console.log("学生数据")
                            console.log(data)
                            wx.request({
                                url: app.globalData.url + 'WxUser/Register&modelName=Userinfo',
                                data: {
                                    Userinfo: {
                                        name: data.name,
                                        nikename: data.nickname,
                                        openid: that.data.openid,
                                        idnum: data.idnum,
                                        birthday: data.birth,
                                        sex: data.sex,
                                        sexid: that.data.stu_info.sexid,
                                        education: that.data.edu[data.education],
                                        phone: data.phone,
                                        schoolname: data.schoolname,
                                        grade: data.grade,
                                        class: data.class,
                                        province: that.data.reg[0],
                                        city: that.data.reg[1],
                                        district: that.data.reg[2],
                                        aller: data.remark,
                                        regsterdate: data.regsterdate,
                                    }
                                },
                                success(res) {
                                    console.log("注册信息")
                                    console.log(res)
                                    if (res.data.data.msg == "该微信已注册") {
                                        wx.showModal({
                                            content: '该微信已注册',
                                            showCancel: false,
                                        })
                                    } else if (res.data.data.msg == "该手机号已注册") {
                                        wx.showModal({
                                            content: '该手机号已注册',
                                            showCancel: false,
                                        })
                                    } else {
                                        wx.setStorageSync('avator', that.data.avator)

                                        wx.showModal({
                                            content: '成功添加个人信息',
                                            showCancel: false,
                                        })
                                        console.log("表单检查成功");
                                        console.log(that.data.stu_info);
                                        that.getUserInfo();
                                        setTimeout(function() {
                                            wx.navigateTo({
                                                url: '../login/login?id=student'
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
    // 获取用户信息
    getUserInfo: function(e) {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxUser/GetUserInfo2',
            data: {
                openid: app.globalData.openid,
                id_flag: 'student',
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("获取成功");
                console.log(res);
                that.UpLoadImage(res.data.data);
            }
        })
    },
    //点击头像上传图片
    UpLoadImage: function(data) {
        let that = this;
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = that.data.avator;
        console.log("图片路径");
        console.log(tempFilePaths);
        // 图片新命名
        var time = Date.parse(new Date());
        time /= 1000;
        var newPicName = formatTime.formatTime(time, 'YMDhms');
        //上传图片
        wx.uploadFile({
            //请求后台的路径
            url: app.globalData.url + 'WxUser/SaveImg',
            //小程序本地的路径
            filePath: tempFilePaths,

            name: 'file',
            formData: {
                //图片命名：用户id-商品id-1~9
                newName: newPicName,
                id: data.id,
                modelName: 'Userinfo',
                file_type: '',
            },
            success(res) {
                console.log("成功保存图片");
                console.log(res);

            },
            fail(res) {
                flag = false;
                wx.showModal({
                    title: '提示',
                    content: '上传失败',
                    showCancel: false
                })
            }
        })


    },
    // 切换教师/家长端
    changeToTeacher: function(e) {
        console.log("切换教师端");
        console.log(e.currentTarget.id);
        this.setData({
            showModal: true,
            user_group: 2,
            register_role: e.currentTarget.id,
        })

    },
    changeToParent: function(e) {
        console.log("切换家长端");
        console.log(e.currentTarget.id);
        this.setData({
            showModal: true,
            user_group: 3,
            register_role: e.currentTarget.id,
        })
    },
    // 身份切换密码校验
    checkRole: function(user_group, register_role) {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxSign/CheckRole',
            data: {
                user_group: user_group,
                password: that.data.pwd,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("身份切换密码校验结果");
                console.log(res);
                if (res.data.data == '验证成功') {
                    that.setData({
                        showModal: false,
                    })
                    wx.navigateTo({
                        url: './register_' + register_role,
                    })
                } else {
                    wx.showToast({
                        title: '密码有误', //提示的内容,
                        duration: 800,
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
    // 课程密码校验
    // 点击确定按钮
    ok: function() {
        let that = this;
        if (that.data.pwd != '') {
            that.checkRole(that.data.user_group, that.data.register_role);
        } else {
            wx.showToast({
                title: '请输入密码',
                duration: 500,
            })
        }
        that.setData({
            pwd: "",
        })
    },
    back: function() {
        this.setData({
            showModal: false,
        })

    },
    InputPwd: function(e) {
        console.log(e)
        this.setData({
            pwd: e.detail.value,
        })
    },
    // 绑定已有数据
    login: function(e) {
        app.globalData.flag_identity = [1, 0, 0];

        console.log(app.globalData.flag_identity[0])
        console.log(app.globalData.flag_identity[1])
        console.log(app.globalData.flag_identity[2])
        wx.navigateTo({
            url: '../login/login?id=student',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var now = new Date;
        let that = this;
        var time = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
        that.setData({
            time: time,
            isTipTrue: false,
            is_show: app.globalData.is_show,
        })
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
        let user = wx.getStorageSync('user');
        app.globalData.flag_identity = [1, 0, 0];

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