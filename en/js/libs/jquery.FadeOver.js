$(function(){

	//フェード用関数
	function imgOvAnimeFade(){

		var ovClass = "rollover-fade", //ロールオーバーする要素のクラス名
		ovStr = "_ov", //ロールオーバー後の画像に追加する文字列
		ovImg = "ovImg",
		speed = 200; //アニメーションの速度

		//classがrolloverのimg要素に対しての処理
		$("img."+ovClass).each(function(){

			var self = $(this),
			url = self.attr("src").replace(/^(.+)(\.[a-z]+)$/,"$1"+ovStr+"$2");
			
			function ovElmLen(){ //ロールオーバー画像表示確認関数
				return self.prev("img."+ovImg).length;
			}
			
			//ホバーイベント
			self.hover(
			function(){
				if(!self.attr("src").match(ovStr+".")){
					if(!ovElmLen()){
						if(jQuery.support.checkOn && jQuery.support.htmlSerialize && !window.globalStorage){ //Operaバグ対策
							self.before("<span style='display:inline-block;' class='"+ovImg+"' ></span>");
						}
						self.css({position:"relative"}).before("<img style='position:absolute;' class='"+ovImg+"' src='"+url+"' alt='' />");
					}
					self.stop().animate({opacity:"0"},speed);
				}
			},
			function(){
				if(ovElmLen()){
					self.stop().animate({opacity:"1"},speed,function(){
						self.css({position:"static"})
						.prevAll("."+ovImg).remove();
					});
				}
			})
			.each(function(){ //プリロード設定
				$("<img>").attr("src",url);
			});

		});

	}

	//アニメーションロールオーバー関数実行
	imgOvAnimeFade();

});