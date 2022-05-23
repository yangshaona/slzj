// pages/doing/doing_parent.js
import { ParentGetStuActivityDetail } from '../../utils/apis.js';
import { mergeArr } from '../../utils/function.js';
const app = getApp();
let id_flag = wx.getStorageSync('id_flag')
let user = wx.getStorageSync('user')
Page({

    /**
     * 页面的初始数据
     */
    data: {

        activity: "",
        user: user,
        id_flag: id_flag
    },
    //跳转到对应孩子的正在活动
    toStudentActiviDetail: function(e) {
        console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: './doing_stuprt?userid=' + e.currentTarget.dataset.id,
        })
    },
    // 监护人绑定孩子
    _goBound: function() {
        id_flag = wx.getStorageSync('id_flag');
        wx.navigateTo({
            url: '../person_info/parent_info',
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag')
        that.setData({
                user: user,
                id_flag: id_flag
            })
            // 'WxSign/ParentGetStuActivityDetail'
        const p = ParentGetStuActivityDetail({
            pid: user.id,
        });
        p.then(value => {
            console.log("获取到正在活动的孩子的信息", value);
            var doing = [],
                activity = [];
            for (var i = 0; i < value.data.data.data.length; i++) {
                doing.push(mergeArr(value.data.data.data[i][0].data, value.data.data.data[i][0].teacher));
            }
            for (var item of doing) {
                activity.push(item[0])
            }
            that.setData({
                activity: activity,
            })
            console.log("活动", activity)


        }, reason => {
            console.log("获取正在活动的孩子信息失败", reason)
        });
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
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag')
        this.setData({
            user: user,
            id_flag: id_flag
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