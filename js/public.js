
$(document).ready(function(){
	$('#header').load("./header.html");
});

$(document).ready(function(){
	$('#nav').load("./nav.html");
});

//$(document).ready(function(){
//	$('#footer').load("../footer.html");
//});

//弹出修改页面弹框
$(".psd").click(function(){
	console.log(1);
	$(".psd_mo").show();
})
$(".psd_close").click(function(){
	$(".psd_mo").hide();
})