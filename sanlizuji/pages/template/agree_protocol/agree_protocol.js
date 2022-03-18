Page({

    /**
     * 页面的初始数据
     */
    data: {
        isTipTrue: true,
    },

    onLoad: function(e) {
        var that = this;
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