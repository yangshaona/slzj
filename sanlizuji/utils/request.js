import { getParamsToUrl } from "./tools"
import { getInterfaceRoute } from "./route.js"

/**
 * @function 微信接口调用
 * @description 如果是GET方法 处理url和参数后输出
 * @param {method: String, url: String, data: Object}
 */
export default function request(param) {
    if (param['method'] == 'GET') {
        param.url = getParamsToUrl(param['data'], getInterfaceRoute(param['url']))
        param.data = {}
    }
    return new Promise((resolved, rejected) => {
        wx.request({
            url: param.url,
            method: param.method,
            header: {
                'content-type': 'application/json'
            },
            data: param.data,
            success(res) {
                resolved(res)
            },
            fail(res) {
                rejected(res)
            }
        })
    })
}