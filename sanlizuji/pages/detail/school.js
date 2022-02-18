// pages/detail/school.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 屏幕高度
        height: getApp().globalData.height,
        // 屏幕宽度
        width: getApp().globalData.width,
        // 学校缩略图 数组放url 可多张
        actImg: [
            "https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg",
            "https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg"
        ],
        service_club: { // 机构名称及机构logo
            club_name: '华南师范大学',
            // 学校logo
            pic: 'https://bkimg.cdn.bcebos.com/pic/21a4462309f79052982290b94eb9c0ca7bcb0b467fab?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5/format,f_auto',
            // 机构简介 应为一个数组，以简介段落为元素
            introduce: [
                '华南师范大学（South China Normal University），简称“华南师大”，主校区位于广州市，是广东省人民政府和教育部共建高校，是首批国家“世界一流学科建设高校”、国家“211工程”重点建设大学，入选国家“111计划”、“卓越教师培养计划”、 “国培计划”、国家级大学生创新创业训练计划、国家建设高水平大学公派研究生项目、广东省重点大学、广东省高水平大学整体建设高校、中国政府奖学金来华留学生接收院校、国家大学生文化素质教育基地等，为中国人工智能教育联席会理事单位。',

            ],
        },
        // 学校往期活动照片 数组 多个url及其描述
        schoolImg: [{
                'img': 'https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg',
                'desc': '快乐地期末考试'
            },
            {
                'img': 'https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg',
                'desc': '浅看一下NBA'
            }
        ]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("服务商详情")
        console.log(options)
        let that = this;
        wx.request({
            url: app.globalData.url + "WxCourse/Clubdetail",
            data: {
                clubid: options.id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("服务商数据")
                console.log(res)
                that.setData({
                    service_club: res.data.data[0]
                })
                that.getClubActivity(res.data.data[0].id)
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })

    },
    //获取对应服务商的活动数据
    getClubActivity: function(id) {
        let that = this;
        wx.request({
            url: app.globalData.url + "WxOther/GetClubActivity",
            data: {
                id: id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("服务商的活动数据")
                console.log(res)
                that.setData({
                    schoolImg: res.data.data
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
    //跳转到对应活动
    toCourseDetail: function(e) {
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