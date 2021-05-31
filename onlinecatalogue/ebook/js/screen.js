/*! $Id: screen.js 215 2013-09-25 07:49:34Z tomita $ */
var Initialized=false;var Header;var MainArea;var NormalLayer;var BookBorderLayer;var BookLayer;var LinkLayer;var CenterBorderLayer;var ZoomLayer;var ZoomedBookLayer;var ZoomedLinkLayer;var ZoomedScrollLayer;var ControlBar;var EZBook;var BookBorder;var CenterBorder;var BookLinkL;var BookLinkR;var ZoomedPage;var ZoomedBookLink;var ScrollTopBtn;var ScrollLeftBtn;var ScrollRightBtn;var ScrollBottomBtn;var WinMgr;var MapWin;var RectSelector;var Plarform;var IsIE7=false;var LayoutParam={zoom_padding:4};var ZoomedPageSizes=[];var BookContext={zoomed:0,zoomed_pg:0,zoom_scrolling:false,in_animation:false,center_border:true,grab:false,grab_prev_x:0,grab_prev_y:0,grab_moved:false,auto_feed_interval:null,auto_feed_timer:null,copy_and_paste_mode:false};var LinkDataCache;function layoutScreen(){var b=EBUtil.winWidth();var a=EBUtil.winHeight();var e=Header?Header.offsetHeight:0;var c=b;var d=(a-e-ControlBar.offsetHeight);if(d<0){d=0}MainArea.style.top=e+"px";MainArea.style.height=d+"px";ControlBar.style.top=(a-ControlBar.offsetHeight)+"px";ScrollTopBtn.style.top="0px";ScrollTopBtn.style.left=parseInt(c/2)-29+"px";ScrollLeftBtn.style.top=parseInt(d/2)-29+"px";ScrollLeftBtn.style.left="0px";ScrollRightBtn.style.top=parseInt(d/2)-29+"px";ScrollRightBtn.style.left=c-38+"px";ScrollBottomBtn.style.top=d-38+"px";ScrollBottomBtn.style.left=parseInt(c/2)-29+"px";WinMgr.setScreentRect(0,0,c,d)}function layoutBook(){var l=MainArea.offsetWidth;var f=MainArea.offsetHeight;var c;var d;var j=(pageWidth_1X*2)/pageHeight_1Y;if(FeaturePageResize){c=l-100;d=c/j;if(d>f-25){d=f-25;c=d*j}c=parseInt(c,10);c=c&~1;if(c>pageWidth_1X*2){c=pageWidth_1X*2;d=c/j}if(c<BookMinWidth){c=BookMinWidth;d=c/j}}else{c=pageWidth_1X*2;d=c/j}var b=parseInt((l-c)/2);var a=parseInt((f-d)/2);EZBook.setPos(b,a);EZBook.setWidth(c);d=EZBook.getHeight();BookBorder.setPos(b,a);BookBorder.setSize(c,d);CenterBorder.setPos(b+parseInt(c/2)-parseInt(CenterBorderWidth/2),a);CenterBorder.setSize(CenterBorderWidth,d);var k=c/2;BookLinkL.setPos(b,a);BookLinkL.setSize(k,d);BookLinkR.setPos(b+k,a);BookLinkR.setSize(k,d);if(BookContext.zoomed){var g=ZoomedPage.getWidth();var i=g*pageHeight_1Y/pageWidth_1X;var e=normalizeZoomedPos(ZoomedPage.getPosX(),ZoomedPage.getPosY(),g,i);ZoomedPage.setPos(e.x,e.y);ZoomedBookLink.setPos(e.x,e.y);updateScrollButton();if(FeatureMapWindow){MapWin.updateClientArea()}}}function normalizeZoomedPos(a,d,b,c){if(b<MainArea.offsetWidth){a=(MainArea.offsetWidth-b)/2}else{if(a>0+LayoutParam.zoom_padding){a=0+LayoutParam.zoom_padding}if(a+b<MainArea.offsetWidth-LayoutParam.zoom_padding){a=MainArea.offsetWidth-LayoutParam.zoom_padding-b}}if(c<MainArea.offsetHeight){d=(MainArea.offsetHeight-c)/2}else{if(d>0+LayoutParam.zoom_padding){d=0+LayoutParam.zoom_padding}if(d+c<MainArea.offsetHeight-LayoutParam.zoom_padding){d=MainArea.offsetHeight-LayoutParam.zoom_padding-c}}return{x:a,y:d}}function updateScrollButton(){var g=MainArea.offsetWidth;var c=MainArea.offsetHeight;var a=ZoomedPage.getPosX();var f=ZoomedPage.getPosY();var b=ZoomedPage.getWidth();var d=parseInt(b*pageHeight_1Y/pageWidth_1X);var e;if(d<c){e="none"}else{e=(f>=0)?"none":"block"}ScrollTopBtn.style.display=e;if(d<c){e="none"}else{e=(f+d<=c)?"none":"block"}ScrollBottomBtn.style.display=e;if(b<g){e="none"}else{e=(a>=0)?"none":"block"}ScrollLeftBtn.style.display=e;if(b<g){e="none"}else{e=(a+b<=g)?"none":"block"}ScrollRightBtn.style.display=e}function setZoomedPage(a){ZoomedPage.load(EBUtil.imageUrl(a));ZoomedBookLink.clear();if(LinkDataCache[a]){ZoomedBookLink.setLink(LinkDataCache[a])}EBUtil.notifyAction("vz","pg="+a)}function zoomIn(j,m){if(BookContext.in_animation){return}var h=EZBook.getCurrentPage();var q=j==0?true:false;if(IsLeftTemplate){if(!q){h++}}else{if(q){h++}}BookContext.zoomed_pg=h;setZoomedPage(BookContext.zoomed_pg);var p=EZBook.getWidth()/2;var o=m.x;var k=m.y;var b=m.x+EZBook.getPosX();var a=m.y+EZBook.getPosY();if(j){b+=p}var e=1;var c=ZoomedPageSizes[e].width;var g=ZoomedPageSizes[e].height;var i=c/p;var n=b-o*i;var l=a-k*i;var f=normalizeZoomedPos(n,l,c,g);n=f.x;l=f.y;var d={x:EZBook.getPosX()+(j?p:0),y:EZBook.getPosY(),width:p,x2:n,y2:l,width2:c,total_step:5,oncomplete:function(){BookContext.zoomed=1;setTimeout(function(){ZoomedPage.setForceNormalImage(false)},100);NormalLayer.style.display="none";ZoomedLinkLayer.style.display="block";updateScrollButton();Bar.updateDownloadButtonStatus();if(FeatureMapWindow){MapWin.setImage(EBUtil.imageUrl(BookContext.zoomed_pg));MapWin.updateClientArea();MapWin.show()}},step:0};ZoomedPage.setPos(d.x,d.y);ZoomedPage.setWidth(d.width);ZoomedPage.setForceNormalImage(true);ZoomLayer.style.display="block";ZoomedLinkLayer.style.display="none";if(BookContext.auto_feed_timer){clearInterval(BookContext.auto_feed_timer);BookContext.auto_feed_timer=null}BookContext.in_animation=true;setTimeout(function(){startZoomInOutAnimation(d)},10)}function zoomOut(){if(BookContext.in_animation){return}var b=EZBook.getWidth()/2;var a=EBUtil.isLeftPage(IsLeftTemplate,BookContext.zoomed_pg);var c={x:ZoomedPage.getPosX(),y:ZoomedPage.getPosY(),width:ZoomedPage.getWidth(),x2:EZBook.getPosX()+(a?0:b),y2:EZBook.getPosY(),width2:b,total_step:5,oncomplete:function(){ZoomLayer.style.display="none";BookContext.zoomed=0;Bar.updateDownloadButtonStatus();if(IsIE7){ZoomedPage.setForceNormalImage(false)}},step:0};NormalLayer.style.display="block";ZoomedLinkLayer.style.display="none";if(FeatureMapWindow){MapWin.hide()}if(BookContext.auto_feed_interval){startAutoFeed(BookContext.auto_feed_interval)}if(IsIE7){ZoomedPage.setForceNormalImage(true)}BookContext.in_animation=true;setTimeout(function(){startZoomInOutAnimation(c)},10)}function changeZoomRatio(k,f){if(BookContext.in_animation){return}var n=ZoomedPage.getWidth();var o=EBUtil.isLeftPage(IsLeftTemplate,BookContext.zoomed_pg);var m=k.x;var i=k.y;var b=k.x+ZoomedPage.getPosX();var a=k.y+ZoomedPage.getPosY();var c=ZoomedPageSizes[f].width;var g=ZoomedPageSizes[f].height;var h=c/n;var l=b-m*h;var j=a-i*h;var e=normalizeZoomedPos(l,j,c,g);l=e.x;j=e.y;var d={x:ZoomedPage.getPosX(),y:ZoomedPage.getPosY(),width:ZoomedPage.getWidth(),x2:l,y2:j,width2:c,total_step:5,oncomplete:function(){BookContext.zoomed=f;ZoomedLinkLayer.style.display="block";updateScrollButton();if(FeatureMapWindow){MapWin.updateClientArea();MapWin.show()}},step:0};ZoomedLinkLayer.style.display="none";BookContext.in_animation=true;setTimeout(function(){startZoomInOutAnimation(d)},10)}function startZoomInOutAnimation(b){var a=b.step;var d=b.total_step;var g=b.x+(b.x2-b.x)*a/d;var f=b.y+(b.y2-b.y)*a/d;var i=b.width+(b.width2-b.width)*a/d;ZoomedPage.setPos(g,f);ZoomedPage.setWidth(i);if(b.step==b.total_step){var e=(pageWidth_1X)/pageHeight_1Y;var j=ZoomedPage.getWidth();var c=j/e;ZoomedBookLink.setPos(g,f);ZoomedBookLink.setSize(j,c);BookContext.in_animation=false;if(typeof b.oncomplete!="undefined"){b.oncomplete()}return}b.step++;setTimeout(function(){startZoomInOutAnimation(b)},10)}function onResize(){layoutScreen();layoutBook();BookMark.layout();SideBar.layout()}function onRightMost(){if(!BookContext.zoomed){EZBook.turnToRightMost()}else{BookContext.zoomed_pg=IsLeftTemplate?lastPage:firstPage;setZoomedPage(BookContext.zoomed_pg);EZBook.setCurrentPage(BookContext.zoomed_pg);if(FeatureMapWindow){MapWin.setImage(EBUtil.imageUrl(BookContext.zoomed_pg))}}}function onLeftMost(){if(!BookContext.zoomed){EZBook.turnToLeftMost()}else{BookContext.zoomed_pg=IsLeftTemplate?firstPage:lastPage;setZoomedPage(BookContext.zoomed_pg);EZBook.setCurrentPage(BookContext.zoomed_pg);if(FeatureMapWindow){MapWin.setImage(EBUtil.imageUrl(BookContext.zoomed_pg))}}}function onRight(){if(!BookContext.zoomed){EZBook.turnToRight()}else{var a=EBUtil.toRightStep(IsLeftTemplate,1);if(BookContext.zoomed_pg+a<firstPage||BookContext.zoomed_pg+a>lastPage){return}BookContext.zoomed_pg+=a;setZoomedPage(BookContext.zoomed_pg);EZBook.setCurrentPage(BookContext.zoomed_pg);if(FeatureMapWindow){MapWin.setImage(EBUtil.imageUrl(BookContext.zoomed_pg))}}}function onLeft(){if(!BookContext.zoomed){EZBook.turnToLeft()}else{var a=EBUtil.toLeftStep(IsLeftTemplate,1);if(BookContext.zoomed_pg+a<firstPage||BookContext.zoomed_pg+a>lastPage){return}BookContext.zoomed_pg+=a;setZoomedPage(BookContext.zoomed_pg);EZBook.setCurrentPage(BookContext.zoomed_pg);if(FeatureMapWindow){MapWin.setImage(EBUtil.imageUrl(BookContext.zoomed_pg))}}}function onMouseWheel(f){var g=f||window.event;var i;if(typeof g.wheelDelta!=="undefined"){i=g.wheelDelta}else{if(typeof g.detail!=="undefined"){i=g.detail*-1}else{return}}if(i==0){return}if(!BookContext.zoomed){if(IsLeftTemplate){if(i<0){EZBook.turnToRight()}else{EZBook.turnToLeft()}}else{if(i<0){EZBook.turnToLeft()}else{EZBook.turnToRight()}}}else{var d=typeof g.wheelDelta!="undefined"?1:20;var c=ZoomedPage.getPosY()+i*d;var a=ZoomedPage.getWidth();var h=a*pageHeight_1Y/pageWidth_1X;var b=normalizeZoomedPos(ZoomedPage.getPosX(),c,a,h);ZoomedPage.setPos(b.x,b.y);ZoomedBookLink.setPos(b.x,b.y);updateScrollButton();if(FeatureMapWindow){MapWin.updateClientArea()}}EBUtil.preventDefault(g)}function onBookClick(c,b,d){if(!Platform.isMac()){switch(b){case 0:if(BookContext.copy_and_paste_mode){return}var a=EZBook.getWidth()/2;if((c==0&&d.x>=a-CenterBorderWidth)||(c==1&&d.x<=CenterBorderWidth)){if(!BookContext.center_border){CenterBorderLayer.style.visibility="visible";BookContext.center_border=true}return}if(c==0){EZBook.turnToLeft()}else{EZBook.turnToRight()}return;default:if(!BookContext.zoomed){zoomIn(c,d)}}}else{if(BookContext.copy_and_paste_mode){return}if(!BookContext.zoomed){zoomIn(c,d)}}}function onZoomedPageClick(b,c){var a=false;if(Platform.isMac()){a=true}else{if(b.button==2||b.button==3){a=true}}if(BookContext.grab_moved){a=false}if(a){if(BookContext.zoomed>0){if(BookContext.zoomed==ZoomedPageSizes.length-1){zoomOut()}else{changeZoomRatio(c,BookContext.zoomed+1)}}}}function onZoomedPageMouseUp(a,b){if(BookContext.copy_and_paste_mode){return}BookContext.grab=false;ZoomedPage.containerNode().style.cursor=""}function onZoomedPageMouseDown(a,b){if(BookContext.copy_and_paste_mode){return}BookContext.grab=true;BookContext.grab_prev_x=a.screenX;BookContext.grab_prev_y=a.screenY;BookContext.grab_moved=false;ZoomedPage.containerNode().style.cursor="move";EBUtil.preventDefault(a)}function onZoomLayerMouseMove(a){var f=a||window.event;if(BookContext.grab){var h=f.screenX;var g=f.screenY;var j=h-BookContext.grab_prev_x;var i=g-BookContext.grab_prev_y;var c=ZoomedPage.getWidth();var d=c*pageHeight_1Y/pageWidth_1X;var b=normalizeZoomedPos(ZoomedPage.getPosX()+j,ZoomedPage.getPosY()+i,c,d);ZoomedPage.setPos(b.x,b.y);ZoomedBookLink.setPos(b.x,b.y);updateScrollButton();if(FeatureMapWindow){MapWin.updateClientArea()}BookContext.grab_prev_x=h;BookContext.grab_prev_y=g;BookContext.grab_moved=true}EBUtil.preventDefault(f)}function onZoomScrollStart(a){BookContext.zoom_scrolling=true;setTimeout(function(){_zoomScrollTimer(a)},10)}function onZoomScrollEnd(){BookContext.zoom_scrolling=false}function _zoomScrollTimer(c){if(!BookContext.zoom_scrolling){return}var g=MainArea.offsetWidth;var b=MainArea.offsetHeight;var a=ZoomedPage.getWidth();var f=parseInt(a*pageHeight_1Y/pageWidth_1X);var e=ZoomedPage.getPosX();var d=ZoomedPage.getPosY();switch(c){case"top":d+=ScrollStep;if(d>0){d=0}break;case"left":e+=ScrollStep;if(e>0){e=0}break;case"right":e-=ScrollStep;if(e+a<g){e=g-a}break;case"bottom":d-=ScrollStep;if(d+f<b){d=b-f}break}ZoomedPage.setPos(e,d);ZoomedBookLink.setPos(e,d);updateScrollButton();if(FeatureMapWindow){MapWin.updateClientArea()}setTimeout(function(){_zoomScrollTimer(c)},10)}function updateLink(){var a=EZBook.getCurrentPage();BookLinkL.clear();BookLinkR.clear();if(IsLeftTemplate){if(LinkDataCache[a]){BookLinkL.setLink(LinkDataCache[a])}if(LinkDataCache[a+1]){BookLinkR.setLink(LinkDataCache[a+1])}}else{if(LinkDataCache[a]){BookLinkR.setLink(LinkDataCache[a])}if(LinkDataCache[a+1]){BookLinkL.setLink(LinkDataCache[a+1])}}}function gotoPage(a){if(!BookContext.zoomed){EZBook.gotoPage(a)}else{BookContext.zoomed_pg=a;setZoomedPage(BookContext.zoomed_pg);EZBook.setCurrentPage(BookContext.zoomed_pg);if(FeatureMapWindow){MapWin.setImage(EBUtil.imageUrl(BookContext.zoomed_pg))}}}function buildTOCHTML(){if(!IB_listdata){return""}var b="";for(var a=0;a<IB_listdata.length;a++){b+='<div><div class="toc_icon_div"><img style="vertical-align:text-bottom;" src="skinimage/sidebar/default_E.gif" /><img style="vertical-align:top;" src="skinimage/sidebar/icon_field.gif" /></div><div class="toc_text_div"><span onclick="gotoPage('+IB_listpage[a]+')">'+IB_listdata[a]+'</span></div><div style="clear:both;"></div></div>'}b+=Lang.SideBarCloseBtnHTML;return b}function gotoLink(j,f,h,d){var c="LinkWindow";if(j=="L"){var a=f;if(AutoAdditionBookKey&&BookKey){a=EBUtil.setQueryParam(a,"key",BookKey)}var l=window.open(a,"newlink","left=0, top=0, directories=yes, status=yes, location=yes, menubar=yes, scrollbars=yes, resizable=yes, toolbar=yes, fullscreen=no");l.focus();var e=new RegExp(/[?&]id=([^&]+)/);if(f.match(e)){EBUtil.notifyAction("l","pg="+h+"&id="+RegExp.$1)}}else{if(j=="E"){var a=f;if(AutoAdditionBookKey&&BookKey){a=EBUtil.setQueryParam(a,"key",BookKey)}var b=1015;var m=700;if(d){var g=d.split("x");b=g[0];m=g[1]}var l=window.open(a,"catalog","left=0, top=0, width="+b+", height="+m+", directories=no, status=no, location=no, menubar=no, scrollbars=no, resizable=no, toolbar=no");l.focus();var e=new RegExp(/[?&]id=([^&]+)/);if(f.match(e)){EBUtil.notifyAction("l","pg="+h+"&id="+RegExp.$1)}}else{if(j=="G"){var g=f.split(",");var k=parseInt(g[0]);var i=k+modifiedPage;var e=new RegExp(/,id=([^,]+)/);if(f.match(e)){EBUtil.notifyAction("l","pg="+h+"&id="+RegExp.$1)}gotoPage(i)}else{if(j=="M"){var a;a=soundDir+f;var l=window.open(a,"newfile","left=0, top=0, width=340, height=270, directories=no, status=no, location=no, menubar=no, scrollbars=no, resizable=yes, fullscreen=no");l.focus()}}}}}function zoomPageByKey(b){if(!BookContext.zoomed){var c={x:parseInt(EZBook.getWidth()/2),y:parseInt(EZBook.getHeight()/2)};zoomIn(b,c)}else{if(1){var a=EBUtil.isLeftPage(IsLeftTemplate,BookContext.zoomed_pg);if((a==true&&b==1)||(a==false&&b==0)){return}}var c={x:parseInt(ZoomedPage.getWidth()/2),y:parseInt(ZoomedPage.getHeight()/2)};if(BookContext.zoomed==ZoomedPageSizes.length-1){zoomOut()}else{changeZoomRatio(c,BookContext.zoomed+1)}}}function onKeyDown(a){var c=a||window.event;var b=EBUtil.eventTarget(c);if(b.tagName=="INPUT"||b.tagName=="SELECT"){return true}switch(c.keyCode){case 37:if(!BookContext.zoomed){onLeft()}return false;case 38:zoomPageByKey(1);return false;case 39:if(!BookContext.zoomed){onRight()}return false;case 40:zoomPageByKey(0);return false}return true}function onAutoFeedTimer(){if(BookContext.zoomed){return}var a=EZBook.getCurrentPage();if(a+2>lastPage){gotoPage(firstPage)}else{if(IsLeftTemplate){onRight()}else{onLeft()}}}function startAutoFeed(a){a=parseInt(a);if(BookContext.auto_feed_timer){stopAutoFeed()}BookContext.auto_feed_interval=a;BookContext.auto_feed_timer=setInterval(onAutoFeedTimer,BookContext.auto_feed_interval)}function stopAutoFeed(){BookContext.auto_feed_interval=0;if(BookContext.auto_feed_timer){clearInterval(BookContext.auto_feed_timer);BookContext.auto_feed_timer=null}}function setCopyAndPasteMode(a){BookContext.copy_and_paste_mode=a;if(a){RectSelector.enable();MainArea.style.cursor=" url(skinimage/cursor/cut.cur), auto"}else{RectSelector.disable();MainArea.style.cursor=""}}function onSelectStart(b){var a=BookContext.zoomed?ZoomedPage.containerNode():EZBook.containerNode();if(!EBUtil.isDescendant(a,b.srcNode)){RectSelector.cancel();return}ZoomedScrollLayer.style.display="none"}function onSelectRect(j){ZoomedScrollLayer.style.display="block";if(j.left==j.right||j.top==j.bottom){return}var f={};if(BookContext.zoomed){var h=j.left-ZoomedPage.getPosX();var g=j.top-ZoomedPage.getPosY();if(ZoomedPage.getWidth()<1||ZoomedPage.getHeight()<1){return}var m=parseFloat(pageWidth_2X)/ZoomedPage.getWidth();var l=parseFloat(pageHeight_2Y)/ZoomedPage.getHeight();var c=parseInt(h*m,10);var a=parseInt(g*l,10);var e=parseInt((j.right-j.left)*m,10);var n=parseInt((j.bottom-j.top)*l,10);f.sz="z";f.pg=BookContext.zoomed_pg;f.x=c;f.y=a;f.w=e;f.h=n}else{var h=j.left-EZBook.getPosX();var g=j.top-EZBook.getPosY();if(EZBook.getWidth()<1||EZBook.getHeight()<1){return}var m=(2*pageWidth_1X)/EZBook.getWidth();var l=parseFloat(pageHeight_1Y)/EZBook.getHeight();var c=parseInt(h*m,10);var a=parseInt(g*l,10);var e=parseInt((j.right-j.left)*m,10);var n=parseInt((j.bottom-j.top)*l,10);f.sz="n";f.pg=EZBook.getCurrentPage();f.x=c;f.y=a;f.w=e;f.h=n}var i="";for(var d in f){if(i!==""){i+="&"}i+=d+"="+f[d]}var b="./copypaste.html?"+i;var k=window.open(b,"copypaste","left=0, top=0, width=200, height=300, directories=no, status=no, location=no, menubar=no, scrollbars=no, resizable=no, toolbar=no");k.focus()}function buildLinkDataCache(){LinkDataCache=new Array();if(typeof userLinkData!="undefined"){var b=userLinkData;for(var d=0;d<b.length;d++){var e=b[d].split(" ");var c=parseInt(e[0]);if(typeof LinkDataCache[c]=="undefined"){LinkDataCache[c]=new Array()}var a=LinkDataCache[c].length;LinkDataCache[c][a]=e}}}function onLoad(){Header=document.getElementById("header");MainArea=document.getElementById("mainarea");NormalLayer=document.getElementById("normallayer");BookBorderLayer=document.getElementById("bookborderlayer");BookLayer=document.getElementById("booklayer");LinkLayer=document.getElementById("linklayer");CenterBorderLayer=document.getElementById("centerborderlayer");BookMarkLayer=document.getElementById("bookmarklayer");ZoomLayer=document.getElementById("zoomlayer");ZoomedBookLayer=document.getElementById("zoomedbooklayer");ZoomedLinkLayer=document.getElementById("zoomedlinklayer");ZoomedScrollLayer=document.getElementById("zoomedscrolllayer");ScrollTopBtn=document.getElementById("scrolltop");ScrollLeftBtn=document.getElementById("scrollleft");ScrollRightBtn=document.getElementById("scrollright");ScrollBottomBtn=document.getElementById("scrollbottom");ControlBar=document.getElementById("controlbar");EBUtil.setupRollOver(document);Platform=new EBUtil.Platform;if(Platform.isIE()&&Platform.versionString()==7){IsIE7=true}Bar.initialize();if(FeatureMultiStageZoom){var a,c;if(typeof MultiStageZoomRatio=="undefined"){a=parseInt(pageWidth_1X+(pageWidth_2X-pageWidth_1X)/2);c=parseInt(pageHeight_1Y+(pageHeight_2Y-pageHeight_1Y)/2)}else{a=parseInt(pageWidth_1X*MultiStageZoomRatio);c=parseInt(pageHeight_1Y*MultiStageZoomRatio)}ZoomedPageSizes=[{},{width:a,height:c},{width:pageWidth_2X,height:pageHeight_2Y}]}else{ZoomedPageSizes=[{},{width:pageWidth_2X,height:pageHeight_2Y}]}if(typeof MainArea.onmousewheel!="undefined"){MainArea.onmousewheel=function(){onMouseWheel()}}else{MainArea.addEventListener("DOMMouseScroll",function(f){onMouseWheel(f)},false)}MainArea.onmousedown=function(){return false};window.onresize=onResize;EZBook=new EBook;EZBook.setLeftTemplate(IsLeftTemplate);EZBook.setPageGeometry(pageWidth_1X,pageHeight_1Y);EZBook.setFirstPage(firstPage);EZBook.setLastPage(lastPage);BookLayer.appendChild(EZBook.containerNode());EZBook.addListener("onclick",function(f,e,g){onBookClick(f,e,g)});EZBook.addListener("pagechange",function(){Bar.updatePageNumber();Bar.updateDownloadButtonStatus();BookMark.update();updateLink();if(Sound){Sound.loadPageSound()}if(!BookContext.zoomed){var e=EZBook.getCurrentPage();EBUtil.notifyAction("v","pg="+e);EBUtil.notifyAction("v","pg="+(e+1))}});BookBorder=new EBookBorder;BookBorderLayer.appendChild(BookBorder.containerNode());CenterBorder=new EBookCenterBorder;CenterBorderLayer.appendChild(CenterBorder.containerNode());CenterBorder.addListener("onclick",function(f){if(BookContext.center_border){CenterBorderLayer.style.visibility="hidden";BookContext.center_border=false}});buildLinkDataCache();BookLinkL=new EBookLink;LinkLayer.appendChild(BookLinkL.containerNode());BookLinkR=new EBookLink;LinkLayer.appendChild(BookLinkR.containerNode());ZoomedPage=new PageCompositeImage(pageWidth_2X,pageHeight_2Y);ZoomedPage.setSliceNumber(sliceNumber);ZoomedPage.setNormalWidthMax(pageWidth_1X);ZoomedPage.setWidth(pageWidth_2X);ZoomedPage.setPos(0,30);ZoomedPage.addListener("onclick",function(f,g){onZoomedPageClick(f,g)});ZoomedPage.addListener("onmouseup",function(f,g){onZoomedPageMouseUp(f,g)});ZoomedPage.addListener("onmousedown",function(f,g){onZoomedPageMouseDown(f,g)});ZoomedBookLayer.appendChild(ZoomedPage.containerNode());ZoomedBookLink=new EBookLink;ZoomedLinkLayer.appendChild(ZoomedBookLink.containerNode());ScrollTopBtn.onmouseover=function(){onZoomScrollStart("top")};ScrollTopBtn.onmouseout=function(){onZoomScrollEnd()};ScrollLeftBtn.onmouseover=function(){onZoomScrollStart("left")};ScrollLeftBtn.onmouseout=function(){onZoomScrollEnd()};ScrollRightBtn.onmouseover=function(){onZoomScrollStart("right")};ScrollRightBtn.onmouseout=function(){onZoomScrollEnd()};ScrollBottomBtn.onmouseover=function(){onZoomScrollStart("bottom")};ScrollBottomBtn.onmouseout=function(){onZoomScrollEnd()};ZoomLayer.style.display="none";WinMgr=new JSWindowManager(document.getElementById("windowlayer"));if(FeatureMapWindow){MapWin=new MapWindow;var b=pageWidth_1X/pageHeight_1Y;MapWin.setClientSize(MapWindowImageWidth,parseInt(MapWindowImageWidth/b));MapWin.setImage("skinimage/s.gif");MapWin.hide();WinMgr.addWindow(MapWin)}RectSelector=new EBUtil.RectSelector(MainArea,document.getElementById("copy_and_paste_layer"));RectSelector.addListener("onselectstart",onSelectStart);RectSelector.addListener("onselect",onSelectRect);BookMark.initialize();SideBar.initialize();if(Sound){Sound.initialize()}document.onkeydown=onKeyDown;Bar.updatePageNumber();Bar.updateDownloadButtonStatus();BookMark.update();updateLink();onResize();var d=EBUtil.getQueryParam(window,"pg");if(d===null){d=EBUtil.getQueryParam(top,"pg")}if(d===null){EZBook.setCurrentPage(1)}else{EZBook.setCurrentPage(parseInt(d,10)+modifiedPage)}Initialized=true};