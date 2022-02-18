/**
 * 自定义倒计时
 * endTime 结束的时间 默认单位为ms
 * format dd-hh-mm-ss 时间格式
 * endText  结束提示语
 * countEnd 倒计时结束函数
 */

let timer = null,
	intval = 1000;

Component({
	properties: {
		// 是否为时间戳模式
		isTimeStamp: {
			type: Boolean,
			defalute: false
		},
		// 倒计时结束时间
		endTime: {
			type: Number,
			value: 24*60*60 * 1000
		},
		// 倒计时格式
		format: {
			type: String,
			value: "{D}天{HH}:{mm}:{ss}"
		},
		// 结束提示
		endText: {
			type: String,
			value: "已结束",
			endTag:"0"
		},
		//当前时间
		currentTime: {
			type: Number,
			value: new Date().getTime()
		}
	},
	// 样式
	options:{
		addGlobalClass:true,
	},

	data: {
		result: "", //显示结果
	},

	lifetimes: {
		ready(){
			this.init();
		},
		detached() {
			//组件销毁时清除定时器 防止爆栈
			clearTimeout(timer);
		},
	},

	methods: {
		start(){
			this.init();
		},
		// 时间格式处理
		format(formatStr, time) {
			// 使用正则体换格式
			formatStr = formatStr.replace(/{DD}/, this.formatNumber(time.d)).
			replace(/{HH}/, this.formatNumber(time.h)).
			replace(/{mm}/, this.formatNumber(time.m)).
			replace(/{ss}/, this.formatNumber(time.s)).
			replace(/{D}/, time.d).
			replace(/{H}/, time.h).
			replace(/{m}/, time.m).
			replace(/{s}/, time.s).
			replace(/{S}/, time.S)
			return formatStr;
		},
		defaultFormat(time) {
			let daydiff = 24 * 60 * 60 * 1000;
			let hoursdiff = 60 * 60 * 1000;
			let minutesdiff = 60 * 1000;

			let d = Math.floor(time / daydiff); //天数
			let h = Math.floor((time - d * daydiff) / hoursdiff);
			let m = Math.floor((time - d * daydiff - h * hoursdiff) / minutesdiff);
			let s = Math.floor((time - d * daydiff - h * hoursdiff - m * minutesdiff) / 1000);

			let S = time / 1000;

			return {
				d,
				h,
				m,
				s,
				S
			}
		},
		//定时启动
		init() {
			timer = setTimeout(() => {
				if (this.data.endTime < intval) {
					this.setData({
						result: this.data.endText,
						endTag:"1",
						isTimeEnd:endTag
					})
					clearTimeout(timer);
					this.countEnd && this.countEnd()
					return false;
				}
				let time = this.timeStamp();
				let formTime = this.defaultFormat(time)
				let res = this.format(this.data.format, formTime);
				this.setData({
					result: res
				})
				this.currentFn && this.currentFn(this.data.endTime)
				this.data.endTime -= intval;
				this.init();
			}, intval)
		},
		// 时间戳处理
		timeStamp() {
			if (this.data.isTimeStamp) {
				let endTime = this.data.endTime - this.data.currentTime;
				return endTime;
			}
			return this.data.endTime;
		},
		// 倒计时结束处理函数
		countEnd() {
			this.triggerEvent("countEnd")
		},
		// 倒计时进行时函数
		currentFn(time){
			this.triggerEvent("currentFn",time)
		},
		// 补零操作
		formatNumber(n) {
			n = n.toString()
			return n[1] ? n : `0${n}`
		}
	}

})
