// pages/journey/journey.js
import { DailyDetail, GetKidsDailyDetail } from '../../utils/apis.js';
const app = getApp();
let user = wx.getStorageSync('user');
let id_flag = wx.getStorageSync('id_flag');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //活动
        activity: {},
        // 状态栏高度
        statusHeight: getApp().globalData.statusHeight,
        // 屏幕高度
        height: getApp().globalData.height,
        // 活动
        journey: [],
        user: user,
        id_flag: id_flag
    },

    //登录查看更多
    _goLogin: function() {
        wx.navigateTo({
            url: '../register/register_stu',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        user = wx.getStorageSync('user')
        id_flag = wx.getStorageSync('id_flag');
        that.setData({
            id_flag: id_flag,
            user: user
        })
        var modelName = "";
        var journey = [];
        if (id_flag == 'student' || id_flag == 'teacher') {
            if (id_flag == 'student') {
                modelName = "SignList";
            } else if (id_flag == 'teacher') {
                modelName = "teaSignList"
            }
            console.log(modelName);
            let p = DailyDetail({
                modelName: modelName,
                userid: user.id,
            });
            p.then(value => {
                console.log("当前活动行程", value);
                var journey = [];
                if (value.data.data[0] == "无正在进行的活动行程" || value.data.data.length == 0) {
                    that.setData({
                        journey: "无正在进行的活动行程"
                    })
                } else {
                    journey.push(value.data.data)
                    that.setData({
                        journey: journey
                    })
                    console.log(that.data.activity)
                    console.log(journey)
                }
            }, reason => {
                console.log("获取当前活动数据失败", reason);
            });
        } else if (id_flag == "parent") {
            let p = GetKidsDailyDetail({
                modelName: "SignList",
                pid: user.id,
            });
            p.then(value => {
                console.log("成功获取孩子当前活动信息", value);
                if (value.data.data.data.length == 0 || value.data.data.data[0].data.length == 0) {
                    that.setData({
                        journey: "无正在进行的活动行程",
                    })
                } else {
                    for (var i of value.data.data.data[0].data) {
                        journey.push(i);
                    }
                    that.setData({
                        journey: journey,
                    })
                }
            }, reason => {
                console.log("获取孩子当前活动信息失败", reason);
            });
        }
    },
    //跳转到课程详情
    toCourseDetail: function(e) {
        console.log("跳转到课程详情")
        console.log(e)
        var fid = e.currentTarget.dataset.fid
        wx.navigateTo({
            url: '../detail/detail?id=' + fid,
        })
    },
    // 监护人绑定孩子已经孩子绑定监护人
    _goBound: function() {
        id_flag = wx.getStorageSync('id_flag');
        wx.navigateTo({
            url: '../person_info/parent_info',
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
        user = wx.getStorageSync('user')
        id_flag = wx.getStorageSync('id_flag');
        this.setData({
            id_flag: id_flag,
            user: user
        })
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
        wx.navigateBack({
            delta: 0,
        })
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