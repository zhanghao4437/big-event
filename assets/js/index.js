$(function () {
    getUserInfo()
    // 点击退出功能
    $('#btnLogOut').on('click', function () {
        // 引用layui
        layui.layer.confirm('确定要退出吗?', { icon: 5, title: '提示' }, function (index) {
            //do something
            // 回调，确定之后执行
            localStorage.removeItem('token');
            // 跳转到登录页
            location.href = '/01/login.html';
            layer.close(index);
        });
    })
})
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 调用渲染头像函数
            renderAvatar(res.data);
        },
        // complete 无论请求成功或失败都会调用这个函数
        // complete: function (res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 清空token
        //         localStorage.removeItem('token');
        //         // 强制跳转到登录页
        //         location.href = '/01/login.html';
        //     }
        // }
    })
}

// 封装渲染头像函数
function renderAvatar(user) {
    let name = user.nickname || user.username;
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)

    if (user.user_pic) {
        $('.user-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show();
    } else {
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.user-avatar').show().html(first);
    }

}