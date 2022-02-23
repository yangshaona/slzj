// pages/detail/teacher.js
const app = getApp();
let user = wx.getStorageSync('user');
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
        teacherName: '',
        // 导师电话
        phoneNum: '',
        // 老师介绍 数组，段落为元素
        desc: [],
        // 老师参与的往期活动照片 数组 多个url及其描述
        schoolImg: "",
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
        user:user,

    },
    //获取导师之前的活动
    GetTeaReviewActiv: function(id) {
      console.log("id是：",id)
        let that = this;
        wx.request({
          url: app.globalData.url + 'WxOther/GetTeaReviewAct',
          data: {
            id: id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("成功获取导师该活动的回顾")
                console.log(res)
                that.setData({
                  schoolImg: mergeArr(res.data.data1, res.data.data2)
                })
                console.log(that.data.schoolImg)

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
            
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("导师详情界面")
        console.log(options)
      let that = this; 
      user = wx.getStorageSync('user');
      that.setData({
        user: user
      })
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
                  that.GetTeaReviewActiv(res.data.data.id)
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
      user = wx.getStorageSync('user');
      this.setData({
        user: user
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

    }
})