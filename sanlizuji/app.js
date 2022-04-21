//app.js
import config from 'config.js';
const webSocket = require('./utils/webSocket.js');
import { isShow, TeaUpGps, UpGps, GpsAccept, ActiveStuDetail, TeaNowCourse } from './utils/apis.js';
App({
    onLaunch: function() {
        var that = this;
        // Do something initial when launch.
        //调用登录接口
        "pages/index/index", {
            "pagePath": "pages/register_stu/register_stu",
            "text": "注册",
            "iconPath": "img/shop.png",
            "selectedIconPath": "img/shop2.png"
        }
        // return;

        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        //this.getSystemInfo();
        //  return ;
        wx.getSystemInfo({
            success: (result) => {
                this.globalData.statusHeight = result.statusBarHeight;
                this.globalData.height = result.screenHeight;
                this.globalData.canHeight = result.windowHeight;
                this.globalData.width = result.screenWidth;
            },
        })

    },

    //获取用户信息
    getUserInfo: function() {
        var that = this;
        var user_info = wx.getStorageSync('user_info');
        if (!user_info) {
            that.show_page('/pages/login/login');
        } else
            that.globalData.userInfo = user_info;
        //  return user_info;
    },
    //获取设备信息
    getSystemInfo: function() {
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        if (this.globalData.systemInfo) {
            return this.globalData.systemInfo;
        } else {
            wx.getSystemInfo({
                success: (res) => {

                    this.globalData.systemInfo = res;
                    let statusBarHeight = res.statusBarHeight,
                        navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
                        navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
                    this.globalData.navHeight = navHeight;
                    this.globalData.navTop = navTop;
                    this.globalData.windowHeight = res.windowHeight;
                    return this.globalData.systemInfo;
                    // typeof cb == "function" && cb(_this.globalData.systemInfo);
                }
            })
        }
    },


    set_address: function(paddress) {
        this.globalData.indexProvince = paddress.indexProvince;
        this.globalData.indexCity = paddress.indexCity;
        this.globalData.indexDistrict = paddress.indexDistrict;
        this.globalData.province = paddress.province;
        this.globalData.dity = paddress.dity;
        this.globalData.district = paddress.district;
        this.globalData.detailedInfo = paddress.detailedInfo;
    },

    globalData: {
        userInfo: null,
        indexProvince: 0,
        indexCity: 0,
        indexDistrict: 0,
        province: '',
        dity: '',
        district: '',
        detailedInfo: '',
        userOpenId: 'undefined',
        addressList: [],
        userId: 0,
        showp: 0,
        login: 141, //登录的用户的id
        loginr1: 0,
        loginr2: 0,
        viewMore: '',
        otherAddressInfo: null,
        isCompleteInfo: 0, //是否完成报名a
        isTimeEnd: "0", //计时结束
        url: config.url, //控制器路径
        openid: "",
        // 状态栏高度
        statusHeight: "",
        // 设备高度
        height: "",
        // 可使用高度
        canHeight: "",
        // 设备宽度
        width: "",
        //记录账号是学生还是教师还是家长，默认是学生
        flag_identity: [1, 0, 0],
        navigate_name: "",
        //经纬度
        latitude: "",
        longtitude: "",
        realTime: null, //实时数据对象(用于关闭实时刷新方法)
        imgUrl: 'https://sanli-tracks.com/sanlia/uploads/temp/WxImg/',
        // okayapiHost: "http://test_phalapi.com", // TODO: 配置成你所在的接口域名
        okayApiAppKey: "appkey", // TODO：改为你的APP_KEY 在http://open.yesapi.cn/?r=App/Mine寻找
        okayApiAppSecrect: "appsecret", // TODO：改为你的APP_SECRECT
        is_show: 0, //是否显示注册按钮
        socketTask: '',
        // 正在活动的orderid
        orderid: "",
        imgPrefix: 'https://sanli-tracks.com/sanlia/uploads/temp/',
    },

    show_msg: function(msg) {
        wx.showToast({ title: msg, duration: 2000, });
    },
    show_error: function() {
        $this.show_msg('网络异常！');
    },

    show_page: function(myurl) {
        wx.navigateTo({
            url: myurl,
            success: function(res) {},
            fail: function(res) {
                if (res.errMsg && (res.errMsg == 'navigateTo:fail can not navigateTo a tabbar page' || res.errMsg == 'navigateTo:fail can not navigate to a tabbar page')) {

                    wx.switchTab({ url: myurl, })
                }
            },
            complete: function(res) {
                // console.log('res', res)
            },
        })
    },

    checkUserInfo: function() {
        var that = this;
        var s1 = "";
        s1 = s1 + '&nickName=' + this.globalData.userInfo.nickName;
        s1 = s1 + '&avatarUrl=' + this.globalData.userInfo.avatarUrl;
        wx.request({
            url: this.globalData.url + 'CheckUser' + s1,
            method: 'POST',
            data: { formData: 0 }, //,formId:formId,openId:app.globalData.openId
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                var responseData = res.data.code;
                s1 = '/pages/ulogin/login';
                if (responseData) { //意见备案，
                    that.globalData.userId = res.data.userId;
                    s1 = '/pages/index/index';
                }
                that.show_page(s1);
            },
            fail: function(res) {
                that.show_page('/pages/ulogin/login');
            },
        });
    },
    //导师获取正在活动的数据
    //获取学生信息
    TeaNowCourse: function() {
        var that = this
        let user = wx.getStorageSync('user');
        var id = "";
        TeaNowCourse({
            id: user.id,
        }).then(value => {
            console.log("导师获取正在活动数据", value);
            if (value.data.data[0] != "无正在进行的课程") {
                id = value.data.data[0].id;
                wx.setStorageSync('orderid', value.data.tea_doing[0].id);
                that.GetLocation(value.data.tea_doing[0].id);
            }
        })
    },
    //学生获取正在活动的数据
    ActiveStuDetail: function() {
        let user = wx.getStorageSync('user')
        var that = this,
            courseid = '';
        ActiveStuDetail({
            id: user.id,
        }).then(value => {
            console.log("学生获取正在活动数据", value.data.data[0]);
            if (value.data.data[0] == "无正在进行的课程") {

            } else {
                that.globalData.orderid = value.data.data[0].id;
                courseid = value.data.data[0].courseid;
                wx.setStorageSync('orderid', that.globalData.orderid);
                console.log("课程id：", value.data.data[0].courseid);
                console.log("教师id：", value.data.data[0].teacherid);
                that.globalData.realTime = setInterval(function() {
                    GpsAccept({
                        courseid: value.data.data[0].courseid,
                        teacherid: value.data.data[0].teacherid,
                    }).then(value => {
                        console.log("学生接收的请求是", value);
                        if (value.data.data.code == 1) {
                            that.GetLocation(courseid);
                        }
                    }, reason => {
                        console.log("学生无法接收到导师获取其位置的请求信息", reason);
                    })
                }, 300000)
            }
        }, reason => {
            console.log("获取学生获取正在活动数据失败", reason);
        });
    },

    //上传学生定位
    UpStuLocation: function(courseid, latitude, longitude) {
        let user = wx.getStorageSync('user');
        let that = this;
        UpGps({
            userid: user.id,
            courseid: courseid,
            longitude: longitude,
            latitude: latitude,
        }).then(value => {
            console.log("成功上传学生位置");
            console.log(value)
        }, reason => {
            console.log("上传位置失败", reason);
        })

    },
    //上传导师定位
    UpTeaLocation: function(courseid, latitude, longitude) {
        let id_flag = wx.getStorageSync("id_flag");
        let user = wx.getStorageSync('user')
        TeaUpGps({
            userid: user.id,
            orderid: courseid,
            longitude: longitude,
            latitude: latitude,
        }).then(value => {
            console.log("成功上传导师位置信息")
            console.log(value)
        }, reason => {
            console.log("上传导师位置信息失败")
            console.log(reason);
        });
    },
    // 获取定位
    GetLocation: function(courseid) {

        let id_flag = wx.getStorageSync("id_flag");
        let user = wx.getStorageSync('user')
        wx.getLocation({
            type: "gcj02",
            altitude: 'true',
            isHighAccuracy: 'true',
            highAccuracyExpireTime: '3500',
            success: (res) => {
                this.globalData.latitude = res.latitude;
                this.globalData.longtitude = res.longitude;
                console.log("导师或学生上传位置")
                console.log(res.latitude);
                console.log(res.longitude)
                if (id_flag == 'teacher') { this.UpTeaLocation(courseid, this.globalData.latitude, this.globalData.longtitude) }
                if (id_flag == 'student') { this.UpStuLocation(courseid, this.globalData.latitude, this.globalData.longtitude) }

            },
            fail: (res) => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'error',
                    duration: 800
                })
                console.log(res);
            }
        })
    },

    onShow: function() {
        console.log("进入小程序onShow()")
        let id_flag = wx.getStorageSync("id_flag");
        let user = wx.getStorageSync('user')
        console.log(id_flag)
        console.log(user);
        var that = this;

        if (user != null && user != '') {
            // that.globalData.realTime = setInterval(function() {
            // 请求服务器数据
            if (id_flag == "teacher") {
                that.TeaNowCourse()
            }
            if (id_flag == 'student') {
                that.ActiveStuDetail();
            }
            // webSocket.connectSocket();

        }
        const p = isShow({});
        p.then(value => {
            console.log("收到的数据是", value);
            that.globalData.is_show = value.data.data.code;
            console.log(that.globalData.is_show);
        }, reason => {
            console.log("无法获取到数据", reason);
        })
    },

    onLoad: function(options) {
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(function() {
            // 新版本下载失败
        })

    },
    onHide: function() {
        console.log("onHide");

        // var data = { "type": "out" }
        // webSocket.sendSocketMessage(data);
    },
    onUnload: function(options) {
        // 页面销毁时关闭连接
        // console.log("onUnload")
        // var data = { "type": "out" }
        // webSocket.sendSocketMessage(data);
        // setTimeout(() => webSocket.closeSocket(), 10000);
    },
})