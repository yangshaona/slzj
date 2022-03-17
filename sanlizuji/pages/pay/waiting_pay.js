// pages/pay/confirm.js
const app = getApp();
let user = wx.getStorageSync('user');
let id_flag = wx.getStorageSync('id_flag');
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
        stuinfo: user,
        // 设备信息
        screenHeight: '',
        //订单详情
        order: '',
        //用户信息
        userinfo: user,
        id_flag: id_flag,
        coupons: "",
        price: 0,
    },
    // 初始化学员选择器
    loadStu: function(e) {
        // 和后台拿东西setData
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        wx.request({
            url: app.globalData.url + 'WxUser/GetKidsList',
            data: {
                id: user.id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("孩子信息");
                console.log(res);
                if (res.data.data.length > 0) {
                    var kid = [];
                    for (var item of res.data.data) {
                        kid.push(item);
                        if (that.options.userid == item.id) {
                            that.setData({
                                stuinfo: item,
                                userinfo: item,
                            })
                            console.log("选中的孩子信息11111");
                            console.log(item);
                            console.log(that.data.stuinfo);
                        }
                    }
                    console.log(kid)
                    that.setData({
                        stu_arr: kid
                    })
                    console.log(that.data.stu_arr)
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

    // 学员选择器改变
    stuChange: function(e) {
        var stu_arr = this.data.stu_arr;
        // var stu = stu_arr[e.detail.value];
        var idx = e.detail.value;
        // if (id_flag == "student") {
        //     stu = user.name;
        //     idx = 0;
        // }
        this.setData({
            idx: idx,
            stu: stu_arr[e.detail.value]
        });
        console.log("学者的数据");
        console.log(this.data.stu)
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
        var that = this;
        console.log(that.options);
        var id = e.currentTarget.dataset.id;
        wx.redirectTo({
            url: './pay?orderid=' + that.options.orderid + '&price=' + that.data.order.price + "&key=" + that.data.coupons + "&coupons=" + that.data.price,

        })
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

        console.log("待付款订单");
        console.log(options);
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        if (id_flag == 'parent') {
            this.loadStu();
        }
        that.setData({
            userinfo: user,
            id_flag: id_flag
        })
        wx.request({
            url: app.globalData.url + 'WxCourse/GetDetail',
            data: {
                id: options.id,
                modelName: 'ClubNews',
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
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag')
        that.setData({
            userinfo: user,
            id_flag: id_flag
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

    },
    //   查找获取是否有优惠券
    getCoupons: function(e) {
        let that = this;

        wx.request({
            url: app.globalData.url + 'WxSign/CouponCheck',
            data: {
                key: that.data.coupons,
                courseid: that.options.id,
            },
            success(res) {
                console.log("优惠券信息");
                console.log(res);
                var data = ["未找到匹配优惠券", '优惠券已使用', '未到生效时间', '优惠券已过期', '非对应课程'];
                if (data.indexOf(res.data.data[0]) != -1) {
                    wx.showToast({
                        title: res.data.data[0],
                        icon: "none",
                        duration: 800,
                    })
                } else {
                    wx.showToast({
                        title: '已搜索到优惠券',
                        icon: "none",
                        duration: 800,
                    });
                    that.setData({
                        price: res.data.data.money,
                    });
                    console.log(that.data.price);
                }

            }
        })
    },
    // 输入优惠券码
    searchCoupons: function(e) {
        console.log(e)
        this.setData({
            coupons: e.detail.value,

        })

    },
})

// getCoupons(coupons,courseid) {
//     let that = this;

//     wx.request({
//         url: app.globalData.url + 'WxSign/CouponCheck',
//         data: {
//             key: coupons,
//             courseid: courseid,
//         },
//         success(res) {
//             console.log("优惠券信息");
//             console.log(res);
//             var data = ["未找到匹配优惠券", '优惠券已使用', '未到生效时间', '优惠券已过期', '非对应课程'];
//             if (data.indexOf(res.data.data[0]) != -1) {
//                 wx.showToast({
//                     title: res.data.data[0],
//                     icon: "none",
//                     duration: 800,
//                 })
//             } else {
//                 wx.showToast({
//                     title: '已搜索到优惠券',
//                     icon: "none",
//                     duration: 800,
//                 })
//             }

//         }
//     })
// }