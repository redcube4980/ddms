$(function(){
	$('#spBtn').click(function() {
		$(this).children().toggleClass('active');
		$('#modalSet').toggleClass('active');
		$('#modalSet').slideToggle('fast');
		
		
		});
	
});