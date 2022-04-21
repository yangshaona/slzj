// // // socket连接
// // const webSocket = require('../../utils/webSocket.js');

// // Page({
// //     data: {
// //         socketTask: "",
// //         isConnect: false,
// //         keepConnectInterval: null,
// //         newMsg: "{}",
// //         have_new_msg: false,
// //         datamsg: {
// //             'type': "login",
// //             "orderid": "332537536784443392",
// //             "Usertype": 'student',
// //             "longitude": '113',
// //             'latitude': '23',
// //         }
// //     },

// //     /**
// //      * 链接会话，
// //      * 每间隔一秒链接一次，知道链接成功后停止链接
// //      */
// //     // connectSocket() {
// //     //     var that = this;
// //     //     var wss_linker = setInterval(function() {

// //     //         that.data.socketTask = wx.connectSocket({
// //     //             url: 'wss://sanli-tracks.com/wss',
// //     //             success: function(res) {
// //     //                 console.log("连接成功", res);
// //     //             },
// //     //             fail: function(res) {
// //     //                 wx.showModal({
// //     //                     title: '提示',
// //     //                     content: 'socket链接异常,请删除程序重试',
// //     //                 })
// //     //             }
// //     //         })
// //     //         console.log("socketTask", that.data.socketTask)
// //     //             //监听链接开启
// //     //         that.data.socketTask.onOpen(function(res) {
// //     //             // wx.onSocketOpen(function(res) {
// //     //             console.log("onpen", res)
// //     //             that.data.isConnect = true;
// //     //             var keep_msg = "keep_connect";
// //     //             console.log("onOpen");
// //     //             that.data.keepConnectInterval = setInterval(function() {
// //     //                 wx.sendSocketMessage({
// //     //                     data: that.data.datamsg,
// //     //                 })
// //     //                 console.log("keep_msg");
// //     //                 if (JSON.stringify(that.data.newMsg) == "{}") {
// //     //                     that.data.have_new_msg = false;
// //     //                 }
// //     //             }, 1000)

// //     //             //获取离线消息
// //     //             that.get_old_msg(res => {
// //     //                 // 获取在线消息
// //     //                 that.data.socketTask.onMessage(function(res) {
// //     //                     var storage_msg = [];
// //     //                     var msg_obj = JSON.parse(res.data);
// //     //                     if (msg_obj.code && msg_obj.code == -1) {
// //     //                         wx.showModal({
// //     //                                 title: '发送通知',
// //     //                                 content: msg_obj.msg,
// //     //                             })
// //     //                             // that.globalData.flag=true;
// //     //                     } else {
// //     //                         wx.showToast({
// //     //                                 title: 'You got a msg'
// //     //                             })
// //     //                             // 处理时间
// //     //                         that.format_date(msg_obj.chatTime, res => {
// //     //                             msg_obj.chatTime = res
// //     //                             var chatRequestUserId = msg_obj.chatRequestUserId + "";
// //     //                             // 把获取的消息存入缓存
// //     //                             that.set_chat_storage(chatRequestUserId, msg_obj);
// //     //                             that.update_unread_msg(chatRequestUserId, msg_obj);
// //     //                         })
// //     //                     }
// //     //                 })
// //     //             })
// //     //             console.log('webSocket is open');
// //     //         })

// //     //         that.data.socketTask.onClose(function(res) {
// //     //             that.data.isConnect = false;
// //     //         })
// //     //         clearInterval(wss_linker); //停止计时器

// //     //     }, 1000)
// //     // },
// //     onLoad: function(options) {
// //         // 创建连接
// //         // webSocket.connectSocket(options);
// //         // 设置接收消息回调
// //         // webSocket.onSocketMessageCallback = this.onSocketMessageCallback;
// //     },

// //     // socket收到的信息回调
// //     onSocketMessageCallback: function(msg) {
// //         console.log('收到消息回调', msg)
// //     },

// //     onUnload: function(options) {
// //         // 页面销毁时关闭连接
// //         webSocket.closeSocket();
// //     },

// //     onReady: function() {
// //         // 生命周期函数--监听页面初次渲染完成

// //     },
// //     onShow: function() {
// //         var that = this;
// //         // that.connectSocket();
// //     },
// //     onHide: function() {
// //         // 生命周期函数--监听页面隐藏
// //         var that = this;
// //         console.log('程序进入了后台');
// //         that.closeSocket();

