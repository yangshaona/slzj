// pages/register/register_stu.js
import { checkPhone, areaColumnChange, initArea } from '../../utils/function.js';
const formatTime = require('../../utils/function.js');
import WeCropper from '../dev/we-cropper.js';
import GlobalConfig from '../dev/config.js';
import { Register, schoollist, GetUserInfo2, getOpenId } from '../../utils/apis.js';
const config = new GlobalConfig();
config.init();
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;
const windowHeight = device.windowHeight - 50;
var app = getApp();
const areaList = require('../../utils/arealist.js');
const check_idnum = require('../../utils/function.js'); //路径根据自己的文件目录来
Page({
    /**
     * 页面的初始数据
     */
    data: {
        windowHeight: windowHeight,
        //标题高度
        top_width: 0,
        top_height: 0,
        statusHeight: app.globalData.statusHeight,
        cropperOpt: {
            id: 'cropper',
            targetId: 'targetCropper',
            pixelRatio: device.pixelRatio,
            width,
            height,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: (width - 300) / 2,
                y: (height - 300) / 2,
                width: 300,
                height: 300
            },
            boundStyle: {
                color: config.getThemeColor(),
                mask: 'rgba(0,0,0,0.8)',
                lineWidth: 1
            }
        },
        // 能否获得用户微信昵称
        cangetUserInfo: false,
        //表单各个小标题
        formTitle: { 'name': '姓名', 'idnum': '身份证号', 'birthday': '生日', 'sex': '性别', 'education': '在读学历', 'nikename': '昵称', 'phone': '手机号', 'schoolname': '学校名称', 'region': '地区', 'grade': '年级', 'class': '班级', 'parents': '监护人姓名', 'p_phone': '监护人手机', 'aller': '备注', 'avatar': '头像' },
        // 学历picker
        edu: ['小学', '初中', '高中', '专科', '本科', '硕士', '博士'],
        edu_idx: null,
        // 生日picker
        birth_idx: null,
        // 年级picker
        grd: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        grd_idx: null,
        // 班级picker
        cls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        cls_idx: null,
        // 地区picker
        reg: ['北京', '北京', '东城'],
        reg_idx: null,
        stu_info: {
            // 姓名
            name: "",
            // 身份证号
            idnum: "",
            // 生日
            birthday: "",
            // 学历
            education: "",
            //性别
            sex: "",
            sexid: "0",
            //手机号
            phone: "",
            // 学校
            schoolname: "",
            //年级
            grade: "",
            // 班级
            class: "",
            // 监护人姓名/电话
            parents: "",
            p_phone: "",
            // 地区
            region: [],
            // 备注
            remark: "",
            // 注册时间
            time: ""
        },
        //头像
        header: "",
        //实名头像
        avator: "",
        //openid
        openid: "",
        //用户昵称
        nickName: "",
        //地区
        location: "",
        multiArray: [],
        multiIndex: [0, 0, 0],
        province: [],
        //是否显示用户协议
        isTipTrue: false,
        isAgree: false,

        // 是否显示头像剪裁框
        showCut: false,
        // 身份切换
        title: "身份切换密码校验",
        showModal: false,
        pwd: '',
        register_role: '',
        user_group: '',
        is_show: 0, //是否显示注册按钮
        input_school: "", //用于输入学校进行模糊搜索
        schoollist: [],
        school_name: '',
    },
    newCut(src) {
        const { cropperOpt } = this.data

        cropperOpt.boundStyle.color = config.getThemeColor()

        this.setData({ cropperOpt })

        if (src) {
            cropperOpt.src = src
            this.cropper = new WeCropper(cropperOpt)
                .on('ready', (ctx) => {
                    console.log(`wecropper is ready for work!`)
                })
                .on('beforeImageLoad', (ctx) => {
                    console.log(`before picture loaded, i can do something`)
                    console.log(`current canvas context:`, ctx)
                    wx.showToast({
                        title: '上传中',
                        icon: 'loading',
                        duration: 20000
                    })
                })
                .on('imageLoad', (ctx) => {
                    console.log(`picture loaded`)
                    console.log(`current canvas context:`, ctx)
                    wx.hideToast()
                })
                .on('beforeDraw', (ctx, instance) => {
                    console.log(`before canvas draw,i can do something`)
                    console.log(`current canvas context:`, ctx)
                })
        }
    },

    touchStart(e) {
        this.cropper.touchStart(e)
    },
    touchMove(e) {
        this.cropper.touchMove(e)
    },
    touchEnd(e) {
        this.cropper.touchEnd(e)
    },
    // 用户点击确认剪裁
    getCropperImage() {
        const that = this;
        this.cropper.getCropperImage(function(path, err) {
            if (err) {
                wx.showModal({
                    title: '温馨提示',
                    content: err.message
                })
            } else {
                // wx.previewImage({
                //   current: '', // 当前显示图片的 http 链接
                //   urls: [path] // 需要预览的图片 http 链接列表
                // })
                console.log(path);
                that.setData({
                        avator: path,
                        showCut: false,
                    })
                    /*
                        path中包含临时图像文件的url，用其上传后台
                        此路径仅在用户下一次点击此按钮时有效
                    */
                console.log(that.data.avator);
            }
        })

    },
    uploadTap() {
        const self = this

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0]
                    //  获取裁剪图片资源后，给data添加src属性及其值

                self.cropper.pushOrign(src)
            }
        })
    },

    // 选择图像
    chooseImg: function(e) {
        console.log("上传实名头像");
        console.log(e);

        const that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0];
                that.setData({
                    showCut: true,
                })
                that.newCut(src);
            }
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
            "multiArray": this.data.multiArray,
            "multiIndex": this.data.multiIndex,
            "province": this.data.province,
            "e": e,
        }
        let res = areaColumnChange(data);
        this.setData({
            reg: res.tmp,
            multiArray: res.data.multiArray,
            multiIndex: res.data.multiIndex
        });
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
        wx.showToast({
            title: "请先同意协议",
            duration: 1000,
        })
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
                    console.log("获取用户微信昵称成功");
                    console.log(res)
                    this.setData({
                        cangetUserInfo: true,
                        nickName: res.userInfo.nickName,
                    })
                },
                fail: (res) => {
                    console.log(res.errMsg)
                }
            })
        }
    },

    // 学历选择器改变
    eduChange: function(e) {
        console.log("学历改变为: " + e.detail.value)
        this.setData({
            edu_idx: e.detail.value
        })
    },
    // 生日选择器改变
    birthChange(e) {
        this.setData({
            birth_idx: e.detail.value
        })
        console.log("生日改变为" + e.detail.value)
    },
    // 年级选择器改变
    gradeChange: function(e) {
        console.log("年级改变为" + this.data.grd[e.detail.value])
        this.setData({
            grd_idx: e.detail.value
        })
    },
    //班级选择器改变
    classChange: function(e) {
        console.log("班级改变为" + this.data.cls[e.detail.value])
        this.setData({
            cls_idx: e.detail.value
        })
    },
    // 地区选择器改变
    regionChange: function(e) {
        console.log("地区改变为" + e.detail.value);
        this.setData({
            reg: e.detail.value,
            reg_idx: 1
        })
    },
    // 身份证号输入验证
    checkID: function(id) {
        var data = check_idnum.checkIdCard(id);
        console.log("检查结果", data);
        if (!data.idCardFlag) {
            wx.showToast({
                title: '身份证号有误',
                icon: 'error',
                duration: 800
            })
            return false;
        } else {
            var birthday = "stu_info.birthday";
            this.setData({
                [birthday]: data.birth,
                sex: data.sex,
            })
            return true;
        }
    },
    // 检查身份证是否正确
    InputIdNum: function(e) {
        this.checkID(e.detail.value);
    },
    // 检查姓名是否正确
    InputName: function(e) {
        check_idnum.checkName(e.detail.value);
    },
    // 检查手机号是否输入正确
    InputPhone: function(e) {
        checkPhone(e.detail.value);
    },
    // 注册表单提交
    submit: function(e) {
        // 留空检查
        var data = e.detail.value;
        console.log(data);
        let that = this;
        for (var i in data) {
            console.log("地区", data.region);
            if (data[i] == null || data[i] == "") {
                console.log(data[i]);
                console.log("表单有未填写部分");
                wx.showToast({
                    title: '请填写' + that.data.formTitle[i],
                    icon: 'fail',
                    duration: 800
                })
                return;
            }
        }

        // 全部已填写
        // 电话号码格式检查
        if (checkPhone(data.phone)) {
            // 身份证号格式检查
            if (that.checkID(data.idnum)) {
                console.log("格式无误")
            } else {
                console.log("身份证号填写有误");
                return;
            }
            // 自动获取注册时间
            var now = new Date;
            var time = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
            console.log(time);
            console.log("数据")
            console.log(data)
            var register_time = 'stu_info.time'
                // 赋值
            that.setData({
                stu_info: data,
                [register_time]: time
            })
            var sexid = "stu_info.sexid"
            if (data.sex == '男') {
                that.setData({
                    [sexid]: "1",
                })
            } else {
                that.setData({
                    [sexid]: "2",
                })
            }
            wx.login({
                success: function(res) {
                    // success
                    console.log("获取openid")
                    console.log(res);
                    const p = getOpenId({
                        code: res.code
                    }).then(value => {
                        console.log(value)
                        that.setData({
                            openid: value.data.openid
                        })
                        app.globalData.openid = value.data.openid
                        console.log("app openid", app.globalData.openid)
                        console.log("学生数据", data);
                        Register({
                            modelName: "Userinfo",
                            Userinfo: {
                                name: data.name,
                                nikename: data.nickname,
                                openid: that.data.openid,
                                idnum: data.idnum,
                                birthday: data.birth,
                                sex: data.sex,
                                sexid: that.data.stu_info.sexid,
                                education: that.data.edu[data.education],
                                phone: data.phone,
                                schoolname: data.schoolname,
                                grade: data.grade,
                                class: data.class,
                                province: that.data.reg[0],
                                city: that.data.reg[1],
                                district: that.data.reg[2],
                                aller: data.remark,
                                regsterdate: data.regsterdate,
                            }
                        }).then(value => {
                            console.log("注册信息", value)
                            if (value.data.data.msg == "该微信已注册") {
                                wx.showModal({
                                    content: '该微信已注册',
                                    showCancel: false,
                                })
                            } else if (value.data.data.msg == "该手机号已注册") {
                                wx.showModal({
                                    content: '该手机号已注册',
                                    showCancel: false,
                                })
                            } else {
                                wx.setStorageSync('avator', that.data.avator)

                                wx.showModal({
                                    content: '成功添加个人信息',
                                    showCancel: false,
                                })
                                console.log("表单检查成功");
                                console.log(that.data.stu_info);
                                that.getUserInfo();
                                setTimeout(function() {
                                    wx.navigateTo({
                                        url: '../login/login?id=student'
                                    })
                                }, 800);
                            }
                        })
                    }).catch(err => {
                        console.log("注册失败", err)
                    });
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
    // 获取用户信息
    getUserInfo: function(e) {
        let that = this;
        const p = GetUserInfo2({
            openid: app.globalData.openid,
            id_flag: 'student',
        }).then(value => {
            console.log("获取成功", value);
            that.UpLoadImage(value.data.data);
        }, reason => {
            console.log("获取用户信息失败", reason);
        });
    },
    //点击头像上传图片
    UpLoadImage: function(data) {
        let that = this;
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = that.data.avator;
        console.log("图片路径");
        console.log(tempFilePaths);
        // 图片新命名
        var time = Date.parse(new Date());
        time /= 1000;
        var newPicName = formatTime.formatTime(time, 'YMDhms');
        //上传图片
        wx.uploadFile({
            //请求后台的路径
            url: app.globalData.url + 'WxUser/SaveImg',
            //小程序本地的路径
            filePath: tempFilePaths,
            name: 'file',
            formData: {
                //图片命名：用户id-商品id-1~9
                newName: newPicName,
                id: data.id,
                modelName: 'Userinfo',
                file_type: '',
            },
            success(res) {
                console.log("成功保存图片", res);
            },
            fail(res) {
                flag = false;
                wx.showModal({
                    title: '提示',
                    content: '上传失败',
                    showCancel: false
                })
            }
        })


    },
    // 切换教师/家长端
    changeToTeacher: function(e) {
        console.log("切换教师端", e.currentTarget.id);
        wx.navigateTo({
            url: './register_' + e.currentTarget.id,
        })

    },
    changeToParent: function(e) {
        console.log("切换家长端", e.currentTarget.id);
        wx.navigateTo({
            url: './register_' + e.currentTarget.id,
        })
    },

    // 绑定已有数据
    login: function(e) {
        app.globalData.flag_identity = [1, 0, 0];
        wx.navigateTo({
            url: '../login/login?id=student',
        })
    },
    getTopHeight: function() {
        let that = this;
        wx.createSelectorQuery().selectAll('#top').boundingClientRect(function(rect) {
            that.setData({
                top_height: rect[0].height,
                top_width: rect[0].width,
            });
            console.log("高度是：", that.data.top_height);
        }).exec();
    },
    // 初始化数据
    Init: function() {
        let that = this;
        that.getTopHeight();
        let data = initArea();
        this.setData({
            is_show: app.globalData.is_show,
            multiArray: [data.provinceList, data.cityList, data.quyuList],
            province: data.province,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.Init();
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
        app.globalData.flag_identity = [1, 0, 0];
        this.Init()
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
    Return: function() {
        console.log("返回")
        wx.navigateBack({
            delta: 2, // 回退前 delta(默认为1) 页面
            success: function(res) {
                // success
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    // 搜索学校
    InputSchool: function(e) {
        console.log(e);
        this.setData({
            school_name: e.detail.value,
        })
        if (e.detail.value != '') {
            this.getSchoolList(e.detail.value);
        } else {
            this.setData({
                schoollist: [],
            })
        }
    },
    SchoolBlur: function(e) {
        console.log(e);
        this.setData({
            schoollist: [],
        })
    },
    getSchool: function(e) {
        console.log(e.currentTarget.dataset.school);
        this.setData({
            school_name: e.currentTarget.dataset.school,
        })
    },
    // 模糊搜索获取学校
    getSchoolList: function(keyword) {
        let that = this;
        console.log("关键字", keyword)
        schoollist({
            keyword: keyword
        }).then(value => {
            console.log("学校记录", value);
            that.setData({
                schoollist: value.data.data
            })
            console.log(that.data.schoollist);
            console.log(value.data.data)
        }, reason => {
            console.log("无法搜索到学校记录", reason);
        });
    }
})