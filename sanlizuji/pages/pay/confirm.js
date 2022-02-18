// pages/pay/confirm.js
const app = getApp();
let user = wx.getStorageSync('user');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 标题
        title: '小葵花课堂',
        // 起始日期
        date: '2022-03-01至2022-03-07',
        // 价格
        price: '998',
        // 学员选择器，需要后端初始化
        stu_arr: [],
        idx: -1,
        // 用户选择的学员
        stu: '',

        // 设备信息
        screenHeight: '',
        //订单详情
        order: '',
        //用户信息
        userinfo: user,
    },
    // 初始化学员选择器
    loadStu: function(e) {
        // 和后台拿东西setData
        var stu = ['小飞侠'];
        this.setData({
            stu_arr: stu
        })
    },

    // 学员选择器改变
    stuChange: function(e) {
        var stu_arr = this.data.stu_arr;
        this.setData({
            idx: e.detail.value,
            userinfo: user
        })
    },
    //跳转进入购买须知
    toBuyInfo: function(e) {
        console.log("跳转到购买须知")
        console.log(e)
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/detail?id=' + id,

        })
    },
    // 点击确认订单先浅检查一下有没有填学员
    checkSubmit: function(e) {
        // if (this.data.idx != -1) {
        console.log('successfully');
        wx.showToast({
                title: "报名成功",
                icon: "success",
                duration: 800
            })
            // var price = this.data.price;
            // var stu = this.data.stu;
            // } else {
            // console.log('err');
            // wx.showToast({
            //     title: '请选择学员',
            //     icon: 'error',
            //     duration: 800
            // })
            // }
    },

    // 获取设备信息
    getSysInfo: function(e) {
        wx.getSystemInfo({
            success: (result) => {
                this.setData({
                    screenHeight: (result.screenHeight - result.statusBarHeight)
                })
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // this.getSysInfo();
        this.loadStu();
        console.log("确认订单");
        console.log(options);
        let that = this;
        user = wx.getStorageSync('user');
        that.setData({
            userinfo: user
        })
        wx.request({
            url: app.globalData.url + 'WxCourse/GetDetail',
            data: {
                id: options.id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("订单详情")
                console.log(res)
                console.log(res.data.data[0])
                that.setData({
                    order: res.data.data[0],
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        user = wx.getStorageSync('user');
        this.setData({
            userinfo: user
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