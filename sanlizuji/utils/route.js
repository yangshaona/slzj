export function getInterfaceRoute(name) {
    return interfaceRoute[name]
}

// 开发环境
const ENV = {
    test: '',
    // 服务器地址前缀
    develop: 'https://sanli-tracks.com/sanlia/index.php?r=',
}

// 选择环境
const DOMAIN = ENV.develop

// 接口地址
const interfaceRoute = {
    GetUserInfo2: DOMAIN + 'WxUser/GetUserInfo2',
    activitytype: DOMAIN + 'WxUser/activitytype',
    CourseCheck: DOMAIN + 'WxCourse/CourseCheck',
    GetMoreNews: DOMAIN + 'WxCourse/GetMoreNews',
    GetClubNews: DOMAIN + 'WxCourse/GetClubNews',
    Advertisement: DOMAIN + 'WxOther/Advertisement',
    ParentGetStuActivityDetail: DOMAIN + 'WxSign/ParentGetStuActivityDetail',
    UpGps: DOMAIN + 'WxOther/UpGps',
    GetTeaUpGps: DOMAIN + 'WxOther/GetTeaUpGps',
    ActiveStuDetail: DOMAIN + 'WxSign/ActiveStuDetail',
    GetStuUpGps: DOMAIN + 'WxOther/GetStuUpGps',
    TeaNowCourse: DOMAIN + 'WxSign/TeaNowCourse',
    GpsRequest: DOMAIN + 'WxOther/GpsRequest',
    DailyDetail: DOMAIN + 'WxSign/DailyDetail',
    GetKidsDailyDetail: DOMAIN + 'WxSign/GetKidsDailyDetail',
    getOpenId: DOMAIN + 'WxUser/getOpenId',
    GetUserInfo: DOMAIN + 'WxUser/GetUserInfo',
    UpdateStuComment: DOMAIN + 'WxCourse/UpdateStuComment',
    UpdateBaseClubComment: DOMAIN + 'WxCourse/UpdateBaseClubComment',
    GetBaseClub: DOMAIN + 'WxCourse/GetBaseClub',
    GetMyApply: DOMAIN + 'WxOther/GetMyApply',
    GetKidsList: DOMAIN + 'WxUser/GetKidsList',
    tgReverse: DOMAIN + 'WxSign/tgReverse',
    orderisshow: DOMAIN + 'WxSign/orderisshow',
    GetKidsActivity: DOMAIN + 'WxCourse/GetKidsActivity',
    GetMyAct: DOMAIN + 'WxOther/GetMyAct',
    GetDiff: DOMAIN + 'WxOther/GetDiff',
    GetDetail: DOMAIN + 'WxOther/GetDetail',
    CouponCheck: DOMAIN + 'WxSign/CouponCheck',
    orderFind: DOMAIN + 'WxSign/orderFind',
    tgPay: DOMAIN + 'WxSign/tgPay',
    GetOrderDetail: DOMAIN + 'WxSign/GetOrderDetail',
    SearchKids: DOMAIN + 'WxUser/SearchKids',
    GetKidsName: DOMAIN + 'WxUser/GetKidsName',
    KidBindParent: DOMAIN + 'WxUser/KidBindParent',
    SearchParent: DOMAIN + 'WxUser/SearchParent',
    GetParentList: DOMAIN + 'WxUser/GetParentList',
    Register: DOMAIN + 'WxUser/Register',
    CheckRole: DOMAIN + 'WxSign/CheckRole',
    schoollist: DOMAIN + 'Wxother/schoollist',
    DeleteOneOrderByPk: DOMAIN + 'WxSign/DeleteOneOrderByPk',
    GetTeacher: DOMAIN + 'WxOther/GetTeacher',
    GetTeaAct: DOMAIN + 'WxOther/GetTeaAct',
    GpsAccept: DOMAIN + 'WxOther/GpsAccept',
    isShow: DOMAIN + 'WxSign/isShow',
    Teasign: DOMAIN + 'WxSign/Teasign',
    Comment: DOMAIN + 'WxCourse/Comment',
    Stusign: DOMAIN + 'WxSign/Stusign',
    Clubdetail: DOMAIN + 'WxCourse/Clubdetail',
    GetActDetail: DOMAIN + 'WxCourse/GetDetail',
    GetClubActivity: DOMAIN + 'WxOther/GetClubActivity',
    CourseDailyDetail: DOMAIN + 'WxCourse/DailyDetail',
    GetTeaReviewAct: DOMAIN + 'WxOther/GetTeaReviewAct',
    GetTeacherDetail: DOMAIN + 'WxSign/GetTeacherDetail',
    TeaUpGps: DOMAIN + 'WxOther/TeaUpGps',
    // GetOrderDetail: DOMAIN + 'WxSign/GetDetail',
    // GetTeaReviewAct: DOMAIN + 'WxOther/GetTeaReviewAct',
    // GetTeacherDetail: DOMAIN + 'WxSign/GetTeacherDetail',

}