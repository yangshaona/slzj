// pages/myApply/comment.js
import { UpdateStuComment, UpdateBaseClubComment, GetBaseClub } from '../../utils/apis.js';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 星级
        // 服务
        service_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 课程
        course_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 住宿
        dorm_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 餐饮
        food_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 导师
        teacher_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 向服务端提交分数评论
        service_star: '',
        course_star: '',
        food_star: '',
        dorm_star: '',
        teacher_star: '',
        // 文字评价
        cmt_service: '',
        cmt_course: '',
        cmt_dorm: '',
        cmt_food: '',
        cmt_teacher: '',
        orderid: '',
        // 分数评价
        rate_data: [],
        base_club: [],
        base_club_comment: { 'baseclubid': '', 'baseclub': '', 'score': "", 'comment': "" },
        comment: [],
    },

    // 评价星级
    rateTap: function(e) {
        console.log(e);
        var that = this;

        var name = e.currentTarget.dataset.name;

        var id = e.currentTarget.dataset.id;
        id = parseInt(id);
        var half = e.currentTarget.dataset.half;
        // 获取当前控制的评价栏目
        var type = this.data.rate_data[name];
        console.log("type:", type)
        console.log(type);
        if (half == 1) {
            type[id]['icon'] = '/icon/star_half_blue.png';
            type[id]['rate'] = 0.5
        } else {
            type[id]['icon'] = '/icon/star_full_blue.png';
            type[id]['rate'] = 1;
        }
        // 总评级
        var rate = 0;
        // 对当前和后的星进行操作
        for (var idx in type) {
            if (idx < id) {
                type[idx]['rate'] = 1;
                type[idx]['icon'] = '/icon/star_full_blue.png';
                rate += type[idx]['rate'];
            } else if (idx > id) {
                type[idx]['rate'] = 0;
                type[idx]['icon'] = '/icon/star_ept_blue.png';
                rate += type[idx]['rate'];
            } else {
                rate += type[idx]['rate'];
            }
        }
        console.log(rate);
        if (e.currentTarget.dataset.clubid != undefined) {
            for (let i = 0; i < that.data.comment.length; i++) {
                if (e.currentTarget.dataset.clubid == that.data.comment[i]['baseclubid']) {

                    that.setData({
                        ["comment[" + i + "].score"]: rate,
                    })
                }
            }
        }
        console.log(that.data.comment)
        var type_name = name + '_star';
        console.log(type_name);
        var rate_data = `rate_data.${name}`;

        that.setData({
            [rate_data]: type,
            [type_name]: rate
        })
        console.log(rate_data)
        console.log(that.data[type_name])
    },

    // 展开/折叠评价
    commentTap: function(e) {
        var status = this.data.cmt_display;
        status = !status;
        this.setData({
            cmt_display: status
        })
    },

    // 评价检查
    cmt_submit: function(e) {
        console.log(e);
        let that = this;
        var service = this.data.service_star;
        var course = this.data.course_star;
        var dorm = this.data.dorm_star;
        var food = this.data.food_star;
        var teacher = this.data.teacher_star;
        var cmt_teacher = e.detail.value.teacher;
        var cmt_service = e.detail.value.service;
        var cmt_dorm = e.detail.value.dorm;
        var cmt_food = e.detail.value.food;
        var cmt_course = e.detail.value.course;

        for (let i = 0; i < that.data.comment.length; i++) {
            let base_comment = e.detail.value[that.data.comment[i]['baseclub']];
            if (base_comment != "") {
                that.setData({
                    ["comment[" + i + "].comment"]: base_comment,
                })
            }
        }
        if (service && course && dorm && food && teacher && cmt_service && cmt_course && cmt_dorm && cmt_food && cmt_teacher) {
            this.setData({
                cmt_service: cmt_service,
                cmt_course: cmt_course,
                cmt_food: cmt_food,
                cmt_dorm: cmt_dorm,
                cmt_teacher: cmt_teacher,
                cmt_display: false
            });
            let user = wx.getStorageSync('user');
            const p = UpdateStuComment({
                orderid: that.data.orderid,
                stuid: user.id,
                foods: food,
                foodm: cmt_food,
                services: service,
                servicem: cmt_service,
                stays: dorm,
                staym: cmt_dorm,
                courses: course,
                coursem: cmt_food,
                teachers: teacher,
                teacherm: cmt_teacher,
            });
            p.then(value => {
                console.log("评价内容");
                console.log(value)
                if (value.data.data.msg == '更新评价成功') {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 800
                    })

                } else {
                    wx.showToast({
                        title: '提交失败',
                        icon: 'success',
                        duration: 800
                    })
                }
            }, reason => {
                wx.showToast({
                    title: '提交失败',
                    icon: 'success',
                    duration: 800
                });
                console.log("评价内容数据提交失败", reason);
            });
            const p2 = UpdateBaseClubComment({
                orderid: that.data.orderid,
                comment: that.data.comment,
            });
            p2.then(value => {
                console.log("上传研学基地评价");
                console.log(value);
                if (value.data.data.msg == '更新评价成功') {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 800
                    })

                } else {
                    wx.showToast({
                        title: '提交失败',
                        icon: 'success',
                        duration: 800
                    })
                }
            }, reason => {
                wx.showToast({
                    title: '提交失败',
                    icon: 'success',
                    duration: 800
                });
                console.log("评价内容数据提交失败", reason);
            });
            setTimeout(function() {
                wx.navigateBack({
                    delta: 0,
                })
            }, 800)
        } else {
            console.log("提交失败");
            wx.showToast({
                title: '请完整填写',
                icon: 'none',
                duration: 800
            })
        }
    },
    Init: function() {
        console.log("评价信息");
        let data = ['service', 'course', 'food', 'dorm', 'teacher'],
            rate_data = {};
        for (let j = 0; j < this.data.base_club.length; j++) {
            data.push(this.data.base_club[j].club_name);
        }
        for (let i = 0; i < data.length; i++) {

            rate_data[`${data[i]}`] = [{ 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
                { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
                { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
                { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
                { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            ];
        }
        console.log(rate_data);
        this.setData({
            rate_data: rate_data,
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        console.log("评价")
        console.log(options)
        that.setData({
            orderid: options.orderid
        })
        that.GetBaseClub();
        that.Init();
    },

    // 获取研学基地
    GetBaseClub: function(options) {
        let that = this;
        const p = GetBaseClub({
            orderid: that.options.orderid,
        });
        p.then(value => {
            console.log("研学基地信息", value);
            if (value.data.data.length > 0) {
                that.setData({
                    base_club: value.data.data
                });
                for (var item of value.data.data) {
                    console.log("基地数据", item);
                    let base_club_comment = { 'baseclubid': '', 'baseclub': '', 'score': "", 'comment': "" };
                    base_club_comment['baseclubid'] = item.id;
                    base_club_comment['baseclub'] = item.club_name;
                    that.data.comment.push(base_club_comment);
                }
                that.Init();
                console.log(that.data.comment);
            }
        }, reason => {
            console.log("获取研学基地数据失败", reason);
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