// pages/register/register_teacher.js
const app = getApp();
const check_idnum = require('../../utils/text.js'); //路径根据自己的文件目录来
const areaList = require('../../utils/arealist.js');
Page({

    /**
     * 页面的初始数据
     */

    data: {
        filepath: '',
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
        reg: ['北京', '北京', '东城'],
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
        province: [],
        //是否显示用户协议
        isTipTrue: false,
        isAgree: false,
        is_show: 0,
    },
    // 同意协议
    tipAgree: function() {
        this.setData({
            isTipTrue: false,
            isAgree: true,
        })
        this.getNickName()

    },
    tipCancel: function() {
        this.setData({
                isTipTrue: false,
                isAgree: false,
            })
            // setTimeout(function() {
        wx.showToast({
                title: "请先同意协议",
                duration: 1000,
            })
            // }, 800)
    },
    // 跳转到用户协议
    toProtocol: function() {
        wx.navigateTo({
            url: '../protocol/protocol',

        })
    }, // 跳转到用户隐私
    toPrivacy: function() {
        wx.navigateTo({
            url: '../privacy_policy/privacy_policy',

        })
    },
    //获取用户昵称
    getNickName: function(e) {
        if (!this.data.isAgree) {
            this.setData({
                isTipTrue: true,
            })
        }
        if (this.data.isAgree) {
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
                    wx.setStorageSync('avator', res.userInfo.avatarUrl)
                },
                fail: (res) => {
                    console.log(res.errMsg)
                }
            })
        }
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
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(16[0-9]{1})|(14[0-9]{1}))+\d{8})$/;

        if (phNum.length != 11 || !reg.test(phNum)) {
            wx.showToast({
                title: '手机号有误',
                icon: 'error',
                duration: 800,
            })
            return false;
        } else {
            console.log("手机号填写格式正确");
            return true;
        }
    },
    // 身份证号输入验证
    checkID: function(id) {
        console.log("检查结果");
        var data = check_idnum.checkIdCard(id);
        console.log(data.idCardFlag);
        if (!data.idCardFlag) {
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800

            })
            return false;
        } else {
            // wx.showToast({
            //     title: '通过了',
            // })
            this.setData({
                birth: data.birth,
                sex: data.sex,
            })
            console.log(data);
            console.log(data.sex);
            return true;
        }
    },
    // 检查身份证是否正确
    InputIdNum: function(e) {
        this.checkID(e.detail.value);
    },
    // 检查姓名是否正确
    InputName: function(e) {
        var that = this;
        console.log(e);
        var name = e.detail.value
        var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/;

        if (name.match(reg)) {
            console.log("111");
            // that.setData({ allow_name: true });
            wx.setStorageSync("name", name)
        } else {
            wx.showToast({
                title: "姓名有误",
                icon: 'error',
                duration: 800
            })
        }
        console.log(name)
    },
    // 检查手机号是否输入正确
    InputPhone: function(e) {
        this.checkPhone(e.detail.value);
    },

    chooseFiles: function(e) {
        console.log("上传文件");
        wx.chooseMessageFile({
            count: 1,
            type: "all",
            success: (res) => {
                wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 800
                });
                console.log("上传文件返回的结果");
                console.log(res);
                var files = res.tempFiles;
                this.setData({
                    filepath: files,
                })
                console.log(files[0].path);
                wx.setStorageSync('exp', files[0].path);
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

    upLoadFiles(data) {
        let that = this;
        console.log
        var exp = wx.getStorageSync('exp');
        console.log("简历路径");
        console.log(exp);
        wx.uploadFile({
            //请求后台的路径
            url: app.globalData.url + 'WxUser/SaveImg',
            //小程序本地的路径
            filePath: exp,

            name: 'file',
            formData: {
                //图片命名：用户id-商品id-1~9
                newName: data.openid + "of resume",
                id: data.id,
                modelName: 'Teacher',
                file_type: 'pdf',
            },
            success(res) {
                console.log(res);
                console.log(res.statusCode);
                if (res.statusCode == 200) {
                    console.log("成功上传简历");

                    wx.showToast({
                        title: "文件保存成功",
                        icon: 'success',
                        duration: 800,
                    });

                } else {
                    wx.showToast({
                        title: "文件保存失败",
                        icon: 'success',
                        duration: 800,
                    });
                }

            },
            fail(res) {
                wx.showModal({
                    title: '提示',
                    content: '上传失败',
                    showCancel: false
                })
            }
        })
    },
    // 获取用户信息
    getUserInfo: function(e) {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxUser/GetUserInfo2',
            data: {
                openid: app.globalData.openid,
                id_flag: 'teacher',
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("获取成功");
                console.log(res);
                that.upLoadFiles(res.data.data);
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
                            });
                            console.log("22222222222")
                            var type = parseInt(data.type) + 1;
                            console.log(type)
                            app.globalData.openid = res.data.openid;
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
                                        type: parseInt(data.type) + 1,
                                        phone: data.phone,
                                        province: that.data.reg[0],
                                        city: that.data.reg[1],
                                        district: that.data.reg[2],
                                    }
                                },
                                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                // header: {}, // 设置请求的 header
                                success: function(res) {
                                    // success
                                    console.log("表单检查成功");
                                    that.getUserInfo();
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
        if (tmp[1] == '北京市') {
            tmp[1] = '北京';

        } else if (tmp[1] == '天津市') {
            tmp[1] = '天津';
        }
        console.log("选中的是：", tmp)
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
            time: time,
            is_show: app.globalData.is_show,
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