Page({

    /**
     * 页面的初始数据
     */
    data: {
        showModal: false,
        textV: '',
        realTime: null, //实时数据对象(用于关闭实时刷新方法)
    },

    /**
     * 控制显示
     */
    eject: function() {
        this.setData({
            showModal: true
        })
    },

    /**
     * 点击返回按钮隐藏
     */
    back: function() {
        this.setData({
            showModal: false
        })
    },

    /**
     * 获取input输入值
     */
    wish_put: function(e) {
        this.setData({
            textV: e.detail.value
        })
    },

    /**
     * 点击确定按钮获取input值并且关闭弹窗
     */
    ok: function() {
        console.log(this.data.textV)
        this.setData({
            showModal: false
        })
    },
    onShow: function() {
        /**
         * 防止用户拿不到最新数据(因为页面切换会重新计时)
         * 无条件请求一次最新数据
         */
        console.log('请求接口：刷新数据(无条件执行)')


        /**
         * 每隔一段时间请求服务器刷新数据(客户状态)
         * 当页面显示时开启定时器(开启实时刷新)
         * 每隔1分钟请求刷新一次
         * @注意：用户切换后页面会重新计时
         */
        this.data.realTime = setInterval(function() {

                // 请求服务器数据
                console.log('请求接口：刷新数据')

                // 反馈提示
                wx.showToast({
                    title: '数据已更新！'
                })

            }, 30000) //间隔时间

        // 更新数据
        this.setData({
            realTime: this.data.realTime, //实时数据对象(用于关闭实时刷新方法)

        })

    },



    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

        /**
         * 当页面隐藏时关闭定时器(关闭实时刷新)
         * 切换到其他页面了
         */
        clearInterval(this.data.realTime)
        console.log("关闭")

    }
})