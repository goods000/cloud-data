$(function() {

    $('.applyStyle').click(function(){
        $('.apply-errorTips').hide().find('em').html('');
    })

    /**
     * 点击分类
     */
    $('body').on('click', '.dataCategory li', function(){
        $('#nowSelectedCategory').html($(this).html());
        $('.dataList').html('');
        $('.dataCategory li').removeClass('active');
        $(this).addClass('active');

        var id = $(this).attr('id');
        var url = '/dataList/index/id/'+id;
        if ('14' == id) {
            $('#gasCardLaw').hide();
            $('#phoneRechargeLaw').hide();
            $('#rechargeLaw').show();
        } else {
            $('#gasCardLaw').hide();
            $('#phoneRechargeLaw').hide();
            $('#rechargeLaw').hide();
        }
        $.getJSON(url, function(json){
            if ('1' == json.code) {
                for (var i=0; i<json.data.length; i++) {
                    if (0==i || applyId == json.data[i].id) {
                        $('.dataList li').removeClass('active');
                        if (json.data[i].type == '0') {
                            $('.dataList').append('<li class="active" data-prenums="（免费使用，根据会员等级不同，每日可调用次数不同）" id="data'+json.data[i].id+'"><svg class="icon apply-icon" aria-hidden="true"><use xlink:href="#icon-'+json.data[i].id+'"></use></svg><span>'+json.data[i].id+'_ '+json.data[i].name+'</span></li>');
                        } else {
                            $('.dataList').append('<li class="active" data-prenums="（初始赠送：'+json.data[i].prenums+'次）" id="data'+json.data[i].id+'"><svg class="icon apply-icon" aria-hidden="true"><use xlink:href="#icon-'+json.data[i].id+'"></use></svg><span>'+json.data[i].id+'_ '+json.data[i].name+'</span></li>');
                        }

                        // $('#nowSelectedData').html(json.data[i].name);
                        $('#nowSelectedData').html('<svg class="icon apply-icon" aria-hidden="true"><use xlink:href="#icon-'+json.data[i].id+'"></use></svg><b>'+json.data[i].id+' :'+json.data[i].name+'</b>');
                    } else {
                        if (json.data[i].type == '0') {
                            $('.dataList').append('<li data-prenums="（免费使用，根据会员等级不同，每日可调用次数不同）" id="data'+json.data[i].id+'"><svg class="icon apply-icon" aria-hidden="true"><use xlink:href="#icon-'+json.data[i].id+'"></use></svg><span>'+json.data[i].id+'_ '+json.data[i].name+'</span></li>');
                        } else {
                            $('.dataList').append('<li data-prenums="（初始赠送：'+json.data[i].prenums+'次）" id="data'+json.data[i].id+'"><svg class="icon apply-icon" aria-hidden="true"><use xlink:href="#icon-'+json.data[i].id+'"></use></svg><span>'+json.data[i].id+'_ '+json.data[i].name+'</span></li>');
                        }
                    }
                }
                $('.dataList .active').click();
            } else {
                layer.alert(json.info);
            }
            $('.dataList').animate({scrollTop:$('.dataList .active').offset().top - "190" + "px"}, 0)
        })
    })

    /**
     * 点击接口数据
     */
    $('body').on('click', '.dataList li', function(){
        $('.dataList li').removeClass('active');
        $(this).addClass('active');
        $('#nowSelectedData').html($(this).html());
        $(":input[name='did']").attr('value', $(this).attr('id').replace('data', ''));
        // 显示赠送次数
        if( $('.dataCategory li.active').attr('id') != 8) {
            var prenums = $(this).attr('data-prenums');
            if($(this).attr('id') == 'data54') {
                prenums +='<span style="color:red;font-size: 12px">*暂不支持个人实名认证用户创建自定义模板</span>'
            }
            $('#prenums').html(prenums);
        } else {
            $('#prenums').html('');
        }
        $('.recharge-show').hide();
        $('#juheLegal').show()
        $('.apply-errorTips').hide().find('em').html('');

        // $('.recharge-show-contract').hide();

        var did = $(":input[name='did']").val();

        if(did == 188 || did == 207 || did == 213 ) {
            //contract tips
            $('#applyBtn').attr('style','background:#999').prop('disabled',true)
            layer.confirm($('#bankApiCheck').html(), {
                btn: ['暂不申请','同意遵守，申请接口'],
                title:false,
                area:'665px',
                closeBtn:false//按钮
            }, function(){
                window.location = '/ucenter/datacenter/apiApply';
            }, function(){
                layer.closeAll();
                $('#applyBtn').attr('style','').prop('disabled',false)

            });
        }


        if ('8' == $('.dataCategory li.active').attr('id')) {
            $('#gasCardLaw').hide();
            $('#phoneRechargeLaw').hide();
            $('.apply-legal').hide()
            $('#rechargeLaw').show();
            // $('.recharge-show-contract').show();
            $('.recharge-show').show();
            $(":input[name='accepted']").prop('checked',false)
        }
        var objId = $(this).attr('id');
        // 如果是加油卡，显示加油卡条款
        if ('data87' == objId) {
            $('.apply-legal').hide()
            $('#gasCardLaw').show();
            // $('#phoneRechargeLaw').hide();
            // $('#rechargeLaw').hide();
        } else if ('data85' == objId) {
            $('.apply-legal').hide()
            $('#phoneRechargeLaw').show();
            // $('#gasCardLaw').hide();
            // $('#rechargeLaw').hide();
        } else if ('data231' == objId || 'data105' == objId ) {
            $('.apply-legal').hide()
            // $('#juheLegal').hide()
            $('#rechargeLaw').show();
        }
    })

    $('.dataList li.active').click()

    // 点击申请数据按钮时
    $('#applyBtn').click(function(){
        $(this).html('申请中...').attr('disabled',true)

        // if ('14' == $('.dataCategory li.active').attr('id')) {
            if (!$(':input[name=accepted]').is(':checked')) {
                $('#applyBtn').attr('disabled',false).html('立即申请');
                $('.apply-errorTips').show().find('em').html('请阅读聚合并同意聚合用户相关协议')
                return false;
            }
        // }

        $(this).parents('form').ajaxSubmit(function(obj){
            if (obj.code == 0) {
                var isContract = obj.result.isContract;
                var applyId = obj.result.applyId;
                var applyName = obj.result.name;
                var needVerify = obj.result.needVerify;
                if (isContract == 1) {
                    //contract tips
                    layer.confirm('尊敬的用户：<br>'+
                        '您已成功申请 [<font color="#4898d5">'+obj.result.name+'</font>] 接口<br><br>'+
                        '<font color="red">注：本业务需签署合同后，才能进行正常对接使用。如有疑问请联系客服</font> <br><br>', {
                        btn: ['已了解，暂不签署','下载合同模板','详细流程介绍'],
                        btn3:function(){
                            window.open('https://juhe.oss-cn-hangzhou.aliyuncs.com/%E5%85%85%E5%80%BC%E4%B8%9A%E5%8A%A1%E5%90%88%E5%90%8C%E7%AD%BE%E7%BD%B2%E6%B5%81%E7%A8%8B%E4%BB%8B%E7%BB%8D.pdf');
                        },
                        title:false,
                        area: '485px',
                        closeBtn:false//按钮
                    }, function(){
                        window.location = '/myData';
                    }, function(){
                        window.open(obj.result.contractUrl);
                    });
                } else if (needVerify) {
                    $.ajax({
                        url:'/ucenter/datacenter/app/verify/'+applyId,
                        type: 'get',
                        dataType:'json',
                        success: function(res){
                            layer.open({
                                type: 1,
                                title: ['场景认证<span style="font-size:12px;color:#fe514a;">（接口申请成功，请尽快完成审核！）</span>','font-size:16px;color:#606060;font-weight:700;padding-left:28px'],
                                btn:false,
                                shadeClose: true,
                                scrollbar:false,
                                shade: 0.5,
                                area: ['540px', '483px'],
                                content: res.result.html,
                                cancel:function(){
                                    location.href = '/myData';
                                }
                            });
                        }
                    })
                } else {
                    layer.msg('您已成功申请 [<font color="#4898d5">'+obj.result.name+'</font>] 接口',{icon:1,shade:0.3,shadeClose:true},function(){
                        window.location = '/myData';
                    })
                }
            } else {
                if (obj.code == 1605) {
                    mobileActShow();
                } else {
                    $('.apply-errorTips').show().find('em').html(obj.reason)
                    // $('#applyBtn').siblings('.errorTips').show().find('em').html(obj.reason);
                }
            }
            $('#applyBtn').attr('disabled',false).html('立即申请');
        })
    })

    $('.list-wrapper').animate({scrollTop:$('.dataList .active').offset().top - "246" + "px"}, 100)

    //api申请购买用户协议
    $('.apply-buy-legal').click(function(){
        layer.open({
            type: 2,
            title: '《API购买服务协议》',
            shadeClose: true,
            shade: 0.8,
            area: ['800px', '500px'],
            content: '.api_content'
        });
    })
    // 加油卡条款
    $('#gasCardLawLink').click(function(){
        layer.open({
            type: 2,
            title: '《加油充值服务条款》',
            shadeClose: true,
            shade: 0.8,
            area: ['800px', '500px'],
            content: '/myData/showgascardlegal' //iframe的url
        });
    })
    // 话费充值条款
    $('#phoneRechargeLawLink').click(function(){
        layer.open({
            type: 2,
            title: '《话费充值服务条款》',
            shadeClose: true,
            shade: 0.8,
            area: ['800px', '500px'],
            content: '/myData/showPhoneRechargeLegal' //iframe的url
        });
    })
    // 充值条款
    $('#rechargeLawLink').click(function(){
        layer.open({
            type: 2,
            title: '《充值服务条款》',
            shadeClose: true,
            shade: 0.8,
            area: ['800px', '500px'],
            content: '/myData/rechargeLegal' //iframe的url
        });
    })
})

