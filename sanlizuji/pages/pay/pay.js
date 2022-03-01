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
        // 订单信息
        listData: [],
        // 剩余时间
        remain_time: 0,
        countDown: 0,
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
                });
                var listData = [];
                listData.push(that.data.order);
                that.setData({
                    listData: listData,
                })
                console.log("数据");
                console.log(listData);
                that.setCountDown();
                that.setTimeCount();
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
    setCountDown: function() {
        console.log("倒计时");
        let time = 1000,
            that = this;
        let listData = this.data.order;
        var now = new Date;
        var date = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
        that.setData({
            now: date
        })
        var registrationtime = new Date('2022-03-01 21:59:05');
        console.log(listData.registrationtime);
        var remain_time = registrationtime - now;
        console.log(remain_time)
        that.setData({
            remain_time: remain_time,
        })

        // if (remain_time != 0) {
        //     console.log("时间不为零");
        //     console.log(remain_time)
        // }

        let formatTime = this.getFormat(remain_time);
        remain_time -= time;
        var countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;
        // return v;

        this.setData({
            listData: listData,
            countDown: countDown,
        });
        var i = 1;
        if (remain_time > 0) {
            // console.log("时间为零");
            setTimeout(this.setCountDown, time);

        } else if (remain_time <= 0) {
            console.log("等于0");
            // if (i == 1) {
            wx.request({
                    url: app.globalData.url + 'WxSign/UpdateOneOrder',
                    data: {
                        id: listData.id,
                    },
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    // header: {}, // 设置请求的 header
                    success: function(res) {
                        // success
                        console.log("修改结果");
                        console.log(res);
                    },
                    fail: function() {
                        // fail
                    },
                    complete: function() {
                        // complete
                    }
                })
                //     i++;
                // }
        }
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
    }
})