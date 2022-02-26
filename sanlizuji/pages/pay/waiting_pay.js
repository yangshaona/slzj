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
        // if (id_flag == "student") {
        //     // stu = user.name;
        //     this.setData({
        //         idx: 0,
        //         stu: user.name,
        //     });
        // }
        console.log(87);
        console.log(that.options);
        var id = e.currentTarget.dataset.id
        console.log("正在获取MD5和account");
        // if (that.data.idx != -1) {
        wx.request({
                url: app.globalData.url + "WxSign/tgPay",
                data: {
                    lowOrderId: that.options.orderid, //后台雪花算法生成的订单号
                    payMoney: 0.01, //支付金额
                    body: that.data.order.title, //商品描述
                    notifyUrl: app.globalData.url + "WxSign/AccepttgPay", //回调地址
                    isMinipg: 1, //是否是小程序
                    openId: that.data.userinfo.openid, //openId
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    console.log(res);
                    console.log(res.data.pay_info);
                    var pay_res = JSON.parse(res.data.pay_info);
                    wx.requestPayment({
                        timeStamp: pay_res.timeStamp.toString(),
                        nonceStr: pay_res.nonceStr,
                        package: pay_res.package,
                        signType: pay_res.signType,
                        paySign: pay_res.paySign,
                        success(res) {
                            console.log(res);
                            wx.request({                            
                                url:  app.globalData.url  +  "WxSign/orderFind",
                                data: {
                                    lowOrderId: that.options.orderid,
                                       //后台雪花算法生成的订单号
                                     status: "SUCCESS",
                                },
                                    method: 'GET',
                                    success: function(res) {  
                                    console.log("支付成功111");                              
                                    console.log(res);                                
                                    wx.showToast({
                                        title: '支付成功',
                                        icon: 'success',
                                        duration: 800,
                                    })                            
                                }                                                
                            })
                            wx.redirectTo({
                                url: '../myApply/myApply',
                            })
                        },
                        fail(res) {
                            console.log(res);
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none'
                            });
                            wx.navigateBack({
                                    delta: 2, // 回退前 delta(默认为1) 页面
                                    // success: function(res){
                                    //     // success
                                    // },
                                    // fail: function() {
                                    //     // fail
                                    // },
                                    // complete: function() {
                                    //     // complete
                                    // }
                                })
                                // wx.redirectTo({
                                //     url: '../myApply/myApply',
                                // })
                        },


                    })


                }
            })
            // } else {
            //     console.log('err');
            //     wx.showToast({
            //         title: '请选择学员',
            //         icon: 'error',
            //         duration: 800
            //     })
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

    }
})