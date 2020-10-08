// 封装拼接url根路径
// 服务器开发环境地址
let bassUrl = 'http://ajax.frontend.itheima.net'

$.ajaxPrefilter(function (option) {
    // 拼接根路径
    option.url = bassUrl + option.url;
    // 为所有/my/的路径设置请求头
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 添加用户请求权限功能
    option.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空token
            localStorage.removeItem('token');
            // 强制跳转到登录页
            location.href = '/01/login.html';
        }
    }
})