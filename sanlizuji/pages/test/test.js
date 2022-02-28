const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isTipTrue: true,
    },

    onLoad: function(e) {
        var that = this;
        // time = e.formatTime(new Date());
        console.log("打开小程序的时间是：")
        that.setData({
            isTipTrue: true
        })
    },
    tipAgree: function() {
        this.setData({
            isTipTrue: false
        })
    },
    // 图片上传
    UpLoadImage: function() {
        //选取图片
        wx.chooseImage({
            count: 1,
            sizeType: ['original'], //原图
            sourceType: ['album', 'camera'], //支持选取图片
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0];
                //上传图片


                // for(var i=0;i<that.data.uploaderList.length;i++){
                wx.uploadFile({
                        //请求后台的路径
                        url: app.globalData.url + 'WxUser/SaveImg',

                        //小程序本地的路径
                        filePath: tempFilePaths,

                        name: 'file',
                        formData: {
                            //图片命名：用户id-商品id-1~9
                            newName: "img",
                            id: 1340,
                            // imgNum:i+1
                        },
                        success(res) {
                            console.log("成功上传图片");
                            console.log(res);
                        },
                        fail(res) {
                            flag = false;
                            wx.showModal({
                                title: '提示',
                                content: '上传失败',
                                showCancel: false
                            })
                        }
                    })
                    //   };
            }
        })
    }
})