// pages/myApply/myApply.js
const app = getApp();
let user = wx.getStorageSync('user');
let id_flag = wx.getStorageSync('id_flag');
import { UpdateOrder, mergeArr } from '../../utils/function.js';
import { orderisshow, GetMyApply, GetKidsList, tgReverse, getStuInfo, getStuApplyList, getAllStus, getAllCourses } from '../../utils/apis.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 状态栏高度
        statusHeight: app.globalData.statusHeight,
        // 屏幕高度
        height: app.globalData.height,
        // 选择框
        selectBox: [
            { 'id': 0, 'ctn': '全部', 'class': 'selected' },
            { 'id': 1, 'ctn': '报名失败', 'class': 'select' },
            { 'id': 2, 'ctn': '待付款', 'class': 'select' },
            { 'id': 3, 'ctn': '报名成功', 'class': 'select' },
            { 'id': 4, 'ctn': '已完成', 'class': 'select' },
        ],
        // 提交服务端的筛选条件
        select: "全部",
        // 显示的报名
        display: [],
        filter: [],
        flag_identity: app.globalData.flag_identity,
        // 是否显示评价按钮
        cmt_display: true,
        //身份
        id_flag: id_flag,
        user: user,
        now: "",
        stus_name: "",
        lowOrderId: '',
        actionSheetHidden: true,
        actionSheetItems: [
            '活动开始前1天退款订单总额的0%',
            '活动开始前2天退款订单总额的50%',
            '活动开始前3天收取退款订单总额的70%'
        ],
        // 教师端中课程信息下拉框
        courses: [],
        // 所有报名数据
        totalApply: [],
        // 下拉框选择的信息
        selectedData: { "student": '', "course": '' },
    },

    // 筛选栏点击事件
    selectTap: function(e) {
        var id = e.currentTarget.dataset.id;
        // 样式改变
        var selectBox = this.data.selectBox;
        for (var idx in selectBox) {
            if (idx == id) {
                selectBox[idx].class = 'selected';
            } else {
                selectBox[idx].class = 'select';
            }
        }
        this.setData({
            selectBox: selectBox,
            select: selectBox[id]['ctn']
        })
        console.log("选择：" + this.data.select);
        this.setFilter();
    },
    // 点击查看详情
    goToOrderDetail: function(e) {
        // 点击的id
        let id = e.currentTarget.dataset.courseid;
        let needPayMoney = e.currentTarget.dataset.needpaymoney;
        console.log(id, needPayMoney);
        if (needPayMoney == '') {
            needPayMoney = e.currentTarget.dataset.price;
        }
        wx.navigateTo({
            url: '../pay/pay?orderid=' + id + '&price=' + needPayMoney + "&key=" + '' + "&userinfo=" + '',

        });


    },
    // 删除一条订单记录
    DeleteOneOrder: function(e) {
        console.log("删除订单", e);
        let orderid = e.currentTarget.dataset.id;
        let status = e.currentTarget.dataset.status;
        let that = this;
        if (status == 2) {
            UpdateOrder(orderid, '支付失败', 1);  
        }
        wx.showModal({
            content: "是否删除该记录",
            success(res) {
                if (res.confirm) {
                    const p = orderisshow({
                        id: orderid,
                        modelName: "SignList",
                    })
                    p.then(value => {
                        console.log("删除结果");
                        console.log(value);
                        if (value.data.data == '删除失败') {
                            wx.showToast({
                                title: "删除失败",
                                icon: 'cancel',
                                duration: 800,
                            })
                        } else {
                            wx.showToast({
                                title: "删除成功",
                                icon: 'success',
                                duration: 800,
                            });
                            that.setFilter();
                        }
                    }, reason => {
                        console.log("删除失败", reason);
                    });
                } else {
                    console.log("取消删除");
                }

            }
        })
    },
    // 点击评价按钮
    commentTap: function(e) {
        // 点击的id
        var orderid = e.currentTarget.dataset.orderid;
        console.log("点击评价")
        console.log(orderid)
        wx.navigateTo({
            url: '../myApply/comment?orderid=' + orderid,
        })
    },
    // 点击待付款按钮
    applyTap1: function(e) {
        var courseid = e.currentTarget.dataset.courseid;
        var orderid = e.currentTarget.dataset.orderid;
        var userid = e.currentTarget.dataset.userid;
        console.log("点击提交订单按钮", "课程id：", courseid, "订单id：", orderid);
        // 根据学生id获取学生数据
        getStuInfo({
            userid: userid,
        }).then(value => {
            console.log("获取到的学生数据是：", value);
            wx.navigateTo({
                url: '../pay/waiting_pay?id=' + courseid + '&orderid=' + orderid + '&userid=' + userid + '&userinfo=' + JSON.stringify(value.data.data),
            })
        }, reason => {
            console.log("无法获取到对应的学生数据：", reason);
            wx.showToast({
                title: '获取数据失败',
                icon: 'error',
                duration: 800,
            })
        })

    },
    // 点击继续报名按钮
    applyTap2: function(e) {
        var id = e.currentTarget.dataset.id;
        console.log("点击报名")
        console.log(id)
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
        })
    },
    //前往报名
    goToApply: function() {
        wx.switchTab({
            url: '../course/course',
        })
    },
    // 查看导师
    teacherTap: function(e) {
        var courseid = e.currentTarget.dataset.courseid;
        var teacherid = e.currentTarget.dataset.teacherid;
        console.log("点击导师按钮")
        wx.navigateTo({
            url: '../detail/teacher?course_id=' + courseid + "&teacherid=" + teacherid,
        })
    },

    // 报名数据类型筛选栏点击对应时显示对应内容
    setFilter: function() {
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        that.setData({
            flag_identity: app.globalData.flag_identity
        })
        if (id_flag == 'parent') {
            that.setTitle("孩子的报名")
        } else if (id_flag == 'teacher') {
            that.setTitle("学生的报名");
        }
        that.getApply(user.id, id_flag);
    },

    // 获取报名数据
    getApply: function(id, idflag) {
        let that = this;
        var total = [];
        if (idflag == 'parent' || idflag == 'student') {
            const p = GetMyApply({
                identity: idflag,
                id: id
            });
            p.then(value => {
                console.log("我的报名", value);
                var stu_apply = [],
                    apply = [];
                if (idflag == 'parent') {
                    if (user.kids != '') {
                        for (var i = 0; i < value.data.data.data.length; i++) {
                            stu_apply = mergeArr(value.data.data.data[i].data1, value.data.data.data[i].data2);
                            apply.push(stu_apply);
                        }
                        console.log("孩子报名数据", apply);
                        for (var i = 0; i < apply.length; i++) {
                            for (var j = 0; j < apply[i].length; j++) {
                                total.push(apply[i][j]);
                            }
                        }
                    }
                } else if (idflag == 'student') {
                    total = mergeArr(value.data.data1, value.data.data2);
                    if (id_flag == 'teacher') {
                        let _total = [];
                        for (let i = 0; i < total.length; i++) {
                            if (total[i].class == user.class && total[i].grade == user.grade) {
                                _total.push(total[i]);
                            }
                        }
                        total = _total;
                    }
                }
                that.setData({
                    totalApply: total
                })
                that.setApplyFilter(total);
            }, reason => {
                console.log("获取报名数据失败", reason);
            });
        }
        // 教师获取学生报名数据
        else if (idflag == 'teacher' && user.type == 2) {
            // 获取学生列表
            getStuApplyList({
                userid: user.id,
            }).then(value => {
                console.log("教师获取到班级学生的报名信息：", value);
                total = mergeArr(value.data.data1, value.data.data2);
                that.setApplyFilter(total);
                that.setData({
                    totalApply: total
                })
            }, reason => {
                console.log("无法获取到班级学生的报名信息：", reason);
            })
        }
    },

    // 设置报名栏数据
    setApplyFilter: function(total) {
        let _total = [];
        let stu = this.data.selectedData["student"];
        let course = this.data.selectedData["course"];
        console.log("选中的数据是：", this.data.selectedData);
        if (stu != '' || course != '') {
            for (let i = 0; i < total.length; i++) {
                if (stu != '' && course != '') {
                    if (total[i].userid == stu.kid_id && total[i].courseid == course.courseId) {
                        _total.push(total[i]);
                    }
                } else if (stu != '') {
                    if (total[i].userid == stu.kid_id) _total.push(total[i]);
                } else if (course != '') {
                    if (total[i].courseid == course.courseId) _total.push(total[i]);
                }
            }
            total = _total;
        }
        let that = this;
        var now = new Date;
        var date = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
        that.setData({
            now: date
        });
        var filter = [];
        var select = this.data.select;
        console.log("所有报名数据", total);
        for (var idx in total) {
            var ctn = total[idx];
            var status = "";
            var endTime = new Date(ctn['endTime']);
            if (ctn['status'] == 1) {
                status = "报名失败";
            } else if (ctn['status'] == 2) {
                status = "待付款";
            } else if (ctn['status'] == 3 && endTime > now) {
                status = "报名成功";
                ctn['endTime'] = 'false';
            } else {
                status = "已完成"
            }
            if (select == status || select == "全部") {
                filter.push(ctn);
            }
        }
        that.setData({
            filter: filter
        });
        for (var i = 0; i < that.data.filter.length; i++) {
            var end_pay_time = new Date(that.data.filter[i].payendTime);
            if (that.data.filter[i].status == 2 && (end_pay_time < now || that.data.filter[i].endTime < now)) {
                UpdateOrder(that.data.filter[i].id, '支付失败', 1);
                that.setData({
                    ["filter[" + i + "].status"]: 1,
                })
            }
        }
    },
    // 当身份为监护人时对报名数据进行排序
    compare: function(property) {
        return function(a, b) {
            let value1 = a[property];
            let value2 = b[property];
            let result = value2 - value1;
            return result;
        }
    },
    //登录查看更多
    _goLogin: function() {
        wx.navigateTo({
            url: '../register/register_stu',
        })
    },
    // 监护人绑定孩子
    _goBound: function() {
        id_flag = wx.getStorageSync('id_flag');
        wx.navigateTo({
            url: '../person_info/parent_info',
        });
    },
    // 设置标题
    setTitle: function(tname) {
        wx.setNavigationBarTitle({ title: tname })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        console.log("返回的数据是", options);
        user = wx.getStorageSync('user');
        this.setData({
            user: user,
            id_flag: id_flag
        })
        if (user != null && user != '') {
            that.setFilter();
        }
    },

    // 退款
    Refund: function(e) {
        console.log(e);
        let that = this;
        that.actionSheetTap();
        that.setData({
            lowOrderId: e.currentTarget.dataset.id,
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        this.setData({
            user: user,
            id_flag: id_flag
        });
        if (user != null && user != '') {
            that.setFilter();
            if (id_flag == 'parent') {
                this.getKidsList();
            } else if (id_flag == 'teacher') {
                this.getAllStus();
                that.getAllCourses()
            }
        }
    },

    actionSheetTap: function() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    Confirm: function() {
        let that = this;
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        });
        const p = tgReverse({
            lowOrderId: that.data.lowOrderId,
        })
        p.then(value => {
            console.log("申请退款");
            console.log(value)
            if (value.data.data.msg == "退款申请成功") {
                wx.showToast({
                    title: "退款申请成功",
                    icon: "success",
                    duration: 1000,
                });
                that.setFilter();
            } else {
                wx.showToast({
                    title: "退款申请失败",
                    icon: "success",
                    duration: 1000,
                })
            }
        }, reason => {
            wx.showToast({
                title: "退款申请失败",
                icon: "success",
                duration: 1000,
            });
            console.log("申请退款失败", reason);
        });
    },
    // 教师获取班级所有学生信息
    getAllStus: function() {
        let that = this;
        getAllStus({
            userid: user.id,
        }).then(value => {
            console.log("获取到班级学生信息是：", value);
            that.fillStuDropdown(value.data.data);
        }, reason => {
            console.log("无法获取到学生信息：", reason);
        })
    },

    // 填充学生下拉框信息
    fillStuDropdown: function(data) {
        this.fillDropdown(data, 'name', 'kid_id', 'stus_name');
    },

    // 填充课程下拉框
    fillCourseDropdown: function(data) {
        this.fillDropdown(data, 'title', 'courseId', 'courses');
    },
    // 参数
    // data：从后台获取的所有数据  
    // name：用于赋值给下拉框显示的数据变量 可选值：name/title
    // dataId：下拉框中选中的数据自带的数据id   可选值：kid_id/courseId
    // obj：赋值给页面中的数据变量，用于页面数据的显示  可选值stus_name/courses
    fillDropdown: function(data, name, dataId, obj) {
        let that = this;
        var tmpArr = [];
        tmpArr.push({ "id": "01", "isActive": false, "value": "请选择", [dataId]: 0 })
        for (var i = 0; i < data.length; i++) {
            var tmp = { "id": "0" + (i + 2), "isActive": false, "value": data[i][name], [dataId]: data[i].id };
            tmpArr.push(tmp);
        }
        that.setData({
            [obj]: tmpArr
        });
    },

    // 获取所有活动信息
    getAllCourses: function() {
        let that = this;
        getAllCourses({}).then(value => {
            console.log("所有的课程信息为：", value);
            that.fillCourseDropdown(value.data.data);
        }, reason => {
            console.log("获取课程信息失败：", reason);
        });
    },
    // 获取孩子信息
    getKidsList: function() {
        let that = this;
        const p = GetKidsList({
            id: user.id
        });
        p.then(value => {
            console.log("孩子信息", value);
            if (value.data.data.length > 0) {
                this.fillStuDropdown(value.data.data);
            }
        }, reason => {
            console.log("获取孩子信息失败", reason);
        });
    },
    // 选中学生
    selectStu: function(e) {
        let that = this;
        console.log("选中的值是", e.detail);
        that.selectData(e.detail, that.data.stus_name, 'stus_name', 'selectedData.student', 'kid_id')
        if (e.detail.kid_id == 0 && (id_flag == 'parent' || id_flag == 'teacher')) {
            this.getApply(user.id, id_flag)
        } else {
            this.getApply(e.detail.kid_id, 'student');
        }
    },
    // 选择的课程
    selectCourse: function(e) {
        let that = this;
        that.selectData(e.detail, that.data.courses, 'courses', 'selectedData.course', 'courseId')
        let _total = [];
        if (e.detail.courseId == 0) {
            _total = that.data.totalApply;
        } else {
            for (let i = 0; i < this.data.totalApply.length; i++) {
                if (e.detail.courseId == this.data.totalApply[i].courseid) {
                    _total.push(this.data.totalApply[i]);
                }
            }
        }
        this.setApplyFilter(_total);
    },

    // 参数
    // detail：下拉框选中得值   //e.detail
    // data：下拉框所有值   //可选值：this.data.courses/this.data.stus_name
    // name：判断是课程还是学生     //可选值：courses/stus_name
    // selectStr：选中的数据对应的变量字符串    //可选值："this.data.selectedData.course"/'this.data.selectedData.student'
    //dataId：选中的数据中的数据id      //可选值：courseId/kid_id
    selectData: function(detail, data, name, selectStr, dataId) {
        let that = this;
        console.log("选中的值是", detail);
        if (detail[dataId] == 0) {
            that.setData({
                [selectStr]: '',
            })
        } else {
            for (let i = 1; i < data.length; i++) {
                var tmp = `$name[` + i + "].isActive";
                this.setData({
                    [tmp]: false,
                })
                if (detail.id == data[i].id) {
                    this.setData({
                        [tmp]: true
                    });
                    that.setData({
                        [selectStr]: data[i],
                    })

                }
            }
        }

    },
})