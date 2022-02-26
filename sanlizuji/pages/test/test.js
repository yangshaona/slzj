Page({

    /**
     * 页面的初始数据
     */
    data: {
        isTipTrue: true,
    },

    onLoad: function(e) {
        var that = this;
        // time = e.formatTime(new Date());
        console.log("打开小程序的时间是：")
        that.setData({
            isTipTrue: true
        })
    },
    tipAgree: function() {
        this.setData({
            isTipTrue: false
        })
    }

})