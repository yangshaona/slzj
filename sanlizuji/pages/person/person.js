// pages/person/demo.js
const app = getApp();
let id_flag = wx.getStorageSync('id_flag');
let user = wx.getStorageSync('user');
let avator = wx.getStorageSync('avator');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 状态栏高度
        statusHeight: app.globalData.statusHeight,
        // 设备高度
        height: app.globalData.height,
        // 设备宽度
        width: app.globalData.width,
        // 头像高度
        imgHeight: "",
        // 数据展示栏
        userInfo: '',
        // 小组件栏
        student_widgets: [
            { 'id': 0, 'icon': '/icon/course2.png', 'desc': '我的活动', 'url': '../mycourse/mycourse_stu' },
            { 'id': 1, 'icon': '/icon/ScheduleOutlined.png', 'desc': '活动行程', 'url': '../journey/journey' },
            { 'id': 2, 'icon': '/icon/time2.png', 'desc': '正在活动', 'url': '../doing/doing_stuprt' },
            { 'id': 3, 'icon': '/icon/ylab-backlog1.png', 'desc': '任务中心', 'url': '../task/task' },
            { 'id': 4, 'icon': '/icon/ceng2.png', 'desc': '我的报名', 'url': '../myApply/myApply' },
            // { 'id': 5, 'icon': '/icon/deal2.png', 'desc': '我的订单', 'url': '../myApply/myApply' },
            { 'id': 5, 'icon': '/icon/idnetify2.png', 'desc': '身份认证', 'url': '../register/register_stu' },
            // { 'id': 6, 'icon': '/icon/set2.png', 'desc': '个人信息', 'url': '../person_info/stu_info' }
        ],
        // 教师小组件栏
        teacher_widgets: [
            { 'id': 0, 'icon': '/icon/course2.png', 'desc': '将要进行', 'url': '../willDo/willDo' },
            { 'id': 1, 'icon': '/icon/ScheduleOutlined.png', 'desc': '活动行程', 'url': '../journey/journey' },
            { 'id': 2, 'icon': '/icon/time2.png', 'desc': '正在活动', 'url': '../doing/doing_tc' },
            { 'id': 3, 'icon': '/icon/ceng2.png', 'desc': '我的报名', 'url': '../myApply/myApply' },
            { 'id': 4, 'icon': '/icon/set2.png', 'desc': '个人信息', 'url': '../person_info/teacher_info' }
        ],
        // 父母小组件栏
        parent_widgets: [
            { 'id': 0, 'icon': '/icon/course2.png', 'desc': '孩子活动', 'url': '../mycourse/mycourse_stu' },
            { 'id': 1, 'icon': '/icon/ScheduleOutlined.png', 'desc': '活动行程', 'url': '../journey/journey' },
            { 'id': 2, 'icon': '/icon/time2.png', 'desc': '正在活动', 'url': '../doing/doing_parent' },
            { 'id': 3, 'icon': '/icon/ceng2.png', 'desc': '孩子报名', 'url': '../myApply/myApply' },
            { 'id': 4, 'icon': '/icon/set2.png', 'desc': '个人信息', 'url': '../person_info/parent_info' }

        ],
        // 以下服务端获取
        // 昵称
        nickName: '哄哄',
        // 性别
        sex: '男',
        // 头像
        avator: avator,
        // 服务端获取用户关注/粉丝
        follow: '',
        fans: '',
        // 身份【学生/家长/导师】
        identity: '',
        id_flag: id_flag,
        user: user,
    },
    //已登录直接跳到个人信息
    toInfo: function(e) {
        console.log(e)
        wx.navigateTo({
            url: e,

        })
    },
    // 学生小组件点击事件
    studentWidgetsTap: function(e) {
        user = wx.getStorageSync('user')
        var id = e.currentTarget.dataset.id;
        var student_widgets = this.data.student_widgets;
        var url = student_widgets[id]['url'];
        var desc = student_widgets[id]['desc'];
        console.log(desc + "组件触发跳转事件");
        console.log(url);
        if (user != null && user != '' && id == 5) {
            this.toInfo('../person_info/stu_info')
        } else {
            wx.navigateTo({
                url: url
            })
        }
    },
    // 教师小组件点击事件
    teacherWidgetsTap: function(e) {
        var id = e.currentTarget.dataset.id;
        var teacher_widgets = this.data.teacher_widgets;
        var url = teacher_widgets[id]['url'];
        var desc = teacher_widgets[id]['desc'];
        console.log(desc + "组件触发跳转事件");
        wx.navigateTo({
            url: url
        })
    },

    // 父母小组件点击事件
    parentWidgetsTap: function(e) {
        var id = e.currentTarget.dataset.id;
        var parent_widgets = this.data.parent_widgets;
        var url = parent_widgets[id]['url'];
        var desc = parent_widgets[id]['desc'];
        console.log(desc + "组件触发跳转事件");
        wx.navigateTo({
            url: url
        })
    },
    //登录
    toLogin: function(e) {
        wx.navigateTo({
            url: '../register/register_stu',

        })
    },
    //点击头像上传图片
    upImage: function(e) {
        wx.chooseMedia({
            mediaType: ['image'],
            count: 1,
            sourceType: ['album', 'camera'],
            success: (res) => {
                console.log("成功上传头像")
                console.log(res)
                wx.showToast({
                    title: '保存成功!',
                    icon: 'success',
                    duration: 800
                })
                console.log("头像保存成功")
                this.setData({
                    avator: res.tempFiles[0].tempFilePath,
                })
                wx.setStorageSync('avator', this.data.avator)
                console.log(this.data.avator)
            },
            fail: (res) => {
                wx.showToast({
                    title: '选择错误',
                    icon: 'success',
                    duration: 800
                })
                console.log(res);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        avator = wx.getStorageSync("avator")

        if (user != null) console.log("用户信息1", user)
        if (user != '') console.log("用户信息2", user)
        if (user == '') console.log("用户信息3", user)
        var height = this.data.width * 0.65 * 0.3;
        this.setData({
            user: user,
            id_flag: id_flag,
            avator: avator,
            imgHeight: height,
        })
        console.log("身份")
        console.log(this.data.id_flag)
            // 从服务端获取关注/粉丝
        this.setData({
            follow: 10,
            fans: 187625,

        })
        if (id_flag == 'parent') {
            this.setData({
                identity: '家长'
            })
        } else if (id_flag == 'teacher') {
            this.setData({
                identity: '导师'
            })
        } else {
            this.setData({
                identity: '学生'
            })
        }
        // 设置数据展示栏
        var info = [
            { 'data': this.data.follow, 'desc': '关注' },
            { 'data': this.data.fans, 'desc': '粉丝' },
        ]
        this.setData({
            userInfo: info,
            user: user
        });
        console.log("用户", user)
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
        id_flag = wx.getStorageSync('id_flag');
        user = wx.getStorageSync('user');

        avator = wx.getStorageSync('avator');

        this.setData({
            id_flag: id_flag
        })
        this.setData({
            follow: 10,
            fans: 187625,

        })
        if (id_flag == 'parent') {
            this.setData({
                identity: '家长'
            })
        } else if (id_flag == 'teacher') {
            this.setData({
                identity: '教师'
            })
        } else {
            this.setData({
                identity: '学生'
            })
        }
        // 设置数据展示栏
        var info = [
            { 'data': this.data.follow, 'desc': '关注' },
            { 'data': this.data.fans, 'desc': '粉丝' },
        ]
        this.setData({
            userInfo: info,
            user: user,
            avator: avator,
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