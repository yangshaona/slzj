import { getLocation } from './location.js';

// socket已经连接成功
var socketOpen = false
    // socket已经调用关闭function
var socketClose = false
    // 判断心跳变量
var heart = ''
    // 心跳失败次数
var heartBeatFailCount = 0
    // 终止心跳
var heartBeatTimeOut = null;
// 终止重新连接
var connectSocketTimeOut = null;
// 避免重连
var lockReconnect = false;
// 是否第一连接
var isFirst = false;
// 登录用户的身份
let id_flag = wx.getStorageSync('id_flag');
// 用户正在活动的orderid
var orderid = wx.getStorageSync('orderid');
// var webSocket = new WebSocket("wss://sanli-tracks.com/wss");
var currentLocation = {
    getCurrentLocation: function() {
        const loca = getLocation();
        const p = loca.then(value => {
                console.log("onResolved()", value);
                location = [value[0], value[1]];
                return new Promise((resolve, reject) => {
                    resolve(value)
                });
            },
            reason => {
                console.log("onRejected()", reason)
                wx.showToast({
                    title: reason,
                    icon: "error",
                    duration: 800,
                });
                return new Promise((resolve, reject) => {
                    reject(reason);
                });
            }
        )

        return p;
    },
}

function sendLogin(type, value) {
    id_flag = wx.getStorageSync("id_flag");
    isFirst = false;
    let datamsg = '';
    orderid = wx.getStorageSync('orderid');
    datamsg = {
        'type': type,
        "orderid": orderid,
        "Usertype": id_flag,
        'latitude': value[0],
        "longitude": value[1],
    };
    webSocket.sendSocketMessage(datamsg);
}

var webSocket = {

    /**
     * 创建一个 WebSocket 连接
     * @param {options} 
     *   url	      String	是	开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名
     *   header	    Object	否	HTTP Header , header 中不能设置 Referer
     *   method	    String	否	默认是GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     *   protocols	StringArray	否	子协议数组	1.4.0
     *   success	  Function	否	接口调用成功的回调函数
     *   fail     	Function	否	接口调用失败的回调函数
     *   complete	  Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
     */
    connectSocket: function() {
        socketOpen = false
        socketClose = false;
        isFirst = true;
        wx.connectSocket({
            url: 'wss://sanli-tracks.com/wss',
            success: function(res) {
                console.log("连接成功", res);
            },
            fail: function(res) {
                console.log("连接失败", res);
            }
        })
    },

    /**
     * 通过 WebSocket 连接发送数据
     * @param {options} 
     *   data	String / ArrayBuffer	是	需要发送的内容
     *   success	Function	否	接口调用成功的回调函数
     *   fail	Function	否	接口调用失败的回调函数
     *   complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
     */
    sendSocketMessage: function(data) {
        let type = data['type'];
        if (socketOpen) {
            data = JSON.stringify(data);
            console.log("传到后台的数据是", data)

            wx.sendSocketMessage({
                data: data,
                success: function(res) {
                    console.log("sendSocketMessage success", res);
                },
                fail: function(res) {
                    console.log("sendSocketMessage fail", res);
                    if (type == 'getgps') {
                        wx.showToast({
                            title: "获取失败",
                            icon: 'error',
                            duration: 800,
                        })
                    }
                }
            })
        } else {
            console.log("发送信息失败，websocket已关闭");
        }
    },

    /**
     * 关闭 WebSocket 连接。
     * @param {options} 
     *   code	Number	否	一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）
     *   reason	String	否	一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
     *   fail	Function	否	接口调用失败的回调函数
     *   complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
     */
    closeSocket: function(options) {
        if (connectSocketTimeOut) {
            clearTimeout(connectSocketTimeOut);
            connectSocketTimeOut = null;
        }
        socketClose = true;
        var self = this;
        self.stopHeartBeat();
        wx.closeSocket({
            success: function(res) {
                console.log('WebSocket 关闭成功！');

            },
            fail: function(res) {
                console.log("WebSocket 关闭失败");
            }
        })
    },

    // 收到消息回调
    onSocketMessageCallback: function(msg) {

        console.log("收到消息回调信息：", msg);
    },

    // 开始心跳
    startHeartBeat: function() {
        console.log('socket开始心跳')
        var self = this;
        heart = 'heart';
        self.heartBeat();
    },

    // 结束心跳
    stopHeartBeat: function() {
        console.log('socket结束心跳')
        var self = this;
        heart = '';
        if (heartBeatTimeOut) {
            clearTimeout(heartBeatTimeOut);
            heartBeatTimeOut = null;
        }
        if (connectSocketTimeOut) {
            clearTimeout(connectSocketTimeOut);
            connectSocketTimeOut = null;
        }
    },

    // 心跳
    heartBeat: function() {
        var self = this;
        if (!heart) {
            return;
        }
        let data = {
            'type': "heartbeat",
        };
        data = JSON.stringify(data)

        wx.sendSocketMessage({
            data: data,
            success: function(res) {
                console.log('socket心跳成功', res);
                if (heart) {
                    heartBeatTimeOut = setTimeout(() => {
                        self.heartBeat();
                    }, 60000);
                }
            },
            fail: function(res) {
                console.log('socket心跳失败');
                if (heartBeatFailCount > 2) {
                    // 重连
                    self.connectSocket();
                }
                if (heart) {
                    heartBeatTimeOut = setTimeout(() => {
                        self.heartBeat();
                    }, 60000);
                }
                heartBeatFailCount++;
            },
        });
    }
}

// 监听WebSocket接受到服务器的消息事件。
wx.onSocketMessage(function(res) {
    console.log('WebSocket连接已打开！', res);
    // wx.hideLoading();
    // 如果已经调用过关闭function
    if (socketClose) {
        webSocket.closeSocket();
    } else {
        socketOpen = true;
        var objdata = JSON.parse(res.data);
        console.log(objdata);
        id_flag = wx.getStorageSync("id_flag");
        if (isFirst && objdata.type == 'handshake') {
            // 先获取当前位置信息
            const p = currentLocation.getCurrentLocation();
            p.then(value => {
                sendLogin('login', value);
            }, reason => {
                console.log(reason);
            })
            setTimeout(() => webSocket.startHeartBeat(), 5000);
        } else {
            switch (objdata.type) {
                case 'getgps':
                    console.log("导师获取学生位置");
                    const p = currentLocation.getCurrentLocation();
                    p.then(value => {
                        if (id_flag == "student") {
                            sendLogin('gpsupdate', value);
                        } else {
                            console.log("导师账号");
                        }
                    }, reason => {
                        console.log("地理位置获取失败", reason)
                    })
                    break;
                case 'gpsupdate':
                    console.log("gpsupdate 更新GPS成功");
                    break;
                case 'heartbeat':
                    console.log("检测心跳");
                    break;
                case 'handshake':
                    console.log("握手成功");
                    break;

                case 'gpsstatus':
                    console.log("位置上传成功");
                    break;
                default:
                    break;
            }
        }
    }
})

// 监听WebSocket错误。
let that = this;
wx.onSocketError(function(res) {
    console.log('WebSocket连接打开失败，请检查！', res);
    // webSocket.connectSocket();
})

// 监听WebSocket关闭。
wx.onSocketClose(function(res) {
    console.log('WebSocket 已关闭');
    console.log("socketClose", socketClose)
        // if (!socketClose) {
        //     clearTimeout(connectSocketTimeOut);
        //     connectSocketTimeOut = setTimeout(() => {
        //         webSocket.connectSocket();
        //     }, 60000);
        // }
})

module.exports = webSocket;