$(function () {
    // 1.点击链接显示隐藏切换功能
    $('#link_reg').on('click', function () {
        $('.login-box').hide().siblings('.reg-box').show();
        // $('.reg-box').show();
    })
    $('#link_login').on('click', function () {
        $('.login-box').show().siblings('.reg-box').hide();
        // $('.reg-box').hide();
    })

    // 通过layui自定义校验规则
    let form = layui.form; // 获取layui中的form对象
    form.verify({
        // 通过form对象中的verify方法校验密码
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码校验规则
        repwd: function (value) {
            let pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })
    // 获取layui的layer对象
    let layer = layui.layer
    // 发起注册的Ajax请求
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起Ajax请求
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $('#link_login').click();
            }
        })
    })
    // 监听登录事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        // 发起Ajax请求
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 保存token到本地存储
                localStorage.setItem('token', res.token);
                // 跳转页面
                location.href = '/01/index.html';
            }
        })
    })
})