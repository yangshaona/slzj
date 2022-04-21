// pages/index/index.js
import config from '../../config.js'
import { GetClubNews, Advertisement, CourseCheck } from '../../utils/apis.js'
var swiperIndex = 0;
var Urlsid = [1, 2, 3, 4];
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 状态栏高度
        statusHeight: getApp().globalData.statusHeight,
        // 设备高度
        height: getApp().globalData.height,
        index: 0, //当前轮播图
        indicatorDots: "true", //是否显示面板指示点
        autoplay: "true", //是否自动切换
        interval: "5000", //自动切换时间间隔
        duration: "1000", //滑动动画时长//uploads/temp/WxImg/turn_img1.jpg
        isHideLoadMore: true,
        activity: [{
                'PicUrl': '/icon/unload.png',
                'Name': ''
            },
            {
                'PicUrl': '/icon/unload.png',
                'Name': ''
            }
        ],
        history: [{
                'PicUrl': '/icon/unload.png',
                'Name': ''
            },
            {
                'PicUrl': '/icon/unload.png',
                'Name': ''
            }
        ],
        img: app.globalData.imgUrl + "turn_img1.jpg",
        imgUrl: [
            app.globalData.imgUrl + "turn_img1.jpg", app.globalData.imgUrl + "turn_img2.jpg",
            app.globalData.imgUrl + "turn_img3.jpg", app.globalData.imgUrl + "turn_img2.jpg",
        ], //imgUrl
        // 顶部导航栏
        //imgUrl为icon链接，text为导航文字,url为所在页面链接
        navigation: [
            { 'imgUrl': '/icon/activity.png', 'text': '亲子活动', 'url': '', 'class': 'selected' },
            { 'imgUrl': '/icon/bubble.png', 'text': '研学课程', 'url': '', 'class': 'select' },
            { 'imgUrl': '/icon/exp.png', 'text': '冬夏令营', 'url': '', 'class': 'select' },
            { 'imgUrl': '/icon/mind.png', 'text': '更多活动', 'url': '', 'class': 'select' }
        ],
        // 搜索框
        searchClass: "srcFold",
        inputClass: "inputFold",
        // 输入的搜索内容, 向服务端提交search内容=>在searchTap函数里的else{}内进行
        search: "",
        navigat_name: "",
        // 课程是否设置绑定得学校才可以访问
        showModal: false,
        pwd: "",
        courseid: "",
        isOnly: 0,
        id_flag: "",
    },

    //点击轮播图
    swiperClick: function(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?id=' + id,

        })
    },

    //轮播图轮播事件
    swiperChange: function(e) {
        console.log("点击")
        if (e.detail.sourse == "touch") {
            swiperIndex = e.detail.current;
            this.setData({
                index: e.detail.current
            })

        }

    },
    // 记录搜索
    writeData: function(e) {
        this.setData({
            search: e.detail.value
        })
    },
    // 点击弹出搜索框
    searchTap: function(e) {
        var src = this.data.searchClass;
        var input = this.data.search;
        if (src == "srcFold") {
            this.setData({
                searchClass: "srcExt",
                inputClass: "inputExt"
            })
            console.log("弹出搜索框");
        } else if (input == "" || input == null) {
            this.setData({
                searchClass: "srcFold",
                inputClass: "inputFold"
            })
            console.log("折叠搜索框")
        } else {
            // 有搜索内容,记录在this.data.search里
            console.log(input);
            console.log(this.data.search);
            // 向后台提交search结果在这里进行
        }
    },
    //跳转到课程详情
    goodsDetails: function(e) {
        var fid = e.currentTarget.dataset.id;
        var isOnly = e.currentTarget.dataset.isonly;
        if (isOnly && this.data.id_flag != 'teacher') {
            this.setData({
                isOnly: isOnly,
                courseid: fid,
                showModal: true,
            })
        } else {
            wx.navigateTo({
                url: '../detail/detail?id=' + fid,
            })
        }
    },
    // 课程密码校验
    // 点击确定按钮
    ok: function() {
        let that = this;
        if (that.data.pwd != '') {
            const p = CourseCheck({
                courseid: that.data.courseid,
                password: that.data.pwd,
            })
            p.then(value => {
                console.log("课程密码校验结果");
                console.log(value);
                if (value.data.data.msg == '密码正确') {
                    that.setData({
                        showModal: false,
                    })
                    wx.navigateTo({
                        url: '../detail/detail?id=' + that.data.courseid,
                    });

                } else {
                    wx.showToast({
                        title: '课程密码有误', //提示的内容,
                        duration: 800,
                    })
                }
            }, reason => {
                console.log("无法进入该课程", reason);
            });
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
        });
    },
    InputPwd: function(e) {
        console.log(e)
        this.setData({
            pwd: e.detail.value,
        });
    },
    //查看更多
    viewMore: function(e) {
        app.globalData.viewMore = this.data.navigat_name;
        console.log(app.globalData.viewMore);
        wx.switchTab({
            url: '../course/course',
        })
    },
    readData: function(e) {
        var that = this;
        if (e == '更多活动') {
            wx.switchTab({
                url: '../course/course',
            })
        } else {
            this.setData({
                navigat_name: e,
            })
            console.log(that.data.navigat_name);
            app.globalData.navigate_name = this.data.navigat_name;
            const p = GetClubNews({
                id: e,
            });
            p.then(value => {
                that.setData({
                    activity: value.data.data,
                    history: value.data.history,
                });
                console.log("课程数据");
                console.log(value);
            }, reason => {
                console.log("获取课程数据失败", reason);
            });
        }
    },
    reReadData: function(e) {
        console.log("111111")
        console.log(e.currentTarget.dataset.id);
        var text = e.currentTarget.dataset.id;
        // 样式改变
        var navigation = this.data.navigation;
        console.log(navigation)
        if (text != '更多活动') {
            for (var item in navigation) {
                console.log("item", navigation[item])
                if (navigation[item].text == text) {
                    navigation[item].class = 'selected';
                } else {
                    navigation[item].class = 'select';
                }
            }
            this.setData({
                navigation: navigation,
            })
        }
        this.readData(e.currentTarget.dataset.id);


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.globalData.navigate_name = "亲子活动"
        let user = wx.getStorageSync('user');
        this.readData("亲子活动");
        let that = this;
        const p = Advertisement({});
        p.then(value => {
            console.log("轮播图");
            console.log(value)
            var i = 0,
                img = [];
            for (var tmp of value.data.data) {
                i++;
                img.push(tmp)
            }
            console.log(img)
            that.setData({
                imgUrl: img
            })
        }, reason => {
            console.log("获取轮播图数据失败", reason);
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
        let id_flag = wx.getStorageSync('id_flag');
        this.setData({
            id_flag: id_flag,
        });
        this.readData(app.globalData.navigate_name);
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
        wx.showNavigationBarLoading(); //在标题栏中显示加载
        this.onLoad();
        setTimeout(function() {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1300);
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