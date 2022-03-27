// pages/myApply/myApply.js
const app = getApp();
let user = wx.getStorageSync('user');
let id_flag = wx.getStorageSync('id_flag');
import {
    UpdateOrder
} from '../../utils/text.js'
Page({

    /**
     * 页面的初始数据
     */

    data: {
        // 状态栏高度
        statusHeight: app.globalData.statusHeight,
        // 屏幕高度
        height: app.globalData.height,
        // 选择框
        selectBox: [
            { 'id': 0, 'ctn': '全部', 'class': 'selected' },
            { 'id': 1, 'ctn': '报名失败', 'class': 'select' },
            { 'id': 2, 'ctn': '待付款', 'class': 'select' },
            { 'id': 3, 'ctn': '报名成功', 'class': 'select' },
            { 'id': 4, 'ctn': '已完成', 'class': 'select' },
        ],
        // 提交服务端的筛选条件
        select: "全部",
        // 显示的报名
        display: [],
        filter: [],
        flag_identity: app.globalData.flag_identity,
        // 是否显示评价按钮
        cmt_display: true,
        //身份
        id_flag: id_flag,
        user: user,
        now: "",
        kids_name: "",
        lowOrderId: '',
        actionSheetHidden: true,
        actionSheetItems: [
            '活动开始前1天退款订单总额的0%',
            '活动开始前2天退款订单总额的50%',
            '活动开始前3天收取退款订单总额的70%'
        ],
    },

    // 筛选栏点击事件
    selectTap: function(e) {
        var id = e.currentTarget.dataset.id;
        // 样式改变
        var selectBox = this.data.selectBox;
        for (var idx in selectBox) {
            if (idx == id) {
                selectBox[idx].class = 'selected';
            } else {
                selectBox[idx].class = 'select';
            }
        }
        this.setData({
            selectBox: selectBox,
            select: selectBox[id]['ctn']
        })
        console.log("选择：" + this.data.select);
        this.setFilter();
    },
    // 点击查看详情
    goToOrderDetail: function(e) {
        // 点击的id
        var id = e.currentTarget.dataset.courseid;
        var price = e.currentTarget.dataset.price;
        wx.navigateTo({
            url: '../pay/pay?orderid=' + id + '&price=' + price,

        })
    },
    // 删除一条订单记录
    DeleteOneOrder: function(e) {

        console.log("删除订单")
        console.log(e)
        let orderid = e.currentTarget.dataset.id;
        let status = e.currentTarget.dataset.status;

        let that = this;
        if (status == 2) {
            UpdateOrder(orderid, '支付失败', 1);  
        }
        wx.showModal({
            content: "是否删除该记录",
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.url + 'WxSign/orderisshow',
                        data: {
                            // modelName: modelName,
                            id: orderid,
                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        // header: {}, // 设置请求的 header
                        success: function(res) {
                            // success
                            console.log("删除结果");
                            console.log(res);
                            if (res.data.data == '删除失败') {
                                wx.showToast({
                                    title: "删除失败",
                                    icon: 'cancel',
                                    duration: 800,
                                })


                            } else {
                                wx.showToast({
                                    title: "删除成功",
                                    icon: 'success',
                                    duration: 800,
                                });
                                that.setFilter();
                            }

                        },
                        fail: function() {
                            // fail
                        },
                        complete: function() {
                            // complete
                        }
                    })
                } else {
                    console.log("取消删除");
                }

            }
        })
    },
    // 点击评价按钮
    commentTap: function(e) {
        // 点击的id
        var orderid = e.currentTarget.dataset.orderid;
        console.log("点击评价")
        console.log(orderid)
        wx.navigateTo({
            url: '../myApply/comment?orderid=' + orderid,
        })
    },
    // 点击待付款按钮
    applyTap1: function(e) {
        var courseid = e.currentTarget.dataset.courseid;
        var orderid = e.currentTarget.dataset.orderid;
        var userid = e.currentTarget.dataset.userid;
        var that = this;
        console.log("提交订单")
        console.log(courseid)
        console.log(orderid)
        wx.navigateTo({
            url: '../pay/waiting_pay?id=' + courseid + '&orderid=' + orderid + '&userid=' + userid,

        })
    },
    // 点击继续报名按钮
    applyTap2: function(e) {
        var id = e.currentTarget.dataset.id;
        console.log("点击报名")
        console.log(id)
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
        })
    },
    //前往报名
    goToApply: function() {
        wx.switchTab({
            url: '../course/course',
        })
    },
    // 查看导师
    teacherTap: function(e) {
        var courseid = e.currentTarget.dataset.courseid;
        var teacherid = e.currentTarget.dataset.teacherid;
        console.log("点击导师按钮")
        wx.navigateTo({
            url: '../detail/teacher?course_id=' + courseid + "&teacherid=" + teacherid,
        })
    },

    // 筛选显示内容，这部分由服务端实现，这里只是测试一下样式
    setFilter: function() {

        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');

        that.setData({
            flag_identity: app.globalData.flag_identity
        })
        var identity;
        if (id_flag == 'student') {
            identity = "student";
        } else if (id_flag == 'teacher') {
            identity = "teacher";
        } else if (id_flag == 'parent') {
            identity = "parent";
            that.setTitle("孩子的报名")
        }
        that.getApply(user.id, identity, id_flag);
    },

    // 获取报名数据
    getApply: function(id, identity, idflag) {
        let that = this;
        var select = this.data.select;
        var filter = [];
        wx.request({
            url: app.globalData.url + 'WxOther/GetMyApply&identity=' + identity,
            data: {
                id: id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("我的报名", res);
                var total = [],
                    kid_apply = [],
                    apply = [];
                if (idflag == 'parent') {
                    if (user.kids != '') {
                        for (var i = 0; i < res.data.data.data.length; i++) {
                            kid_apply = mergerArr(res.data.data.data[i].data1, res.data.data.data[i].data2);
                            apply.push(kid_apply);
                        }
                        console.log("孩子报名数据", apply);
                        for (var i = 0; i < apply.length; i++) {
                            for (var j = 0; j < apply[i].length; j++) {

                                total.push(apply[i][j]);
                            }
                        }

                        let result = total.sort(that.compare("id"));
                        console.log(result);
                    }
                } else {
                    total = mergerArr(res.data.data1, res.data.data2)
                }
                var now = new Date;

                var date = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
                that.setData({
                    now: date
                })
                for (var idx in total) {
                    var ctn = total[idx];
                    var status = "";
                    var endTime = new Date(ctn['endTime']);

                    if (ctn['status'] == 1) {
                        status = "报名失败";
                    } else if (ctn['status'] == 2) {
                        status = "待付款";
                    } else if (ctn['status'] == 3 && endTime > now) {

                        status = "报名成功";
                        ctn['endTime'] = 'false';
                    } else {
                        status = "已完成"
                    }
                    if (select == status || select == "全部") {
                        filter.push(ctn);
                    }
                }
                that.setData({
                    filter: filter
                })
                for (var i = 0; i < that.data.filter.length; i++) {
                    var end_pay_time = new Date(that.data.filter[i].payendTime);
                    if (that.data.filter[i].status == 2 && (end_pay_time < now || that.data.filter[i].endTime < now)) {
                        UpdateOrder(that.data.filter[i].id, '支付失败', 1);
                        that.setData({
                            ["filter[" + i + "].status"]: 1,
                        })
                    }
                }

                function mergerArr(arr1, arr2) {
                    if (arr1 == [] || arr1.length == 0) {
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
    // 当身份为监护人时对报名数据进行排序
    compare: function(property) {
        return function(a, b) {
            let value1 = a[property];
            let value2 = b[property];
            let result = value2 - value1;
            return result;
        }
    },
    //登录查看更多
    _goLogin: function() {
        wx.navigateTo({
            url: '../register/register_stu',
        })
    },
    // 监护人绑定孩子
    _goBound: function() {
        id_flag = wx.getStorageSync('id_flag');

        wx.navigateTo({
            url: '../person_info/parent_info',
        })

    },
    // 设置标题
    setTitle: function(tname) {
        wx.setNavigationBarTitle({ title: tname })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        console.log("返回的数据是")
        console.log(options)
        user = wx.getStorageSync('user');
        this.setData({
            user: user,
            id_flag: id_flag
        })
        if (user != null && user != '') {
            that.setFilter();
        }

    },
    // 获取孩子信息
    getKidsList: function() {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxUser/GetKidsList',
            data: {
                id: user.id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("孩子信息", res);
                if (res.data.data.length > 0) {
                    var kids = [];
                    kids.push({ "id": "01", "isActive": false, "value": "请选择", "kid_id": 0 })
                    for (var i = 0; i < res.data.data.length; i++) {
                        var kid = { "id": "0" + (i + 2), "isActive": false, "value": res.data.data[i].name, "kid_id": res.data.data[i].id };
                        kids.push(kid);
                    }
                    that.setData({
                        kids_name: kids
                    })
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
    // 选中孩子
    select: function(e) {
        console.log("选中的值是");
        console.log(e.detail);
        var type = e.detail.value
        if (e.detail.value == "请选择") {
            type = "";
        }

        for (var i = 1; i < this.data.kids_name.length; i++) {
            var tmp = "kids_name[" + i + "].isActive"
            this.setData({
                [tmp]: false,
            })
            if (e.detail.id == this.data.kids_name[i].id) {
                this.setData({
                    [tmp]: true
                })
            }
        }
        if (e.detail.kid_id == 0) {
            this.getApply(user.id, 'parent', 'parent');

        } else {
            this.getApply(e.detail.kid_id, 'student', 'student');

        }
    },
    // 退款
    Refund: function(e) {
        console.log(e);
        let that = this;
        that.actionSheetTap();
        that.setData({
            lowOrderId: e.currentTarget.dataset.id,
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
        let that = this;
        user = wx.getStorageSync('user')
        id_flag = wx.getStorageSync('id_flag')
        this.setData({
            user: user,
            id_flag: id_flag
        })
        if (user != null && user != '') {
            that.setFilter();
            if (id_flag == 'parent') {
                this.getKidsList()
            }

        }

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

    },
    onShareAppMessage: function() {

    },
    actionSheetTap: function() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    Confirm: function() {
        let that = this;
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        });
        wx.request({
            url: app.globalData.url + 'WxSign/tgReverse',
            data: {
                lowOrderId: that.data.lowOrderId,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("申请退款");
                console.log(res)
                if (res.data.data.msg == "退款申请成功") {
                    wx.showToast({
                        title: "退款申请成功",
                        icon: "success",
                        duration: 1000,
                    });
                    that.setFilter();
                } else {
                    wx.showToast({
                        title: "退款申请失败",
                        icon: "success",
                        duration: 1000,
                    })
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
})