// pages/course/course.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 设备状态栏高度
        statusHeight: getApp().globalData.statusHeight,
        // 设备高度
        height: getApp().globalData.height,
        // 全部新闻
        news: [{
                'imgUrl': 'https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg',
                'title': '小程序|Version 1.0.0building|更新快照',
                'time': '2022-01-28',
                'view': '827364'
            },
            {
                'imgUrl': 'https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg',
                'title': '小程序开通啦',
                'time': '2022-01-26',
                'view': '999999999'
            }
        ],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        wx.request({
            url: app.globalData.url + "WxOther/GetDiff",
            data: {},
            success: function(res) {
                // success
                console.log("成功获取发布信息");
                console.log(res)
                that.setData({
                    news: res.data.data
                })
                console.log(res.data.data[0].imagesurl)
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    //跳转到发布文章的详情
    toNewsDetail: function(e) {
        var goodsId = e.currentTarget.dataset.id;
        console.log("单个发布数据")
        console.log(e)
        wx.navigateTo({
            url: '../news_detail/news_detail?id=' + goodsId,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

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