// pages/course/course.js
const app = getApp();
import { GetDiff } from '../../utils/apis.js'
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
        news: [],
        options: ["单位新闻", "单位介绍", "信息通知"],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getNews("");
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
    // 根据类型获取文章数据
    getNews: function(type) {
        let that = this;
        const p = GetDiff({
            type: type
        });
        p.then(value => {
            console.log("成功获取发布信息");
            console.log(value);
            if (value.data.data.length != 0) {
                that.setData({
                    news: value.data.data
                })
            } else {
                that.setData({
                    news: "",
                })
            }
        }, reason => {
            console.log("获取数据失败", reason);
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            options: [{ "id": "01", "isActive": false, "value": "请选择" },
                { "id": "02", "isActive": false, "value": "单位新闻" },
                { "id": "03", "isActive": false, "value": "信息通知" },
                { "id": "04", "isActive": false, "value": "单位介绍" },
                { "id": "05", "isActive": false, "value": "时政信息" },
                { "id": "06", "isActive": false, "value": "招标信息" },
            ],
        });
        this.getNews("");
    },
    select: function(e) {
        console.log("选中的值是");
        console.log(e.detail.value);
        var type = e.detail.value
        if (e.detail.value == "请选择") {
            type = "";
        }
        for (var i = 1; i < this.data.options.length; i++) {
            var tmp = "options[" + i + "].isActive"
            this.setData({
                [tmp]: false,
            })
            if (e.detail.id == this.data.options[i].id) {
                this.setData({
                    [tmp]: true
                })
            }
        }
        this.getNews(type);
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