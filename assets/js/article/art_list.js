$(function () {
    // 定义查询参数
    let q = {
        pagenum: 1, // 页码值 默认第一页
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '', // 文章发布的状态
    }
    // 定义时间过滤器
    template.defaults.imports.date = function (date) {
        const dt = new Date(date);

        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 补零函数
    function padZero(n) {
        return n = n > 9 ? n : '0' + n;
    }
    initTabList()
    initCate()
    function initTabList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败！')
                }
                let htmlStr = template('tpl_list', res);
                $('tbody').html(htmlStr)

                // 调用分页函数
                renderPage(res.total) // 总条数
            }
        })
    }
    // 初始化列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取列表失败')
                }

                let htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                layui.form.render()
            }
        })
    }
    // 筛选列表
    $('#form_search').on('submit', function (e) {
        e.preventDefault();
        // 更改 q 中的查询条件
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        // 重新调用筛选请求
        initTabList()
    })

    // 分页函数
    var laypage = layui.laypage;
    function renderPage(total) {
        laypage.render({

            elem: 'pageBox',  // 哪个元素设置分页 
            count: total, // 数据条数
            limit: q.pagesize, // 每页显示多少条
            curr: q.pagenum, // 第几页高亮
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 自定义排版
            limits: [2, 3, 5, 10], //每页条数的选择项
            // 触发jump的方法：分页发生改变的时候，页码改变的时候 展示条数发生改变
            jump: function (obj, first) { // 分页发生改变触发该函数
                // 把最新的页码值赋值给 q 这个查询对象
                q.pagenum = obj.curr;
                // 可以通过first的值，来判断是哪种方式触发的，如果first的值是true那么就是laypage.render方式触发，就不调用initTabList函数，
                q.pagesize = obj.limit; //得到每页显示的条数
                if (!first) {
                    // 根据最新的 q 重新调用函数
                    initTabList()
                }
            }
        })
    }
    // 绑定点击删除事件
    $('tbody').on('click', '.btn-delete', function () {
        let Id = $(this).attr('index');
        let len = $('.btn-delete').length;
        console.log(len);
        layui.layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }

                    layui.layer.msg(res.message)
                    if (len === 1 && q.pagenum > 1) q.pagenum--
                    initTabList()
                }
            })

            layer.close(index);
        });
    })
})