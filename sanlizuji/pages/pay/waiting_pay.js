import { GetActDetail, GetKidsList, CouponCheck, GetOrderDetail, changeOrderInfo } from '../../utils/apis.js';
const app = getApp();
let user = wx.getStorageSync('user');
let id_flag = wx.getStorageSync('id_flag');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 标题
        title: '',
        // 起始日期
        date: '',
        // 学员选择器，需要后端初始化
        stu_arr: [],
        idx: -1,
        // 用户选择的学员
        stu: '',
        stuinfo: user,
        // 设备信息
        screenHeight: '',
        //订单详情
        order: '',
        //用户信息
        userinfo: user,
        id_flag: id_flag,
        // 优惠券码
        coupons_key: "",
        // 优惠金额
        price: 0,
        // 需要支付的金额
        payPrice: 0,
        // 每个订单的价格
        onePrice: 0,
        // 购买数量记录
        num: 1,
        // 记录订单初始时的购买数量
        order_num: 1,
    },

    //跳转进入购买须知
    toBuyInfo: function(e) {
        console.log("跳转到购买须知")
        console.log(e)
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
        });
    },
    //  提交订单
    checkSubmit: function(e) {
        var that = this;
        console.log(that.options);
        var id = e.currentTarget.dataset.id;
        console.log("优惠券金额", that.data.price);
        if (that.data.num != that.data.order_num) {
            changeOrderInfo({
                orderid: that.options.orderid,
                order_num: that.data.num,
            }).then(value => {
                console.log("修改订单购买数量结果", value);
            })
        }
        wx.redirectTo({
            // url: './pay?orderid=' + that.options.orderid + '&price=' + that.data.order.price + "&key=" + that.data.coupons_key + "&coupons=" + that.data.price + "&userinfo=" + that.options.userinfo,
            url: './pay?orderid=' + that.options.orderid + '&price=' + that.data.payPrice + "&key=" + that.data.coupons + "&userinfo=" + that.options.userinfo,

        })
    },

    // 获取设备信息
    getSysInfo: function(e) {
        wx.getSystemInfo({
            success: (result) => {
                this.setData({
                    screenHeight: (result.screenHeight - result.statusBarHeight)
                })
            },
        })
    },
    Init: function() {
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        let userinfo = JSON.parse(that.options.userinfo);
        that.setData({
                userinfo: user,
                id_flag: id_flag,
                stuinfo: userinfo,
            })
            // 获取学生订单数据
        GetOrderDetail({
            id: that.options.orderid,
            modelName: 'SignList',
        }).then(value => {
            const p = GetActDetail({
                id: that.data.courseid,
                modelName: 'ClubNews',
            });
            p.then(value2 => {
                console.log("课程详情", value2)
                that.setData({
                    order: value2.data.data[0],
                    payPrice: value2.data.data[0].price * value.data.data[0].order_num,
                    onePrice: value2.data.data[0].price,
                    num: value.data.data[0].order_num,
                    order_num: value.data.data[0].order_num
                })
            }, reason => {
                console.log("获取课程数据失败", reason);
            });
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("待付款订单页面", options);
        let that = this;
        that.setData({
            courseid: options.id,
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
        that.Init(that.data.courseid);
    },

    //   查找获取是否有优惠券
    getCoupons: function(e) {
        let that = this;
        console.log("优惠券码", coupons_key);
        const p = CouponCheck({
            key: that.data.coupons_key,
            courseid: that.options.id,
        })
        p.then(value => {
            console.log("优惠券信息", value);
            var data = ["未找到匹配优惠券", '优惠券已使用', '未到生效时间', '优惠券已过期', '非对应课程'];
            if (data.indexOf(value.data.data[0]) != -1) {
                wx.showToast({
                    title: value.data.data[0],
                    icon: "none",
                    duration: 800,
                })
            } else {
                wx.showToast({
                    title: '已搜索到优惠券',
                    icon: "none",
                    duration: 800,
                });
                let payPrice = that.data.payPrice;
                console.log("应付金额", payPrice);
                that.setData({
                    price: value.data.data.money,
                    payPrice: payPrice - value.data.data.money,
                });
                console.log("优惠券金额", that.data.price);
            }
        }, reason => {
            console.log("获取优惠券数据失败", reason);
        });
    },
    // 输入优惠券码
    searchCoupons: function(e) {
        console.log(e)
        this.setData({
            coupons_key: e.detail.value,
        })
    },
    // 用于记录购买的数量，默认为1
    setValue: function(e) {
        this.setData({
            num: e.detail.value
        });
        console.log(this.data.num);
    },
    add: function(e) {
        var num, that = this;
        this.data.num++;
        num = that.data.num;
        that.setData({
            num: num,
            payPrice: this.data.onePrice * that.data.num - that.data.price,
        })
    },
    reduce: function(e) {
        var num = 1,
            that = this;
        if (this.data.num <= 1) {
            wx.showToast({
                title: '数量不能为0哦！',
                icon: "none",
                duration: 500
            })
        } else {
            this.data.num--;
            num = this.data.num;
            that.setData({
                num: num,
                payPrice: that.data.onePrice * that.data.num - that.data.price,
            })
        }
        console.log(num)
    },
})