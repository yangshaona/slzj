// pages/person_info/stu_info.js
let user = wx.getStorageSync('user')
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
    },

    /**
     * 控制显示
     */
    Bind: function() {
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
    /**
     * 点击确定按钮获取input值并且关闭弹窗
     */

    ok: function() {
        let that = this;
        console.log(that.data.parent_name);
        console.log(that.data.parent_phone);
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

    },
    //退出登录
    logout: function() {
        wx.setStorageSync('user', null)
        wx.setStorageSync('id_flag', null);
        wx.setStorageSync('avator', null)
        app.globalData.flag_identity = [1, 0, 0]
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

                    wx.request({
                        url: app.globalData.url + 'WxUser/UpdateUserInfo',
                        data: {
                            id: user.id,
                            modelName: "Userinfo",
                            Userinfo: {
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
                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        // header: {}, // 设置请求的 header
                        success: function(res) {
                            // success
                            console.log("更改个人信息")
                            console.log(res)
                        },
                        fail: function() {
                            // fail
                        },
                        complete: function() {
                            // complete
                        }
                    })

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
    //获取所有绑定的所有父母姓名
    GetParentsName: function() {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxUser/GetParentsName',
            data: {
                id: user.id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                if (res.data.data.msg == "获取成功") {
                    user.parents = res.data.data.data.join(',');
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        user = wx.getStorageSync('user')
        this.setData({
            user: user,
        });
        // this.GetParentsName();
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
        // this.GetParentsName();
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

    }
})