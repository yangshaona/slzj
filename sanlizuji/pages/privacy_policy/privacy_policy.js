import {
    formatRichText
} from '../../utils/function.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        privacy: "",
        url: '',
    },

    // 获取隐私政策
    getPrivacy: function() {
        let that = this;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.getPolicy();
    },
    //
    DownloadPrivacy: function() {
        var url = this.data.url;
        wx.setClipboardData({
            data: url,
            success: function(res) {}
        })
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
        this.getPolicy();

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
    getPolicy: function() {
        this.setData({
            privacy: '<h1 style="text-align:center"><strong><span style=";font-family:宋体;font-size:29px"><span style="font-family:宋体">三立足迹智慧研学</span></span></strong><strong><span style=";font-family:宋体;font-size:29px"><span style="font-family:宋体">隐私政策</span></span></strong></h1><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">我们的隐私政策已于</span> <span style="font-family:Calibri">202</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">2</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px">&nbsp;<span style="font-family:宋体">年</span> </span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">2</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px">&nbsp;<span style="font-family:宋体">月</span> </span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">26</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px">&nbsp;<span style="font-family:宋体">日更新</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">。</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">请花一些时间熟悉我们的隐私政策，如果您有任何问题，请联系我们。</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">关于</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">我们</span></span></p><p style="line-height:150%"><span style="font-family:宋体;font-weight:bold;font-size:21px">一、</span><strong><span style="font-family: 宋体;line-height: 150%;font-size: 21px"><span style="font-family:宋体">三立足迹智慧研学</span></span></strong><strong><span style="font-family: 宋体;line-height: 150%;font-size: 21px"><span style="font-family:宋体">十分重视您的隐私。</span></span></strong></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">本隐私政策在制定时充分考虑到您的需求。您将全面了解到我们个人信息收集和使用惯例，同时确保您最终能够控制您提供给</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">三立足迹智慧研学</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">的个人信息，这一点至关重要。</span> </span></p><p style="line-height:150%"><span style="font-family:宋体;font-weight:bold;font-size:21px">二、</span><strong><span style="font-family: 宋体;line-height: 150%;font-size: 21px"><span style="font-family:宋体">关于本隐私政策</span></span></strong></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">除了提供独立隐私政策的</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">三立足迹智慧研学</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">产品或服务外</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">，</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">本隐私政策规定了</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">三立足迹智慧研学</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">如何收集、使用、披露、处理和保护您使用</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">我们的小程序</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">提供给我们或我们收集的信息。若某款</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">三立足迹智慧研学</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">产品或服务有单独的隐私政策，则该单独隐私政策将被优先适用。该产品或服务的单独隐私政策未涵盖的部分，以本隐私政策内容为准。除您所在地区所适用的法律另有特殊规定外，本隐私政策下</span>“个人信息”指通过信息本身或通过关联其他信息后能够识别特定个人的信息。</span></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">我们将严格遵守隐私政策来使用这些信息。在需要时，基于适用的法律分类</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">，</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">个人信息还应包括敏感的个人数据或信息。</span> 我们如何为您提供帮助</span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">。</span></span></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">最后，我们希望为您带来最好的体验。如果您对本隐私政策中描述的数据处理实践有任何疑问，请通过联系我们，以便我们处理您的特殊需求。我们很高兴收到您的反馈。如果您的隐私或数据使用问题没有得到满意解决，请联系我们的第三方争端解决机构（免费）：请参阅下方</span> “联系我们”。 </span></p><p style="line-height:150%"><span style="font-family:宋体;font-weight:bold;font-size:21px">三、</span><strong><span style="font-family: 宋体;line-height: 150%;font-size: 21px"><span style="font-family:宋体">我们收集哪些信息以及如何使用信息？</span></span></strong></p><p style="line-height:150%"><strong><span style="font-family: 宋体;line-height: 150%;font-size: 19px"><span style="font-family:宋体">（一）您须授权我们收集和使用您个人信息的情形</span></span></strong></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">1</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">、</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">我们收集哪些信息</span> 为了向您提供我们的服务，我们需要您提供使用该服务所必需的信息。我们只会收集为实现具体、特定、明确及合法的目的所必需的信息，并且确保不会对这些信息进行与上述目的不相符的进一步处理。您有权自行选择是否提供我们请求的信息，但多数情况下，如果您拒绝，我们可能无法向您提供相应的服务，也无法回应您遇到的问题。根据您选择的服务，我们可能收集以下信息中的一种或多种： </span></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">（</span><span style="font-family:Calibri">1</span><span style="font-family:宋体">）、</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">您主动提供给我们的个人信息我们会根据您选择的服务，收集您在使用相应服务时需要提供的个人信息。例如，若您使用</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">三立足迹智慧研学</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">活动报名</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">服务，您可能会提供您的姓名、联系方式、订单信息等相关信息；若您创建帐号，您可能会提供您的</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">手机号码、住址、</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">昵称</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">、</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">照片</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">、</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">生日、性别、帐号安全设置等相关信息</span></span><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">。</span></span></p><p style="line-height:150%"><strong><span style="font-family: 宋体;line-height: 150%;font-size: 19px"><span style="font-family:宋体">（二）您可选择是否授权我们收集和使用您的个人信息的情形</span></span></strong></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px">&nbsp;</span></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">1</span><span style="font-family:宋体">、为提升您使用多看阅读时的用户体验，我们的以下附加功能中可能会收集和使用您的个人信息。如果您不提供这些个人信息，您依然可以使用多看阅读进行阅读，但您可能无法使用这些可以提升您的用户体验的附加功能。这些附加功能包括：</span></span></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">（</span><span style="font-family:Calibri">1</span><span style="font-family:宋体">）基于位置信息的附加功能：我们会收集您的位置信息（我们仅收集您当时所处的地理位置，但不会将您各时段的位置信息进行结合以判断您的行踪轨迹）来判断您所处的地点，用于实现账号和支付时的风控功能。</span></span></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">（</span><span style="font-family:Calibri">2</span><span style="font-family:宋体">）基于摄像头（相机）和图片上传的附加功能：您可以使用这个附加功能完成上传头像照片的功能。</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px">&nbsp;</span></p><p style="line-height:150%"><strong><span style="font-family: 宋体;line-height: 150%;font-size: 19px"><span style="font-family:宋体">（三）您充分知晓，以下情形中，我们收集、使用个人信息无需征得您的同意：</span></span></strong></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">1</span><span style="font-family:宋体">、与国家安全、国防安全有关的；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">2</span><span style="font-family:宋体">、与公共安全、公共卫生、重大公共利益有关的；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">3</span><span style="font-family:宋体">、与犯罪侦查、起诉、审判和判决执行等有关的；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">4</span><span style="font-family:宋体">、出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">5</span><span style="font-family:宋体">、所收集的个人信息是个人信息主体自行向社会公众公开的；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">6</span><span style="font-family:宋体">、从合法公开披露的信息中收集的您的个人信息的，如合法的新闻报道、政府信息公开等渠道；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">7</span><span style="font-family:宋体">、根据您的要求签订合同所必需的；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">8</span><span style="font-family:宋体">、用于维护所提供的产品与</span><span style="font-family:Calibri">/</span><span style="font-family:宋体">或服务的安全稳定运行所必需的，例如发现、处置产品与</span><span style="font-family:Calibri">/</span><span style="font-family:宋体">或服务的故障；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">9</span><span style="font-family:宋体">、为合法的新闻报道所必需的；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:Calibri">10</span><span style="font-family:宋体">、学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px">&nbsp;</span></p><p style="line-height:150%"><strong><span style="font-family: 宋体;line-height: 150%;font-size: 19px"><span style="font-family:宋体">（四）我们从第三方获得您个人信息的情形</span></span></strong></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">在一些法律允许的情况下，我们可能从第三方处获得您的个人信息。例如，您授权第三方账户登录使用我们的服务或授权导入的您在第三方平台的信息如账户、昵称等。</span> </span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px">&nbsp;</span></p><p style="line-height:150%"><strong><span style="font-family: 宋体;line-height: 150%;font-size: 19px"><span style="font-family:宋体">（五）非个人信息</span></span></strong></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">我们还可能收集其他无法识别到特定个人的信息（即不属于个人信息的信息），例如您使用特定服务时产生的统计类数据，如设备相关信息、日活事件、页面访问事件、页面访问时长事件、会话事件；网络监控数据如请求时长、请求与错误请求数等；</span><span style="font-family:Calibri">IP</span><span style="font-family:宋体">地址；以及应用崩溃事件等。收集此类信息的目的在于改善我们向您提供的服务。所收集信息的类别和数量取决于您如何使用我们产品和</span><span style="font-family:Calibri">/</span><span style="font-family:宋体">或服务。</span></span></p><p style="text-indent:28px;line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px"><span style="font-family:宋体">就本隐私政策而言，汇总数据被视为非个人信息。如果我们将非个人信息与个人信息结合使用，则在结合使用期间，此类信息将被视为个人信息。</span></span></p><p style="line-height:150%"><span style=";font-family:宋体;line-height:150%;font-size:16px">&nbsp;</span></p><p><br/></p>',

            url: 'https://sanli-tracks.com/sanli/uploads/三立足迹智慧研学隐私政策.doc',
        })
        var content = "";
        // content = formatRichText(this.data.privacy);
        // this.setData({
        //     privacy: content,
        // })
    }
})