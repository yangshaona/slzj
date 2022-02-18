// pages/detail/teacher.js
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
        // 老师图片 数组放url 可多张
        actImg: [
            "https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg",
            "https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg"
        ],
        //导师信息
        teacher_info: "",
        // 导师名称
        teacherName: '曹九稳',
        // 导师电话
        phoneNum: '13336253625',
        // 老师介绍 数组，段落为元素
        desc: [
            '曹九稳，博士，教授，IEEE Senior Member，2012、2008、2005年分别在新加坡南洋理工大学（NTU）电子电气工程学院、电子科技大学数学科学学院获博士、理学硕士和理学学士学位；浙江省机器学习与智慧健康国际合作基地中心主任、杭州电子科技大学人工智能研究院副院长；入选浙江省“万人计划”青年拔尖人才、省高等学校“院士结对培养青年英才计划”、省高校领军人才培养计划高层次拔尖人才、中国电子学会优秀科技工作者、科技部“中法杰出青年交流计划”、省151人才工程等，中国人工智能协会高级会员、IEEE电路与系统协会（CAS）技术委员会委员。',
            '主要从事深度神经网络、医学信号处理、智能数据处理等领域的研究，主持国家科技部重点研发、国家自然科学基金重点、国家自然科学青年基金、科技部中法杰出青年交流计划项目、省海外高层次人才创新创业项目等。主持获2019年中国商业联合会科技二等奖（省部级），参与获2017年中国商业联合会科技一等奖（省部级）。在IEEE（TNNLS、TCYB、JBHI、TNSRE、TSP、TGRS、IoT、TCSVT、TCDS、TIE、TCAS-II）、IEEE ICASSP等国际期刊与会议上发表论文180余篇（第一/通讯作者SCI检索90余篇），5篇论文入选ESI热点，6篇论文入选ESI高被引，Google学术引用3100余次，授权发明专利19项，公开发明专利80余项。担任IEEE TCAS-I、J. Franklin I.、Multi. System. Sig. Process.、Memetic Computing、Electronics 5个国际著名SCI期刊的副主编。指导博士生、硕士生多次获得国家奖学金、省优博论文提名、省/校优秀博士/硕士毕业论文、省/校优秀博士/硕士毕业生、国际学术会议最佳论文、中国研究生人工智能创新大赛等荣誉。',
            '研究中心现有5位教授、1位副教授、3位讲师；与法国巴黎大学、新加坡南洋理工大学、加拿大温莎大学、德国伍伯塔尔大学、澳门大学、复旦华山医院、浙江省儿保医院、浙二医院等长期保持科研合作；研究中心学生多次赴法国、加拿大等交流学习；与法国巴黎第五大学联合成立了“中法机器学习与智慧健康国际合作联合实验室”，获批2018年中央财政专项“机器学习与智慧健康中法国际合作研究平台”。'
        ],
        // 老师参与的往期活动照片 数组 多个url及其描述
        schoolImg: [{
                'img': 'https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg',
                'desc': '快乐地期末考试'
            },
            {
                'img': 'https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg',
                'desc': '浅看一下NBA'
            }
        ],
        // 导师评价
        comment: [{
                'nickName': 'return0',
                'avator': 'https://s3.bmp.ovh/imgs/2022/01/a22bfc3b7b881581.jpg',
                'ctn': '真不错哈哈哈哈哈喜欢这个老师'
            },
            {
                'nickName': 'return0',
                'avator': 'https://s3.bmp.ovh/imgs/2022/01/a22bfc3b7b881581.jpg',
                'ctn': '爱住了'
            },
        ],

    },
    //获取导师之前的活动
    GetTeaReviewActiv: function(id) {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxCourse/DailyDetail',
            data: {
                courseid: id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("成功获取导师该活动的回顾")
                console.log(res)
                that.setData({
                    schoolImg: res.data.data
                })
                console.log(that.data.schoolImg)
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("导师详情界面")
        console.log(options)
        let that = this;
        let user = wx.getStorageSync('user')
        wx.request({
            url: app.globalData.url + 'WxSign/GetTeacherDetail',
            data: {
                courseid: options.course_id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("成功获取老师数据")
                console.log(res)
                if (res.data.data == "") {
                    that.setData({
                        teacher_info: res.data.data
                    })
                } else {
                    that.setData({
                        teacher_info: res.data.data
                    })
                    that.GetTeaReviewActiv(options.course_id)
                }
                console.log(that.data.teacher_info)
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
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