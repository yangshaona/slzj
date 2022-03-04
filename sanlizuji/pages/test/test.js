const locationUtils = require('../../utils/text.js') // 引入工具类

Page({
    data: {
        timer: 0,
    },
    /**
     * 未支付订单倒计时
     */
    countDown: function() {
        var that = this;
        that.data.timer = setInterval(function() {
            var orders = that.data.orderArray;
            for (var i = 0; i < orders.length; i++) {
                var status = orders[i].status;
                if (status == 0) {
                    var create_time = orders[i].create_time;
                    //计算剩余时间差值
                    var leftTime = (new Date(create_time).getTime() + 30 * 60 * 1000) - (new Date().getTime());
                    if (leftTime > 0) {
                        //计算剩余的分钟
                        var minutes = util.formatNumber(parseInt(leftTime / 1000 / 60 % 60, 10));
                        //计算剩余的秒数
                        var seconds = util.formatNumber(parseInt(leftTime / 1000 % 60, 10));
                        var left_time = minutes + ":" + seconds;
                        orders[i].left_time = left_time;
                    } else {
                        //移除超时未支付的订单
                        orders.splice(i, 1);
                    }
                }
            }
            that.setData({
                orderArray: orders
            });
        }, 1000);
    },
    onLoad: function(options) {
        // 生命周期函数--监听页面加载
        // this.authorization()
    },
    onReady: function() {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function() {
        // 生命周期函数--监听页面显示
        this.authorization();
    },
    onHide: function() {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function() {
        // 生命周期函数--监听页面卸载
        clearInterval(this.data.timer);
    },
    onPullDownRefresh: function() {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数

    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    },
    getLocation: function() {
        this.authorization();
    },
    //这个函数是一开始点击事件触发的：
    async authorization() {
        let self = this
        try {
            await this.getWxLocation() //等待
        } catch (error) {
            wx.showModal({
                title: '温馨提示',
                tip: '获取权限失败，需要获取您的地理位置才能为您提供更好的服务！是否授权获取地理位置？',
                showCancel: true,
                confirmText: '前往设置',
                cancelText: '取消',
                sureCall() {
                    self.toSetting()
                },
                cancelCall() {}
            })
            return
        }
    },

    getWxLocation() {
        wx.showLoading({
            title: '定位中...',
            mask: true,
        })
        return new Promise((resolve, reject) => {
            let _locationChangeFn = (res) => {
                console.log('location change', res)
                wx.hideLoading();
                wx.offLocationChange(_locationChangeFn)
            }
            wx.startLocationUpdate({
                success: (res) => {
                    console.log(res);
                    wx.onLocationChange(_locationChangeFn);
                    resolve();

                },
                fail: (err) => {
                    console.log('获取当前位置失败', err)
                    wx.hideLoading()
                    reject()
                }
            })
        })
    },
    toSetting() {
        let self = this
        console.log('11111111')
        wx.openSetting({
            success(res) {
                console.log(res)
                if (res.authSetting["scope.userLocation"]) {
                    // res.authSetting["scope.userLocation"]为trueb表示用户已同意获得定位信息，此时调用getlocation可以拿到信息
                    self.authorization()
                }
            }
        })
    },
    // 获取当前位置
    // getLocation: function() {
    //     let self = this;
    //     wx.openSetting({
    //         success(res) {
    //             console.log(res)
    //             if (res.authSetting["scope.userLocation"]) {
    //                     // res.authSetting["scope.userLocation"]为true表示用户已同意获得定位信息，此时调用getlocation可以拿到信息
    //                 self.authorization()
    //             }
    //         }
    //     })
    // },
    // async authorization() {
    //     let that = this;
    //     console.log("开启定位")
    //     wx.startLocationUpdate({
    //         success(res) {
    //             console.log('开启定位', res)
    //             wx.onLocationChange(function(res) {
    //                 console.log('location change', res)
    //             });
    //         },
    //         fail(res) {
    //             console.log('开启定位失败', res);
    //             that.toSetting();
    //         }
    //     })
    //     wx.stopLocationUpdate({
    //         success: (res) => {
    //             console.log("停止追踪", res);
    //             wx.offLocationChange(function(res) {
    //                 console.log('offlocation change', res)
    //             })
    //         },
    //         fail: (err) => {
    //             console.log(err);
    //         },
    //     });
    // 
    // 
    // }



})