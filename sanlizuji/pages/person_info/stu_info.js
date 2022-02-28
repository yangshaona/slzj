// pages/person_info/stu_info.js
import {
    SaveInfo
} from '../../utils/text.js'
let user = wx.getStorageSync('user');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //用户信息
        user: user,
        //弹窗是否显示
        showModal: false,
        //监护人姓名和电话
        parent_name: '',
        parent_phone: '',
        trigger: '',
        stu_name: "",
        tmp: "",
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        user = wx.getStorageSync('user')
        this.setData({
            user: user,
        });
        this.GetParentsList();

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
        console.log("学生信息")
        console.log(user)
        this.setData({
            user: user
        });
        this.GetParentsList();
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

    /**
     * 控制显示
     */
    Bind: function(e) {
        this.setData({
            showModal: true,
            trigger: e.currentTarget.dataset.trigger,

        });
        console.log("点击哪里");
        console.log(e)

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
     * 获取监护人姓名输入值
     */
    nameInput: function(e) {
        this.setData({
            parent_name: e.detail.value
        })
    },
    /**
     * 获取监护人电话号码输入值
     */
    phoneInput: function(e) {
        this.setData({
            parent_phone: e.detail.value
        })
    },
    // 修改姓名
    stuName: function(e) {
        this.setData({
            tmp: e.detail.value
        })
        console.log("修改姓名");
        console.log(this.data.tmp);
    },
    // 身份证信息的修改
    stuIdNum: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("身份证信息");
        console.log(this.data.tmp);
    },
    // 手机号信息的修改
    stuPhone: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("手机号信息");
        console.log(this.data.tmp);
    },
    // 学校信息的修改
    stuSchool: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("学校信息");
        console.log(this.data.tmp);
    },
    // 年级信息的修改
    stuGrade: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("年级信息");
        console.log(this.data.tmp);
    },
    // 备注信息的修改
    stuMark: function(e) {
        this.setData({
            tmp: e.detail.value,
        })
        console.log("备注信息");
        console.log(this.data.tmp);
    },
    /**
     * 点击确定按钮获取input值并且关闭弹窗
     */
    //修改信息
    checkInfo: function(trigger) {
        var _user = user;
        var that = this;
        if (that.data.tmp == '') {
            wx.showModal({
                content: "请输入内容",
                showCancel: false,
            })
        } else {
            _user[trigger] = that.data.tmp;

            wx.setStorageSync('user', _user);
            // that.SaveInfo();


            var modelName = "Userinfo";
            var modelData = {
                name: user.name,
                nikename: user.nickname,
                header: user.header,
                openid: user.openid,
                idnum: user.idnum,
                birthday: user.birthday,
                sex: user.sex,
                sexid: user.sexid,
                education: user.education,
                phone: user.phone,
                schoolname: user.schoolname,
                grade: user.grade,
                class: user.class,
                province: user.province,
                city: user.city,
                district: user.district,
                parents: that.data.parent_name,
                p_phone: that.data.parent_phone,
                aller: user.aller,
                regsterdate: user.regsterdate,
            }
            SaveInfo(modelData, modelName);


            console.log("2222222");
            console.log(user);
            that.setData({
                showModal: false,
                tmp: '',
            })

        }
    },
    ok: function() {
        let that = this;
        console.log(that.data.parent_name);
        console.log(that.data.parent_phone);
        var trigger = that.data.trigger;
        console.log("trigger", trigger);
        // 绑定事件
        if (trigger == 'bind') {
            wx.request({
                url: app.globalData.url + 'WxUser/SearchParent',
                data: {
                    name: that.data.parent_name,
                    phone: that.data.parent_phone,
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    console.log("父母信息");
                    console.log(res)
                    if (res.data.data.msg == "请输入姓名和电话") {
                        wx.showModal({
                            content: res.data.data.msg,
                            showCancel: false,
                        })

                    } else {
                        if (res.data.data.length == 0) {
                            wx.showModal({
                                content: "监护人未注册",
                                showCancel: false,
                            })
                        } else {
                            that.kidBindParent(res.data.data[0].id);

                        }
                    }
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })
        }
        // 修改信息事件 
        else if (trigger == 'name' || trigger == 'idnum' || trigger == 'phone' || trigger == 'schoolname' || trigger == 'grade' || trigger == 'aller') {
            that.checkInfo(trigger);
        }


        that.setData({
            user: user
        })
    },
    //退出登录
    logout: function() {
        wx.setStorageSync('user', null);
        wx.setStorageSync('id_flag', null);
        wx.setStorageSync('avator', null);
        app.globalData.flag_identity = [1, 0, 0];
        this.setData({
            user: '',
        })
        wx.switchTab({
            url: '../person/person',
        })
    },
    //孩子绑定父母
    kidBindParent: function(pid) {
        let that = this;
        console.log("父母id", pid)
        wx.request({
            url: app.globalData.url + "WxUser/KidBindParent",
            data: {
                id: user.id,
                pid: pid,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("绑定数据")
                console.log(res)
                console.log(res.data.code)
                that.setData({
                    showModal: false
                })
                if (res.data.code == 200) {
                    that.SaveInfo();
                    wx.showToast({
                        title: "绑定成功",
                        icon: "success",
                        duration: 1000,
                    })
                } else {
                    wx.showToast({
                        title: "绑定失败",
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
    //获取已绑定的家长信息
    GetParentsList: function() {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxUser/GetParentList',
            data: {
                id: user.id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("成功获取绑定的家长信息11");
                console.log(res)
                var pname_list = [],
                    phone_list = [];
                if (res.data.msg == "获取列表信息成功") {
                    for (var key of res.data.data) {
                        pname_list.push(key.name);
                        phone_list.push(key.phone);
                    }
                    user.parents = pname_list.join(',');
                    user.p_phone = phone_list.join(',');

                } else {
                    user.parents = "未绑定监护人信息";
                    user.p_phone = "";
                }
                that.setData({
                    user: user
                })
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    //手机号码输入检查
    checkPhone: function(phNum, id) {
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(16[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
        if (phNum.length != 11 || !reg.test(phNum)) {
            wx.showModal({
                content: id + '输入有误', //提示的内容,
                showCancel: false, //是否显示取消按钮,
            });
            return false;
        } else {
            console.log("手机号填写格式正确");
            return true;
        }
    },
    // 身份证号输入验证
    checkID: function(id) {
        var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (id.length < 18) {
            console.log("身份证号输入位数不正确");
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800
            })
            return false;
        } else if (!reg.test(id)) {
            console.log("身份证格式错误");
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800
            })
            return false;
        } else {
            console.log("身份证号验证通过")
            return true;
        }
    }


})