/*-------------------------------------------------------------------
Visual Change
-------------------------------------------------------------------*/

//初期設定
var Now_ImageID=parseInt(1);
var Next_ImageID=parseInt(2);
var _Timer;

$(document).ready(function(){
	$('#viewerVisualArea ul .visual').css({zIndex:'98',opacity:'0'});
	$('#visual'+Now_ImageID).stop().animate({opacity:'1'},{duration:800,easing:'easeInOutQuad'},function(){$(this).css({zIndex:'11'})});
	_Timer=setTimeout(function(){imageViewerAutoChange()},5000);
	$('.visual_navi'+Now_ImageID+' a').addClass('now');		
});

//クリック時
function imageViewerClickThumb(flag){
	clearTimeout(_Timer);
	Next_ImageID=parseInt(flag);
	$('.visual_navi'+Now_ImageID+' a').removeClass('now');
	$('#visual'+Now_ImageID).stop().animate({opacity:'0'},{duration:500,easing:'easeInQuad'},function(){$(this).css({zIndex:'10'})});
	$('#visual'+Next_ImageID).stop().animate({opacity:'1'},{duration:800,easing:'easeInOutQuad'},function(){$(this).css({zIndex:'11'})});
	
	Now_ImageID=Next_ImageID;
	$('.visual_navi'+Next_ImageID+' a').addClass('now');
	_Timer=setTimeout(function(){imageViewerAutoChange()},5000);
}

//自動再生
function imageViewerAutoChange(){
	
	if(Now_ImageID>=4){Next_ImageID=parseInt(1);}
	else{Next_ImageID=parseInt(Now_ImageID+1);}
	
	$('.visual_navi'+Now_ImageID+' a').removeClass('now');
	$('#visual'+Now_ImageID).stop().animate({opacity:'0'},{duration:500,easing:'easeInQuad'},function(){$(this).css({zIndex:'10'})});
	$('#visual'+Next_ImageID).stop().animate({opacity:'1'},{duration:800,easing:'easeInOutQuad'},function(){$(this).css({zIndex:'11'})});
	
	Now_ImageID=Next_ImageID;
	$('.visual_navi'+Next_ImageID+' a').addClass('now');
	_Timer=setTimeout(function(){imageViewerAutoChange()},5000);
}