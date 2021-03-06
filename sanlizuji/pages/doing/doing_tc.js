// pages/doing/doing_tc.js
const app = getApp();
let user = wx.getStorageSync('user')
const webSocket = require('../../utils/webSocket.js');
import { GetStuUpGps, TeaNowCourse, GpsRequest } from '../../utils/apis.js';
var timeId = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        height: getApp().globalData.height,
        // 活动主题
        title: '期末考试',
        // 学生
        students: [],
        // 用户坐标
        location: [],
        // 学生坐标
        mark: [],
        // 教师用户坐标
        tea_location: {
            latitude: 0,
            longitude: 0,

        },
        // 导师坐标
        stu_location: {
            latitude: 0,
            longitude: 0,
        },
        courseid: '',
        stuid: "",
        realTime: null, //实时数据对象(用于关闭实时刷新方法)
        user: user,
        request_code: 0,
    },
    //获取学生定位
    getStuGps: function(id) {
        let that = this;
        const p = GetStuUpGps({
            orderid: id,
        });
        p.then(value => {
                console.log("导师获取某个学生的位置信息");
                console.log(value)
                var tmp = [];
                tmp.push(that.data.tea_location);
                var latitude = "stu_location.latitude",
                    longitude = "stu_location.longitude";

                that.setData({
                    location: [value.data.data[0].latitude, value.data.data[0].longitude],
                    [latitude]: value.data.data[0].latitude,
                    [longitude]: value.data.data[0].longitude,

                })
                tmp.push(that.data.stu_location);
                console.log(tmp)
                that.setData({
                    mark: tmp
                })
            }, reason => {
                console.log("获取学生的位置数据失败", reason);
            })
            /*    wx.request({
                   url: app.globalData.url + 'WxOther/GetStuUpGps',
                   data: {
                       // userid: id,
                       // courseid: that.data.courseid
                       orderid: id,
                   },
                   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                   // header: {}, // 设置请求的 header
                   success: function(res) {
                       // success
                       console.log("导师获取某个学生的位置信息");
                       console.log(res)
                       var tmp = [];
                       tmp.push(that.data.tea_location);
                       var latitude = "stu_location.latitude",
                           longitude = "stu_location.longitude";

                       that.setData({
                           location: [res.data.data[0].latitude, res.data.data[0].longitude],
                           [latitude]: res.data.data[0].latitude,
                           [longitude]: res.data.data[0].longitude,

                       })
                       tmp.push(that.data.stu_location);
                       console.log(tmp)
                       that.setData({
                               mark: tmp
                           })
                           // console.log(that.data.mark)
                   },
                   fail: function() {
                       // fail
                   },
                   complete: function() {
                       // complete
                   }
               }) */
    },

    //获取学生信息
    TeaNowCourse: function() {

        let that = this;
        user = wx.getStorageSync('user');
        if (user != null && user != '') {
            const p = TeaNowCourse({
                id: user.id,
            });
            p.then(value => {
                    console.log("导师获取学生数据")
                    console.log(value)
                    if (value.data.data[0] == "无正在进行的课程") {
                        that.setData({
                            title: value.data.data[0]
                        })
                    } else {
                        that.setData({
                            students: value.data.data,
                            title: value.data.data[0].coursename,
                            courseid: value.data.data[0].courseid,
                        })
                    }
                }, reason => {
                    console.log("导师获取学生数据失败", reason);
                })
                /*   wx.request({
                      url: app.globalData.url + 'WxSign/TeaNowCourse',
                      data: {
                          id: user.id,
                      },
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      // header: {}, // 设置请求的 header
                      success: function(res) {
                          // success
                          console.log("导师获取学生数据")
                          console.log(res)
                          if (res.data.data[0] == "无正在进行的课程") {
                              that.setData({
                                  title: res.data.data[0]
                              })
                          } else {
                              that.setData({
                                  students: res.data.data,
                                  title: res.data.data[0].coursename,
                                  courseid: res.data.data[0].courseid,
                              })
                          }
                      },
                      fail: function() {
                          // fail
                      },
                      complete: function() {
                          // complete
                      }
                  }) */
        }
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

        user = wx.getStorageSync('user');
        if (user != null && user != '') {
            this.TeaNowCourse();
        }
        this.setData({
            user: user
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

        /**
         * 每隔一段时间请求服务器刷新数据(客户状态)
         * 当页面显示时开启定时器(开启实时刷新)
         * 每隔1分钟请求刷新一次
         * @注意：用户切换后页面会重新计时
         */
        user = wx.getStorageSync('user')
        this.setData({
            user: user
        })
        var that = this;
        if (user != null && user != '') {
            // 请求服务器数据
            console.log('请求接口：刷新数据')
            that.TeaNowCourse();
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


    // 获取定位
    getLocation: function(e) {
        console.log("定位");
        let that = this;
        console.log(e)
        var id = '';
        console.log(e)
        if (isNumber(e)) {
            id = e;
        } else {
            id = e.currentTarget.dataset.id;
        }
        //判断是否为数字
        function isNumber(val) {
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数io
            if (regPos.test(val)) {
                return true;
            } else {
                return false;
            }
        }
        user = wx.getStorageSync('user');
        if (user != null && user != '') {
            that.authorization(id);
        }
    },
    //这个函数是一开始点击事件触发的：
    async authorization(id) {
        let self = this
        try {
            await this.getWxLocation(id) //等待
        } catch (error) {
            wx.showModal({
                title: '温馨提示',
                tip: '获取权限失败，需要获取您的地理位置才能为您提供更好的服务！是否授权获取地理位置？',
                showCancel: true,
                confirmText: '前往设置',
                cancelText: '取消',
                sureCall() {
                    self.toSetting()
                },
                cancelCall() {}
            })
            return
        }
    },

    getWxLocation(id) {
        console.log("定位中");
        let that = this;
        wx.showLoading({
            title: '定位中...',
            mask: true,
        })
        return new Promise((resolve, reject) => {
            let _locationChangeFn = (res) => {
                console.log('location change', res);
                wx.hideLoading();

                var latitude = res.latitude;
                var longtitude = res.longitude;
                console.log(res);
                const p = GpsRequest({
                    teacherid: user.id,
                    courseid: that.data.courseid,
                });
                p.then(value => {
                    console.log("导师请求获取某个学生的位置信息");
                    console.log(value)
                    that.setData({
                        request_code: value.data.data.code,
                    })
                    if (value.data.data.code == 1) {
                        that.getStuGps(id);
                    } else {
                        wx.showToast({
                            title: '请求失败',
                            duration: 800,
                        });
                        that.data.realTime = setInterval(function() {
                                // 请求服务器数据
                                console.log('请求接口：刷新数据')
                                that.TeaNowCourse();
                                that.getLocation(id)
                            }, 30000) //间隔时间

                        // 更新数据
                        that.setData({
                            realTime: that.data.realTime, //实时数据对象(用于关闭实时刷新方法)
                        })
                    }
                }, reason => {
                    console.log("获取学生位置数据失败", reason);
                })
                var longitude2 = "tea_location.longitude",
                    latitude2 = "tea_location.latitude";
                this.setData({
                    [latitude2]: latitude,
                    [longitude2]: longtitude,
                    stuid: id
                })
                console.log("获取用户位置成功");
                console.log(this.data.mark)

                wx.offLocationChange(_locationChangeFn)
            }
            wx.startLocationUpdate({
                success: (res) => {
                    console.log(res);
                    wx.onLocationChange(_locationChangeFn);
                    resolve();
                },
                fail: (err) => {
                    console.log('获取当前位置失败', err)
                    wx.hideLoading()
                    reject()
                }
            })
        })
    },
    toSetting() {
        let self = this
        wx.openSetting({
            success(res) {
                console.log(res)
                if (res.authSetting["scope.userLocation"]) {
                    // res.authSetting["scope.userLocation"]为trueb表示用户已同意获得定位信息，此时调用getlocation可以拿到信息
                    self.authorization()
                }
            }
        })
    },
    getGps: function() {
        var data = { "type": "getgps" };
        if (timeId) {
            wx.showToast({
                title: "操作频繁，请稍后再试",
                icon: "none",
                duration: 800,
            })
        }
        clearTimeout(timeId);
        timeId = setTimeout(() => {
            webSocket.sendSocketMessage(data);
        }, 2000);
    }
})