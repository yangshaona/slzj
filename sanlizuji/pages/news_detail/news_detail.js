// pages/news_detail/news_detail.js
const app = getApp();
import { GetDetail } from '../../utils/apis.js'
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
        const p = GetDetail({
            id: options.id
        });
        p.then(value => {
            console.log("发布文章详情")
            console.log(value.data.data)
            that.setData({
                course_detail: value.data.data[0],
            });
        }, reason => {
            console.log("获取发布文章详情数据失败", reason);
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