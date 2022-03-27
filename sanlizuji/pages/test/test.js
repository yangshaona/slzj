Page({
    data: {
        url: "https://sanli-tracks.com/sanlia/uploads/temp/resume/2022/03/15/oCjgJ5c3ENG7-66sqRv2UYZMozloof resume.pdf",

    },
    savePicture1: function(e) {
        var _this = this;
        console.log(e);
        var url = _this.data.url;
        wx.getSetting({
            success: function(t) {
                var imgurl = url;
                if (imgurl.indexOf('https://') === -1) imgurl = imgurl.replace('http://', 'https://');
                t.authSetting["scope.writePhotosAlbum"] ? (wx.showLoading({
                    title: "下载中请稍后..."
                }), setTimeout(function() {
                        wx.hideLoading()
                    },
                    1e3), wx.downloadFile({
                    url: imgurl,
                    success: function(t) {
                        console.log(t);
                        console.log(t.tempFilePath);
                        wx.openDocument({
                            filePath: t.tempFilePath,
                            success: function(t) {
                                console.log(t);
                                console.log("222222")
                            },
                            fail: function(t) {
                                console.log(t);
                                console.log("3333333333")
                            }
                        })
                    }
                })) : wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    fail: function() {
                        wx.showModal({
                            title: "警告",
                            content: "您点击了拒绝授权，将无法正常使用保存图片或视频的功能体验，请删除小程序重新进入。"
                        })
                    }
                })
            }
        })
    },
    savePicture: function(e) {
        var _this = this;
        console.log(e);
        var url = _this.data.url;
        wx.getSetting({
            success: function(t) {
                var imgurl = url;
                if (imgurl.indexOf('https://') === -1) imgurl = imgurl.replace('http://', 'https://');
                t.authSetting["scope.writePhotosAlbum"] ? (wx.showLoading({
                    title: "下载中请稍后"
                }), setTimeout(function() {
                        wx.hideLoading()
                    },
                    1e3), _this.download()) : wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    fail: function() {
                        wx.showModal({
                            title: "警告",
                            content: "您点击了拒绝授权，将无法正常使用保存图片或视频的功能体验，请删除小程序重新进入。"
                        })
                    }
                })
            }
        })
    },

    download: function() {
        console.log("下载中");
        let _this = this;
        let f = this.data.url;
        const task = wx.downloadFile({
            url: f,
            success: function(res) {
                console.log(44, res);
                const t = res.tempFilePath;
                wx.saveFile({
                    tempFilePath: t,
                    success: function(res) {
                        wx.openDocument({
                            showMenu: true,
                            filePath: res.savedFilePath,
                            success: function(res) {

                            },
                            fail: function(r) {
                                wx.showToast({
                                    title: '打开文件失败',
                                })
                            }
                        })
                        wx.showToast({
                            title: '下载成功',
                        })
                    },
                    fail: function(r) {
                        console.log(67, r)
                    }
                })
            },
            fail: function(r) {
                console.log(72, r);
            }
        })
        task.onProgressUpdate((res) => {
            if (res.progress < 100) {
                _this.setData({
                    downloadproce: '下载中(' + res.progress + '%)'
                })
            } else {
                _this.setData({
                    downloadproce: '资料下载'
                })
            }

            console.log('下载进度', res.progress)
            console.log('已经下载的数据长度', res.totalBytesWritten)
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        })
    },
    onLoad: function(options) {
        // 生命周期函数--监听页面加载

    },
    onReady: function() {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function() {
        // 生命周期函数--监听页面显示

    },
    onHide: function() {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function() {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function() {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数

    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    }
})