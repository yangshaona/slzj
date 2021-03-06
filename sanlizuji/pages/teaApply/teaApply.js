// pages/myApply/myApply.js
const app = getApp();
let user = wx.getStorageSync('user')
let id_flag = wx.getStorageSync('id_flag');
import { mergeArr } from '../../utils/function.js'
import { DeleteOneOrderByPk, GetTeacher, GetMyApply, orderisshow, CancelRegistration } from '../../utils/apis.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 状态栏高度
        statusHeight: app.globalData.statusHeight,
        // 屏幕高度
        height: app.globalData.height,
        // 选择框
        selectBox: [
            { 'id': 0, 'ctn': '全部', 'class': 'selected' },
            { 'id': 1, 'ctn': '报名失败', 'class': 'select' },
            { 'id': 2, 'ctn': '待审核', 'class': 'select' },
            { 'id': 3, 'ctn': '报名成功', 'class': 'select' },
            { 'id': 4, 'ctn': '已完成', 'class': 'select' },
        ],
        // 提交服务端的筛选条件
        select: "全部",
        // 显示的报名
        display: [],
        filter: [],
        flag_identity: app.globalData.flag_identity,
        // 是否显示评价按钮
        cmt_display: true,
        //身份
        id_flag: id_flag,
        user: user,
        now: "",
    },

    // 筛选栏点击事件
    selectTap: function(e) {
        var id = e.currentTarget.dataset.id;
        // 样式改变
        var selectBox = this.data.selectBox;
        for (var idx in selectBox) {
            if (idx == id) {
                selectBox[idx].class = 'selected';
            } else {
                selectBox[idx].class = 'select';
            }
        }
        this.setData({
            selectBox: selectBox,
            select: selectBox[id]['ctn']
        })
        console.log("选择：" + this.data.select);
        this.setFilter();
    },
    // 点击查看详情
    goToDetail: function(e) {
        // 点击的id
        var id = e.currentTarget.dataset.courseid;
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
        })
    },
    // 点击评价按钮
    commentTap: function(e) {
        // 点击的id
        var id = e.currentTarget.dataset.id;
        console.log("点击评价", id);
        wx.navigateTo({
            url: '../myApply/comment?id=' + id,
        })
    },

    // 点击继续报名按钮
    applyTap2: function(e) {
        var id = e.currentTarget.dataset.id;
        console.log("点击报名")
        console.log(id)
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
        })
    },
    //前往报名
    goToApply: function() {
        wx.switchTab({
            url: '../course/course',
        })
    },
    // 查看导师
    teacherTap: function(e) {
        var courseid = e.currentTarget.dataset.id;
        var starttime = e.currentTarget.dataset.starttime;
        let teacherid = "";
        console.log("点击导师按钮");
        console.log(courseid);
        // 获取导师信息
        GetTeacher({
            courseid: courseid,
            starttime: starttime,
        }).then(value => {
            console.log(value);
            if (value.data.data1.length != 0) {
                teacherid = value.data.data1[0].userid;
            }
        }, reason => {
            console.log("获取导师数据失败", reason);
        });
        wx.navigateTo({
            url: '../detail/teacher?course_id=' + courseid + "&teacherid=" + teacherid,
        })
    },

    // 删除一条订单记录
    DeleteOneOrder: function(e) {
        console.log("删除订单", e);
        var orderid = e.currentTarget.dataset.orderid;
        let that = this;
        wx.showModal({
            content: "是否删除",
            success(res) {
                if (res.confirm) {
                    orderisshow({
                        modelName: "teaSignList",
                        id: orderid,
                    }).then(value => {
                        console.log("删除结果", value);
                        if (value.data.data == '删除成功') {
                            wx.showToast({
                                title: "删除成功",
                                icon: 'success',
                                duration: 800,
                            })
                            that.setFilter();
                        } else {
                            wx.showToast({
                                title: "删除失败",
                                icon: 'error',
                                duration: 800,
                            });
                        }
                    }, reason => {
                        console.log("删除数据失败", reason);
                    })
                }
            }
        })
    },
    // 取消报名
    cancelRegistration: function(e) {
        console.log("取消订单", e)
        let orderid = e.currentTarget.dataset.id;
        console.log(orderid);
        // "WxSign/CancelRegistration"
        CancelRegistration({
            orderid: orderid,
        }).then(value => {
            console.log("取消报名结果", value);
            if (value.data == "修改成功") {
                this.setFilter();
            } else {
                wx.showToast({
                    title: "取消失败",
                    icon: "error",
                    duration: 800
                })
            }
        }, reason => {
            console.log("取消报名失败", reason);
            wx.showToast({
                title: "取消失败",
                icon: "error",
                duration: 800
            })
        })
    },
    // 筛选显示内容，这部分由服务端实现，这里只是测试一下样式
    setFilter: function() {
        var select = this.data.select;
        var filter = [];
        console.log(select);
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        console.log("我的报名数据")
        console.log(user);
        console.log(id_flag)
        that.setData({
            flag_identity: app.globalData.flag_identity
        })
        GetMyApply({
            identity: "teacher",
            id: user.id
        }).then(value => {
            console.log("教师端我的报名", value)
            var total = [];
            total = mergeArr(value.data.data1, value.data.data2)
            var now = new Date;
            var date = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
            that.setData({
                now: date
            })
            for (var idx in total) {
                var ctn = total[idx];
                var status = "";
                var endTime = new Date(ctn['endTime']);

                if (ctn['status'] == 1) {
                    status = "报名失败";
                } else if (ctn['status'] == 2) {
                    status = "待审核";
                } else if (ctn['status'] == 3 && endTime > now) {
                    status = "报名成功";
                    ctn['endTime'] = 'false';
                } else {
                    status = "已完成"
                }
                if (select == status || select == "全部") {
                    filter.push(ctn);
                }
            }
            that.setData({
                filter: filter
            })
            console.log("所有报名数据", that.data.filter);

        }, reason => {
            console.log("获取教师的报名数据失败", reason);
        })
    },
    //登录查看更多
    _goLogin: function() {
        wx.navigateTo({
            url: '../register/register_stu',
        })
    },

    // 设置标题
    setTitle: function(tname) {
        wx.setNavigationBarTitle({ title: tname })
    },
    // 初始化页面
    Init: function() {
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        this.setData({
            user: user,
            id_flag: id_flag
        })
        if (user != null && user != '') {
            that.setFilter();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        console.log("返回的数据是", options)
        that.Init();
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
        this.Init();
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