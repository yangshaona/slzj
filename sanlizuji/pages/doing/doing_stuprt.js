// pages/course/doing/doing_stu&prt.js
const app = getApp();
let user = wx.getStorageSync('user')
let id_flag = wx.getStorageSync('id_flag');
import { UpGps, GetTeaUpGps, ActiveStuDetail } from '../../utils/apis.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 状态栏高度
        statusHeight: getApp().globalData.statusHeight,
        // 屏幕高度
        height: getApp().globalData.height,
        // 正在活动
        course: "",
        doing: {
            'coursename': '', //活动名称
            'starttime': '', //活动日期
            'groupnum': '', //小组号
            'latituderoom': '', //房间号
            'car': '', //车牌号
        },
        // 导师信息
        teacher: {},
        // 中部信息展示框
        display: [],
        // 信息icon
        icon: {
            'starttime': '/icon/date1.png',
            'groupnum': '/icon/group.png',
            'hotel': '/icon/room.png',
            'car': '/icon/car.png'
        },
        // 用户坐标
        location: [],
        // 导师坐标
        mark: [],
        realTime: null, //实时数据对象(用于关闭实时刷新方法)
        //导师位置
        tea_location: {
            latitude: 0,
            longitude: 0,
        },
        //学生位置
        stu_location: {
            latitude: 0,
            longitude: 0,
        },
    },

    // 信息框赋值
    getData: function() {
        var data = this.data.doing;
        var url = this.data.icon;
        var trans = { 'groupnum': '小组', 'hotel': '酒店', 'car': '车牌', 'starttime': '日期' }
        var display = [];
        for (var idx in data) {
            if (idx == 'coursename') continue;
            else if (idx == 'groupnum' || idx == 'hotel' || idx == 'car' || idx == 'starttime') {
                var key = trans[idx];
                var value = '';
                if (idx == 'hotel') value = data[idx] + data['room'];
                else value = data[idx];
                var icon = url[idx];
                var dict = { 'key': key, 'value': value, 'icon': icon };
                display.push(dict);
            }
        }
        console.log(display);
        this.setData({
            display: display
        })
    },

    // 获取学生自身的定位
    getLocation: function(e) {
        var that = this;
        wx.getLocation({
            type: "gcj02",
            altitude: 'true',
            isHighAccuracy: 'true',
            highAccuracyExpireTime: '3500',
            success: (res) => {
                var latitude = res.latitude;
                var longitude = res.longitude;
                var tmp = [];
                tmp.push(that.data.tea_location);
                var latitude2 = "stu_location.latitude",
                    longitude2 = "stu_location.longitude";
                that.setData({
                    location: [latitude, longitude],
                    [latitude2]: latitude,
                    [longitude2]: longitude,
                })
                tmp.push(that.data.stu_location);
                console.log(tmp)
                that.setData({
                    mark: tmp
                })
                console.log("获取用户位置成功");
                console.log(this.data.location);
                console.log(this.data.mark);
                const p = UpGps({
                    userid: user.id,
                    courseid: that.data.course.courseid,
                    longitude: res.longitude,
                    latitude: res.latitude,
                });
                p.then(value => {
                    console.log("成功上传学生位置");
                    console.log(value)
                }, reason => {
                    console.log("上传学生位置失败", reason);
                });
            },
            fail: (res) => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'error',
                    duration: 800
                })
                console.log(res);
            }
        })
    },

    //获取导师位置
    getTeacherLocation: function(teaOrderId) {
        let that = this;
        const p = GetTeaUpGps({
            teaOrderId: teaOrderId,
        });
        p.then(value => {
            console.log("成功获取导师位置");
            console.log(value);
            if (value.data.data.length != 0) {
                var latitude = "tea_location.latitude",
                    longitude = "tea_location.longitude";
                that.setData({
                    [latitude]: value.data.data[0].latitude,
                    [longitude]: value.data.data[0].longitude,
                });
                that.getLocation();
            }
        }, reason => {
            console.log("获取导师位置失败", reason);
        })
    },

    //登录查看更多
    _goLogin: function() {
        wx.navigateTo({
            url: '../register/register_stu',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        console.log(options)
        var userid = options.userid
        let that = this;
        user = wx.getStorageSync('user')
        id_flag = wx.getStorageSync('id_flag');
        this.setData({
            id_flag: id_flag,
            user: user
        })
        if (id_flag != 'parent') {
            userid = user.id;
        }
        const p = ActiveStuDetail({
            id: userid,
        });
        p.then(value => {
            console.log("是否有正在活动信息111111111")
            console.log(value)
            if (value.data.data[0] == "无正在进行的课程") {
                that.setData({
                    doing: value.data.data[0],
                })
            } else if (value.data.data[0] == "该活动暂未分配老师") {
                that.setData({
                    doing: value.data.data[0],
                })
            } else {
                that.setData({
                    doing: value.data.data[0],
                    teacher: value.data.teacher[0],
                    course: value.data.data[0]
                });
                console.log(value.data.data[0].teacherOrderId);
                wx.setStorageSync('teaOrderId', value.data.data[0].teacherOrderId);
                wx.setStorageSync('teaOrderId', value.data.data[0].teacherOrderId);
                //获取导师位置
                that.getTeacherLocation(value.data.data[0].teacherOrderId);
                that.getData();

            }
        }, reason => {
            console.log("获取正在活动数据失败", reason);
        });
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
        var that = this;
        user = wx.getStorageSync('user')
        id_flag = wx.getStorageSync('id_flag');
        this.setData({
            id_flag: id_flag,
            user: user
        })
        if (that.data.course != "") {
            this.data.realTime = setInterval(function() {

                    // 请求服务器数据
                    console.log('请求接口：刷新数据');
                    let teaOrderId = wx.getStorageSync('teaOrderId');
                    that.getTeacherLocation(teaOrderId);
                }, 30000) //间隔时间
                // 更新数据
            this.setData({
                realTime: this.data.realTime, //实时数据对象(用于关闭实时刷新方法)
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        /**
         * 当页面隐藏时关闭定时器(关闭实时刷新)
         * 切换到其他页面了
         */
        clearInterval(this.data.realTime)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        // clearInterval(this.data.realTime)
        wx.navigateBack({
            delta: 0,
        })
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