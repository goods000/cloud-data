$(function () {

    //异步加载错误代码
    $('#errorcode').click(function () {
        var did = $(this).attr('did');
        var show = $(this).attr('show');

        if (show == 0) {
            $(this).attr('show', '1');
            $.getJSON('/docs/api/errorCode/' + did, function (obj) {
                var dataErr = obj.result.dataError
                var sysErr = obj.result.sysError
                var dHtml = '';
                for (var i in dataErr) {
                    dHtml += '<tr><td>&nbsp;</td><td class="url">' + dataErr[i]['error_code'] + '</td>' +
                        '<td class="text">' + dataErr[i]['error_des'] + '</td></tr>'
                }
                $('#dataErrorCode').html(dHtml)

                var sHtml = '';
                for (var j in sysErr) {
                    sHtml += '<tr><td>&nbsp;</td>' +
                        '<td class="url">' + sysErr[j]['error_code'] + '</td>' +
                        '<td class="text">' + sysErr[j]['error_des'] + '</td>' +
                        '<td class="text">' + sysErr[j]['resultcode'] + '</td></tr>'
                }
                $('#sysErrorCode').html(sHtml)
            })
        }
    })

    //异步加载示例代码，如页面不刷新，则仅仅加载一次
    $('#sdkandqa').click(function () {
        var show = $(this).attr('show');
        var did = $(this).attr('did');
        if (show == 0) {
            $(this).attr('show', '1');
            layer.load(1, {
                shade: 0.3
            })
            $.getJSON("https://code.juhe.cn/api/docsByDid?callback=?", {
                "did": did
            }, function (data) {
                layer.closeAll()
                var code = data.code;
                if (code == '1') {
                    var list = data.list;
                    var codehtml = '<tr class="title"><td width="40">&nbsp;</td><td width="100">语言</td><td>标题</td><td>提供者</td><td>时间</td></tr>';
                    for (var j in list) {
                        codehtml += '<tr>' +
                            '<td >&nbsp;</td>' +
                            '<td class="url">' + list[j].language + '</td>' +
                            '<td ><a href="' + list[j].url + '" class="blue" target="_blank">' + list[j].title + '</a></td>' +
                            '<td >' + list[j].nickname + '</td>' +
                            '<td >' + list[j].addtime + '</td>' +
                            '</tr>';
                    }
                    $("#code_table").html(codehtml);
                } else {
                    var codehtml = '<tr class="title"><td width="40">&nbsp;</td><td width="100">语言</td><td>标题</td><td>提供者</td><td>时间</td></tr>';
                    codehtml += "<tr><td colspan='5' align='center'>暂无教学代码，小聚正在拼命添加中....</td></tr>";
                    $("#code_table").html(codehtml);
                }
            });
        }
    })

    //切换tab的时候初始化第一个子接口
    $('#apilists').click(function () {
        var show = $(this).attr('show');
        if (show == 0) {
            if ($('#apilists').hasClass('active')) {
                if ($('ul.api-sub-list li').size() > 0) {

                    $('.api-sub-list .api-aid').each(function () {
                        if ($(this).hasClass('active') && $(this).children('a').hasClass('selected')) {
                            getApiInfo($(this))
                        }
                    });
                } else {
                    if($('#api-status').val() == 2){
                        var html = '<div style="padding: 20px;color:#999;size: 14px">该接口已停用，有问题请联系客服</div>'
                    }else {
                        var html = '<div style="padding: 20px;color:#999;size: 14px">该接口正在维护中，有问题请联系客服</div>'
                    }
                    $('div.api-sub-content').html(html);
                }
            }
        }
    })

    //点击子菜单是请求接口文档
    $('#docs-api-area').on('click', 'ul.api-sub-list .api-aid', function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        $('ul.api-sub-list .api-aid').removeClass('active');
        $('ul.api-sub-list .api-aid a').removeClass('selected');

        getApiInfo($(this))
    })

    //页面加载的时候，加载api文档
    if ($('#apilists').hasClass('active')) {
        if ($('#apilists').attr('show') == 0) {
            if ($('ul.api-sub-list li').size() > 0) {
                $('.api-sub-list .api-aid').each(function () {
                    if ($(this).hasClass('active') && $(this).children('a').hasClass('selected')) {
                        getApiInfo($(this))
                    }
                });
            } else {
                if($('#api-status').val() == 2){
                    var html = '<div style="padding: 20px;color:#999;size: 14px">该接口已停用，有问题请联系客服</div>'
                }else {
                    var html = '<div style="padding: 20px;color:#999;size: 14px">该接口正在维护中，有问题请联系客服</div>'
                }
                $('div.api-sub-content').html(html);
            }

        }
    }

    $('#api-package-side').on('click', '.pdf-download', function () {
        if ($(this).attr('href') == 'javascript:;') {
            $('.now-btn').attr('data', '');
            frameLogin();
            return;
        }
    })
    getRecommend()
});



