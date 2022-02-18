// pages/detail/detail.js
const app = getApp();
import {
    formatRichText
} from '../../utils/text.js'
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
        // 活动缩略图 数组放url 可多张
        actImg: [
            "https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg",
            "https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg"
        ],
        //服务商机构
        // logo: 'https://bkimg.cdn.bcebos.com/pic/21a4462309f79052982290b94eb9c0ca7bcb0b467fab?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5/format,f_auto',

        service_club: { // 机构名称及机构logo
            club_name: '华南师范大学',
            pic: 'https://bkimg.cdn.bcebos.com/pic/21a4462309f79052982290b94eb9c0ca7bcb0b467fab?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5/format,f_auto',
            // 机构简介 应为一个数组，以简介段落为元素
            introduce: [
                '华南师范大学（South China Normal University），简称“华南师大”，主校区位于广州市，是广东省人民政府和教育部共建高校，是首批国家“世界一流学科建设高校”、国家“211工程”重点建设大学，入选国家“111计划”、“卓越教师培养计划”、 “国培计划”、国家级大学生创新创业训练计划、国家建设高水平大学公派研究生项目、广东省重点大学、广东省高水平大学整体建设高校、中国政府奖学金来华留学生接收院校、国家大学生文化素质教育基地等，为中国人工智能教育联席会理事单位。',

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
        service_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 课程
        course_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 住宿
        dorm_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 餐饮
        food_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 导师
        teacher_rate: [
            { 'id': 0, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 1, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 2, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 3, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
            { 'id': 4, 'rate': 0, 'icon': '/icon/star_ept_blue.png' },
        ],
        // 向服务端提交评论
        service_star: '',
        course_star: '',
        food_star: '',
        dorm_star: '',
        teacher_star: '',
        // 文字评价
        cmt: "",
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
        let that = this
        wx.request({
            url: app.globalData.url + 'WxCourse/GetDetail',
            data: {
                id: options.id
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

                that.getSchedule(res.data.data[0].id)
                that.getComments(res.data.data[0].id);
                that.getClub(res.data.data[0].club_id)
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
                id: "",
                coursename: "",
                foods: "",
                services: "",
                courses: "",
                stays: "",
                foodm: "",
                servicem: "",
                coursem: "",
                staym: "",
                P_comment: "",
                P_score: "",
                photo: "",


            },
            success(res) {
                console.log("评论数据");
                console.log(res)
                that.setData({
                    comment: res.data.data
                });
            },
        })
    },
    //获取学校或者服务商
    getClub: function(club_id) {
        let that = this;
        console.log(club_id)
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
                that.setData({
                    service_club: res.data.data[0]

                });
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
        })
    },
    // 跳转学校详情
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

            wx.showModal({
                content: '还未登录，请先登录再报名！', //提示的内容,
                showCancel: false, //是否显示取消按钮,
                success: function(res) {
                    if (res.confirm) {
                        console.log('确定')
                        wx.navigateTo({
                            url: '../register/register_teacher'
                        })
                    } else {
                        console.log('取消')
                    }
                }

            });
        } else {
            wx.request({
                url: app.globalData.url + "WxSign/Teasign",
                data: {
                    userid: user.id,
                    courseid: that.data.course_detail.id,
                    username: user.name
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    if (res.data.data.msg == "报名成功") {

                        console.log("报名成功")
                        console.log(res);
                        wx.navigateTo({
                                url: '../pay/confirm?id=' + that.data.course_detail.id,
                            })
                            // wx.showToast({
                            //     title: "报名成功",
                            //     icon: 'success',
                            //     duration: 1600,
                            // })
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
        }
    },
    //学生报名
    studentSignUp: function(options) {
        console.log("学生报名信息");
        console.log(options);
        let user = wx.getStorageSync('user')
        let that = this;
        console.log(user)
        if (!user) {

            wx.showModal({
                content: '还未登录，请先登录再报名！', //提示的内容,
                showCancel: false, //是否显示取消按钮,
                success: function(res) {
                    if (res.confirm) {
                        console.log('确定')
                        wx.navigateTo({
                            url: '../register/register_stu'
                        })
                    } else {
                        console.log('取消')
                    }
                }

            });
        } else {

            wx.request({
                url: app.globalData.url + "WxSign/Stusign",
                data: {
                    userid: user.id,
                    courseid: that.data.course_detail.id,
                    username: user.name
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res) {
                    // success
                    console.log("报名数据")
                    console.log(res)
                    if (res.data.data.msg == "报名成功") {
                        wx.navigateTo({
                                url: '../pay/confirm?id=' + that.data.course_detail.id,
                            })
                            // wx.showToast({
                            //     title: "报名成功",
                            //     icon: 'success',
                            //     duration: 1600,
                            // })
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