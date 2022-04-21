// pages/detail/teacher.js
import { GetTeaReviewAct, GetTeacherDetail } from '../../utils/apis.js';
const app = getApp();
let user = wx.getStorageSync('user');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 屏幕高度
        height: app.globalData.height,
        // 屏幕宽度
        width: app.globalData.width,
        // 老师图片 数组放url 可多张
        actImg: [],
        //导师信息
        teacher_info: "",
        // 导师名称
        teacherName: '',
        // 导师电话
        phoneNum: '',
        // 老师介绍 数组，段落为元素
        desc: [],
        // 老师参与的往期活动照片 数组 多个url及其描述
        schoolImg: "",
        // 导师评价
        comment: [],
        user: user,
        imgPrefix: app.globalData.imgPrefix,

    },
    //跳转到活动详情
    toCourseDetail: function(e) {
        var id = e.currentTarget.dataset.courseid;
        wx.navigateTo({
            url: './detail?id=' + id,
        })
    },
    //获取导师之前的活动
    GetTeaReviewActiv: function(id) {
        console.log("id是：", id)
        let that = this;
        GetTeaReviewAct({
            id: id,
        }).then(value => {
            console.log("成功获取导师该活动的回顾", value);
            that.setData({
                schoolImg: mergeArr(value.data.data1, value.data.data2)
            });
            console.log(that.data.schoolImg);

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
        }, reason => {
            console.log("无法获取导师活动的数据", reason);
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("导师详情界面")
        console.log(options)
        let that = this;
        user = wx.getStorageSync('user');
        that.setData({
            user: user
        });
        // 获取教师数据
        GetTeacherDetail({
            courseid: options.course_id,
            teacherid: options.teacherid
        }).then(value => {
            console.log("成功获取老师数据", value);
            if (value.data.data == "") {
                that.setData({
                    teacher_info: value.data.data
                })
            } else {
                that.setData({
                    teacher_info: value.data.data
                })
                that.GetTeaReviewActiv(value.data.data.id);
            }
            console.log(that.data.teacher_info);
        }, reason => {
            console.log("无法获取教师的数据", reason);
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