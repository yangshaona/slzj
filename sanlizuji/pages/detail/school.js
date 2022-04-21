// pages/detail/school.js
import { Clubdetail, GetClubActivity } from '../../utils/apis.js'
const app = getApp();
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
        actImg: ["/icon/unload.png"],
        service_club: { // 机构名称及机构logo
            club_name: '',
            // 学校logo
            pic: '',
            // 机构简介 应为一个数组，以简介段落为元素
            introduce: [],
        },
        // 学校往期活动照片 数组 多个url及其描述
        schoolImg: [],
        imgPrefix: app.globalData.imgPrefix,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("服务商详情")
        console.log(options)
        let that = this;
        Clubdetail({
            clubid: options.id,
        }).then(value => {
            console.log("服务商数据", value)
            that.setData({
                service_club: value.data.data[0]
            })
            that.getClubActivity(value.data.data[0].id)
        }, reason => {
            console.log("无法获取到服务商数据", reason);
        })
    },
    //获取对应服务商的活动数据
    getClubActivity: function(id) {
        let that = this;
        GetClubActivity({
            id: id,
        }).then(value => {
            console.log("服务商的活动数据", value)
            that.setData({
                schoolImg: value.data.data
            })
        })
    },
    //跳转到对应活动
    toCourseDetail: function(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
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