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
            { 'id': 3, 'icon': '/icon/todos.png', 'desc': '任务中心', 'url': '../task/task' },
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
            { 'id': 3, 'icon': '/icon/ceng2.png', 'desc': '我的报名', 'url': '../teaApply/teaApply' },
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
        header: "",
        modelName: '',
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
    UpLoadImage: function() {
        let that = this;
        if (!user) {
            wx.navigateTo({
                url: '../register/register_stu',

            })
        } else {
            //选取图片
            wx.chooseImage({
                count: 1,
                sizeType: ['original'], //原图
                sourceType: ['album', 'camera'], //支持选取图片
                success(res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths[0];
                    console.log("图片路径");
                    console.log(tempFilePaths);
                    //上传图片
                    wx.uploadFile({
                        //请求后台的路径
                        url: app.globalData.url + 'WxUser/SaveImg',

                        //小程序本地的路径
                        filePath: tempFilePaths,

                        name: 'file',
                        formData: {
                            //图片命名：用户id-商品id-1~9
                            newName: user.openid,
                            id: user.id,
                            modelName: that.data.modelName,
                            // imgNum:i+1
                        },
                        success(res) {
                            console.log("成功上传图片");
                            console.log(res);
                            console.log(res.statusCode);
                            if (res.statusCode == 200) {
                                wx.showToast({
                                    title: "上传成功",
                                    icon: 'success',
                                    duration: 800,
                                });
                                wx.request({
                                    url: app.globalData.url + 'WxUser/GetUserInfo2',
                                    data: {
                                        openid: user.openid,
                                        id_flag: id_flag,
                                    },
                                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                    // header: {}, // 设置请求的 header
                                    success: function(res) {
                                        wx.setStorageSync('user', res.data.data);
                                        user = wx.getStorageSync('user');
                                        that.setData({
                                            user: user,
                                        })
                                        console.log(that.data.user)
                                    },
                                })

                            } else {
                                wx.showToast({
                                    title: "上传失败",
                                    icon: 'success',
                                    duration: 800,
                                });
                            }

                        },
                        fail(res) {
                            flag = false;
                            wx.showModal({
                                title: '提示',
                                content: '上传失败',
                                showCancel: false
                            })
                        }
                    })
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.judgeIdentity();
        var height = this.data.width * 0.65 * 0.3;
        this.setData({
            imgHeight: height,
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
        this.judgeIdentity();
        // if (this.data.user.header == undefined) console.log(this.data.user.header);
        // if (this.data.user.header == null) console.log(this.data.user.header);
    },
    // 判断类型
    judgeIdentity: function() {
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        avator = wx.getStorageSync("avator");
        if (id_flag == 'parent') {
            this.setData({
                identity: '家长',
                modelName: 'UserParent',
            })
        } else if (id_flag == 'teacher') {
            this.setData({
                identity: '教师',
                modelName: 'Teacher',
            })
        } else {
            this.setData({
                identity: '学生',
                modelName: "Userinfo",
            })
        }
        this.setData({
            user: user,
            id_flag: id_flag,
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