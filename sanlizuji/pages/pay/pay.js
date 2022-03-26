// pages/pay/pay.js
let app = getApp();
let user = wx.getStorageSync('user');
import {
    UpdateOrder
} from '../../utils/text.js'
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
        // 活动课程
        order: '',
        price: '',

        // 倒计时
        startTime: '',
        endTime: '',
        time: '',

        // 订单信息
        listData: [],
        // 剩余时间
        remain_time: 0,
        countDown: 0,
        coupons: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取订单时间
        console.log("确认支付");
        console.log(options);
        this.setData({
            price: options.price,
            coupons: options.coupons,
        })
        this.getCourse(options.orderid);
        user = wx.getStorageSync('user');


    },
    // 获取报名的课程接口
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
                console.log("订单详情")
                console.log(res)
                that.setData({
                    order: res.data.data[0],
                });
                var listData = [];
                listData.push(that.data.order);
                that.setData({
                    listData: listData,
                })
                if (that.data.order.status == 2) {
                    // that.setCountDown();
                    // that.setTimeCount();
                    that.getTime();

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
    // 订单支付倒计时
    getTime: async function(e) {
        const that = this;
        // 页面跳转后立刻获取订单提交时间和截止时间
        that.setData({
            endTime: that.data.order.payendTime,
        })
        that.setTime();
    },

    setTime: async function(e, callback) {
        let listData = this.data.order;
        const that = this;
        // 计时结束回调函数
        if (typeof(callback) === 'function') {
            // 后台销毁订单
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
                    console.log("订单详情")
                    console.log(res)
                    that.setData({
                        order: res.data.data[0],
                    });
                    listData = that.data.order;
                    if (listData.isshow) {
                        console.log("计时结束时回调函数")

                        UpdateOrder(listData.id, '支付失败', 1);
                    }

                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })
            return -1;
        }
        // 每过1000ms计算一次

        let st = setInterval(async function() {
            let now = new Date();
            var date = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
            that.setData({
                now: date
            })
            var payendTime = new Date(listData.payendTime);
            let duration = payendTime - now;
            let formatTime = that.getFormat(duration);
            var countDown = `${formatTime.mm}:${formatTime.ss}`;
            if (duration <= 0) {
                // 倒计时结束，回调函数
                clearInterval(st);
                return await that.setTime(0, function() {
                    console.log('Time out!');
                })
            }
            that.setData({
                remain_time: duration,
                countDown: countDown,
            })
        }, 1000)
    },
    /**
     * 60s倒计时
     */
    setTimeCount: function() {
        let time = this.data.time
        time--;
        if (time <= 0) {
            time = 0;
        }
        this.setData({
            time: time
        })
        setTimeout(this.setTimeCount, 1000);
    },


    /**
     * 倒计时
     */
    setCountDown: async function(e, callback) {
        let time = 1000,
            that = this;
        let listData = that.data.order;
        // 计时结束回调函数
        if (typeof(callback) === 'function') {
            // 后台销毁订单
            console.log("计时结束");
            wx.showToast({
                title: "时间到",
                duration: 1000,
            })
            UpdateOrder(listData.id, '支付失败', 1);

            return -1;
        }

        let st = setInterval(async function() {
            var now = new Date;
            var date = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
            that.setData({
                now: date
            })
            var payendTime = new Date(listData.payendTime);
            let duration = payendTime - now;
            let formatTime = that.getFormat(duration);
            var countDown = `${formatTime.mm}:${formatTime.ss}`;
            if (duration <= 0) {
                // 倒计时结束，回调函数
                wx.showToast({
                    title: "超时",
                    duration: 1000,
                })
                clearInterval(st);
                return await that.setCountDown(0, function() {
                    console.log('Time out!');
                })
            }
            that.setData({
                remain_time: duration,
                countDown: countDown,
            })
        }, 1000)

    },

    /**
     * 格式化时间
     */
    getFormat: function(msec) {
        let ss = parseInt(msec / 1000);
        let ms = parseInt(msec % 1000);
        let mm = 0;
        let hh = 0;
        if (ss > 60) {
            mm = parseInt(ss / 60);
            ss = parseInt(ss % 60);
            if (mm > 60) {
                hh = parseInt(mm / 60);
                mm = parseInt(mm % 60);
            }
        }
        ss = ss > 9 ? ss : `0${ss}`;
        mm = mm > 9 ? mm : `0${mm}`;
        hh = hh > 9 ? hh : `0${hh}`;
        return { ss, mm, hh };
    },
    // 支付接口
    Submit: function() {
        console.log("正在获取MD5和account");
        let that = this;
        console.log(that.data.order)
        let price = that.data.price;
        if (that.options.key != "") {
            price = (that.data.price - that.options.coupons).toFixed(2);
        }
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
                                key: that.options.key,
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
    // 取消订单
    Cancel: function(e) {
        let that = this;
        console.log(e);
        var orderid = e.currentTarget.dataset.orderid;
        UpdateOrder(orderid, '支付失败', 1);
        that.getCourse(orderid);
        setTimeout(function() {
            wx.redirectTo({
                url: '../myApply/myApply',
            })
        }, 1000)
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

    },


})