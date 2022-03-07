// picker.js
Page({
    data: {
        //每个对象就是一个选择器，有自己的索引值index，标题title，选项option（又是一个数组）
        objArray: [{
                index: 0,
                title: '选项一',
                option: ['1', '2', '3', '4', '5'],
            },
            {
                index: 0,
                title: '选项二',
                option: ['一', '二', '三', '四', '五'],
            },
            {
                index: 0,
                title: '选项三',
                option: ['①', '②', '③', '④', '⑤']
            },
        ],
        region: [],
    },
    // 绑定事件，因为不能用this.setData直接设置每个对象的索引值index。
    // 所以用自定义属性current来标记每个数组对象的下标
    bindChange_select: function(ev) {
        // 定义一个变量curindex 储存触发事件的数组对象的下标
        const curindex = ev.target.dataset.current
            // 根据下标 改变该数组对象中的index值
        this.data.objArray[curindex].index = ev.detail.value
            // 把改变某个数组对象index值之后的全新objArray重新 赋值给objArray
        this.setData({
            objArray: this.data.objArray
        })
    },
    //.js
    //点击确定按钮
    bindRegionChange: function(e) {
        console.log(e)
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    }
})