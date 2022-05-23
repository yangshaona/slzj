/**
 * @function 将get请求的参数连接到url上
 */
export function getParamsToUrl(param, url) {
    // 判空
    if (JSON.stringify(param) == '{}') {
        return url
    }

    for (let i in param) {
        if (typeof param[i] === 'object') {
            param[i] = JSON.stringify(param[i]);
        }
        url += ('&' + i + '=' + param[i])
    }
    console.log('[tools.js-getParamsToUrl()]', url)
    return url
}