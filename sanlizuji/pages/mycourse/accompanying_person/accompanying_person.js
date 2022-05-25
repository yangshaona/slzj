// pages/mycourse/accompanying_person/accompanying_person.js
import { GetOrderDetail } from '../../../utils/apis.js';
import { mergeArr } from '../../../utils/function.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 全部随行人信息
        otherInfo: [{ name: '', idnum: '', phone: '' }],
        otherMsg: [{ hotel: '', room: '', group: '', }]
    },

    // 根据订单id获取订单信息
    GetOrderDetail(orderid) {
        let that = this;
        const p = GetOrderDetail({
            id: orderid,
            modelName: 'SignList',
        });
        p.then(value => {
            console.log("订单详情", value);
            if (value.data.data[0].OtherInfo != '') {
                that.setData({
                    otherInfo: JSON.parse(value.data.data[0].OtherInfo),
                });
                if (value.data.data[0].OtherMsg != '') {
                    that.setData({
                        otherMsg: JSON.parse(value.data.data[0].OtherMsg),
                    })
                };
                that.setData({
                    allOtherInfo: mergeArr(that.data.otherInfo, that.data.otherMsg),
                })
                console.log("随行人信息", that.data.allOtherInfo);
            }
        }, reason => {
            console.log("获取订单详情数据失败", reason);
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("查看随行人");
        let that = this;
        that.GetOrderDetail(options.orderid);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
        that.GetOrderDetail(that.options.orderid);
    },


})