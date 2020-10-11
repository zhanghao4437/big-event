$(function () {
    init()
    function init() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 调用模板引擎
                let htmlStr = template('tpl_artCate', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    let index = null
    $('#btnAndCate').on('click', function () {
        index = layui.layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '260px'],
            content: $('#dialog_add').html()
        });
    })

    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('添加文章失败')
                }

                layui.layer.msg('添加文章成功')
                init()
                layui.layer.close(index)
            }
        })
    })
    let indexEdit = null
    // 编辑
    $('tbody').on('click', '.btn_edit', function () {
        indexEdit = layui.layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '260px'],
            content: $('#dialog_edit').html()
        });


        // 请求渲染
        let id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                layui.form.val('form_edit', res.data)
            }
        })
    })
    // 绑定修改的Ajax
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message);
                layui.layer.close(indexEdit);
                init()
            }
        })
    })

    // 点击删除事件
    $('tbody').on('click', '.btn_delete', function () {
        let id = $(this).attr('data-Id');
        layui.layer.confirm('确定要删除?', { icon: 5, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }

                    layui.layer.msg(res.message);

                    layui.layer.close(index);

                    init();
                }
            })
        });
    })
})

