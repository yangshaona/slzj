// pages/course/course.js
const app = getApp();
let user = wx.getStorageSync('user');
let id_flag = wx.getStorageSync('id_flag');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 设备状态栏高度
        statusHeight: app.globalData.statusHeight,
        // 设备高度
        height: app.globalData.height,
        // 全部活动
        /* 需要的key: 
          imgUrl: 缩略图链接
          actTitle: 活动标题
          actNum: 报名人数
          ddl: 报名截止日期
        */
        activity: [],
        activity2: {},
        id_flag: "",
        user: user,

        kids_name: "",
    },
    // 跳转到报名
    //前往报名
    goToApply: function() {
        wx.switchTab({
            url: '../course/course',
        })
    },
    // 导师详情
    showTeacherDetail: function(e) {
        console.log("点击导师")
        var courseid = e.currentTarget.dataset.courseid;
        var teacherid = e.currentTarget.dataset.teacherid;
        if (courseid == '' || teacherid == '') {
            wx.showToast({
                title: '还未分配导师',
                icon: "none",
                duration: 800,
            })
        } else {
            wx.navigateTo({
                url: '../detail/teacher?course_id=' + courseid + "&teacherid=" + teacherid,
            })
        }
    },
    //父母获取孩子的活动
    GetKidsActivity: function(e) {
        let that = this;
        user = wx.getStorageSync('user');
        id_flag = wx.getStorageSync('id_flag');
        that.setData({
                id_flag: id_flag,
            })
            //获取已绑定的孩子信息
        wx.request({
            url: app.globalData.url + 'WxCourse/GetKidsActivity',
            data: {
                pid: user.id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("成功获取绑定孩子qq信息");
                console.log(res);
                var activity = [];
                for (var item of res.data.data.data) {
                    activity.push(mergeArr(item.data1, item.data2));

                }

                function mergeArr(arr1, arr2) { //arr目标数组 arr1要合并的数组 return合并后的数组
                    if (arr1.length == 0) {
                        return [];
                    }
                    let arr3 = [];
                    arr1.map((item, index) => {
                        arr3.push(Object.assign(item, arr2[index]));
                    })
                    return arr3;
                }
                that.setData({
                    activity: activity
                })
                console.log("我的活动数据")
                console.log(activity)
                console.log(that.data.activity)
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },


    //学生获取我的活动
    GetStuActivity: function() {
        let that = this;
        user = wx.getStorageSync("user");
        wx.request({
            url: app.globalData.url + 'WxOther/GetMyAct',
            data: {
                id: user.id
            },
            success: function(res) {
                // success
                console.log("我的活动")
                console.log(res);
                var activity = mergeArr(res.data.data1, res.data.data2)
                that.setData({
                    activity: activity
                })
                console.log("ac");
                console.log(activity)

                function mergeArr(arr1, arr2) { //arr目标数组 arr1要合并的数组 return合并后的数组
                    if (arr1.length == 0) {
                        return [];
                    }
                    let arr3 = [];
                    arr1.map((item, index) => {
                        arr3.push(Object.assign(item, arr2[index]));
                    })
                    return arr3;
                }
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        });
    },

    //登录查看更多
    _goLogin: function() {
        wx.navigateTo({
            url: '../register/register_stu',
        })
    },

    // 监护人绑定孩子已经孩子绑定监护人
    _goBound: function() {
        id_flag = wx.getStorageSync('id_flag');
        wx.navigateTo({
            url: '../person_info/parent_info',
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        console.log(options);
        user = wx.getStorageSync('user')
        id_flag = wx.getStorageSync('id_flag');
        that.setData({
            id_flag: id_flag,
            user: user
        })
        if (id_flag == "student") that.GetStuActivity();
        else if (id_flag == "parent") {
            that.GetKidsActivity();
            that.setTitle("孩子的活动");
        }

    },
    // 设置标题
    setTitle: function(tname) {
        wx.setNavigationBarTitle({ title: tname })
    },
    //点击跳转到活动课程详情
    toCoursesDetail: function(e) {
        console.log("我的")
        console.log(e)
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
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
        let that = this;
        user = wx.getStorageSync('user')
        id_flag = wx.getStorageSync('id_flag');
        that.setData({
            id_flag: id_flag,
            user: user
        })
        if (id_flag == "student") that.GetStuActivity();
        else if (id_flag == "parent") that.GetKidsActivity();
        // if (user != null && user != '') {

        //     if (id_flag == 'parent') {
        //         console.log("家长身份");
        //         console.log(that.data.id_flag);
        //         this.getKidsList()
        //     }

        // }
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
    // 选中孩子
    select: function(e) {
        console.log("选中的值是");
        console.log(e.detail);
        var type = e.detail.value
        if (e.detail.value == "请选择") {
            type = "";
        }

        for (var i = 1; i < this.data.kids_name.length; i++) {
            var tmp = "kids_name[" + i + "].isActive"
            this.setData({
                [tmp]: false,
            })
            if (e.detail.id == this.data.kids_name[i].id) {
                this.setData({
                    [tmp]: true
                })
            }
        }
        if (e.detail.kid_id == 0) {
            this.getApply(user.id, 'parent', 'parent');

        } else {
            this.getApply(e.detail.kid_id, 'student', 'student');

        }
    },
    // 获取孩子信息
    getKidsList: function() {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxUser/GetKidsList',
            data: {
                id: user.id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("孩子信息111");
                console.log(res);
                if (res.data.data.length > 0) {
                    var kids = [];
                    kids.push({ "id": "01", "isActive": false, "value": "请选择", "kid_id": 0 })
                    for (var i = 0; i < res.data.data.length; i++) {
                        var kid = { "id": "0" + (i + 2), "isActive": false, "value": res.data.data[i].name, "kid_id": res.data.data[i].id };
                        kids.push(kid);
                    }
                    that.setData({
                        kids_name: kids
                    })
                    console.log(that.data.kids_name);
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