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
import { checkPhone } from '../../utils/function.js'
const check_idnum = require('../../utils/function.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userList: [{
            user: "",
            idcard: "",
            phone: "",
        }],
        showModal: true,

    },
    addUser(e) {
        console.log(e.detail.value, 111)
        let index = e.target.dataset.id;
        let userList = this.data.userList;
        userList[index].user = e.detail.value.trim();
        this.setData({
            userList
        })
    },
    addIdCard(e) {
        console.log(e.detail.value, 222)
        let index = e.target.dataset.id;
        let userList = this.data.userList;
        var data = check_idnum.checkIdCard(e.detail.value);
        if (!data.idCardFlag) {
            wx.showToast({
                title: '身份证号有误',
                icon: 'none',
                duration: 800
            })
            return;
        }
        userList[index].idcard = e.detail.value.trim();
        this.setData({
            userList
        })
    },
    addTel(e) {
        console.log(e.detail.value, 333)
        let index = e.target.dataset.id;
        let userList = this.data.userList;
        if (!checkPhone(e.detail.value.trim())) {
            wx.showToast({
                title: '请填写正确的手机号',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        userList[index].phone = e.detail.value.trim();
        this.setData({
            userList
        })
    },
    // 添加随行人
    addList() {
        let userList = this.data.userList;
        console.log("添加人信息为", userList);
        if (userList[userList.length - 1].user.trim() !== '' && userList[userList.length - 1].idcard.trim() !== '' && userList[userList.length - 1].phone.trim() !== '') {
            setTimeout(() => {
                let userList = this.data.userList;
                userList.push({
                    user: "",
                    idcard: '',
                    phone: ""
                })
                this.setData({
                    userList
                }, 300)
            })
        } else {
            wx.showToast({
                title: '请填写完整再追加',
                icon: 'none',
                duration: 2000
            })
            return;
        }

    },
    delList() {
        let userList = this.data.userList;
        if (userList.length > 1) {
            userList.pop();
            this.setData({
                userList: userList
            })
        } else {
            wx.showToast({
                title: '操作失败，无法继续删除',
                icon: 'none',
                duration: 2000,
            })
        }

    },
    // 点击提交按钮
    ok: function() {
        let userList = this.data.userList;
        if (userList[userList.length - 1].user.trim() == '' || userList[userList.length - 1].idcard.trim() == '' || userList[userList.length - 1].phone.trim() == '') {
            wx.showToast({
                title: '请填写完整再提交',
                icon: 'none',
                duration: 2000,
            })
        } else {
            // 填写信息到数据库
            console.log(JSON.stringify(userList));
            // 跳转到订单确认界面
            wx.redirectTo({
                url: './pay?orderid=' + that.options.orderid + '&price=' + that.data.payPrice + "&key=" + that.data.coupons + "&userinfo=" + that.options.userinfo,
            });
            this.setData({
                showModal: false,
            })
        }


    },
    back: function() {
        // 跳转到订单确认界面 
        this.setData({
            showModal: false,
        })
        wx.redirectTo({
            url: './pay?orderid=' + that.options.orderid + '&price=' + that.data.payPrice + "&key=" + that.data.coupons + "&userinfo=" + that.options.userinfo,
        });

    }
})