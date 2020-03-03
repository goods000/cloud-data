/* placeholder */
var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({position:'relative', zoom:'1', display:'inline-block', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
            var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top, height:h, lineHeight:h+'px', paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};

jQuery(function(){
    JPlaceHolder.init();
});

$('.moneyListDiv:last').css('border','none');

/* header right nav */
$('.headerLi1').mouseenter(function(){
	$('.centerLogout').slideDown();
}).mouseleave(function(){
	$('.centerLogout').stop(true).slideUp();
});

$('.headerLi3').mouseenter(function(){
	$('.juheCode').slideDown();
}).mouseleave(function(){
	$('.juheCode').stop(true).slideUp();
});


//nav sub
$('.ucenterParent').each(function(){
    $(this).click(function(){
        $(this).next('.ucenterSub').stop(true).slideToggle();
    })
})


// 弹层
function code_num(htmlCode){
  layer.open({
    type: 1,
    shadeClose: true,
    title: '笑话大全预警设置',
    scrollbar: true,
    area: ['auto', 'auto'],
    shade: [0.6],
    skin: 'layui-layer-nobg',
    closeBtn: 0,
    content: htmlCode
  });
}

function layLoading()
{
    return layer.load(1,{shade:0.3})
}

function layLoadCls(index)
{
    layer.close(index)
}

function layLoadClsAll()
{
    layer.closeAll()
}

function layerMsg(msg,icon,fun) {
    layer.msg(msg, {icon: icon, time: 2000, shade: 0.3 ,shadeClose:true}, fun);

}
function layerTips(msg,id,icon)
{
    layer.tips(msg,id,{tips:[icon,'#03c5ff'],shade:0.3,time:3000,shadeClose:true});
}
