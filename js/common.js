/*-------------------------------------------------------------------
BTN
-------------------------------------------------------------------*/

$(document).ready(function() {		
	//clickArea	
	$("#globalHeader #GHarea h1").click(function(){
		window.open($(this).find("a").attr("href"), '_self');
		return false;  
    });
	
	//overAnimation
	$("#globalHeader #GHarea h1").hover(
		function(){
			$(this).css("cursor","pointer");
		},
		function(){
			$(this).css("cursor","default");		
		}
	);	
});	