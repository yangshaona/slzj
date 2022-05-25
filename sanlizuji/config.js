var host = "https://sanli-tracks.com/sanli/index.php?r=";
// var host = 'https://sanli-tracks.com/sanlia/index.php?r=';
// var host = 'http://127.0.0.1/sanliGit/sanli/index.php?r=';
// 
let config = {
    host,
    //请求网址url列表
    url: `${host}`,
    //首页加载
    indexload: `${host}Goods_Info/GetGoodsInfo`,
    //购物车添加
    addCart: `${host}cart/add`,
    //图片上传
    upImg: `${host}Goods_Info/GetGoodsImg`,
    //商品信息上传
    upGoodsInfo: `${host}Goods_Info/UpGoodsInfo`,
    WX_ENV: "development", //当前环境 development, product, test
};

module.exports = config;