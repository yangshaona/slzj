// const app = getApp();
// const util = require('../../utils/text.js'); //路径根据自己的文件目录来
// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {
//         isTipTrue: true,
//         idnum: "",
//     },

//     onLoad: function(e) {
//         var that = this;
//         // time = e.formatTime(new Date());
//         // console.log("打开小程序的时间是：")
//         // that.setData({
//         //     isTipTrue: true
//         // })
//     },
//     tipAgree: function() {
//         this.setData({
//             isTipTrue: false
//         })
//     },
//     InputIdNum: function(e) {
//         this.setData({
//             idnum: e.detail.value
//         })
//         console.log("输入的值是：", e);
//         console.log(this.data.idnum)
//     },
//     SaveIdNum: function() {
//         if (!util.checkIdCard(this.data.idnum)) {
//             wx.showToast({
//                 title: '请输入正确的身份证号',
//                 icon: 'none'
//             })
//         } else {
//             wx.showToast({
//                 title: '通过了',
//             })
//         }


//     },
//     name: function(e) {
//         var ts = this;
//         var name = e.detail.value
//         var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/;

//         if (name.match(reg)) { console.log("111");
//             ts.setData({ allow_name: true });
//             wx.setStorageSync("name", name) }
//         console.log(name)
//     },

// })

// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {
//         // 倒计时
//         targetTime: 0,
//         clearTimer: false
//     },

//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function(options) {
//         this.setData({
//             targetTime: new Date().getTime() + 10 * 60000
//         });
//     },

//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady: function() {

//     },

//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow: function() {

//     },

//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide: function() {

//     },

//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload: function() {
//         this.setData({
//             clearTimer: true
//         });
//     },

//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh: function() {

//     },

//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom: function() {

//     },

//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage: function() {

//     },
//     /**
//      * 定时器回调
//      */
//     countDownCallbackFn() {
//         console.log("结束回调")
//     }
// })

// Page({
//     /**
//      * 页面的初始数据
//      */
//     data: {
//         pingData: [{
//                 "id": "1",
//                 "icon": "../../images/image2.jpg",
//                 "number": "20",
//                 "pingTime": "2019-3-28 23:30:00",
//                 "time": "55267",
//                 "showList": "false",
//             },
//             {
//                 "id": "2",
//                 "icon": "../../images/image3.jpg",
//                 "number": "4566",
//                 "pingTime": "2019-3-28 12:30:00",
//                 "time": "58934",
//                 "showList": "false",
//             },
//             {
//                 "id": "3",
//                 "icon": "../../images/image2.jpg",
//                 "number": "20",
//                 "pingTime": "2019-3-28 08:30:00",
//                 "time": "555234",
//                 "showList": "false",
//             }
//         ],
//         time: "60"
//     },
//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function(options) {
//         var that = this
//         that.setData({
//             listData: that.data.pingData
//         })
//         that.setCountDown();
//         that.setTimeCount();
//     },
//     /**
//      * 60s倒计时
//      */
//     setTimeCount: function() {
//         let time = this.data.time
//         time--;
//         if (time <= 0) {
//             time = 0;
//         }
//         this.setData({
//             time: time
//         })
//         setTimeout(this.setTimeCount, 1000);
//     },
//     /**
//      * 倒计时
//      */
//     setCountDown: function() {
//         let time = 1000;
//         let { listData } = this.data;
//         let list = listData.map((v, i) => {
//             if (v.time <= 0) {
//                 v.time = 0;
//             }
//             let formatTime = this.getFormat(v.time);
//             v.time -= time;
//             v.countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;
//             return v;
//         })
//         this.setData({
//             listData: list
//         });
//         setTimeout(this.setCountDown, time);
//     },
//     /**
//      * 格式化时间
//      */
//     getFormat: function(msec) {
//         let ss = parseInt(msec / 1000);
//         let ms = parseInt(msec % 1000);
//         let mm = 0;
//         let hh = 0;
//         if (ss > 60) {
//             mm = parseInt(ss / 60);
//             ss = parseInt(ss % 60);
//             if (mm > 60) {
//                 hh = parseInt(mm / 60);
//                 mm = parseInt(mm % 60);
//             }
//         }
//         ss = ss > 9 ? ss : `0${ss}`;
//         mm = mm > 9 ? mm : `0${mm}`;
//         hh = hh > 9 ? hh : `0${hh}`;
//         return { ss, mm, hh };
//     }
// })
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

    },
    onReady: function() {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function() {
        // 生命周期函数--监听页面显示

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
    }
})