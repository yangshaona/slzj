function getLocation() {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: "gcj02",
            altitude: 'true',
            isHighAccuracy: 'true',
            highAccuracyExpireTime: '3500',
            success: (res) => {
                var latitude = res.latitude;
                var longitude = res.longitude;
                var location = [latitude, longitude];
                console.log("成功获取", location)
                resolve(location);
            },
            fail: (res) => {
                reject("获取失败");
                console.log(res);
            }
        })
    })

}


// 这个属性是将方法名暴露出来，否则需要引用的页面取不到
module.exports = {
    getLocation
}