$(function () {
    // 定义校验规则
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })
    // 发送Ajax请求修改密码

    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发送Ajax
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // 判断状态码
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                layui.layer.msg(res.message)
                // 使用原生方法reset清空表单
                $('.layui-form')[0].reset();
            }
        })
    })
})