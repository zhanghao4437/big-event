// 封装拼接url根路径
// 服务器开发环境地址
let bassUrl = 'http://ajax.frontend.itheima.net'

$.ajaxPrefilter(function (option) {
    // 拼接根路径
    option.url = bassUrl + option.url;
})