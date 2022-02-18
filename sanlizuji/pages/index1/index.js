// pages/index/index.js
var swiperIndex = 0;
var Urlsid = [1, 2, 3, 4];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 状态栏高度
    statusHeight: getApp().globalData.statusHeight,
    // 设备高度
    height: getApp().globalData.height,
    index: 0, //当前轮播图
    indicatorDots: "true",//是否显示面板指示点
    autoplay: "true",//是否自动切换
    interval: "5000",//自动切换时间间隔
    duration: "1000",//滑动动画时长//uploads/temp/WxImg/turn_img1.jpg
    isHideLoadMore: true,
    // 轮播图图像url
    // imgUrl: [
    //   app.globalData.imgUrl+"turn_img1.jpg",  app.globalData.imgUrl +"turn_img2.jpg",
    //   app.globalData.imgUrl +"turn_img3.jpg",  app.globalData.imgUrl +"turn_img4.jpg",
    // ],
    imgUrl: [
      "https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg",
      "https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg"
    ],
    // 顶部导航栏
    //imgUrl为icon链接，text为导航文字,url为所在页面链接
    navigation: [
      {'imgUrl':'/icon/activity.png','text':'亲子活动','url':''},
      {'imgUrl':'/icon/bubble.png','text':'研学课程','url':''},
      {'imgUrl':'/icon/exp.png','text':'冬夏令营','url':''},
      {'imgUrl':'/icon/mind.png','text':'待定板块','url':''}
    ],
    // 搜索框
    searchClass: "srcFold",
    inputClass: "inputFold",
    // 输入的搜索内容, 向服务端提交search内容=>在searchTap函数里的else{}内进行
    search: "",
    /* 热门活动
      imgUrl: 缩略图链接
      actTitle: 活动标题
      ddl: 活动截止日期
      actNum: 报名人数
    */
    popActivity: [
      { 
        'imgUrl':'https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg',
        'actTitle':'观看NBA直播','ddl':'2022-01-25','actNum':'827364'
      },
      {
        'imgUrl':'https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg',
        'actTitle':'NBA体验营','ddl':'2022-01-26','actNum':'999999999'
      }
    ],
    // 往期回顾
    history: [
      { 
        'imgUrl':'https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg',
        'actTitle':'与NBA巨星面对面','ddl':'2022-01-25','actNum':'827364'
      },
      {
        'imgUrl':'https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg',
        'actTitle':'与MVP面对面','ddl':'2022-01-26','actNum':'999999999'
      },
      { 
        'imgUrl':'https://s3.bmp.ovh/imgs/2022/01/6ab7032e3f6c3bde.jpg',
        'actTitle':'见证三分王','ddl':'2022-01-25','actNum':'827364'
      },
      {
        'imgUrl':'https://s3.bmp.ovh/imgs/2022/01/817aed11996fdc0b.jpg',
        'actTitle':'勇士总冠军','ddl':'2022-01-26','actNum':'999999999'
      }
    ] 
  },

  //点击轮播图
  swiperClick: function () {
    // wx.navigateTo({
    //   url: '/pages/shopinfo/shopinfo?id=' + Urlsid[swiperIndex],
    // })
  },

  //轮播图轮播事件
  swiperChange: function (e) {
    if(e.detail.sourse == "touch") {
      swiperIndex = e.detail.current;
      this.setData({
        index: e.detail.current
      })
    }
  },
  // 记录搜索
  writeData: function(e) {
    this.setData({
      search: e.detail.value
    })
  },
  // 点击弹出搜索框
  searchTap: function(e) {
    var src = this.data.searchClass;
    var input = this.data.search;
    if(src == "srcFold") {
      this.setData({
        searchClass: "srcExt",
        inputClass: "inputExt"
      })
      console.log("弹出搜索框");
    }
    else if(input == "" || input == null) {
      this.setData({
        searchClass: "srcFold",
        inputClass: "inputFold"
      })
      console.log("折叠搜索框")
    }
    else {
      // 有搜索内容,记录在this.data.search里
      console.log(input);
      console.log(this.data.search);
      // 向后台提交search结果在这里进行
    }
  },

  // 点击进入详情
  turnTo: function(e) {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("状态栏高度:"+this.data.statusHeight)
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.onLoad();
    setTimeout(function () {
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1300);
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