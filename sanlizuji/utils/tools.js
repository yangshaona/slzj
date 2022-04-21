/**
 * @function 将get请求的参数连接到url上
 */
export function getParamsToUrl(param, url) {
    // 判空
    if (JSON.stringify(param) == '{}') {
        return url
    }
    for (let i in param) {
        url += ('&' + i + '=' + param[i])
    }
    // url = url.substring(0, url.length - 1); //除掉最后的&
    console.log('[tools.js-getParamsToUrl()]', url)
    return url
}