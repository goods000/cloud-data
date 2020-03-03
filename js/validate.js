/**
 * 手机号验证
 * @param mobile
 * @returns {boolean}
 */
function isMobile(mobile)
{
    var mreg =/^1(3\d{1}|4[135789]{1}|5\d{1}|6[56]{1}|7[0135678]{1}|8\d{1}|9[189]{1})\d{8}$/;
    if(!mreg.test(mobile)){
        return false;
    }
    return true;
}

/**
 * 多号码回车验证
 * @param mobile
 * @returns {boolean}
 */
function isMobiles(mobile)
{
    var mreg =/^1(3\d{1}|4[135789]{1}|5\d{1}|6[56]{1}|7[0135678]{1}|8\d{1}|9[189]{1})\d{8}\s{0,}(\s+1(3\d{1}|4[135789]{1}|5\d{1}|6[56]{1}|7[0135678]{1}|8\d{1}|9[189]{1})\d{8}\s{0,}){0,}$/;
    if(!mreg.test(mobile)){
        return false;
    }
    return true;
}

/**
 * 邮箱验证
 * @param email
 * @returns {boolean}
 */
function isEmail(email)
{
    var myreg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!myreg.test(email)) {
        return false;
    }
    return true;
}
/**
 * 用户名验证
 * @param userName
 * @returns {boolean}
 */
function isUserName(userName)
{
    var patrn = /^[a-zA-Z0-9]{1}([a-zA-Z0-9]|[._]){5,19}$/;
    if (!patrn.exec(userName)) {
        return false;
    }
    return true;
}

//判断是否为正整数
function isNumber(num){
    var reg = /^\d+(?=\.{0,1}\d+$|$)/
    if(reg.test(num)) return true;
    return false ;
}


function layerSuccess(msg,reload)
{
    layer.msg(msg,{icon:1,time:3000,shade:0.3,shadeClose:true},function(){
        if(reload == 1) {
            location.reload();
        }else if(reload == 'close') {
            window.parent.layer.closeAll();
        }
    })
}

function layerWarn(msg)
{
    layer.msg(msg,{icon:0,time:3000,shade:0.3,shadeClose:true},function(){
    })
}

function layerError(msg)
{
    layer.msg(msg,{icon:2,time:3000,shade:0.3,shadeClose:true},function(){
    })
}

function base64Endoce(txt) {
    // 使用jsencrypt库加密前端参数
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey($('meta[name="encrypt-pub-key"]').attr('content'));
    return  encrypt.encrypt(txt);
}


function getPubKey(){
    $.ajax({
        url:'/getPubKey',
        type:'get',
        dataType:'json',
        async:false,
        success:function(obj){
            if(obj.code == 0) {
                $('meta[name="encrypt-pub-key"]').attr('content',obj.result.publicKey);
                $('meta[name="csrf-token"]').attr('content', obj.result.verifyTk);
            }
        }
    })
}

function setRequestMt()
{
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'User-Agent-Verify':base64Endoce($('meta[name="csrf-token"]').attr('content'))
        }
    });
}

