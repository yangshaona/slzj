// pages/detail/detail.js
const app = getApp();
import {
    formatRichText
} from '../../utils/text.js'
let user = wx.getStorageSync('user');
let id_flag = wx.getStorageSync('id_flag');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 屏幕高度
        height: getApp().globalData.height,
        // 屏幕宽度
        width: getApp().globalData.width,
        //行程id
        index: 1,
        course_detail: {},

        //服务商机构
        // logo: 'https://bkimg.cdn.bcebos.com/pic/21a4462309f79052982290b94eb9c0ca7bcb0b467fab?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5/format,f_auto',

        service_club: { // 机构名称及机构logo
            club_name: '',
            pic: '',
            // 机构简介 应为一个数组，以简介段落为元素
            introduce: [
                ''
            ],
        },

        // 活动主要内容
        journey: [],
        avator: 'http://img.duoziwang.com/2021/01/1-2104221923050-L.jpg',
        // 评论区
        comment: [],
        // 是否显示评论区
        cmt_display: false,
        // 星级
        // 服务
        service_rate: [{
                'id': 0,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 1,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 2,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 3,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 4,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
        ],
        // 课程
        course_rate: [{
                'id': 0,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 1,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 2,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 3,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 4,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
        ],
        // 住宿
        dorm_rate: [{
                'id': 0,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 1,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 2,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 3,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 4,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
        ],
        // 餐饮
        food_rate: [{
                'id': 0,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 1,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 2,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 3,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 4,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
        ],
        // 导师
        teacher_rate: [{
                'id': 0,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 1,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 2,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 3,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
            {
                'id': 4,
                'rate': 0,
                'icon': '/icon/star_ept_blue.png'
            },
        ],
        // 向服务端提交评论
        service_star: '',
        course_star: '',
        food_star: '',
        dorm_star: '',
        teacher_star: '',
        // 文字评价
        cmt: "",
        // 学员选择器，需要后端初始化
        stu_arr: [],
        idx: -1, //如果是家长报名就需要先选择孩子才能报名
        stu: '',
        user: user,
        id_flag: id_flag,
        isOutDate: false,
        showModal: false,
        input_school: "", //获取报名时的输入的学校信息
        input_grade: "", //获取报名时的输入的年级信息
        input_class: "", //获取报名时的输入的班级信息
        actionSheetHidden: true,
        actionSheetItems: [
            '活动开始前1天收取退款订单总额的70%',
            '活动开始前2天收取退款订单总额的50%',
            '活动开始前3天收取退款订单总额的0%'
        ],
    },

    // 评价星级
    rateTap: function(e) {
        var that = this;
        var name = e.currentTarget.dataset.name;
        var _name = name + '_rate';
        var id = e.currentTarget.dataset.id;
        id = parseInt(id);
        var half = e.currentTarget.dataset.half;
        // 获取当前控制的评价栏目
        var type = this.data[_name];
        console.log(type);
        if (half == 1) {
            type[id]['icon'] = '/icon/star_half_blue.png';
            type[id]['rate'] = 0.5
        } else {
            type[id]['icon'] = '/icon/star_full_blue.png';
            type[id]['rate'] = 1;

        }
        // 总评级
        var rate = 0;
        // 对当前和后的星进行操作
        for (var idx in type) {
            if (idx < id) {
                type[idx]['rate'] = 1;
                type[idx]['icon'] = '/icon/star_full_blue.png';
                rate += type[idx]['rate'];
            } else if (idx > id) {
                type[idx]['rate'] = 0;
                type[idx]['icon'] = '/icon/star_ept_blue.png';
                rate += type[idx]['rate'];
            } else {
                rate += type[idx]['rate'];
            }
        }
        console.log(rate);
        var type_name = name + '_star';
        console.log(type_name);
        that.setData({
            [_name]: type,
            [type_name]: rate
        })
        console.log(that.data[type_name])
    },

    // 展开/折叠评价
    commentTap: function(e) {
        var status = this.data.cmt_display;
        status = !status;
        this.setData({
            cmt_display: status
        })
    },

    // 评价检查
    cmt_submit: function(e) {
        var service = this.data.service_star;
        var course = this.data.course_star;
        var dorm = this.data.dorm_star;
        var food = this.data.food_star;
        var teacher = this.data.teacher_star;
        var cmt = e.detail.value.comment;
        console.log(cmt);
        console.log(service);
        if (service && course && dorm && food && teacher && cmt) {
            console.log("success");
            this.setData({
                cmt: e.detail.value,
                cmt_display: false
            })
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 800
            })
        } else {
            wx.showModal({
                content: "还有内容未评价",
                showCancel: false,
            })
            console.log("fail");
        }
    },




    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag')
        that.setData({
            user: user,
            id_flag: id_flag,
        })
        if (id_flag == 'parent') {
            that.loadStu();
        }
        wx.request({
            url: app.globalData.url + 'WxCourse/GetDetail',
            data: {
                id: options.id,
                modelName: 'ClubNews',
            },
            success(res) {

                console.log("活动详情")
                console.log(res)
                    //formatRichText 调用方法    
                    //解决rich-text放入图片时富文本无法换行的问题  
                var content = "";
                content = formatRichText(res.data.data[0].text);
                res.data.data[0].text = content;

                that.setData({
                    index: res.data.data.id,
                    course_detail: res.data.data[0],

                });
                var now = new Date;
                var sign_date_end = new Date(res.data.data[0].sign_date_end);
                var sign_date_start = new Date(res.data.data[0].sign_date_start);
                console.log("当前时间");
                console.log(now);
                console.log(sign_date_end);
                console.log(sign_date_start);

                if (sign_date_end < now || sign_date_start > now) {
                    that.setData({
                        isOutDate: true,
                    })
                }
                console.log("报名时间是否小于当前时间");
                console.log(that.data.isOutDate);
                that.getSchedule(res.data.data[0].id);
                that.getComments(res.data.data[0].id);

                let service_club = [];
                that.getClub(res.data.data[0].serviceClub, service_club);

                if (res.data.data[0].club_id != '') that.getClub(res.data.data[0].club_id, service_club);

            }
        })
    },
    //获取当前行程
    getSchedule: function(options) {
        let that = this;
        wx.request({
            url: app.globalData.url + "WxCourse/DailyDetail&courseid=" + options,
            data: {
                courseid: options
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("行程数据")
                console.log(res)
                    // console.log(res.data)
                    // console.log(res.data.detail)

                that.setData({
                    journey: res.data.data
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
    //获取课程活动的所有评价
    getComments: function(courseid) {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxCourse/Comment',
            data: {
                courseid: courseid,
                // id: "",
                // coursename: "",
                // foods: "",
                // services: "",
                // courses: "",
                // stays: "",
                // foodm: "",
                // servicem: "",
                // coursem: "",
                // staym: "",
                // P_comment: "",
                // P_score: "",
                // photo: "",


            },
            success(res) {
                console.log("评论数据");
                console.log(res)
                console.log(res.data.data);
                that.setData({
                    comment: res.data.data
                });
                if (that.data.comment.length == 0) {
                    console.log("没有评论")
                    console.log(that.data.comment);

                } else {
                    console.log(that.data.comment)
                }

            },
        })
    },
    //获取学校或者服务商
    getClub: function(club_id, service_club) {
        let that = this;
        console.log(club_id);
        var tmp = '';
        wx.request({
            url: app.globalData.url + 'WxCourse/Clubdetail',
            data: {
                clubid: club_id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("服务商信息")
                console.log(res)
                var club_content = "";
                club_content = richTextFormat(res.data.data[0].introduce);
                res.data.data[0].introduce = club_content;
                tmp = res.data.data[0];
                service_club.push(tmp);
                that.setData({
                    service_club: service_club,
                })
                console.log(service_club);
                //富文本显示部分数据
                function richTextFormat(value) {
                    // value = value.replace(/<\/?[^>]*>/g,'')
                    value = value.replace(/<\/?.+?>/g, '')
                    value = value.replace(/\s+/g, '')
                    if (value.length > 30) {
                        return value.slice(0, 50) + "...";
                    }
                    return value;
                }
            },
        });
    },
    // 跳转学校或服务商详情
    serviceDetail: function(e) {
        console.log("点击跳转到服务商详情")
        console.log(e)
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/school?id=' + id,
        })
    },
    //教师报名
    teacherSignUp: function(options) {
        console.log("教师报名信息");
        console.log(options);
        let that = this;
        let user = wx.getStorageSync('user');
        console.log(user)
        if (!user) {
            wx.setStorageSync('isLoaded', 'false');
            that.isLoaded('../register/register_teacher')

        } else {
            if (user.type == 2) {
                console.log("学校");
                that.setData({
                    showModal: true,
                })
            } else {
                wx.showModal({
                    content: '是否确定报名',
                    success(res) {
                        if (res.cancel) {

                        } else if (res.confirm) {
                            that.Sign();

                        }
                    }
                })
            }
        }
    },
    Sign: function() {
        let that = this;
        console.log("教师报名得填写得学校信息");
        console.log(that.data.input_school, that.data.input_grade, that.data.input_class);
        wx.request({
            url: app.globalData.url + "WxSign/Teasign",
            data: {
                userid: user.id,
                courseid: that.data.course_detail.id,
                username: user.name,
                schoolname: that.data.input_school,
                grade: that.data.input_grade,
                class: that.data.input_class,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                if (res.data.data.msg == "报名成功") {

                    console.log("报名成功")
                    console.log(res);
                    wx.navigateTo({
                        url: '../teaApply/teaApply',
                    })
                    wx.showToast({
                        title: "报名成功",
                        icon: 'success',
                        duration: 500,
                    })
                } else if (res.data.data.msg == "该导师已报名") {
                    wx.showModal({
                        content: '您已经报过名！',
                        showCancel: false
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '../teaApply/teaApply',
                        })
                    }, 1000)
                } else {
                    wx.showModal({
                        content: '报名失败',
                        showCancel: false
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
    // 获取学校名称
    InputSchool: function(e) {
        this.setData({
            input_school: e.detail.value,
        })
        console.log("学校信息");
        console.log(this.data.input_school);
    },
    // 获取年级
    InputGrade: function(e) {
        this.setData({
            input_grade: e.detail.value,
        })
        console.log("年级信息");
        console.log(this.data.input_grade);
    },
    // 获取班级
    InputClass: function(e) {
        this.setData({
            input_class: e.detail.value,
        })
        console.log("班级信息");
        console.log(this.data.input_class);
    },
    // 点击确定按钮
    ok: function() {
        let that = this;
        that.Sign();
        that.setData({
            showModal: false,
        })
    },
    back: function() {
        let that = this;
        wx.showModal({
            title: "是否取消报名",
            success(res) {
                if (res.cancel) {

                } else {
                    that.setData({
                        showModal: false,
                    })

                }
            }
        })

    },
    // 学员选择器改变
    stuChange: function(e) {
        var stu_arr = this.data.stu_arr;
        this.setData({
            idx: e.detail.value,
            stu: stu_arr[e.detail.value].name,
            kid: stu_arr[e.detail.value],
        });
        console.log("学生的数据1111");
        console.log(this.data.stu);
        console.log(this.data.kid);
        if (this.data.stu != '') {
            this.studentSignUp();
        }
    },

    // 初始化学员选择器
    loadStu: function(e) {
        // 和后台拿东西setData
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');

        console.log("家长身份")
        wx.request({
            url: app.globalData.url + 'WxUser/GetKidsList',
            data: {
                id: user.id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("孩子信息");
                console.log(res);
                if (res.data.data.length > 0) {
                    var kid = [];
                    for (var item of res.data.data) {
                        kid.push(item);
                    }
                    console.log(kid)
                    that.setData({
                        stu_arr: kid
                    })
                    console.log(that.data.stu_arr)
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
    // 判断是否已登录
    isLoaded: function(url) {

        wx.showModal({
            content: '还未登录，请先登录再报名！', //提示的内容,

            success: function(res) {
                if (res.confirm) {
                    console.log('确定')
                    wx.navigateTo({
                        url: url
                    })
                } else {
                    console.log('取消')
                }
            }

        });
    },
    //学生报名
    studentSignUp: function(options) {
        console.log("学生报名信息");
        console.log(options);
        user = wx.getStorageSync('user')
        let that = this;
        console.log(user)
        if (!user) {
            wx.setStorageSync('isLoaded', 'false');
            that.isLoaded('../register/register_stu');
        } else {
            if (id_flag == 'parent') {
                if (that.data.idx != -1) {
                    that.GenerateOrder(that.data.kid.id, that.data.kid.name);
                } else {
                    console.log('err');
                    wx.showToast({
                        title: '请选择孩子',
                        icon: 'error',
                        duration: 800
                    })
                }
            } else {
                console.log('学生报名');
                that.GenerateOrder(user.id, user.name);
            }

        }
    },

    // 生成订单
    GenerateOrder: function(id, name) {
        let that = this;

        if (that.data.course_detail.sign_num >= that.data.course_detail.sign_max) {
            wx.showModal({
                title: '名额不足',
                content: '希望下次早点报名哦！',
                showCancel: false
            })
        } else {
            wx.request({
                url: app.globalData.url + "WxSign/Stusign",
                data: {
                    userid: id,
                    courseid: that.data.course_detail.id,
                    username: name
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    console.log("报名数据")
                    console.log(res)
                    if (res.data.data.msg == "报名成功") {
                        wx.navigateTo({
                            url: '../pay/confirm?id=' + that.data.course_detail.id + '&orderid=' + res.data.data.id + '&userid=' + id,
                        })
                    } else {
                        wx.showModal({
                            title: '报名失败',
                            content: "该活动已报名",
                            showCancel: false
                        });
                        setTimeout(function() {
                            wx.redirectTo({
                                url: '../myApply/myApply',
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
        }
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
        id_flag = wx.getStorageSync('id_flag');
        if (id_flag == 'parent') {
            that.loadStu();
        }
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag')
        that.setData({
            user: user,
            id_flag: id_flag,
        })
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
})