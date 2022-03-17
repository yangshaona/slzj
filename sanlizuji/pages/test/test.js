//index.js

Page({
    data: {
        // text:"这是一个页面"
        actionSheetHidden: true,
        actionSheetItems: [
            '活动开始前1天收取退款订单总额的70%', '活动开始前2天收取退款订单总额的50%',
            '活动开始前3天收取退款订单总额的0%'
        ],
        menu: ''
    },
    actionSheetTap: function() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    actionSheetbindchange: function() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    bindMenu1: function() {
        this.setData({
            menu: 1,
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    bindMenu2: function() {
        this.setData({
            menu: 2,
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    bindMenu3: function() {
        this.setData({
            menu: 3,
            actionSheetHidden: !this.data.actionSheetHidden
        })
    }
})