// pages/news_detail/news_detail.js
const app = getApp();
import {
    formatRichText
} from '../../utils/text.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 屏幕高度
        height: getApp().globalData.height,
        course_detail: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        console.log("详情页面数据")
        console.log(options)

        wx.request({
            url: app.globalData.url + 'WxOther/GetDetail',
            data: {
                id: options.id
            },
            success(res) {
                console.log("发布文章详情")
                console.log(res.data.data)
                    //formatRichText 调用方法    
                    //解决rich-text放入图片时富文本无法换行的问题  
                var content = "";
                content = formatRichText(res.data.data[0].content);
                res.data.data[0].content = content;
                that.setData({
                    course_detail: res.data.data[0],

                });
            }
        })
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