// //     },

// //     onPullDownRefresh: function() {
// //         // 页面相关事件处理函数--监听用户下拉动作

// //     },
// //     onReachBottom: function() {
// //         // 页面上拉触底事件的处理函数

// //     },
// //     onShareAppMessage: function() {
// //         // 用户点击右上角分享
// //         return {
// //             title: 'title', // 分享标题
// //             desc: 'desc', // 分享描述
// //             path: 'path' // 分享路径
// //         }
// //     }
// // })







// // Page({

// //     data: {
// //         // socketTask: "",
// //         // isConnect: false,
// //         // keepConnectInterval: null,
// //         // newMsg: "{}",
// //         // have_new_msg: false,
// //         datamsg: {
// //             'type': "login",
// //             "orderid": "332537536784443392",
// //             "Usertype": 'student',
// //             "longitude": '113',
// //             'latitude': '23',
// //         }
// //     },
// //     //连接connectSocket
// //     connectSocket() {
// //         wx.connectSocket({
// //             url: 'wss://sanli-tracks.com/wss',
// //             header: {
// //                 'content-type': 'application/json'
// //             },
// //             success: function(res) {
// //                 console.log('Socket连接成功:', res);
// //             },
// //             fail: function(res) {
// //                 console.error('连接失败:', res);
// //             },
// //         })
// //     },
// //     onLoad(options) {
// //         var that = this;
// //         // websocket连接
// //         that.connectSocket();
// //         // websocket打开
// //         // 监听WebSocket连接打开事件。callback 回调函数
// //         wx.onSocketMessage(function(res) {
// //                 console.log('监听到 WebSocket 连接已打开！');
// //                 wx.hideLoading();
// //                 let datamsg = {
// //                     'type': "getgps",
// //                     "orderid": "332537536784443392",
// //                     "Usertype": 'student',
// //                     "longitude": '113',
// //                     'latitude': '23',
// //                 }
// //                 let str_json = JSON.stringify(datamsg);
// //                 wx.sendSocketMessage({
// //                     data: str_json,
// //                     success: function(res) {
// //                         console.log("sendSocketMessage", res);
// //                     },
// //                     fail: function(res) {
// //                         console.log("失败sendSocketMessage", res)
// //                     }
// //                 })
// //             })
// //             //连接失败
// //             // wx.onSocketError((err) => {
// //             //     console.log('websocket连接失败', err);
// //             //     that.connectSocket();
// //             // })

// //         // 收到websocket消息
// //         // var pass = 0;
// //         // wx.onSocketMessage(function(res) {
// //         //         console.log("onSocketMessage", res);
// //         //         const msg = JSON.parse(res.data) // 收到的消息为字符串，需处理一下
// //         //         console.log("msg", msg);
// //         //     })
// //         //     // 检测到 WebSocket 连接
// //         // wx.onSocketError(function(res) {
// //         //         console.log('监听到 WebSocket连接报错！');
// //         //         that.connectSocket();
// //         //     })
// //         //     // 检测到 WebSocket 连接已关闭
// //         // wx.onSocketClose(function(res) {
// //         //         console.log('监听到 WebSocket 连接已关闭！');
// //         //     })
// //         // }
// //     },
// //     onHide() {
// //         wx.closeSocket();
// //     },
// // })


// // socket连接
const webSocket = require('../../utils/webSocket.js');
Page({
    data: {},
    onLoad: function(options) {
        let type = "getgps";
        // 创建连接
        webSocket.connectSocket(type);

        // 设置接收消息回调
        webSocket.onSocketMessageCallback = this.onSocketMessageCallback;
    },
    savePicture1: function() {
        var data = {
            "type": "getgps",
            // 'type': "gpsupdate",
            // "orderid": "332537536784443392",
            // "Usertype": 'student',
            // "longitude": '113.4',
            // 'latitude': '23',
        };

        var time = setTimeout(() => {
            webSocket.sendSocketMessage(data);
        }, 5000);
        // console.log("time", time);
    },
    // socket收到的信息回调
    onSocketMessageCallback: function(msg) {
        // console.log('收到消息回调', msg)
    },

    onUnload: function(options) {
        // 页面销毁时关闭连接
        webSocket.closeSocket();
    },
})