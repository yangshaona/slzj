const app = getApp();
const util = require('../../utils/text.js'); //路径根据自己的文件目录来
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isTipTrue: true,
        idnum: "",
    },

    onLoad: function(e) {
        var that = this;
        // time = e.formatTime(new Date());
        // console.log("打开小程序的时间是：")
        // that.setData({
        //     isTipTrue: true
        // })
    },
    tipAgree: function() {
        this.setData({
            isTipTrue: false
        })
    },
    InputIdNum: function(e) {
        this.setData({
            idnum: e.detail.value
        })
        console.log("输入的值是：", e);
        console.log(this.data.idnum)
    },
    SaveIdNum: function() {
        if (!util.checkIdCard(this.data.idnum)) {
            wx.showToast({
                title: '请输入正确的身份证号',
                icon: 'none'
            })
        } else {
            wx.showToast({
                title: '通过了',
            })
        }


    },
    name: function(e) {
        var ts = this;
        var name = e.detail.value
        var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/;

        if (name.match(reg)) { console.log("111");
            ts.setData({ allow_name: true });
            wx.setStorageSync("name", name) }
        console.log(name)
    },
    // // 图片上传
    // UpLoadImage: function() {
    //     //选取图片
    //     wx.chooseImage({
    //         count: 1,
    //         sizeType: ['original'], //原图
    //         sourceType: ['album', 'camera'], //支持选取图片
    //         success(res) {
    //             // tempFilePath可以作为img标签的src属性显示图片
    //             const tempFilePaths = res.tempFilePaths[0];
    //             //上传图片


    //             // for(var i=0;i<that.data.uploaderList.length;i++){
    //             wx.uploadFile({
    //                     //请求后台的路径
    //                     url: app.globalData.url + 'WxUser/SaveImg',

    //                     //小程序本地的路径
    //                     filePath: tempFilePaths,

    //                     name: 'file',
    //                     formData: {
    //                         //图片命名：用户id-商品id-1~9
    //                         newName: "img",
    //                         id: 1340,
    //                         // imgNum:i+1
    //                     },
    //                     success(res) {
    //                         console.log("成功上传图片");
    //                         console.log(res);
    //                     },
    //                     fail(res) {
    //                         flag = false;
    //                         wx.showModal({
    //                             title: '提示',
    //                             content: '上传失败',
    //                             showCancel: false
    //                         })
    //                     }
    //                 })
    //                 //   };
    //         }
    //     })
    // }
})