$(function(){
    //点击弹窗手机验证码框
    $('.mobile-check-show-span .mobile-check-show').click(function(){
        $('input[name="codeCheckType"]').val(0);
        var type = $(this).attr('data-code-type');
        $('input[name="codeCheckType"]').val(type);
        layer.open({
            type:1,
            title:'安全验证',
            area:['500px','auto'],
            content:$('#mobile-code-check-layer')
        })
    })

    //发送短信验证码
    $('.send-validate-code').click(function(){
        //隐藏错误提示
        $('.errorTips').hide();
        $(this).html('验证码发送中...').prop("disabled",true);
        var id = $(this).attr('id');
        var that = $(this);
        var dataType = $('input[name="codeCheckType"]').val();
        var mobile = $('input[name="mainMobile"]').val();

        $.ajax({
            url:'/ucenter/mobileCode/safeChecked',
            type:'post',
            data:'type='+dataType+'&mobile='+mobile,
            dataType:'json',
            success:function(obj){
                if(obj.code == 1){
                    resetSmsSend(120,that);
                }else if(obj.code == 1251) {
                    resetSmsSend(obj.result.index,that);
                } else{
                    var html = obj.info;
                    if(obj.reason) {
                        html = obj.reason;
                    }
                    $('.safe-check-error').show().find('em').html(html);
                }
                that.html('获取验证码').prop("disabled",false);
            }
        })
    })

    $('.submitCodeCheck').click(function(){
        //隐藏错误提示
        $('.safe-check-error').css('display','none')
        var dataType = $('input[name="codeCheckType"]').val();
        var mobile = $('input[name="mainMobile"]').val();
        var valicode = $('input[name="safeCode"]').val();
        var that = $(this);

        if(valicode.length != 6) {
            $('.safe-check-error').show().find('em').html('请填写正确的验证码');
            $("#safeCode").focus();
            return false;
        }

        that.prop("disabled",true);

        that.val('验证...').prop('disabled',true);
        $.post("/ucenter/mobileCode/verifySafeCode", {type:dataType,mobile:mobile,mobilecode:valicode},
            function(obj){
                var code = obj.code;
                if(code =='0'){
                    layerSuccess(obj.reason,1)
                }
                else{
                    layerError(obj.reason)
                    that.val('确定').prop('disabled',false);
                }
            }
            ,'json')
    })
})

// 重置短信发送按钮
function resetSmsSend(index,that) {
    var init = setInterval(function() {
        index--;
        if (index <= 0) {
            clearInterval(init);
            that.html("获取验证码").css({"background": "#03c5ff"}).prop("disabled", false);
        }else {
            that.html("重新发送(" + index + ")").css({"background": "#666"}).prop("disabled", true);
        }
    }, 1000)

}
function mobileBlur(mobile)
{
    if(isMobile(mobile)) {
        $.ajax({
            url:'/common/checkMobile/' + mobile,
            type:'post',
            dataType:'json',
            async:false,
            data:'tokenSign='+base64Endoce($('meta[name="csrf-token"]').attr('content')),
            success:function(){

            }
        })
    }

}

function newSmsCodeSend(method,that,thatHtml,putData,isFocus)
{
    $.ajax({
        url:'/sendsms',
        type:method,
        dataType:'json',
        data:putData,
        success:function(obj){
            if(obj.code == 0 || obj.code == 1) {
                resetSmsBtnTime(that,obj)
            } else {
                if(obj.result && obj.result.section) {
                    var selector = $(obj.result.section)
                } else {
                    var selector = that
                }

                newErrorShow(that,thatHtml,selector,obj.reason,isFocus)
            }
        },
        error:function(obj){
            console.log(obj)
            newErrorShow(that,thatHtml,that,'系统错误,稍后再试',false)
        }
    })
}

// 重置短信发送按钮
function resetSmsBtnTime(that,obj) {

    if(obj.result && obj.result.index) {
        var index = obj.result.index
    } else {
        var index = 120
    }

    var init = setInterval(function () {
        index--;
        if (index <= 0) {
            clearInterval(init);
            that.val('获取验证码').css({'background': '#2AABE4'}).prop('disabled', false);
        } else {
            that.val('重新发送(' + index + ')').css({'background': '#999'}).prop('disabled', true);
        }
    }, 1000);
}

/**
 * 新版错误处理显示
 *
 * @param that
 * @param thatHtml
 * @param obj
 * @param isFocus
 */
function newErrorShow(that,thatHtml,selector,msg,isFocus)
{

    selector.parent().find('.errorTips').find('em').html(msg)
    selector.parent().find('.errorTips').fadeIn();

    if(isFocus){
        selector.focus();
    }

    that.val(thatHtml).prop('disabled',false)
}