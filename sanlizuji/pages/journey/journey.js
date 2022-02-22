// pages/journey/journey.js
const app = getApp();
let user = wx.getStorageSync('user');
let id_flag = wx.getStorageSync('id_flag');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //活动
        activity: {},
        //行程
        journey: {},
        // 状态栏高度
        statusHeight: getApp().globalData.statusHeight,
        // 屏幕高度
        height: getApp().globalData.height,
        // 活动缩略图
        actImg: 'https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg',
        // 活动名称
        actName: '勇士 VS 湖人',
        // 起止日期
        start: '2022-01-21',
        end: '2022-02-22',
        // 活动
        journey: [],
        user: user,
        id_flag: id_flag
    },

    //登录查看更多
    _goLogin: function() {
        wx.navigateTo({
            url: '../register/register_stu',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        user = wx.getStorageSync('user')
        id_flag = wx.getStorageSync('id_flag');
        that.setData({
            id_flag: id_flag,
            user: user
        })
        var modelName = "";
        var activity = [],
            journey = [];
        if (id_flag == 'student' || id_flag == 'teacher') {
            if (id_flag == 'student') {
                modelName = "SignList";
            } else if (id_flag == 'teacher') {
                modelName = "teaSignList"
            }
            console.log(modelName)
            wx.request({
                url: app.globalData.url + 'WxSign/DailyDetail&modelName=' + modelName,
                data: {
                    userid: user.id,
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    console.log("当前活动行程")
                    console.log(res)
                    var journey = [];
                    if (res.data.data[0] == "无正在进行的活动行程" || res.data.data.length == 0) {
                        that.setData({
                            journey: "无正在进行的活动行程"
                        })
                    } else {
                        journey.push(res.data.data)
                        that.setData({
                            journey: journey
                        })

                        console.log(that.data.activity)
                        console.log(journey)

                    }
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            });
        } else if (id_flag == "parent") {
            wx.request({
                url: app.globalData.url + 'WxSign/GetKidsDailyDetail',
                data: {
                    modelName: "SignList",
                    pid: user.id,
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    console.log("成功获取孩子当前活动信息");
                    console.log(res)
                    if (res.data.data.data.length == 0 || res.data.data.data[0].data.length == 0) {
                        that.setData({
                            journey: "无正在进行的活动行程",
                        })
                    } else {
                        for (var i of res.data.data.data[0].data) {
                            journey.push(i);
                        }
                        that.setData({
                            journey: journey,
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
        }
    },
    //跳转到课程详情
    toCourseDetail: function(e) {
        console.log("跳转到课程详情")
        console.log(e)
        var fid = e.currentTarget.dataset.fid
        wx.navigateTo({
            url: '../detail/detail?id=' + fid,
        })
    },
    // 监护人绑定孩子已经孩子绑定监护人
    _goBound: function() {
        id_flag = wx.getStorageSync('id_flag');
        wx.navigateTo({
            url: '../person_info/parent_info',
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
        id_flag = wx.getStorageSync('id_flag');
        this.setData({
            id_flag: id_flag,
            user: user
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
        wx.navigateBack({
            delta: 0,
        })
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