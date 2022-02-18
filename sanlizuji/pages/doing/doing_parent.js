// pages/doing/doing_parent.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

        activity: "",
    },
    //跳转到对应孩子的正在活动
    toStudentActiviDetail: function(e) {
        console.log("111111111");
        console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: './doing_stuprt?userid=' + e.currentTarget.dataset.id,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let user = wx.getStorageSync('user')
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxSign/ParentGetStuActivityDetail',
            data: {
                pid: user.id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("获取到真在活动的孩子的信息")
                console.log(res)
                console.log(res.data.data.data)
                    // var doing = [];
                    // if (res.data.data.data[0].length == 0) {
                    //     that.setData({
                    //         activity: "无正在进行的课程",
                    //     })
                    // } else {
                    //     //     that.setData({
                    //     //         doing: res.data.data[0],
                    //     //         teacher: res.data.teacher[0],
                    //     //         course: res.data.data[0]
                    //     //     })
                var doing = [],
                    activity = [];
                console.log(res.data.data.data[0])
                for (var i = 0; i < res.data.data.data.length; i++) {
                    // doing.push(item);
                    doing.push(mergeArr(res.data.data.data[i][0].data, res.data.data.data[i][0].teacher));

                }
                for (var item of doing) {
                    activity.push(item[0])

                }
                that.setData({
                    activity: activity,
                })

                console.log("活动");
                console.log(activity)

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