// pages/detail/detail.js
const app = getApp();
import { GetKidsList, Teasign, Clubdetail, Comment, CourseDailyDetail, GetActDetail, Stusign, getStuList } from '../../utils/apis.js'
let user = wx.getStorageSync('user');
let id_flag = wx.getStorageSync('id_flag');
import { richTextFormat, SaveInfo } from '../../utils/function.js';
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
        service_club: { // 机构名称及机构logo
            club_name: '',
            pic: '',
            // 机构简介 应为一个数组，以简介段落为元素
            introduce: [''],
        },
        // 活动主要内容
        journey: [],
        // 评论区
        comment: [],
        // 学员选择器，需要后端初始化
        stu_arr: [],
        idx: -1, //如果是家长报名就需要先选择孩子才能报名
        stu: '',
        user: user,
        id_flag: id_flag,
        isOutDate: false,
        showModal: false,
        //获取为学生报名时教师还未填写学校相关信息时进行弹窗提示填写
        input_school: "",
        input_grade: "",
        input_class: "",

        actionSheetHidden: true,
        actionSheetItems: [
            '活动开始前1天退款订单总额的0%',
            '活动开始前2天退款订单总额的50%',
            '活动开始前3天退款订单总额的70%'
        ],
        imgPrefix: app.globalData.imgPrefix,
        // 点击教师报名按钮
        teaShowModal: false,
        // 教师点击学生报名按钮
        stuShowModal: false,
        // 是否显示picker
        showpicker: true,
        // 
    },
    // 已进入该界面时进行初始化
    Init: function() {
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag'); -
        console.log("用户信息", user, "用户身份：", id_flag);
        if (id_flag == 'parent') {
            that.loadStu();
        } else if (id_flag == 'teacher' && user.type == 2) {
            if (user.grade != '' && user.class != '' && user.school != '') {
                that.loadStu();
            } else {
                that.setData({
                    showpicker: false
                })
            }
        }
        that.setData({
            user: user,
            id_flag: id_flag,
        });
    },
    // 获取活动详情
    getCourseDetail: function() {
        let that = this;
        const p = GetActDetail({
            id: that.options.id,
            modelName: 'ClubNews',
        });
        p.then(value => {
            console.log("活动详情", value);
            that.setData({
                index: value.data.data.id,
                course_detail: value.data.data[0],
            });
            var now = new Date;
            var sign_date_end = new Date(value.data.data[0].sign_date_end);
            var sign_date_start = new Date(value.data.data[0].sign_date_start);
            if (sign_date_end < now || sign_date_start > now) {
                that.setData({
                    isOutDate: true,
                })
            }
            // 获取行程
            that.getSchedule(value.data.data[0].id);
            // 获取评论信息
            that.getComments(value.data.data[0].id);
            let service_club = [];
            // 获取研学基地
            that.getClub(value.data.data[0].serviceClub, service_club);
            if (value.data.data[0].club_id != '') that.getClub(value.data.data[0].club_id, service_club);
        }, reason => {
            console.log("无法获取到活动详情", reason);
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.Init();
        that.getCourseDetail();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
        that.Init();
    },
    //获取当前行程
    getSchedule: function(courseid) {
        let that = this;
        console.log("课程id是：", courseid)
        const p = CourseDailyDetail({
            courseid: courseid
        });
        p.then(value => {
            console.log("行程数据", value)
            that.setData({
                journey: value.data.data
            })
        }, reason => {
            console.log("获取行程数据失败", reason);
        });
    },
    //获取课程活动的所有评价
    getComments: function(courseid) {
        let that = this;
        const p = Comment({
            courseid: courseid,
        });
        p.then(value => {
            console.log("评论数据", value.data.data);
            that.setData({
                comment: value.data.data
            });
            if (that.data.comment.length == 0) {
                console.log("没有评论", that.data.comment);
            } else {
                console.log(that.data.comment)
            }
        }, reason => {
            console.log("获取评论数据失败", reason);
        });
    },
    //获取学校或者服务商
    getClub: function(club_id, service_club) {
        let that = this;
        console.log(club_id);
        var tmp = '';
        Clubdetail({
            clubid: club_id
        }).then(value => {
            console.log("服务商信息", value)
            if (value.data.data.length != 0) {
                var club_content = "";
                club_content = richTextFormat(value.data.data[0].introduce);
                value.data.data[0].introduce = club_content;
                tmp = value.data.data[0];
                service_club.push(tmp);
                that.setData({
                    service_club: service_club,
                })
                console.log(service_club);

            }
        }, reason => {
            console.log("无法获取服务商数据", reason);
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
        console.log("教师报名信息", options);
        let that = this;
        let user = wx.getStorageSync('user');
        console.log(user)
        if (!user) {
            wx.setStorageSync('isLoaded', 'false');
            that.isLoaded('../register/register_teacher');
        } else {
            if (user.type == 2) {
                console.log("学校");
                that.setData({
                    showModal: true,
                    teaShowModal: true,
                })
            } else {
                wx.showModal({
                    content: '是否确定报名',
                    success(res) {
                        if (res.cancel) {} else if (res.confirm) {
                            that.teaSign();
                        }
                    }
                })
            }
        }
    },
    teaSign: function() {
        let that = this;
        console.log("教师报名得填写得学校信息");
        console.log(that.data.input_grade, that.data.input_class);
        const p = Teasign({
            userid: user.id,
            courseid: that.data.course_detail.id,
            username: user.name,
            grade: that.data.input_grade,
            class: that.data.input_class,
        })
        p.then(value => {
            if (value.data.data.msg == "报名成功") {
                console.log("报名成功", value);
                wx.navigateTo({
                    url: '../teaApply/teaApply',
                })
                wx.showToast({
                    title: "报名成功",
                    icon: 'success',
                    duration: 500,
                })
            } else if (value.data.data.msg == "该导师已报名") {
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
        }, reason => {
            console.log("报名失败", reason);
        });
    },
    // 获取学校
    InputSchool: function(e) {
        this.setData({
            input_school: e.detail.value,
        })
        console.log("学校信息", this.data.input_school);
    },
    // 获取年级
    InputGrade: function(e) {
        this.setData({
            input_grade: e.detail.value,
        })
        console.log("年级信息", this.data.input_grade);
    },
    // 获取班级
    InputClass: function(e) {
        this.setData({
            input_class: e.detail.value,
        })
        console.log("班级信息", this.data.input_class);
    },
    // 修改教师信息
    changeTeaInfo: async function(e) {
        user = wx.getStorageSync('user');
        var _user = user,
            that = this;
        console.log(this.data.input_class, this.data.input_grade, this.data.input_school);
        _user.school = that.data.input_school;
        _user.grade = that.data.input_grade;
        _user.class = that.data.input_class;
        wx.setStorageSync('user', _user);
        user = wx.getStorageSync('user');
        var modelName = "Teacher";
        var modelData = {
            name: user.name,
            header: user.header,
            openid: user.openid,
            idnum: user.idnum,
            birthday: user.birthday,
            sex: user.sex,
            sexid: user.sexid,
            phone: user.phone,
            province: user.province,
            city: user.city,
            district: user.district,
            type: user.type,
            resume: user.exp,
            school: user.school,
            grade: user.grade,
            class: user.class,
        }
        let result = await SaveInfo(modelData, modelName);
        that.loadStu();
        this.setData({
            user: user,
        })
    },
    // 点击确定按钮
    ok: function() {
        let that = this;
        if (that.data.input_grade == '' || that.data.input_class == '' || (!that.data.showpicker && that.data.input_school == '')) {
            wx.showToast({
                title: '部分数据没有填写',
                icon: 'error',
                duration: 800,
            })
        } else {
            if (that.data.teaShowModal) that.teaSign();
            else {
                that.changeTeaInfo();
            }
            that.setData({
                showModal: false,
                teaShowModal: false,
                stuShowModal: false,
                showpicker: true,
            })
        }
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
                        teaShowModal: false,
                        stuShowModal: false,
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
        console.log("学生的数据", this.data.kid);
        if (this.data.stu != '') {
            this.studentSignUp();
        }
    },

    // 检查教师是否数据中班级年级以及数据是否都有数据
    checkInfo: function() {
        this.setData({
            stuShowModal: true,
        })
        let that = this;
        if (id_flag == 'teacher') {
            if (user.grade == '' || user.class == '' || user.school == '') {
                that.setData({
                    showModal: true,
                })
            }
        }
    },
    // 家长或者老师身份时初始化学员选择器
    loadStu: function(e) {
        // 和后台拿东西setData
        console.log("下标是", this.data.idx);
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        // 家长获取孩子信息
        if (id_flag == 'parent') {
            GetKidsList({
                id: user.id,
            }).then(value => {
                console.log("孩子信息", value);
                if (value.data.data.length > 0) {
                    var students = [];
                    for (var item of value.data.data) {
                        students.push(item);
                    }
                    that.setData({
                        stu_arr: students,
                    })
                    console.log(that.data.stu_arr)
                } else {
                    wx.showToast({
                        title: '还未绑定孩子信息',
                        icon: 'error',
                        duration: 800,
                    })
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '../person_info/parent_info',
                        })
                    }, 800)
                }
            }, reason => {
                console.log("无法获取到孩子的信息", reason);
            });
        }
        // 导师获取学生信息
        else if (id_flag == 'teacher') {
            getStuList({
                id: user.id,
                courseid: that.options.id,
            }).then(value => {
                console.log("老师获取班级的所有学生数据是：", value);
                if (value.data.fail.length == 0) {
                    wx.showToast({
                        title: "所有学生已报名完成",
                        icon: "success",
                        duration: 800,
                    });
                } else {
                    var students = [];
                    // 获取报名失败或者未报名的学生数据
                    for (var item of value.data.fail) {
                        students.push(item);
                    }
                    that.setData({
                        stu_arr: students,
                        isHasStu: true, //设置是否显示学生数据picker
                    })
                    console.log("报名失败的所有学生数据：", that.data.stu_arr)
                }
            }, reason => {
                console.log("无法获取到学生列表信息", reason);
            })
        }
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
    studentSignUp: function() {
        user = wx.getStorageSync('user')
        let that = this;
        console.log(user)
        if (!user) {
            that.isLoaded('../register/register_stu');
        } else {
            if (id_flag == 'parent' || id_flag == 'teacher') {
                // if (id_flag == 'teacher') {
                //     if (user.grade == '' || user.class == '' || user.school == '') {
                //         console.log("2345yugfdsaj")
                //         that.setData({
                //             showModal: true,
                //             stuShowModal: true,
                //         })
                //     }
                // }
                if (that.data.idx != -1) {
                    console.log("选择的学生下标是：", that.data.idx);
                    that.generateOrder(that.data.kid);
                    that.setData({
                        idx: -1,
                    })
                } else {
                    wx.showToast({
                        title: '请选择学生',
                        icon: 'error',
                        duration: 800,
                    })
                }
            } else {
                that.generateOrder(user);
            }
        }
    },

    // 生成订单
    generateOrder: function(userinfo) {
        let that = this;
        console.log("课程已报名人数：", that.data.course_detail.sign_num, "课程报名的名额：", that.data.course_detail.sign_max);
        if (parseInt(that.data.course_detail.sign_num) >= parseInt(that.data.course_detail.sign_max)) {
            wx.showModal({
                title: '名额不足',
                content: '希望下次早点报名哦！',
                showCancel: false
            })
        } else {
            // 学生报名
            Stusign({
                userid: userinfo.id,
                courseid: that.data.course_detail.id,
                username: userinfo.name,
            }).then(value => {
                console.log("报名数据", value)
                if (value.data.data.msg == "报名成功") {
                    wx.navigateTo({
                        // url: '../pay/confirm?id=' + that.data.course_detail.id + '&orderid=' + value.data.data.id + '&userid=' + id,
                        // 跳转到订单确认信息页面
                        url: '../pay/confirm?id=' + that.data.course_detail.id + '&orderid=' + value.data.data.id + '&userinfo=' + JSON.stringify(userinfo),
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
            }, reason => {
                console.log("报名失败", reason);
            });
        }
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