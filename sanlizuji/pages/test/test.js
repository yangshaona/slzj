// // // socket连接
// const webSocket = require('../../utils/webSocket.js');
// Page({
//     data: {},
//     onLoad: function(options) {
//         let type = "getgps";
//         // 创建连接
//         webSocket.connectSocket(type);

//         // 设置接收消息回调
//         webSocket.onSocketMessageCallback = this.onSocketMessageCallback;
//     },
//     savePicture1: function() {
//         var data = {
//             "type": "getgps",
//             // 'type': "gpsupdate",
//             // "orderid": "332537536784443392",
//             // "Usertype": 'student',
//             // "longitude": '113.4',
//             // 'latitude': '23',
//         };

//         var time = setTimeout(() => {
//             webSocket.sendSocketMessage(data);
//         }, 5000);
//         // console.log("time", time);
//     },
//     // socket收到的信息回调
//     onSocketMessageCallback: function(msg) {
//         // console.log('收到消息回调', msg)
//     },

//     onUnload: function(options) {
//         // 页面销毁时关闭连接
//         webSocket.closeSocket();
//     },
// })


Page({

    /**
     * 页面的初始数据
     */
    data: {
        num: 1
    },
    // + - 购买数量
    setValue: function(e) {
        this.setData({
            num: e.detail.value
        });
        console.log(this.data.num);
    },
    add: function(e) {
        var num, that = this;
        this.data.num++;
        num = that.data.num;
        that.setData({
            num: num
        })
    },
    reduce: function(e) {
        var num, that = this;
        if (this.data.num <= 1) {
            wx.showToast({
                title: '数量不能为0哦！',
                icon: "none",
                duration: 500
            })
        } else {
            this.data.num--;
            num = this.data.num;
            that.setData({
                num: num
            })
        }
        console.log(num)
    }

})