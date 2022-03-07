/**
 * 自定义倒计时
 * endTime 结束的时间 默认单位为ms
 * format dd-hh-mm-ss 时间格式
 * endText  结束提示语
 * countEnd 倒计时结束函数
 */

// let timer = null,
// 	intval = 1000;

// Component({
// 	properties: {
// 		// 是否为时间戳模式
// 		isTimeStamp: {
// 			type: Boolean,
// 			defalute: false
// 		},
// 		// 倒计时结束时间
// 		endTime: {
// 			type: Number,
// 			value: 24*60*60 * 1000
// 		},
// 		// 倒计时格式
// 		format: {
// 			type: String,
// 			value: "{D}天{HH}:{mm}:{ss}"
// 		},
// 		// 结束提示
// 		endText: {
// 			type: String,
// 			value: "已结束",
// 			endTag:"0"
// 		},
// 		//当前时间
// 		currentTime: {
// 			type: Number,
// 			value: new Date().getTime()
// 		}
// 	},
// 	// 样式
// 	options:{
// 		addGlobalClass:true,
// 	},

// 	data: {
// 		result: "", //显示结果
// 	},

// 	lifetimes: {
// 		ready(){
// 			this.init();
// 		},
// 		detached() {
// 			//组件销毁时清除定时器 防止爆栈
// 			clearTimeout(timer);
// 		},
// 	},

// 	methods: {
// 		start(){
// 			this.init();
// 		},
// 		// 时间格式处理
// 		format(formatStr, time) {
// 			// 使用正则体换格式
// 			formatStr = formatStr.replace(/{DD}/, this.formatNumber(time.d)).
// 			replace(/{HH}/, this.formatNumber(time.h)).
// 			replace(/{mm}/, this.formatNumber(time.m)).
// 			replace(/{ss}/, this.formatNumber(time.s)).
// 			replace(/{D}/, time.d).
// 			replace(/{H}/, time.h).
// 			replace(/{m}/, time.m).
// 			replace(/{s}/, time.s).
// 			replace(/{S}/, time.S)
// 			return formatStr;
// 		},
// 		defaultFormat(time) {
// 			let daydiff = 24 * 60 * 60 * 1000;
// 			let hoursdiff = 60 * 60 * 1000;
// 			let minutesdiff = 60 * 1000;

// 			let d = Math.floor(time / daydiff); //天数
// 			let h = Math.floor((time - d * daydiff) / hoursdiff);
// 			let m = Math.floor((time - d * daydiff - h * hoursdiff) / minutesdiff);
// 			let s = Math.floor((time - d * daydiff - h * hoursdiff - m * minutesdiff) / 1000);

// 			let S = time / 1000;

// 			return {
// 				d,
// 				h,
// 				m,
// 				s,
// 				S
// 			}
// 		},
// 		//定时启动
// 		init() {
// 			timer = setTimeout(() => {
// 				if (this.data.endTime < intval) {
// 					this.setData({
// 						result: this.data.endText,
// 						endTag:"1",
// 						isTimeEnd:endTag
// 					})
// 					clearTimeout(timer);
// 					this.countEnd && this.countEnd()
// 					return false;
// 				}
// 				let time = this.timeStamp();
// 				let formTime = this.defaultFormat(time)
// 				let res = this.format(this.data.format, formTime);
// 				this.setData({
// 					result: res
// 				})
// 				this.currentFn && this.currentFn(this.data.endTime)
// 				this.data.endTime -= intval;
// 				this.init();
// 			}, intval)
// 		},
// 		// 时间戳处理
// 		timeStamp() {
// 			if (this.data.isTimeStamp) {
// 				let endTime = this.data.endTime - this.data.currentTime;
// 				return endTime;
// 			}
// 			return this.data.endTime;
// 		},
// 		// 倒计时结束处理函数
// 		countEnd() {
// 			this.triggerEvent("countEnd")
// 		},
// 		// 倒计时进行时函数
// 		currentFn(time){
// 			this.triggerEvent("currentFn",time)
// 		},
// 		// 补零操作
// 		formatNumber(n) {
// 			n = n.toString()
// 			return n[1] ? n : `0${n}`
// 		}
// 	}

// })

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        target: Number, // 结束时间
        callback: String, // 回调
        clearTimer: Boolean // 清除定时器
    },

    /**
     * 组件的初始数据
     */
    data: {
        time: ''
    },
    ready() {
        this.getFinalTime();
    },

    /**
     * 组件的方法列表
     */
    methods: {
        init() {
            const self = this;
            setTimeout(() => {
                self.getFinalTime.call(self);
            }, 1000);
        },
        getFinalTime() {
            const data = this.data;
            const gapTime = Math.ceil((data.target - new Date().getTime()) / 1000); // 距离结束时间
            let time = '00:00:00';
            if (gapTime > 0) {
                let lastTime = gapTime % 86400;
                const hour = this.formatNum(parseInt(lastTime / 3600));
                lastTime = lastTime % 3600;
                const minute = this.formatNum(parseInt(lastTime / 60));
                const second = this.formatNum(lastTime % 60);
                time = `${hour}:${minute}:${second}`;
                if (!data.clearTimer) this.init.call(this);
            } else {
                this.endFn();
            }
            this.setData({
                time: time
            });
        },
        formatNum(num) {
            return num > 9 ? num : `0${num}`;
        },
        endFn() {
            this.triggerEvent('callback', {});
        }
    }
})