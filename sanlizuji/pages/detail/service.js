// pages/detail/school.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 屏幕高度
        height: getApp().globalData.height,
        // 屏幕宽度
        width: getApp().globalData.width,
        // 学校缩略图 数组放url 可多张
        actImg: [
            "https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg",
            "https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg"
        ],
        // 服务商名称
        serviceName: 'Return0Studio',
        // 服务商logo
        logo: 'https://bkimg.cdn.bcebos.com/pic/21a4462309f79052982290b94eb9c0ca7bcb0b467fab?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5/format,f_auto',
        // 服务商介绍 数组，段落为元素
        desc: [
            'Return0Studio，是一个很牛逼的团队'
        ],
        // 学校往期活动照片 数组 多个url及其描述
        schoolImg: [{
                'img': '/icon/图片未加载.png',
                'desc': ''
            },
            {
                'img': '/icon/图片未加载.png',
                'desc': ''
            }
        ]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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

    }
})