// pages/course/course.js
const app = getApp();
import { GetTeaAct } from '../../utils/apis.js';
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
        /* 需要的key: 
          imgUrl: 缩略图链接
          actTitle: 活动标题
          actNum: 报名人数
          ddl: 报名截止日期
        */
        activity: [],
        user: user
    },
    //跳转到课程详情
    toCourseDetail: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '../detail/detail?id=' + e.currentTarget.dataset.id,
            success: function(res) {
                // success
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
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

                function mergeArr(arr1, arr2) { //arr目标数组 arr1要合并的数组 return合并后的数组
                    if (arr1.length == 0) {
                        return [];
                    }
                    let arr3 = [];
                    arr1.map((item, index) => {
                        arr3.push(Object.assign(item, arr2[index]));
                    })
                    return arr3;
                }
                that.setData({
                    activity: mergeArr(value.data.data1, value.data.data2)
                })
            }, reason => {
                console.log("获取将要进行的活动数据失败", reason);
            });
        }
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
        user = wx.getStorageSync('user');
        this.setData({
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