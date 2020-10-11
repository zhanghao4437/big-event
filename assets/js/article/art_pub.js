$(function () {
    initEditor()
    initPub()
    function initPub() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                let htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr);

                layui.form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnFile').on('click', function () {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e) {
        let files = e.target.files

        if (files.length === 0) {
            return
        }

        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    let art_save = '已发布'

    $('#btn_save2').on('click', function () {
        art_save = '草稿'
    })
    $('#form_pub').on('submit', function (e) {
        e.preventDefault();

        let fd = new FormData(this);

        fd.append('state', art_save);

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })

    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                layui.layer.msg(res.message)

                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 600)
            }
        })
    }

})