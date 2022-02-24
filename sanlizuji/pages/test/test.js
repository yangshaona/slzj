Page({

    /**
     * 页面的初始数据
     */
    data: {
        hideShare: false
    },

    // 邀请模块遮罩层
    chooseShare: function() {

        var that = this;

        var hides = that.data.hideShare;

        if (hides == true) {
            that.setData({
                hideShare: false
            })
        } else if (hides == false) {
            that.setData({
                hideShare: true
            })
        }

    },
    submit: function() {
        let that = this;
        wx.request({
                url: 'http://tgyapi.yltg.com.cn/mock/35/tgPosp/services/payApi/wxJspay',
                data: {
                    account: "1",
                    payMoney: "1",
                    lowOrderId: "123",
                    body: "测试",
                    sign: "11",
                    notifyUrl: "1",
                    returnUrl: "1",
                    appId: "isMinipg",
                    openId: "oCjgJ5c3ENG7-66sqRv2UYZMozlo",
                    isMinipg: "1",
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    console.log("222");
                    console.log(res)
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })
            // wx.requestPluginPayment({
            //     version: 'develop',
            //     fee: 1,
            //     paymentArgs: {},
            //     currencyType: 'CNY',
            //     success(res) {
            //         console.log("成功")
            //         console.log(res)
            //     },
            //     fail(res) {
            //         console.log("失败");
            //         console.log(res)
            //     }

        // })
    }
})