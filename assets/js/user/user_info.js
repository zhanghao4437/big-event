$(function () {
    layui.form.verify({
        nickname: function (value) {
            if (value.length > 7) {
                return '昵称长度为 1 ~ 6 个字符之间';
            }
        }
    })

    // 初始化用户基本信息
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                layui.form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置按钮设置点击事件
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })

    // 设置修改信息点击事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        // 发起POST请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                layui.layer.msg(res.message)

                // 调用父页面的方法
                window.parent.getUserInfo();
            }
        })
    })
})