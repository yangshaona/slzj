//app.js
import config from 'config.js';
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
            // wx.login({
            //     success: function() {
            //         wx.getUserInfo({
            //             success: function(res) {
            //                 that.globalData.userInfo = res.userInfo;
            //                 console.log("app.js登录")
            //                 console.log(res)
            //             }
            //         });
            //     }
            // });
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
        // imgUrl: 'https://shenhailao.com/hsreport/uploads/temp/WxImg/',
        imgUrl: 'https://sanli-tracks.com/sanli/uploads/temp/WxImg/',
        // imgUrl: 'http://localhost/gitSanli/sanli/uploads/temp/WxImg/',
        okayapiHost: "http://test_phalapi.com", // TODO: 配置成你所在的接口域名
        okayApiAppKey: "appkey", // TODO：改为你的APP_KEY 在http://open.yesapi.cn/?r=App/Mine寻找
        okayApiAppSecrect: "appsecret" // TODO：改为你的APP_SECRECT
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
        wx.request({
            url: that.globalData.url + 'WxSign/TeaNowCourse&id=' + user.id,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("导师获取正在活动数据")
                console.log(res)
                console.log(res.data.data[0])
                if (res.data.data[0] != "无正在进行的课程") {
                    id = res.data.data[0].courseid;
                    that.GetLocation(id);
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
    //学生获取正在活动的数据
    ActiveStuDetail: function() {
        let user = wx.getStorageSync('user')
        var that = this
        var id = "",
            courseid = 1;
        wx.request({
            url: that.globalData.url + 'WxSign/ActiveStuDetail',
            data: {
                id: user.id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("学生获取正在活动数据");
                console.log(res)
                console.log(res.data.data[0])
                if (res.data.data[0] == "无正在进行的课程") {

                } else {
                    courseid = res.data.data[0].courseid;
                    wx.request({
                        url: that.globalData.url + 'WxOther/GpsAccept',
                        data: {
                            courseid: res.data.data[0].courseid,
                            teacherid: res.data.data[0].teacherid,
                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        // header: {}, // 设置请求的 header
                        success: function(res) {
                            // success
                            console.log("学生接收的请求是")
                            console.log(res)
                            if (res.data.data.code == 1) {
                                that.GetLocation(courseid);
                            }
                        },
                        fail: function() {
                            // fail
                        },
                        complete: function() {
                            // complete
                        }
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
    onShow: function() {
        let id_flag = wx.getStorageSync("id_flag");
        let user = wx.getStorageSync('user')
        console.log(id_flag)
        console.log(user);
        var that = this;
        that.globalData.realTime = setInterval(function() {
                // 请求服务器数据
                if (id_flag == "teacher") {
                    that.TeaNowCourse()

                }
                if (id_flag == 'student') {
                    that.ActiveStuDetail();
                }

            }, 30000) //间隔时间

        // 更新数据
        that.globalData.realTime = that.globalData.realTime; //实时数据对象(用于关闭实时刷新方法)


    },
    //上传学生定位
    UpStuLocation: function(courseid, latitude, longitude) {
        let user = wx.getStorageSync('user');
        let that = this;
        wx.request({
            url: that.globalData.url + 'WxOther/UpGps',
            data: {
                userid: user.id,
                courseid: courseid,
                longitude: longitude,
                latitude: latitude,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("成功上传学生位置");
                console.log(res)
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    //上传导师定位
    UpTeaLocation: function(id, latitude, longitude) {
        let id_flag = wx.getStorageSync("id_flag");
        let user = wx.getStorageSync('user')
        wx.request({
            url: this.globalData.url + 'WxOther/TeaUpGps',
            data: {
                userid: user.id,
                courseid: id,
                longitude: longitude,
                latitude: latitude,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("成功上传位置信息")
                console.log(res)
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    // 获取定位
    GetLocation: function(id) {

        let id_flag = wx.getStorageSync("id_flag");
        let user = wx.getStorageSync('user')
        wx.getLocation({
            type: "gcj02",
            altitude: 'false',
            isHighAccuracy: 'true',
            highAccuracyExpireTime: '3500',
            success: (res) => {
                this.globalData.latitude = res.latitude;
                this.globalData.longtitude = res.longitude;
                console.log(res.latitude);
                console.log(res.longitude)
                if (id_flag == 'teacher') { this.UpTeaLocation(id, this.globalData.latitude, this.globalData.longtitude) }
                if (id_flag == 'student') { this.UpStuLocation(id, this.globalData.latitude, this.globalData.longtitude) }

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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        /**
         * 当页面隐藏时关闭定时器(关闭实时刷新)
         * 切换到其他页面了
         */
        clearInterval(this.globalData.realTime)
    },
})