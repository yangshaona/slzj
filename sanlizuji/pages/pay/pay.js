// pages/pay/pay.js
let app = getApp();
let user = wx.getStorageSync('user');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 下单时间
        dealTime: '2022-02-27 15:13',
        // 订单号
        dealId: '5AZ8Y13E4',
        // 订单信息-活动主题
        dealTtl: '华师一日游',
        // 报名学员
        student: '小飞侠',
        // 起止时间
        startD: '2022-02-28',
        endD: '2022-03-01',
        // 备注
        remark: '无',
        // 价格
        price: '999',
        // 活动课程
        order: '',
        price: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("确认支付11");
        console.log(options);
        this.setData({
            price: options.price,
        })
        this.getCourse(options.orderid);
        user = wx.getStorageSync('user');
    },
    // 获取课程接口
    getCourse: function(orderid) {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxSign/GetOrderDetail',
            data: {
                id: orderid,
                modelName: 'SignList',
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("订单详情11")
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

    // 支付接口
    Submit: function() {
        console.log("正在获取MD5和account");
        let that = this;
        wx.request({
            url: app.globalData.url + "WxSign/tgPay",
            data: {
                lowOrderId: that.data.order.id, //后台雪花算法生成的订单号
                payMoney: 0.01, //支付金额
                body: that.data.order.coursename, //商品描述
                notifyUrl: app.globalData.url + "WxSign/AccepttgPay", //回调地址
                isMinipg: 1, //是否是小程序
                openId: user.openid, //openId
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
                                console.log("支付成功");                              
                                console.log(res);                                
                                wx.showToast({
                                    title: '支付成功',
                                    icon: 'success',
                                    duration: 800,
                                })                            
                            }                                                
                        })


                        setTimeout(function() {
                            wx.redirectTo({
                                url: '../myApply/myApply',
                            })
                        }, 1000)
                    },
                    fail(res) {
                        console.log(res);
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 800,
                        });
                        wx.redirectTo({
                            url: './waiting_pay?id=' + that.data.order.courseid + "&orderid=" + that.options.orderid + '&userid=' + that.data.order.userid,

                        })
                    }
                })

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