//pay

//tab-pos
$(window).scroll(function () {
    var hhh = $(window).scrollTop();
    if (hhh > 415) {
        $(".tab-pos1").addClass('tab-pos');
        $('.docs-api-tab .api-now').show();
    } else {
        $(".tab-pos1").removeClass('tab-pos');
        $('.docs-api-tab .api-now').hide();
    };
});

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        /*月份*/
        "d+": this.getDate(),
        /*日*/
        "H+": this.getHours(),
        /*小时*/
        "m+": this.getMinutes(),
        /*分*/
        "s+": this.getSeconds(),
        /*秒*/
        "q+": Math.floor((this.getMonth() + 3) / 3),
        /*季度*/
        "S": this.getMilliseconds() /*毫秒*/
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        };
    };
    return fmt;
};

//选项卡
function tabs(tabTit, on, tabCon) {
    $(tabCon).each(function () {
        if ($(tabTit + ' li').hasClass('move-api-set') && $('#realAid').val() != 0) {
            $(this).children().eq(1).show();
        } else {
            $(this).children().eq(0).show();
        }
    });
    $(tabTit).each(function () {
        if ($(tabTit + ' li').hasClass('move-api-set') && $('#realAid').val() != 0) {
            $(this).children().eq(1).addClass(on);
            $(this).children().eq(0).removeClass(on);
        } else {
            $(this).children().eq(0).addClass(on);
        }
    });
    $(tabTit).children().click(function () {
        $(this).addClass(on).siblings().removeClass(on);
        var index = $(tabTit).children().index(this);
        $(tabCon).children().eq(index).show().siblings().hide();
    });
}
tabs(".tabul", "active", ".tabDiv");
$('.apides').each(function () {
    $(this).mouseover(function () {
        $(this).find('.apidescipe').show();
    }).mouseout(function () {
        $(this).find('.apidescipe').hide();
    })
})

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    canvas_width = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    canvas_height = canvas.height = 230,
    random_points = [];

