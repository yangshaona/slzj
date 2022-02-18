// pages/register/register_teacher.js
const app = getApp();

const areaList = require('../../utils/arealist.js');
Page({

    /**
     * 页面的初始数据
     */

    data: {
        // 能否获得用户微信昵称
        cangetUserInfo: false,
        //表单各个小标题
        formTitle: { 'name': '姓名', 'idNum': '身份证号', 'birth': '生日', 'sex': '性别', 'type': '类型', 'nickName': '昵称', 'phone': '手机号', 'region': '地区', 'exp': '简历' },
        // 类型picker
        tp: ['企业', '学校', '兼职'],
        tp_idx: null,
        // 生日picker
        birth_idx: null,
        // 地区picker
        reg: [],
        reg_idx: null,
        // 姓名
        name: "",
        // 身份证号
        idNum: "",
        // 生日
        birth: "",
        // 类型
        type: 0,
        //性别
        sex: "",
        sexid: "",
        //用户昵称
        nickName: "",
        //手机号
        phone: "",
        // 地区
        region: [],
        // 简历
        exp: [],
        //头像
        header: "",
        openid: "",
        //地区
        multiArray: [],
        multiIndex: [0, 0, 0],
        province: []
    },

    //获取用户昵称
    getNickName: function(e) {
        wx.getUserProfile({
            desc: '获取用户昵称',
            success: (res) => {
                console.log("获取用户微信昵称成功"),
                    console.log(res)
                this.setData({
                    cangetUserInfo: true,
                    nickName: res.userInfo.nickName,
                    header: res.userInfo.avatarUrl,
                })
            },
            fail: (res) => {
                console.log(res.errMsg)
            }
        })
    },

    // 类型选择器改变
    typeChange: function(e) {
        console.log("类型改变为: " + e.detail.value)
        this.setData({
            tp_idx: e.detail.value
        })
    },
    // 生日选择器改变
    birthChange(e) {
        this.setData({
            birth_idx: e.detail.value
        })
        console.log("生日改变为" + e.detail.value)
    },
    // 地区选择器改变
    regionChange: function(e) {
        console.log("地区改变为" + e.detail.value);
        this.setData({
            reg: e.detail.value,
            reg_idx: 1
        })
    },

    //手机号码输入检查
    checkPhone: function(phNum) {
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (phNum.length != 11 || !reg.test(phNum)) {
            wx.showModal({
                content: '手机号输入有误',
                showCancel: false,
            })
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
    },
    // 选择文件
    chooseFiles: function(e) {
        wx.chooseMessageFile({
            count: 1,
            type: "all",
            success: (res) => {
                wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 800
                });
                console.log(res);
                var files = res.tempFiles;
                var exp = [];
                for (var idx in files) {
                    exp.push(files[idx].path);
                }
                console.log(exp);
                this.setData({
                    exp: exp
                })
            },
            fail: (res) => {
                console.log(res);
                wx.showToast({
                    title: '上传失败',
                    icon: 'error',
                    duration: 800
                })
            }
        })
    },
    // 注册表单提交
    submit: function(e) {
        // 留空检查
        let that = this;
        var data = e.detail.value;
        console.log(data);
        for (var i in data) {
            if (data[i] == null || data[i] == "") {
                console.log(i);
                console.log(data[i]);
                console.log("表单有未填写部分");
                wx.showToast({
                    title: '请填写' + this.data.formTitle[i],
                    icon: 'error',
                    duration: 800
                })
                return;
            }
        }
        // 全部已填写
        // 电话号码格式检查
        if (this.checkPhone(data.phone)) {
            // 身份证号格式检查
            if (this.checkID(data.idNum)) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 800
                })
            } else {
                console.log("身份证号填写有误");
                return;
            }
            // 赋值
            this.setData({
                name: data.name,
                idNum: data.idNum,
                birth: data.birth,
                sex: data.sex,
                type: this.data.tp[data.type],
                phone: data.phone,
                region: data.region,
                exp: data.exp,
            })
            if (data.sex == '男') {
                that.setData({
                    sexid: "1",
                })
            } else {
                that.setData({
                    sexid: "2",
                })
            }
            wx.login({
                success: function(res) {
                    // success
                    console.log("获取openid")
                    console.log(res)
                    wx.request({
                        url: app.globalData.url + "WxUser/getOpenId",
                        data: {
                            code: res.code
                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        // header: {}, // 设置请求的 header
                        success: function(res) {
                            // success
                            console.log(res)
                            that.setData({
                                openid: res.data.openid
                            })
                            app.globalData.openid = res.data.openid
                            console.log("app openid")
                            console.log(app.globalData.openid)
                            console.log("教师数据")
                            console.log(data)
                            console.log("教师性别id:", that.data.sexid);
                            wx.request({
                                url: app.globalData.url + 'WxUser/Register&modelName=Teacher',
                                data: {
                                    Teacher: {
                                        header: that.data.header,
                                        openid: res.data.openid,
                                        birthday: data.birth,
                                        idnum: data.idNum,
                                        resume: data.exp,
                                        name: data.name,
                                        sex: data.sex,
                                        sexid: that.data.sexid,
                                        type: data.type,
                                        phone: data.phone,
                                        province: data.region[0],
                                        city: data.region[1],
                                        district: data.region[2],
                                    }
                                },
                                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                // header: {}, // 设置请求的 header
                                success: function(res) {
                                    // success
                                    console.log("表单检查成功");

                                    console.log(res)
                                    if (res.data.data.msg == "该手机号已注册") {
                                        wx.showModal({
                                            content: '该手机号已注册',
                                            showCancel: false,
                                        })
                                    } else {
                                        wx.showModal({
                                            content: '成功添加个人信息',
                                            showCancel: false,
                                        })
                                        console.log("表单检查成功");
                                        setTimeout(function() {
                                            wx.navigateTo({
                                                url: '../login/login?id=teacher'
                                            })
                                        }, 800);

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

                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })

        } else {
            console.log("手机号填写错误");
            return;
        }
    },
    // 绑定已有数据
    login: function(e) {
        app.globalData.flag_identity = [0, 1, 0];
        console.log(app.globalData.flag_identity[0])
        console.log(app.globalData.flag_identity[1])
        console.log(app.globalData.flag_identity[2])
        console.log("数据")
        wx.navigateTo({
            url: '../login/login?id=teacher',
        })
    },
    //获取地区
    bindMultiPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            multiIndex: e.detail.value,
            reg_idx: 1
        })
    },
    bindMultiPickerColumnChange: function(e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        const provinceName = data.multiArray[0][data.multiIndex[0]];
        let provinceId = "";
        let province = this.data.province;
        let quyuList = [],
            cityList = [],
            provinceList = [],
            city = [],
            area = [];
        try {
            province.forEach(item => {
                if (item.name === provinceName) {
                    provinceId = item.id;
                    throw (new Error('find item'))
                }
            })
        } catch (err) {}
        city = areaList.filter(item => {
            return item.pid == provinceId;
        })
        if (e.detail.column == 0) {
            data.multiIndex = [e.detail.value, 0, 0];
            try {
                area = areaList.filter(item => {
                    return item.pid == city[data.multiIndex[1]].id;
                })
            } catch (err) {}
        } else if (e.detail.column == 1) {
            data.multiIndex[2] = 0;
            area = areaList.filter(item => {
                return item.pid == city[e.detail.value].id;
            })
        } else {
            const cityName = data.multiArray[1][data.multiIndex[1]];
            let cityId = '';
            try {
                areaList.forEach(item => {
                    if (item.name === cityName) {
                        cityId = item.id;
                        throw (new Error('find item'));
                    }
                })
            } catch (err) {}
            area = areaList.filter(item => {
                return item.pid == cityId;
            })
        }
        provinceList = province.map(item => {
            return item.name
        })
        cityList = city.map(item => {
            return item.name;
        })
        quyuList = area.map(item => {
            return item.name;
        })
        data.multiArray = [provinceList, cityList, quyuList],
            this.setData(data);
        var tmp = [];
        for (var i = 0; i < 3; i++) {
            tmp[i] = data.multiArray[i][data.multiIndex[i]];

        }
        this.setData({
            reg: tmp,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var now = new Date;
        var time = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
        this.setData({
            time: time
        })
        var province = [],
            city = [],
            area = [];
        province = areaList.filter(item => {
            return item.pid == 0;
        })
        city = areaList.filter(item => {
            return item.pid == province[0].id;
        })
        area = areaList.filter(item => {
            return item.pid == city[0].id;
        })
        var provinceList = province.map(item => {
            return item.name
        })
        var cityList = city.map(item => {
            return item.name;
        })
        var quyuList = area.map(item => {
            return item.name;
        })
        this.setData({
            multiArray: [provinceList, cityList, quyuList],
            province
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

        app.globalData.flag_identity = [0, 1, 0];
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