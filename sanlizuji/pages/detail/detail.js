// pages/detail/detail.js
const app = getApp();
import { GetKidsList, Teasign, Clubdetail, Comment, CourseDailyDetail, GetActDetail, Stusign } from '../../utils/apis.js'
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
        service_club: { // 机构名称及机构logo
            club_name: '',
            pic: '',
            // 机构简介 应为一个数组，以简介段落为元素
            introduce: [''],
        },
        // 活动主要内容
        journey: [],
        avator: 'http://img.duoziwang.com/2021/01/1-2104221923050-L.jpg',
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
        input_grade: "", //获取报名时的输入的年级信息
        input_class: "", //获取报名时的输入的班级信息
        actionSheetHidden: true,
        actionSheetItems: [
            '活动开始前1天退款订单总额的0%',
            '活动开始前2天退款订单总额的50%',
            '活动开始前3天退款订单总额的70%'
        ],
        imgPrefix: app.globalData.imgPrefix,
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
        // 获取活动详情
        const p = GetActDetail({
            id: options.id,
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
            that.getSchedule(value.data.data[0].id);
            that.getComments(value.data.data[0].id);
            let service_club = [];
            that.getClub(value.data.data[0].serviceClub, service_club);
            if (value.data.data[0].club_id != '') that.getClub(value.data.data[0].club_id, service_club);

        }, reason => {
            console.log("无法获取到活动详情", reason);
        });
    },
    //获取当前行程
    getSchedule: function(options) {
        let that = this;
        console.log("课程id是：", options)
        const p = CourseDailyDetail({
            courseid: options
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
                //富文本显示部分数据
                function richTextFormat(value) {
                    value = value.replace(/<\/?.+?>/g, '')
                    value = value.replace(/\s+/g, '')
                    if (value.length > 30) {
                        return value.slice(0, 50) + "...";
                    }
                    return value;
                }
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
        console.log("下标是", this.data.idx);
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');

        console.log("家长身份");
        GetKidsList({
            id: user.id,
        }).then(value => {
            console.log("孩子信息", value);
            if (value.data.data.length > 0) {
                var kid = [];
                for (var item of value.data.data) {
                    kid.push(item);
                }
                console.log(kid)
                that.setData({
                    stu_arr: kid
                })
                console.log(that.data.stu_arr)
            }
        }, reason => {
            console.log("无法获取到孩子的信息", reason);
        });
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
        console.log(that.data.course_detail.sign_num, that.data.course_detail.sign_max);
        if (parseInt(that.data.course_detail.sign_num) >= parseInt(that.data.course_detail.sign_max)) {
            wx.showModal({
                title: '名额不足',
                content: '希望下次早点报名哦！',
                showCancel: false
            })
        } else {
            // 学生报名

            Stusign({
                userid: id,
                courseid: that.data.course_detail.id,
                username: name,
            }).then(value => {
                console.log("报名数据", value)
                if (value.data.data.msg == "报名成功") {
                    wx.navigateTo({
                        url: '../pay/confirm?id=' + that.data.course_detail.id + '&orderid=' + value.data.data.id + '&userid=' + id,
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