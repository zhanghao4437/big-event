// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

// 创建点击事件，上传头像
$('#btnChooesImage').on('click', function () {
    $('#file').click();
})

// 给上传文件添加 change 事件
$('#file').on('change', function (e) {
    let filesList = e.target.files;
    if (filesList.length === 0) {
        return layui.layer.msg('上传头像失败');
    }
    let imageURL = URL.createObjectURL(filesList[0]);

    $image
        .cropper('destroy')
        .attr('src', imageURL)
        .cropper(options)
})

// 添加更换头像点击事件

$('#btnUpload').on('click', function () {
    // 获取头像地址 将裁剪后的图片，输出为 base64 格式的字符串
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 发送请求 更改头像
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }

            layui.layer.msg(res.message)

            // 调用父页面方法更新用户信息
            window.parent.getUserInfo();
        }
    })
})
getUser()
function getUser() {
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
            $image
                .cropper('destroy')
                .attr('src', res.data.user_pic)
                .cropper(options)
        },

    })
}