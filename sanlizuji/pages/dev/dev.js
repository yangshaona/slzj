// pages/dev/dev.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '',
    endTime: '',
    time: '',
  },

  getTime: async function(e) {
    const that = this;
    // 页面跳转后立刻生成订单提交时间
    function createTime() {
      const startTime = +new Date();
      // 十五分钟
      const endTime = startTime + 900000;
      // 向服务器提交订单提交时间和订单截止时间
      wx.request({
        url: 'url',
        data: {
          startTime: startTime,
          endTime: endTime,
        },
        method: 'POST',
      })


      that.setData({
        startTime: startTime,
        endTime: endTime,
      })
      that.setTime();
    }
    // 向服务器请求数据，若已存在此订单的截止时间，则直接拿下来用
    wx.request({
      url: 'url',
      data: {

      },
      success: res=>{
        console.log(res);
        // 获得订单截止时间
        that.setData({
          endTime: res.data.endTime,
        })
        that.setTime();
      },
      fail: err=>{
        console.log(err);
        // 新生成截止时间, 并提交后台
        createTime();
      }
    })
    
  },

  setTime: async function(e,callback) {
    // 计时结束回调函数
    if(typeof(callback) === 'function') {
      // 异步跳转
      setTimeout(function(){
        wx.reLaunch({
          // 跳转到某个页面
          url: '../index/index',
        })
      },800)
      wx.showToast({
        title: '订单过期！',
        icon: 'error',
        duration: 800,
      })
      // 后台销毁订单
      wx.request({
        url: 'url',
        data: {},
      })
      return -1;
    }


    // 每过1000ms计算一次
    const that = this;
    let st = setInterval(async function() {
      let now = +new Date();
      let duration = (that.data.endTime-now)/1000;
      if(duration <= 0) {
        // 倒计时结束，回调函数
        clearInterval(st);
        return await that.setTime(0,function(){
          console.log('Time out!');
        })  
      }
      let time = parseInt(duration/60) + '分' + parseInt(duration%60) + '秒'; 
      that.setData({
        time: time,
      })
    },1000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTime(); 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})