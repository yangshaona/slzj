import { DailyDetail } from "../../utils/apis.js";
const app = getApp();
let user = wx.getStorageSync("user")
let id_flag = wx.getStorageSync('id_flag');
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

    //登录查看更多
    _goLogin: function() {
        wx.navigateTo({
            url: '../register/register_stu',
        })
    },
    // 进入页面进行初始化
    Init: function() {
        let that = this;
        user = wx.getStorageSync('user')
        id_flag = wx.getStorageSync('id_flag');
        this.setData({
            id_flag: id_flag,
            user: user
        })

        if (user != null && user != '') {
            if (app.globalData.flag_identity[0] == 1) {
                var modelName = "SignList";
            } else if (app.globalData.flag_identity[1] == 1) {
                var modelName = "teaSignlist"
            }
            const p = DailyDetail({
                modelName: modelName,
                userid: user.id,
            }).then(value => {
                console.log("任务中心", value)
                if (value.data.data[0] == "无正在进行的活动行程") {
                    that.setData({
                        task: value.data.data[0],
                    })
                } else {
                    that.setData({
                        mission: value.data.data
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
            }, reason => {
                console.log("获取任务中心数据失败", reason);
            });
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
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
        let that = this;
        that.Init();
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