// pages/person/demo.js
import {
    Unbound
} from '../../utils/text.js';
import WeCropper from '../dev/we-cropper.js';
import GlobalConfig from '../dev/config.js';
import { GetUserInfo2 } from "../../utils/apis.js";
// import { formatTime } from '../../utils/text.js';
const formatTime = require('../../utils/text.js');
// const app = getApp();
const config = new GlobalConfig();

config.init();

const device = wx.getSystemInfoSync()
const width = device.windowWidth
    // const height = device.windowHeight - 50
const height = device.windowHeight - 50;
const windowHeight = device.windowHeight - 50;
const app = getApp();
let id_flag = wx.getStorageSync('id_flag');
let user = wx.getStorageSync('user');
let avator = wx.getStorageSync('avator');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 状态栏高度
        statusHeight: app.globalData.statusHeight,
        // 设备高度
        height: app.globalData.height,
        // 设备宽度
        width: app.globalData.width,
        // 头像高度
        imgHeight: "",
        // 数据展示栏
        userInfo: '',
        // 小组件栏
        student_widgets: [
            { 'id': 0, 'icon': '/icon/course2.png', 'desc': '我的活动', 'url': '../mycourse/mycourse_stu' },
            { 'id': 1, 'icon': '/icon/ScheduleOutlined.png', 'desc': '活动行程', 'url': '../journey/journey' },
            { 'id': 2, 'icon': '/icon/time2.png', 'desc': '正在活动', 'url': '../doing/doing_stuprt' },
            { 'id': 3, 'icon': '/icon/todos.png', 'desc': '任务中心', 'url': '../task/task' },
            { 'id': 4, 'icon': '/icon/ceng2.png', 'desc': '我的报名', 'url': '../myApply/myApply' },
            // { 'id': 5, 'icon': '/icon/deal2.png', 'desc': '我的订单', 'url': '../myApply/myApply' },
            { 'id': 5, 'icon': '/icon/idnetify2.png', 'desc': '身份认证', 'url': '../register/register_stu' },
            // { 'id': 6, 'icon': '/icon/set2.png', 'desc': '个人信息', 'url': '../person_info/stu_info' }
        ],
        // 教师小组件栏
        teacher_widgets: [
            { 'id': 0, 'icon': '/icon/course2.png', 'desc': '将要进行', 'url': '../willDo/willDo' },
            { 'id': 1, 'icon': '/icon/ScheduleOutlined.png', 'desc': '活动行程', 'url': '../journey/journey' },
            { 'id': 2, 'icon': '/icon/time2.png', 'desc': '正在活动', 'url': '../doing/doing_tc' },
            { 'id': 3, 'icon': '/icon/ceng2.png', 'desc': '我的报名', 'url': '../teaApply/teaApply' },
            { 'id': 4, 'icon': '/icon/set2.png', 'desc': '个人信息', 'url': '../person_info/teacher_info' }
        ],
        // 父母小组件栏
        parent_widgets: [
            { 'id': 0, 'icon': '/icon/course2.png', 'desc': '孩子活动', 'url': '../mycourse/mycourse_stu' },
            { 'id': 1, 'icon': '/icon/ScheduleOutlined.png', 'desc': '活动行程', 'url': '../journey/journey' },
            { 'id': 2, 'icon': '/icon/time2.png', 'desc': '正在活动', 'url': '../doing/doing_parent' },
            { 'id': 3, 'icon': '/icon/ceng2.png', 'desc': '孩子报名', 'url': '../myApply/myApply' },
            { 'id': 4, 'icon': '/icon/set2.png', 'desc': '个人信息', 'url': '../person_info/parent_info' }

        ],
        // 以下服务端获取
        // 昵称
        nickName: '',
        // 性别
        sex: '',
        // 头像
        avator: avator,
        // 服务端获取用户关注/粉丝
        follow: '',
        fans: '',
        // 身份【学生/家长/导师】
        identity: '',
        id_flag: id_flag,
        user: user,
        header: "",
        modelName: '',
        header: "",
        // 是否显示头像剪裁框
        showCut: false,
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
    },
    newCut(src) {
        const { cropperOpt } = this.data;
        cropperOpt.boundStyle.color = config.getThemeColor();
        this.setData({ cropperOpt });
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
                console.log(path);
                that.setData({
                    avator: path,
                    showCut: false,
                });
                that.UpLoadImage();
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
    chooseImage: function(e) {
        console.log("上传实名头像");
        console.log(e);
        const that = this;
        if (!user) {
            wx.navigateTo({
                url: '../register/register_stu',
            })
        } else {
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
        }
    },
    //已登录直接跳到个人信息
    toInfo: function(e) {
        console.log(e)
        wx.navigateTo({
            url: e,

        })
    },

    // 学生小组件点击事件
    studentWidgetsTap: function(e) {
        user = wx.getStorageSync('user')
        var id = e.currentTarget.dataset.id;
        var student_widgets = this.data.student_widgets;
        var url = student_widgets[id]['url'];
        var desc = student_widgets[id]['desc'];
        console.log(desc + "组件触发跳转事件");
        console.log(url);
        if (user != null && user != '' && id == 5) {
            this.toInfo('../person_info/stu_info')
        } else {
            wx.navigateTo({
                url: url
            })
        }
    },
    // 教师小组件点击事件
    teacherWidgetsTap: function(e) {
        var id = e.currentTarget.dataset.id;
        var teacher_widgets = this.data.teacher_widgets;
        var url = teacher_widgets[id]['url'];
        var desc = teacher_widgets[id]['desc'];
        console.log(desc + "组件触发跳转事件");
        wx.navigateTo({
            url: url
        })
    },

    // 父母小组件点击事件
    parentWidgetsTap: function(e) {
        var id = e.currentTarget.dataset.id;
        var parent_widgets = this.data.parent_widgets;
        var url = parent_widgets[id]['url'];
        var desc = parent_widgets[id]['desc'];
        console.log(desc + "组件触发跳转事件");
        wx.navigateTo({
            url: url
        })
    },
    //登录
    toLogin: function(e) {
        wx.navigateTo({
            url: '../register/register_stu',
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
    //退出登录
    logout: function() {
        let that = this,
            user = wx.getStorageSync('user');
        wx.showModal({
            content: '是否退出登录',
            success(res) {
                if (res.cancel) {

                } else if (res.confirm) {
                    var modelName = '';
                    if (id_flag == 'student') {
                        modelName = "Userinfo";
                    } else if (id_flag == 'teacher') {
                        modelName = "Teacher";
                    } else if (id_flag == 'parent') {
                        modelName = "UserParent";
                    }
                    Unbound(user.id, modelName);
                    wx.setStorageSync('user', null);
                    wx.setStorageSync('id_flag', null);
                    wx.setStorageSync('avator', null);
                    app.globalData.flag_identity = [1, 0, 0];
                    that.setData({
                        user: '',
                    });
                    that.onShow();
                    wx.redirectTo({
                        url: '../person/person',
                    })
                }
            }
        })
    },

    //点击头像上传图片
    UpLoadImage: function() {
        let that = this;
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = that.data.avator;
        console.log("图片路径");
        console.log(tempFilePaths);
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
                // 图片新名称
                newName: newPicName,
                id: user.id,
                modelName: that.data.modelName,
                file_type: '',
            },
            success(res) {
                console.log("成功上传图片");
                console.log(res);
                if (res.statusCode == 200) {
                    wx.showToast({
                        title: "上传成功",
                        icon: 'success',
                        duration: 800,
                    });
                    const p = GetUserInfo2({
                        openid: user.openid,
                        id_flag: id_flag,
                    });
                    p.then(value => {
                        console.log("收到的数据是", value);
                        console.log(value.data.data)
                        wx.setStorageSync('user', value.data.data);
                        user = wx.getStorageSync('user');
                        that.setData({
                            user: user,
                            header: value.data.data.header
                        });
                    }, reason => {
                        wx.showToast({
                            title: "上传失败",
                            icon: 'success',
                            duration: 800,
                        });
                    });
                } else {
                    wx.showToast({
                        title: "上传失败",
                        icon: 'success',
                        duration: 800,
                    });
                }
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
        that.setData({
            user: user,
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.judgeIdentity();
        var height = this.data.width * 0.65 * 0.3;
        this.setData({
            imgHeight: height,
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
        this.judgeIdentity();
    },
    // 判断类型
    judgeIdentity: function() {
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        avator = wx.getStorageSync("avator");
        if (id_flag == 'parent') {
            this.setData({
                identity: '家长',
                modelName: 'UserParent',
            })
        } else if (id_flag == 'teacher') {
            this.setData({
                identity: '教师',
                modelName: 'Teacher',
            })
        } else {
            this.setData({
                identity: '学生',
                modelName: "Userinfo",
            })
        }
        this.setData({
            user: user,
            id_flag: id_flag,
            avator: avator,
        })
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