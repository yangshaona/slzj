import { GetActDetail, GetKidsList, CouponCheck, GetOrderDetail, changeOrderInfo } from '../../utils/apis.js';
import { checkPhone } from '../../utils/function.js'
const check_idnum = require('../../utils/function.js');
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
        // 增添随行人
        userList: [{
            name: "",
            idnum: "",
            phone: "",
        }],
        otherInfo: '',
        showModal: false,
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

        // 如果该活动类型可以添加随行人则弹窗提示是否添加随行人
        if (that.data.order.isOther != 0) {
            wx.showModal({
                title: "添加随行人",
                content: '是否增添监护人一同随行',
                success(res) {
                    if (res.confirm) {
                        // 填写随行人信息
                        that.setData({
                            showModal: true,
                        })
                    } else {
                        that.setData({
                            payPrice: that.data.onePrice - that.data.price,
                        });
                        that.changeOrderInfo(1, '', that.data.payPrice);

                        wx.redirectTo({
                            url: './pay?orderid=' + that.options.orderid + '&price=' + that.data.payPrice + "&key=" + that.data.coupons + "&userinfo=" + that.options.userinfo,
                        });
                    }
                }
            })
        } else {
            wx.redirectTo({
                url: './pay?orderid=' + that.options.orderid + '&price=' + that.data.payPrice + "&key=" + that.data.coupons + "&userinfo=" + that.options.userinfo,
            });
        }
    },
    // 修改订单信息
    changeOrderInfo(num, OtherInfo, needPayMoney) {
        let that = this;
        changeOrderInfo({
            orderid: that.options.orderid,
            order_num: num,
            OtherInfo: OtherInfo,
            needPayMoney: needPayMoney,
        }).then(value => {
            console.log("修改订单结果", value);
        });
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
            if (value.data.data[0].OtherInfo != '') {
                that.setData({
                    userList: JSON.parse(value.data.data[0].OtherInfo),
                });
            }

            console.log(that.data.userList)
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

    // 增添随行人
    addUser(e) {
        console.log(e.detail.value, 111)
        let index = e.target.dataset.id;
        let userList = this.data.userList;
        userList[index].name = e.detail.value.trim();
        this.setData({
            userList
        })
    },
    addIdCard(e) {
        console.log(e.detail.value, 222)
        let index = e.target.dataset.id;
        let userList = this.data.userList;
        var data = check_idnum.checkIdCard(e.detail.value);
        if (!data.idCardFlag) {
            wx.showToast({
                title: '身份证号有误',
                icon: 'none',
                duration: 800
            })
            return;
        }
        userList[index].idnum = e.detail.value.trim();
        this.setData({
            userList
        })
    },
    addTel(e) {
        console.log(e.detail.value, 333)
        let index = e.target.dataset.id;
        let userList = this.data.userList;
        if (!checkPhone(e.detail.value.trim())) {
            wx.showToast({
                title: '请填写正确的手机号',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        userList[index].phone = e.detail.value.trim();
        this.setData({
            userList
        })
    },
    // 添加随行人
    addList() {
        let userList = this.data.userList;
        console.log("添加人信息为", userList);
        if (userList[userList.length - 1].name.trim() !== '' && userList[userList.length - 1].idnum.trim() !== '' && userList[userList.length - 1].phone.trim() !== '') {
            setTimeout(() => {
                let userList = this.data.userList;
                userList.push({
                    name: "",
                    idnum: '',
                    phone: ""
                })
                this.setData({
                    userList
                }, 300)
            })
        } else {
            wx.showToast({
                title: '请填写完整再追加',
                icon: 'none',
                duration: 2000
            })
            return;
        }

    },
    delList() {
        let userList = this.data.userList;
        if (userList.length > 1) {
            userList.pop();
            this.setData({
                userList: userList
            })
        } else {
            wx.showToast({
                title: '操作失败，无法继续删除',
                icon: 'none',
                duration: 2000,
            })
        }

    },
    // 点击提交按钮
    ok: function() {
        let userList = this.data.userList;
        let that = this;
        if (userList[userList.length - 1].name.trim() == '' || userList[userList.length - 1].idnum.trim() == '' || userList[userList.length - 1].phone.trim() == '') {
            wx.showToast({
                title: '请填写完整再提交',
                icon: 'none',
                duration: 2000,
            })
        } else {
            // 修改改变数量的订单参与人数数据
            that.setData({
                num: userList.length + 1,
                payPrice: this.data.onePrice * (userList.length + 1) - that.data.price,
            })
            that.changeOrderInfo(that.data.num, JSON.stringify(userList), that.data.payPrice);
            // 跳转到订单确认界面
            wx.redirectTo({
                url: './pay?orderid=' + that.options.orderid + '&price=' + that.data.payPrice + "&key=" + that.data.coupons + "&userinfo=" + that.options.userinfo,
            });
            this.setData({
                showModal: false,
            })
        }
    },
    back: function() {
        // 跳转到订单确认界面 
        let that = this;
        this.setData({
            showModal: false,
        })
        wx.redirectTo({
            url: './pay?orderid=' + that.options.orderid + '&price=' + that.data.payPrice + "&key=" + that.data.coupons + "&userinfo=" + that.options.userinfo,
        });

    }
})