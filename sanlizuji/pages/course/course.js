// pages/course/course.js
const app = getApp();
const areaList = require('../../utils/arealist.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        width: app.globalData.width,
        // 今日日期
        date: "",
        // 设备状态栏高度
        statusHeight: app.globalData.statusHeight,
        // 设备高度
        height: app.globalData.height,
        // 内容透明度
        ctnOpacity: "100%",
        isSearch: 0, //判断是否点击搜索
        // 筛选栏
        filterClass: "filterHide",
        filter: [{
                'title': '活动主题',
                'ctn': ['亲子活动', '研学课程', '冬夏令营']
            },
            {
                'title': '活动时长',
                'ctn': ['短途', '长途']
            },
            {
                'title': '活动状态',
                'ctn': ['未开始报名', '已开始报名', '活动未开始', '活动进行中', '活动已结束']
            }
        ],
        // 用于判定选中的样式data-id
        filterID: {
            '亲子活动': '0',
            '研学课程': '0',
            '冬夏令营': '0',
            '短途': '0',
            '长途': '0',
            '未开始报名': '0',
            '已开始报名': '0',
            '活动未开始': '0',
            '活动进行中': '0',
            '活动已结束': '0'
        },

        // 筛选的条件,在 filterCheck执行后赋值
        condition: [],
        /** 
         * 传服务端
         */
        // 搜索的内容， 在searchTap执行后赋值
        seacher_word: "",
        // 筛选条件
        theme: [],
        duration: "",
        status: [],
        start: "",
        end: "",
        region: ['北京', '北京', '东城'],
        multiArray: [],
        multiIndex: [0, 0, 0],
        activity: [],
        navig_name: '',
        title_name: '课程',
        seacher_word: "",
        filterHide: true,
        reg_idx: null,
    },
    // checkTap
    checkTap: function(e) {
        console.log(e);
        const width = this.data.width;
        let tapX = e.detail.x;
        if (this.data.filterHide || tapX / width >= 0.75) {
            return true;
        } else {
            return false;
        }
    },

    // 筛选栏弹出/折叠
    filterTap: function(e) {
        if (this.checkTap(e) || e.currentTarget.dataset.id == 'confirm') {
            var filterCSS = this.data.filterClass;
            var filterHide = this.data.filterHide;
            console.log("遮罩是。。。。。")
            console.log(filterHide)
            if (filterHide) {
                console.log("筛选栏展开");
                this.setData({
                    filterClass: "filterShow",
                    ctnOpacity: "40%",
                    filterHide: false,
                })
            } else {
                console.log("筛选栏折叠");
                this.setData({
                        filterClass: "filterHide",
                        ctnOpacity: "100%",
                        filterHide: true
                    })
                    // 向服务端提供的条件
                var condition = this.data.condition;
                var theme = [],
                    duration = "",
                    status = [];
                for (var key of condition) {
                    if (key.length == 4) {
                        theme.push(key);
                    } else if (key.length == 2) {
                        duration = key;
                    } else {
                        status.push(key);
                    }
                }
                this.setData({
                    theme: theme,
                    duration: duration,
                    status: status
                });

                this.getSearchData();
            }
        }

    },
    // 重置筛选条件
    reset: function() {
        console.log("nihao")
        this.setData({
            theme: [],
            duration: "",
            status: [],
            start: "",
            end: "",
            region: [],
            reg_idx: null,
            condition: [],
            filterID: {
                '亲子活动': '0',
                '研学课程': '0',
                '冬夏令营': '0',
                '短途': '0',
                '长途': '0',
                '未开始报名': '0',
                '已开始报名': '0',
                '活动未开始': '0',
                '活动进行中': '0',
                '活动已结束': '0'
            },
        })
    },
    // 地区选择器改变
    regionChange: function(e) {
        let data = e.detail.value;
        this.setData({
            region: data
        })
    },
    //获取筛选数据
    getFilter: function() {
        let that = this;
        wx.request({
            url: app.globalData.url + 'WxOther/activitytype',
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header2
            success: function(res) {
                // success
                console.log("活动主题类型")
                console.log(res)
                for (var i = 0; i < res.data.data.length; i++) {
                    var type = "filter[0].ctn[" + i + "]";
                    that.setData({
                        [type]: res.data.data[i].type
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
    },
    // 筛选框选中
    filterCheck: function(e) {
        var id = e.currentTarget.dataset.id;
        var key = e.currentTarget.dataset.value;
        var condition = this.data.condition;
        if (id == 0) {
            console.log("选中")
            var filter = this.data.filterID;
            filter[key] = 1;
            // 活动时长为单选
            if (key == '短途') {
                if (condition.indexOf('长途') != -1) {
                    condition.splice(condition.indexOf('长途'), 1);
                    console.log('释放长途');
                    // 改变data-id
                    filter['长途'] = 0;
                }
            } else if (key == '长途') {
                if (condition.indexOf('短途') != -1) {
                    condition.splice(condition.indexOf('短途'), 1);
                    console.log('释放短途');
                    // 改变data-id
                    filter['短途'] = 0;
                }
            }
            condition.push(key);
            this.setData({
                filterID: filter,
                condition: condition
            })
        } else {
            console.log("释放")
            var filter = this.data.filterID;
            filter[key] = 0;
            Array.prototype.indexOf
                // 删除数组中的元素
            condition.splice(condition.indexOf(key), 1);
            this.setData({
                filterID: filter,
                condition: condition
            })
        }
        console.log("选中条件")
        console.log(this.data.condition)
    },

    // 时间选择器改变
    startChange: function(e) {
        this.setData({
            start: e.detail.value,
            end: e.detail.value
        })
    },
    endChange: function(e) {
        this.setData({
            end: e.detail.value
        })
    },

    //跳转到课程详情
    toCourseDetail: function(e) {
        console.log(e)
        var fid = e.currentTarget.dataset.fid
        wx.navigateTo({
            url: '../detail/detail?id=' + fid,
        })
    },
    // 搜索
    searchTap: function(e) {
        console.log("提交检索");
        var ctn = e.detail.value;
        // 清空内容
        this.setData({
            seacher_word: ctn,
        })
        wx.showToast({
            title: '正在搜索',
            icon: 'success',
            duration: 500
        })
        this.getSearchContent();
        setTimeout(function() {
            e.detail.value = "";
        }, 500)
    },
    //搜索内容
    getSearchContent: function(e) {
        this.getSearchData();
    },
    getSearchData: function() {
        console.log("地区选中是：", this.data.region);
        let that = this;
        var para = [],
            area = ['', '', ''];
        para.push(app.globalData.viewMore);
        var status = '',
            duration = '';
        if (that.data.status != '') {
            status = that.data.status;
        }
        if (that.data.duration != '') {
            duration = that.data.duration;
        }

        if (that.data.theme != '') {
            para = that.data.theme;
            this.setData({
                title_name: "课程",
            })
        } else if (app.globalData.viewMore == '') {
            para = ['亲子活动', '研学课程', '冬夏令营'];
            this.setData({
                title_name: "课程",
            })
        } else {
            this.setData({
                title_name: app.globalData.viewMore,
            })
        }
        if (para[0] == "") {
            para = "";
        }
        if (that.data.reg_idx != null) {
            area = that.data.region;
        }
        console.log("area: ", area);

        wx.request({
            url: app.globalData.url + 'WxCourse/GetMoreNews',
            data: {
                'keyword': that.data.seacher_word,
                province: area[0],
                city: area[1],
                start_time: that.data.start,
                end_time: that.data.end,
                activeStatus: status,
                duration: duration,
                'type': para,
            },
            success(res) {
                console.log("成功获取课程数据")
                console.log(res)
                that.setData({
                    activity: res.data.data
                });
            }
        })
    },
    setTitle: function(tname) {
        wx.setNavigationBarTitle({
            title: tname
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var that = this;
        this.getSearchData(0);
        // 自动获取注册时间
        var now = new Date;
        var date = (now.getFullYear()).toString() + '-' + (now.getMonth() + 1).toString() + '-' + (now.getDate()).toString();
        this.setData({
            date: date
        })
        that.InitArea();

    },
    timeFormat(param) {
        return param < 10 ? '0' + param : param;
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
        this.getSearchData();
        app.globalData.viewMore = '';
        this.InitArea();

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

    },
    //获取地区
    bindMultiPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            multiIndex: e.detail.value,
            reg_idx: 1
        })
    },
    bindMultiPickerColumnChange: function(e) {
        console.log('picker')
        console.log(e)
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        const provinceName = data.multiArray[0][data.multiIndex[0]];
        let provinceId = "";
        let province = this.data.province;
        let quyuList = [],
            cityList = [],
            provinceList = [],
            city = [],
            area = [];
        try {
            province.forEach(item => {
                if (item.name === provinceName) {
                    provinceId = item.id;
                    throw (new Error('find item'))
                }
            })
        } catch (err) {}
        city = areaList.filter(item => {
            return item.pid == provinceId;
        })
        if (e.detail.column == 0) {
            data.multiIndex = [e.detail.value, 0, 0];
            try {
                area = areaList.filter(item => {
                    return item.pid == city[data.multiIndex[1]].id;
                })
            } catch (err) {}
        } else if (e.detail.column == 1) {
            data.multiIndex[2] = 0;
            area = areaList.filter(item => {
                return item.pid == city[e.detail.value].id;
            })
        } else {
            const cityName = data.multiArray[1][data.multiIndex[1]];
            let cityId = '';
            try {
                areaList.forEach(item => {
                    if (item.name === cityName) {
                        cityId = item.id;
                        throw (new Error('find item'));
                    }
                })
            } catch (err) {}
            area = areaList.filter(item => {
                return item.pid == cityId;
            })
        }
        provinceList = province.map(item => {
            return item.name
        })
        cityList = city.map(item => {
            return item.name;
        })
        quyuList = area.map(item => {
            return item.name;
        })
        data.multiArray = [provinceList, cityList, quyuList],
            this.setData(data);
        var tmp = [];
        for (var i = 0; i < 3; i++) {
            tmp[i] = data.multiArray[i][data.multiIndex[i]];

        }
        this.setData({
            region: tmp,
        })
    },
    InitArea: function() {
        var province = [],
            city = [],
            area = [];
        province = areaList.filter(item => {
            return item.pid == 0;
        })
        city = areaList.filter(item => {
            return item.pid == province[0].id;
        })
        area = areaList.filter(item => {
            return item.pid == city[0].id;
        })
        var provinceList = province.map(item => {
            return item.name
        })
        var cityList = city.map(item => {
            return item.name;
        })
        var quyuList = area.map(item => {
            return item.name;
        })
        this.setData({
            multiArray: [provinceList, cityList, quyuList],
            province
        })
    }
})