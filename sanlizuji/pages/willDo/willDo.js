// pages/course/course.js
const app = getApp();
import { GetTeaAct } from '../../utils/apis.js';
import { mergeArr } from '../../utils/function.js';
let user = wx.getStorageSync('user');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 设备状态栏高度
        statusHeight: getApp().globalData.statusHeight,
        // 设备高度
        height: getApp().globalData.height,
        // 全部活动
        activity: [],
        user: user
    },
    //跳转到课程详情
    toCourseDetail: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '../detail/detail?id=' + e.currentTarget.dataset.id,
        })
    },
    Init: function() {
        let that = this;
        user = wx.getStorageSync('user');
        that.setData({
            user: user
        })
        if (user != null && user != '') {
            const p = GetTeaAct({
                id: user.id,
                openid: user.openid,
            });
            p.then(value => {
                console.log("将要进行的活动", value);
                that.setData({
                    activity: mergeArr(value.data.data1, value.data.data2)
                })
            }, reason => {
                console.log("获取将要进行的活动数据失败", reason);
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.Init();
    },
    //登录查看更多
    _goLogin: function() {
        wx.navigateTo({
            url: '../register/register_stu',
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
        let that = this;
        that.Init();
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