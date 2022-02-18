// pages/task/task.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 页面高度
        height: getApp().globalData.height,
        // onload从服务端获取一共的任务
        mission: [],
        // 从服务端获取是什么活动
        activity: "睡觉",
        local: "汕头市",
        // 获取mission后前端onload赋值
        task: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let user = wx.getStorageSync("user")
        if (app.globalData.flag_identity[0] == 1) {
            var modelName = "SignList";
        } else if (app.globalData.flag_identity[1] == 1) {
            var modelName = "teaSignlist"
        }
        // if(id_flag=='parent')userid=user.
        wx.request({
            url: app.globalData.url + 'WxSign/DailyDetail&modelName=' + modelName,
            data: {
                userid: user.id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("任务中心")
                console.log(res)
                if (res.data.data[0] == "无正在进行的活动行程") {
                    that.setData({
                        task: res.data.data[0],
                    })
                } else {
                    that.setData({
                        mission: res.data.data
                    })
                    var mission = that.data.mission;
                    var task = [];
                    for (var key in mission) {
                        var dict = { 'day': parseInt(key) + 1, 'task': mission[key]['task'], 'location': mission[key]['location'] };
                        task.push(dict);
                    }
                    that.setData({
                        task: task
                    })
                    console.log(that.data.task)
                }

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