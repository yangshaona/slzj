// pages/person_info/stu_info.js
import { SaveInfo, checkPhone, checkName, Unbound, initArea, areaColumnChange } from '../../utils/function.js';
import { KidBindParent, SearchParent, GetParentList } from '../../utils/apis.js';
const areaList = require('../../utils/arealist.js');
const check_idnum = require('../../utils/function.js'); //路径根据自己的文件目录来
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
        // 学历更改
        edu: ['小学', '初中', '高中', '专科', '本科', '硕士', '博士'],
        edu_idx: null,
        // 地区更改
        location: "",
        multiArray: [],
        multiIndex: [0, 0, 0],
        province: [],
        showpicker: "off-picker",
        birthday: "",
        sex: '',
        sexid: 0,
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        user = wx.getStorageSync('user')
        this.setData({
            user: user,
            is_show: app.globalData.is_show,
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
        this.getArea();
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
    checkInputName: function(e) {
        this.setData({
            tmp: e.detail.value
        })
        console.log("输入的数据是：", e.detail.value);
        // check_idnum.checkName(e.detail.value);
    },
    // 检查手机号是否输入正确
    checkPhone: function(e) {
        this.setData({
                tmp: e.detail.value,
            })
            // checkPhone(e.detail.value);
    },
    checkIdNum: function(e) {
        this.setData({
            tmp: e.detail.value,
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
    // 学历选择器改变
    eduChange: function(e) {
        console.log("学历改变为: " + e.detail.value);
        var value = this.data.edu[e.detail.value];
        this.setData({
            edu_idx: e.detail.value,
            tmp: value,
        });
        console.log(this.data.tmp);
        this.checkInfo("education");
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
            if (trigger == 'region') {
                _user["province"] = that.data.tmp[0];
                _user["city"] = that.data.tmp[1];
                _user["district"] = that.data.tmp[2];
            } else if (trigger == 'idnum') {
                _user[trigger] = that.data.tmp;
                _user["birthday"] = that.data.birthday;
                _user["sex"] = that.data.sex;
                _user["sexid"] = that.data.sexid;
            } else _user[trigger] = that.data.tmp;
            wx.setStorageSync('user', _user);
            user = wx.getStorageSync('user');
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
            console.log(user);
            that.setData({
                showModal: false,
                tmp: '',
                user: user,
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
            const p = SearchParent({
                name: that.data.parent_name,
                phone: that.data.parent_phone,
            }).then(value => {
                console.log("父母信息", value)
                if (value.data.data.msg == "请输入姓名和电话") {
                    wx.showModal({
                        content: value.data.data.msg,
                        showCancel: false,
                    })
                } else {
                    if (value.data.data.length == 0) {
                        wx.showModal({
                            content: "监护人未注册",
                            showCancel: false,
                        })
                    } else {
                        that.kidBindParent(value.data.data[0].id);
                    }
                }
            }, reason => {
                console.log("获取父母信息数据失败", reason);
            });
        }
        // 修改信息事件 
        else if (trigger == 'name' || trigger == 'idnum' || trigger == 'phone' || trigger == 'schoolname' || trigger == 'grade' || trigger == 'aller') {
            if (trigger == 'name' && check_idnum.checkName(this.data.tmp)) {
                that.checkInfo(trigger);
            } else if (trigger == 'idnum') {
                var data = check_idnum.checkIdCard(this.data.tmp);
                console.log(data.idCardFlag);
                if (!data.idCardFlag) {
                    wx.showToast({
                        title: '身份证号有误',
                        icon: 'error',
                        duration: 800
                    })
                    return false;
                } else {
                    var sexid = data.sex == '男' ? 1 : 2;
                    this.setData({
                        birthday: data.birth,
                        sex: data.sex,
                        sexid: sexid,
                    })
                    that.checkInfo(trigger);
                    return true;
                }
            } else if (trigger == 'phone' && checkPhone(this.data.tmp)) {
                that.checkInfo(trigger);
            } else {
                that.checkInfo(trigger);
            }
        }
        that.setData({
            user: user
        })
    },
    // 检查身份证号是否输入正确
    checkID: function() {
        var data = check_idnum.checkIdCard(this.data.tmp);
        console.log(data.idCardFlag);
        if (!data.idCardFlag) {
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800
            })
            return false;
        } else {
            var _user = wx.getStorageSync('user');
            _user.birthday = data.birth;
            _user.sex = data.sex;
            if (data.sex == '男') {
                _user.sexid = '1';
            } else {
                _user.sexid = '2';
            }
            wx.setStorageSync('user', _user);
            user = wx.getStorageSync('user');
            console.log("身份证信息");
            console.log(this.data.tmp);
            return true;
        }
    },

    //退出登录
    logout: function() {
        let user = wx.getStorageSync('user');
        Unbound(user.id, 'Userinfo');
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
        console.log("父母id", pid);
        const p = KidBindParent({
            id: user.id,
            pid: pid,
        }).then(value => {
            console.log("绑定数据", value);
            that.setData({
                showModal: false
            })
            if (value.data.code == 200) {
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
        }, reason => {
            console.log("绑定父母失败", reason);
        });
    },
    //获取已绑定的家长信息
    GetParentsList: function() {
        let that = this;
        const p = GetParentList({
            id: user.id,
        }).then(value => {
            console.log("成功获取绑定的家长信息", value);
            var pname_list = [],
                phone_list = [];
            if (value.data.msg == "获取列表信息成功") {
                for (var key of value.data.data) {
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
        }, reason => {
            console.log("绑定家长数据失败", reason);
        });
    },

    // 提示不要随便修改地址
    changeAddress: function() {
        wx.showModal({
            title: "警告",
            content: "请不要随意更改地址！",
            confirmText: "知道了",
            showCancel: false,
        })
        this.setData({
            showpicker: "show-picker",
        })
    },
    //获取地区
    bindMultiPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            multiIndex: e.detail.value,
            reg_idx: 1,
            showpicker: "off-picker",
        })
    },
    bindMultiPickerColumnChange: function(e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        var data = {
            "multiArray": this.data.multiArray,
            "multiIndex": this.data.multiIndex,
            "province": this.data.province,
            "e": e,
        }
        let res = areaColumnChange(data);
        this.setData({
            reg: res.tmp,
            tmp: res.tmp,
            multiArray: res.data.multiArray,
            multiIndex: res.data.multiIndex
        });
        this.checkInfo("region");
    },
    getArea: function() {
        let data = initArea();
        this.setData({
            multiArray: [data.provinceList, data.cityList, data.quyuList],
            province: data.province
        });
    },

})