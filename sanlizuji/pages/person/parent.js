// pages/person/demo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 状态栏高度
        statusHeight: getApp().globalData.statusHeight,
        // 设备高度
        height: getApp().globalData.height,
        // 设备宽度
        width: getApp().globalData.width,
        // 头像高度
        imgHeight: "",
        // 数据展示栏
        userInfo: '',
        // 父母小组件栏
        parent_widgets: [
            { 'id': 0, 'icon': '/icon/course2.png', 'desc': '孩子活动', 'url': '../willDo/willDo' },
            { 'id': 1, 'icon': '/icon/ScheduleOutlined.png', 'desc': '活动行程', 'url': '../journey/journey' },
            { 'id': 2, 'icon': '/icon/time2.png', 'desc': '正在活动', 'url': '../doing/doing_stuprt' },
            { 'id': 3, 'icon': '/icon/ceng2.png', 'desc': '孩子报名', 'url': '../myApply/myApply' }
        ],
        // 以下服务端获取
        // 昵称
        nickName: '哄哄',
        // 性别
        sex: '男',
        // 头像
        avator: 'http://img.duoziwang.com/2021/01/1-2104221923050-L.jpg',
        // 服务端获取用户关注/粉丝
        follow: '',
        fans: '',
        // 身份【学生/家长/导师】
        identity: '',
    },

    // 小组件点击事件
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 设置头像高度
        var height = this.data.width * 0.8 * 0.3;
        this.setData({
                imgHeight: height
            })
            // 从服务端获取关注/粉丝
        this.setData({
                follow: 10,
                fans: 187625,
                identity: '家长'
            })
            // 设置数据展示栏
        var info = [
            { 'data': this.data.follow, 'desc': '关注' },
            { 'data': this.data.fans, 'desc': '粉丝' },
        ]
        this.setData({
            userInfo: info
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