function draw() {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    var i, pi, x_dist, y_dist, dist, w;
    random_points.forEach(function (p, index) {
        p.x += p.xa;
        p.y += p.ya;
        p.xa *= p.x > canvas_width || p.x < 0 ? -1 : 1;
        p.ya *= p.y > canvas_height || p.y < 0 ? -1 : 1;
        ctx.fillRect(p.x - 0.5, p.y - 0.5, 4, 4);
        ctx.fillStyle = '#cacaca';
        for (i = index + 1; i < random_points.length; i++) {
            pi = random_points[i];
            if (pi.x !== null && pi.y !== null) {
                x_dist = p.x - pi.x;
                y_dist = p.y - pi.y;
                dist = x_dist * x_dist + y_dist * y_dist;
                w = (pi.max - dist) / pi.max + 0.2;
                ctx.beginPath();
                ctx.lineWidth = w;
                ctx.strokeStyle = 'rgba(180,180,180,' + w + ')';
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pi.x, pi.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(draw);
}
for (var i = 0; i < 50; i++) {
    var x = Math.random() * canvas_width,
        y = Math.random() * canvas_height,
        xa = .8 * Math.random() - .4,
        ya = .8 * Math.random() - .4,
        max = 10000;
    random_points[i] = {
        x: x,
        y: y,
        xa: xa,
        ya: ya,
        max: max
    };
}
setTimeout(draw, 100);


function initLiClick(type) {
    if (type == 'pay') {
        if ($('.now-btn').hasClass('pay-buy-a1')) {
            var databuy = $('.pay-buy-a1').attr('href').slice(0, -3);
        }

        $('.pay-ul li').each(function (index) {

            var price = $(this).attr('data-price');
            var num = $(this).attr('data-renums');

            var blackVip = $(this).attr('data-black-vip');
            var blackPlusVip = $(this).attr('data-plus-vip');
            var blackVipPrice = (blackVip * price).toFixed(2)
            var blackPlusVipPrice = (blackPlusVip * price).toFixed(2)

            var onceprice = (price / num);
            if (onceprice > 0) {
                onceprice = onceprice.toFixed(4);
            } else {
                onceprice = 0;
            }
            var remark = $(this).attr('data-remark');
            var dataDid = $(this).attr('data-did');
            if (index == 0) {
                $('.last-price .red').html('¥' + price);
                $('.last-price span em').html(onceprice);
            }


            $(this).click(function () {
                $('.left-p,.now-btn').show()
                $('#go-vip').css('display', 'none')
                $('#go-superman').css('display', 'none')
                $('.vipinfos').hide()
                $('.superman').hide()
                $('.price-ul li').removeClass('active');
                $(this).addClass('active');
                $('.last-price .red').html('¥' + price);
                $('.last-price span em').html(onceprice);

                if (remark) {
                    $('.last-price span i').html(', ' + remark);
                } else {
                    $('.last-price span i').html('');
                }

                if ($('.now-btn').hasClass('pay-buy-a1')) {
                    $('.pay-buy-a1').attr('href', databuy + dataDid);
                }
                //vip
                if ($(this).hasClass('viplist')) {
                    var vipnums = $(this).attr('data-renums')
                    $('.vipinfos').show()
                    $('.vipinfos span').html(vipnums)
                    $('.vip-right,.left-p').hide()
                    $('.now-btn').hide()
                    $('#go-vip').css('display', 'inline-block')
                }

                //vip
                if ($(this).hasClass('super-list')) {
                    $('.superman').show()
                    $('.vip-right,.left-p').hide()
                    $('.now-btn').hide()
                    $('#go-superman').css('display', 'inline-block')
                }

                //超人测试套餐
                if ($(this).hasClass('rebate-test')) {
                    $('.superman').hide()
                    $('.now-btn').hide()
                    $('#go-superman').css('display', 'inline-block')
                }

                if (blackPlusVip < 1 || blackVip < 1) {
                    $('.right-vip').show()
                    $('.blackem').html('￥' + blackVipPrice)
                    $('.blackplusem').html('￥' + blackPlusVipPrice)
                } else {
                    $('.right-vip').hide()
                }
            });

        });

        $('.pay-ul li:first').click();


    } else if (type == 'free') {
        //套餐
        $('.free-ul li').each(function () {
            $(this).click(function () {
                $('.price-ul li').removeClass('active');
                $(this).addClass('active');
            });
        });
    }
}

function getApiInfo(that) {

    that.addClass('active');
    that.children().addClass('selected');
    $.getJSON(that.children().attr('href') + '/' + $('meta[name="dataId"]').attr('did'), function (obj) {
        if (obj.code == 0) {
            $('div.api-sub-content').html(obj.result.html);
            $('pre code').each(function (i, e) {
                hljs.highlightBlock(e)
            });
        }
    }, 'json')
    $('#apilists').attr('show', 1)
}

/**
 * 处理pc端的套餐信息
 * @param data
 */
var apiStatusBtn = {
    '2': '<a class="now-btn gray-btn-a">已停用</a>',
    '3': '<a class="now-btn gray-btn-a">维护中</a>',
    'default': '<a class="now-btn" href="http://crm2.qq.com/page/portalpage/wpa.php?uin=800076065&f=1&ty=1&aty=0&a=&from=6" target="_blank" rel="noopener noreferrer">联系客服</a>',
}

function packageHtmlPC(data) {
    $('#api-apply-count').html(data.apiData.applycount)
    $('#favorite-count').html(data.apiData.favcount)
    var html = '';
    if (data.html) {
        $('#api-package-side').html(data.html)
    } else {
        switch (data.type) {
            case 'pay':
                html = packageHtmlPCPay(data)
                break;
            case 'other':
                html = packageHtmlPCOther(data)
                break;
            case 'free':
                html = packageHtmlPCFree(data)
                break;
        }

        $('#api-package-side').html(html)
    }
    initLiClick(data.type)
}

/**
 * 付费类接口处理
 * @param data
 * @returns {string}
 */
function packageHtmlPCPay(data) {

    var apiData = data.apiData;
    var packages = data.packages;

    var html = '<ul class="price-ul pay-ul clearfix">';

    $.each(packages, function (i, item) {
        var c = '';
        if (i == 0) {
            c += 'active ';
        }
        if (item.name == '专享积分套餐') {
            c += 'points-package ';
        }
        if (item.rebate) {
            c += 'rebate-test ';
        }
        html += '<li style="padding: 0 12px" class="' + c + '" data-remark="' + item.remarks + '"  data-renums = "' + item.renums + '" data-did="' + item.id + '"';
        html += ' data-price="' + item.price + '" data-plus-vip="' + item.black_plus_vip_discount + '" data-black-vip="' + item.black_vip_discount + '">';


        if (item.black_plus_vip_discount < 1 || item.black_vip_discount < 1) {
            html += '<i class="iconfont icon-heizuan"></i>';
        }

        if (item.test) {
            html += '<span>' + item.renums + '</span>';
        } else {
            html += '<span>' + item.renums + '</span>次';
        }
    })
    html += '</li></ul>'

    html += payApiPrice(packages)
    html += '<div class="buy-apply-div">';
    if (apiData.status == 1 && apiData.isshow == 1 && apiData.openapply == 1) {
        html += buyAreaBtn(data, apiData, '');
    } else {
        if (apiStatusBtn.hasOwnProperty(apiData.status)) {
            html += apiStatusBtn[apiData.status];
        } else {
            html += apiStatusBtn.default;
        }
    }
    html += favoriteDown(data, apiData) + '</div>';

    return html;
}

/**
 * 充值类接口的套餐区域处理
 *
 * @param data
 * @returns {string}
 */
function packageHtmlPCOther(data) {
    var apiData = data.apiData;
    //按钮区域
    var html = '<ul class="price-ul clearfix">\<li class="active">按实际订单计费</li></ul><p class="last-price"><b class="red" style="font-size:14px;">¥ ***</b><span>价格详情请联系客服</span></p>'
    html += '<div class="buy-apply-div">';
    if (apiData.status == 1 && apiData.isshow == 1 && apiData.openapply == 1) {
        html += buyAreaBtn(data, apiData, '');
    } else {
        if (apiStatusBtn.hasOwnProperty(apiData.status)) {
            html += apiStatusBtn[apiData.status];
        } else {
            html += apiStatusBtn.default;
        }
    }
    html += favoriteDown(data, apiData);
    return html + '</div>';
}

/**
 * 免费数据的套餐区域处理
 *
 * @param data
 * @returns {string}
 */
function packageHtmlPCFree(data) {
    var free1 = 0;
    var free2 = 0;

    var vip = data.vip;
    var apiData = data.apiData;
    var packages = data.packages;
    var htmlExt = '';

    if (vip.hasOwnProperty(apiData.id)) {
        free1 = vip[apiData.id].free1
        free2 = vip[apiData.id].free2
    } else {
        free1 = vip.default.free1
        free2 = vip.default.free2
    }

    if (data.membership == 2) {
        htmlExt = '<li>高级会员' + free2 + '次/天</li>'
    }
    //数据套餐部分
    var html = '<ul class="price-ul free-ul clearfix"><li class="active">免费会员' + free1 + '次/天</li>' + htmlExt + '<li>聚合黑钻无限次/天</li></ul>';
    //价格区域
    html += '<p class="last-price"><b class="green">免费</b><span style="font-size:12px; color:#888;">（根据聚合会员等级不同，每日可调用次数不同，<a href="/vip" ref="noopener noreferrer" target="_blank" style="color:#bc962c;">了解会员权益>></a>）</span></p>'

    //按钮区域
    html += '<div class="buy-apply-div">';
    if (apiData.status == 1 && apiData.isshow == 1 && apiData.openapply == 1) {
        html += buyAreaBtn(data, apiData, '');
    } else {
        if (apiStatusBtn.hasOwnProperty(apiData.status)) {
            html += apiStatusBtn[apiData.status];
        } else {
            html += apiStatusBtn.default;
        }
    }
    html += favoriteDown(data, apiData);
    return html + '</div>';
}

/**
 * 统一处理收藏和下载文档的按钮
 * @param data
 * @param apiData
 * @returns {*}
 */

function favoriteDown(data, apiData) {
    var html = '';
    //收藏
    if (data.hasFavorite > 0) {
        html += '<a class="stored " id="favorite" href="javascript:;" didType="1" did="' + apiData.id + '">已收藏</a>'
    } else {
        html += '<a class="" id="favorite" href="javascript:;" didType="1" did="' + apiData.id + '">收藏</a>'
    }

    var style = 'width: 100px;font-weight: normal;margin-left: 5px;color:#00bdff;height: 38px;' +
        'line-height: 38px;font-size:14px;border: 1px solid #00bdff;background: none;text-align: center;' +
        'border-radius: 2px;'
    //下载按钮
    if (apiData.status == 1 && data.apiLists > 0) {
        if (data.hasLogin > 0) {
            var hrefPdf = '/docs/download/pdf/' + apiData.id;
            if (data.clear > 0) {
                hrefPdf += '?clear=1';
            }
            html += '<a class="pdf-download" href="' + hrefPdf + '" style="' + style + '" title="下载【' + apiData.name + '】离线文档">下载离线文档</a>';
        } else {
            html += '<a class="pdf-download" href="javascript:;" style="' + style + '" title="下载【' + apiData.name + '】离线文档">下载离线文档</a>';
        }
    }

    return html;
}

/**
 * 购买按钮
 * @param data
 * @param apiData
 * @returns {string|*}
 */
function buyAreaBtn(data, apiData, c) {
    var html = '';
    if (data.type == 'pay') {
        html += '<a id="go-vip" href="/vip" target="_black" ref="noopener noreferrer">了解黑钻会员</a>';
        html += '<a id="go-superman" href="/superman" target="_black" ref="noopener noreferrer">了解超人</a>';
    }
    if (data.apiApplied > 0) {
        if (data.type == 'other') {
            html += '<a class="now-btn" href="http://crm2.qq.com/page/portalpage/wpa.php?uin=800076065&f=1&ty=1&aty=0&a=&from=6" target="_blank" rel="noopener noreferrer">联系客服</a>'
        } else if (data.type == 'pay') {
            html += '<a class="now-btn pay-buy-a1" href="/recharge/index/id/' + data.apiApplied + '?id=wxy">续费购买</a>'
        } else {
            html += '<a class="now-btn" href="/vip" target="_blank" rel="noopener noreferrer">了解黑钻会员</a>'
        }
    } else if (data.hasLogin == 1) {
        html += '<a class="now-btn ' + c + '" href="/ucenter/datacenter/apiApply/' + apiData.id + '">立即申请</a>'
    } else {
        html += '<a class="now-btn" href="javascript:frameLogin(1)" data="/ucenter/datacenter/apiApply/' + apiData.id + '">立即申请</a>'
    }

    return html;
}

/**
 * 套餐价格处理
 * @param packages
 * @returns {string}
 */
function payApiPrice(packages) {
    var html = '<div class="last-price clearfix" style="height: auto;">';
    html += '<p class="left-p"><b class="red">¥' + packages[0].price + '</b><span>（约<em></em>元/次）<i>' + packages[0].remarks + '</i></span></p>';
    html += '<div class="right-vip"><label class="vip-price"><i class="iconfont icon-heizuan"></i><b>黑钻：<em class="blackem"></em></b></label>';
    html += '<label class="vip-price"><i class="iconfont icon-heizuanplus"></i><b>黑钻Plus：<em class="blackplusem"></em></b></label>';
    html += '<a href="/vip" ref="noopener noreferrer" style="color:#00aeff;font-size:12px" target="_blank">了解黑钻>></a></div></div>'

    return html;
}