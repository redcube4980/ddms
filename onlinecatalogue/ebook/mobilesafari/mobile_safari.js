/*! $Id: mobile_safari.js 233 2013-11-21 08:09:09Z tomita $ */
var CurrentMode;var ScreenWidth;var ScreenHeight;var ScrollAreaWidth;var ScrollAreaHeight;var CfgUpDownDrag=false;var CfgDisableTurnPageInZoom=true;var CfgDebugConsole=false;var CurrentPage;var DefaultPageWidth;var DefaultPageHeight;var MinPageWidth;var MaxPageWidth;var InTransition=null;var ControlBarHeight;var linkDataCache=new Array();var linkImgPath="../image/link_color/";var linkImgExt=".gif";var PImageSingle;var PImageSingle2;var PImageDouble;var PImageDouble2;var PImage;var PImage2;var ScrollLayer;var ControlBar;var Gesture;var ThumbImages=[];var ThumbWidth=150;var ThumbHeight;var ThumbPageNumberHeight=20;var ThumbHMargin=10;var ThumbVMargin=20;var ThumbRows;var ThumbCols;var ThumbLastRow;var ThumbScrollY=0;var TID_transitionToCatalog=null;var ThumbnailGeometry={iPhone:{width:150,h_margin:10,v_margin:20,page_num_height:20,},iPad:{width:200,h_margin:10,v_margin:20,page_num_height:20,},};function getParam(a){var c=location.search;if(!c){return null}var b=new RegExp("[?&]"+a+"=([^&]*)");if(!c.match(b)){return null}return RegExp.$1}function getDeviceType(){var a="Unknown";switch(navigator.platform){case"iPhone":case"iPhone Simulator":a="iPhone";break;case"iPad":case"iPad Simulator":a="iPad";break}return a}function getOrientation(){switch(window.orientation){case 0:case 180:default:return"vertical";case -90:case 90:return"horizontal"}}function getPageStep(){switch(getOrientation()){case"vertical":return 1;case"horizontal":return 2}}function setCurrentPage(a){switch(getOrientation()){case"vertical":CurrentPage=a;break;case"horizontal":if(a%2==0){a--}CurrentPage=a;break}}function LinkColorType2Value(a){if(a=="R"){return"#FF0000"}else{if(a=="G"){return"#00FF00"}else{if(a=="B"){return"#0000FF"}else{if(a=="C"){return"#00FFFF"}else{if(a=="M"){return"#FF00FF"}else{if(a=="Y"){return"#FFFF00"}else{if(a=="K"){return"#FFFFFF"}else{return"#FFFFFF"}}}}}}}}function initializeScreenSizeVariables(){var b=getDeviceType();ScreenWidth=document.body.clientWidth;ScreenHeight=document.body.clientHeight;var a=new EBUtil.Platform;var c=a.osVersionString();c=parseFloat(c);switch(b){case"iPhone":if(c<7){ScreenHeight+=60}break;case"iPad":if(c>=7){if(getOrientation()=="horizontal"){ScreenHeight-=20}}break}}function initializeThumbnailSizeVariables(){var a=getDeviceType();if(ThumbnailGeometry[a]){ThumbWidth=ThumbnailGeometry[a].width;ThumbHMargin=ThumbnailGeometry[a].h_margin;ThumbVMargin=ThumbnailGeometry[a].v_margin;ThumbPageNumberHeight=ThumbnailGeometry[a].page_num_height}}function initializeCatalogViewGeometry(){ControlBarHeight=ControlBar.offsetHeight;initializeScreenSizeVariables();ScrollAreaWidth=ScreenWidth;ScrollAreaHeight=ScreenHeight-ControlBarHeight;document.body.style.width=ScreenWidth+"px";document.body.style.height=(ScreenHeight+100)+"px";var e=document.getElementById("ScrollArea");e.style.top="0px";e.style.left="0px";e.style.width=ScrollAreaWidth+"px";e.style.height=ScrollAreaHeight+"px";e.style.left=parseInt(ScreenWidth/2-ScrollAreaWidth/2)+"px";ControlBar.style.top=(ScreenHeight-ControlBarHeight)+"px";var c=ScrollAreaWidth/ScrollAreaHeight;var d;switch(getOrientation()){case"vertical":d=pageWidth_1X/pageHeight_1Y;MaxPageWidth=pageWidth_2X;break;case"horizontal":d=pageWidth_1X*2/pageHeight_1Y;MaxPageWidth=pageWidth_2X*2;break}if(MaxPageWidth<ScrollAreaWidth){MaxPageWidth=ScrollAreaWidth*2}var b=ScrollAreaHeight-10;var a=b*d;if(a>ScrollAreaWidth){a=ScrollAreaWidth-10;b=a/d}DefaultPageWidth=parseInt(a);DefaultPageHeight=parseInt(b);MinPageWidth=parseInt(a);initializePageImageLayout();if(!CfgDebugConsole){setTimeout(function(){hideAddressBar()},100)}}function hideAddressBar(){if(!PImage.pageImage.complete){setTimeout(function(){hideAddressBar()},100)}else{window.scrollTo(0,1)}}function initializePageImageLayout(){var a=DefaultPageWidth;var b=DefaultPageHeight;PImage.setWidth(a);PImage.setPos(parseInt((ScrollAreaWidth-a)/2),parseInt((ScrollAreaHeight-b)/2));PImage2.setWidth(a)}function initializeThumbnailViewGeometry(){initializeScreenSizeVariables();ScrollAreaWidth=ScreenWidth;ScrollAreaHeight=ScreenHeight;initializeThumbnailSizeVariables();document.body.style.width=ScreenWidth+"px";document.body.style.height=(ScreenHeight+100)+"px";var d=document.getElementById("ThumbScrollArea");d.style.top="0px";d.style.left="0px";d.style.width=ScrollAreaWidth+"px";d.style.height=ScrollAreaHeight+"px";ThumbHeight=parseInt(pageHeight_1Y*ThumbWidth/pageWidth_1X)+ThumbPageNumberHeight;ThumbCols=parseInt(ScreenWidth/(ThumbWidth+ThumbHMargin));ThumbRows=parseInt(ScreenHeight/(ThumbHeight+ThumbVMargin))+2;ThumbLastRow=Math.ceil(lastPage/ThumbCols)-1;cleanupThumbnail();for(var b=0;b<ThumbRows;b++){ThumbImages.push([]);for(var e=0;e<ThumbCols;e++){var a=new ThumbImage(pageWidth_1X,pageHeight_1Y);a.setWidth(ThumbWidth);a.setHeight(ThumbHeight);document.getElementById("ThumbScrollArea").appendChild(a.getDOMNode());a.onClick=function(){if(TID_dragThumb){clearTimeout(TID_dragThumb);TID_dragThumb=null}var c=this;if(TID_transitionToCatalog){clearTimeout(TID_transitionToCatalog)}TID_transitionToCatalog=setTimeout(function(){TID_transitionToCatalog=null;setMode("catalog");GotoPage(c.currentPage)},500)};ThumbImages[b].push(a)}}ThumbScrollY=0;ThumbLastStartPage=null;updateThumbnailView();if(!CfgDebugConsole){setTimeout(function(){window.scrollTo(0,1)},100)}}function cleanupThumbnail(){for(var a=0;a<ThumbImages.length;a++){if(!ThumbImages[a].length){continue}for(var b=0;b<ThumbImages[a].length;b++){document.getElementById("ThumbScrollArea").removeChild(ThumbImages[a][b].getDOMNode());delete ThumbImages[a][b].pageImage;delete ThumbImages[a][b]}}ThumbImages=[]}function buildLinkDataCache(){linkDataCache=new Array();if(typeof userLinkData!=="undefined"){var b=userLinkData;for(var d=0;d<b.length;d++){var e=b[d].split(" ");var c=parseInt(e[0]);if(typeof linkDataCache[c]=="undefined"){linkDataCache[c]=new Array()}var a=linkDataCache[c].length;linkDataCache[c][a]=e}}}function setMode(a){CurrentMode=a;switch(a){case"catalog":cleanupThumbnail();document.getElementById("ViewCatalog").style.display="block";document.getElementById("ViewThumbnail").style.display="none";Gesture.onDrag=function(c,b){onDrag(c,b)};Gesture.onTouchEnd=function(b){onTouchEnd(b)};Gesture.onGestureStart=function(b){onGestureStart(b)};Gesture.onGestureChange=function(c,b){onGestureChange(c,b)};Gesture.onGestureEnd=function(b){onGestureEnd(b)};Gesture.onDoubleClick=function(b){onDoubleClick(b)};initializeCatalogViewGeometry();break;case"thumbnail":document.getElementById("ViewCatalog").style.display="none";document.getElementById("ViewThumbnail").style.display="block";Gesture.onDrag=function(c,b){onDragThumbnailView(c,b)};Gesture.onTouchEnd=null;Gesture.onGestureStart=null;Gesture.onGestureChange=null;Gesture.onGestureEnd=null;Gesture.onDoubleClick=null;initializeThumbnailViewGeometry();break}}function onInitialize(){if(!FeatureSmartPhone){location.href="unsupported.html"}document.title=Lang.WindowTitle;var b=getParam("pg");setCurrentPage(b!==null?parseInt(b)+modifiedPage:1);UpdatePageNumber();ScrollLayer=document.getElementById("ScrollLayer");ControlBar=document.getElementById("ControlBar");if(!FeatureMobileSafariLink){userLinkData=[]}buildLinkDataCache();PImageSingle=new PageImage(pageWidth_1X,pageHeight_1Y,pageWidth_2X,pageHeight_2Y);PImageSingle.getDOMNode().addEventListener("webkitTransitionEnd",function(c){onPImageTransitionEnd(c)},false);PImageDouble=new PageImageDouble(pageWidth_1X,pageHeight_1Y,pageWidth_2X,pageHeight_2Y);PImageDouble.getDOMNode().addEventListener("webkitTransitionEnd",function(c){onPImageTransitionEnd(c)},false);PImageSingle2=new PageImage(pageWidth_1X,pageHeight_1Y,pageWidth_2X,pageHeight_2Y);PImageSingle2.getDOMNode().addEventListener("webkitTransitionEnd",function(c){onPImageTransitionEnd(c)},false);PImageDouble2=new PageImageDouble(pageWidth_1X,pageHeight_1Y,pageWidth_2X,pageHeight_2Y);PImageDouble2.getDOMNode().addEventListener("webkitTransitionEnd",function(c){onPImageTransitionEnd(c)},false);switch(getOrientation()){case"vertical":PImage=PImageSingle;PImage2=PImageSingle2;break;case"horizontal":PImage=PImageDouble;PImage2=PImageDouble2;break}ScrollLayer.appendChild(PImage.getDOMNode());PImage2.hide();ScrollLayer.appendChild(PImage2.getDOMNode());window.addEventListener("orientationchange",onOrientationChange,false);ScrollLayer.addEventListener("webkitTransitionEnd",function(c){onScrollLayerTransitionEnd(c)},false);Gesture=new GestureManager;setMode("catalog");PImage.viewPage(CurrentPage);PImage.showLink();var a=getPageStep();if(CurrentPage+a>=firstPage&&CurrentPage+a<=lastPage){PImage2.viewPage(CurrentPage+a)}EBUtil.notifyAction("v","pg="+CurrentPage)}var ImageCachesMaxLength=1;var ImageCaches=[];var ImageCachesNextIndex=0;function cachePageImage(b){if(b<firstPage||b>lastPage){return}while(ImageCaches.length<ImageCachesMaxLength){var a=new Image;ImageCaches.push(a)}ImageCaches[ImageCachesNextIndex].src="../images/"+b+".jpg";ImageCachesNexIndex++;if(ImageCachesNexIndex>=ImagesCaches.length){ImageCachesNexIndex=0}}function UpdatePageNumber(){var a=CurrentPage-modifiedPage;if(a<0){a=0}var b=lastPage-modifiedPage;document.getElementById("PageNumber").innerHTML=a+"/"+b}function GotoPage(a){setCurrentPage(a);UpdatePageNumber();PImage.viewPage(CurrentPage);initializePageImageLayout();EBUtil.notifyAction("v","pg="+CurrentPage)}function toRightPage(){if(InTransition){return false}var a=getPageStep();if(IsLeftTemplate){if(CurrentPage+a>lastPage){return false}setCurrentPage(CurrentPage+a)}else{if(CurrentPage-a<firstPage){return false}setCurrentPage(CurrentPage-a)}UpdatePageNumber();InTransition="ToRightScroll";PImage.setLightWeightMode(true);PImage2.setLightWeightMode(true);if(PImage2.getCurrentPage()!==CurrentPage){PImage2.viewPage(CurrentPage)}PImage2.setWidth(PImage.getWidth());PImage2.setPos(ScrollAreaWidth+(ScrollAreaWidth-PImage.getWidth())/2,(ScrollAreaHeight-PImage.getHeight())/2);PImage2.show();PImage2.hideLink();ScrollLayer.className="scrollTransition";ScrollLayer.style.left=-ScrollAreaWidth+"px";EBUtil.notifyAction("v","pg="+CurrentPage);return true}function toLeftPage(){if(InTransition){return false}var a=getPageStep();if(IsLeftTemplate){if(CurrentPage-a<firstPage){return false}setCurrentPage(CurrentPage-a)}else{if(CurrentPage+a>lastPage){return false}setCurrentPage(CurrentPage+a)}UpdatePageNumber();InTransition="ToLeftScroll";PImage.setLightWeightMode(true);PImage2.setLightWeightMode(true);if(PImage2.getCurrentPage()!==CurrentPage){PImage2.viewPage(CurrentPage)}PImage2.setWidth(PImage.getWidth());PImage2.setPos(-ScrollAreaWidth+(ScrollAreaWidth-PImage.getWidth())/2,(ScrollAreaHeight-PImage.getHeight())/2);PImage2.show();PImage2.hideLink();ScrollLayer.className="scrollTransition";ScrollLayer.style.left=ScrollAreaWidth+"px";EBUtil.notifyAction("v","pg="+CurrentPage);return true}function tryToTurnPage(){if(InTransition){return false}if(CfgDisableTurnPageInZoom&&PImage.getScale()!=1){return false}var b=PImage.getX();var c=PImage.getWidth();if(PImage.getWidth()<ScrollAreaWidth){var b=PImage.getX()+PImage.getWidth()/2;var a=ScrollAreaWidth/2;var d=1;if(b>a+d){if(toLeftPage()){return true}}else{if(b<a-d){if(toRightPage()){return true}}}}else{if(PImage.getX()>ScrollAreaWidth/3){if(toLeftPage()){return true}}else{if(PImage.getX()+PImage.getWidth()<ScrollAreaWidth*2/3){if(toRightPage()){return true}}}}return false}function normalizePagePos(){if(InTransition){return}var i=PImage.getX();var h=PImage.getY();var g=PImage.getWidth()*PImage.getScale();var b=PImage.getHeight()*PImage.getScale();var a=false;if(g<MinPageWidth){g=MinPageWidth;b=parseInt(g*PImage.getHeight()/PImage.getWidth());a=true}else{if(g>MaxPageWidth){g=MaxPageWidth;b=parseInt(g*PImage.getHeight()/PImage.getWidth());a=true}}if(a){var e=PImage.getWidth()*PImage.getScale();var j=g/e;var f=ScreenWidth/2-PImage.getX();var d=ScreenHeight/2-PImage.getY();i=i+f-f*j;h=h+d-d*j}if(b<ScrollAreaHeight){h=(ScrollAreaHeight-b)/2}else{if(h>0){h=0}else{if(h+b<ScrollAreaHeight){h=ScrollAreaHeight-b}}}h=parseInt(h);if(g<ScrollAreaWidth){i=(ScrollAreaWidth-g)/2}else{if(i>0){i=0}else{if(i+g<ScrollAreaWidth){i=ScrollAreaWidth-g}}}i=parseInt(i);if(i!=PImage.getX()||h!=PImage.getY()||a){var c=g/PImage.getWidth();PImage.hideLink();InTransition="Normalize";PImage.getDOMNode().className="Page zoomInOutTransition";PImage.setPosAndScale(i,h,c)}}function GotoLink(j,f,h,d){var b="LinkWindow";if(j=="L"){var a=f;if(AutoAdditionBookKey&&BookKey){a+="&key="+BookKey}WO=window.open(a,"newlink","left=0, top=0, directories=yes, status=yes, location=yes, menubar=yes, scrollbars=yes, resizable=yes, toolbar=yes, fullscreen=no");WO.focus();var e=new RegExp(/[?&]id=([^&]+)/);if(f.match(e)){EBUtil.notifyAction("l","pg="+h+"&id="+RegExp.$1)}}else{if(j=="E"){var a=f;if(AutoAdditionBookKey&&BookKey){a+="&key="+BookKey}var c=1015;var k=700;if(d){var g=d.split("x");c=g[0];k=g[1]}WO=window.open(a,"catalog","left=0, top=0, width="+c+", height="+k+", directories=no, status=no, location=no, menubar=no, scrollbars=no, resizable=no, toolbar=no");WO.focus();var e=new RegExp(/[?&]id=([^&]+)/);if(f.match(e)){EBUtil.notifyAction("l","pg="+h+"&id="+RegExp.$1)}}else{if(j=="G"){var g=f.split(",");var i=parseInt(g[0]);var e=new RegExp(/,id=([^,]+)/);if(f.match(e)){EBUtil.notifyAction("l","pg="+h+"&id="+RegExp.$1)}GotoPage(parseInt(i)+parseInt(modifiedPage))}else{if(j=="M"){}}}}}var TID_drag=null;var goalX;var goalY;function onDrag(b,a){if(InTransition){return}if(!TID_drag){TID_drag=setTimeout(function(){onTimerDrag()},10);goalX=PImage.getX();goalY=PImage.getY()}if(!CfgUpDownDrag){if(PImage.getScale()==1){a.diffY=0}}goalX+=a.diffX;goalY+=a.diffY}function onTimerDrag(){var a=PImage.getX();var c=PImage.getY();if(Math.pow(goalX-a,2)+Math.pow(goalY-c,2)<10){PImage.setPos(goalX,goalY);TID_drag=null}else{var b=0.9;a=a+(goalX-a)*b;c=c+(goalY-c)*b;PImage.setPos(parseInt(a),parseInt(c));TID_drag=setTimeout(function(){onTimerDrag()},10)}}function onTouchEnd(a){if(!CfgDebugConsole){window.scrollTo(0,1)}if(InTransition){return}if(TID_drag){clearTimeout(TID_drag);TID_drag=null}if(!tryToTurnPage()){normalizePagePos()}}var zoomWork;var inGesture=false;function onGestureStart(a){zoomWork={startWidth:parseInt(PImage.getWidth()*PImage.getScale()),startHeight:parseInt(PImage.getHeight()*PImage.getScale()),startX:PImage.getX(),startY:PImage.getY(),cx:null,cy:null,distance:null,goalWidth:null,lastZoom:0,};PImage.hideLink();inGesture=true}function onGestureChange(b,d){if(InTransition&&InTransition!="Zoom"){return}if(b.scale!=1){var g=b.scale;if(zoomWork.cx===null){zoomWork.cx=d.centerX;zoomWork.cy=d.centerY;zoomWork.distance=d.pinchDistance}g=d.pinchDistance/zoomWork.distance;if(g>1){var a=10;g=1+(g-1)*a}else{var c=1.1;g=(1/(c-g)-1/c)/(1/(c-1)-1/c)}var i=parseInt(zoomWork.startWidth*g);if(i<MinPageWidth*0.8){i=parseInt(MinPageWidth*0.8)}else{if(i>MaxPageWidth*1.05){i=parseInt(MaxPageWidth*1.05)}}var e=i/PImage.getWidth();e=e.toFixed(3);if(e!=PImage.getScale()){InTransition="Zoom";PImage.getDOMNode().className="Page zoomInOutTransition";var h=zoomWork.cx-zoomWork.startX;var f=zoomWork.cy-zoomWork.startY;var l=i/zoomWork.startWidth;var k=zoomWork.startX+h-h*l;var j=zoomWork.startY+f-f*l;PImage.setPosAndScale(k,j,e)}}}function onGestureEnd(a){if(!InTransition){normalizePagePos()}PImage.setLightWeightMode(false);PImage.showLink();inGesture=false}function switchPImage(){if(PImage){ScrollLayer.removeChild(PImage.getDOMNode())}if(PImage2){ScrollLayer.removeChild(PImage2.getDOMNode())}switch(getOrientation()){case"vertical":PImage=PImageSingle;PImage2=PImageSingle2;break;case"horizontal":PImage=PImageDouble;PImage2=PImageDouble2;break}PImage.show();ScrollLayer.appendChild(PImage.getDOMNode());PImage2.hide();ScrollLayer.appendChild(PImage2.getDOMNode());PImage.viewPage(CurrentPage);PImage.showLink();var a=getPageStep();if(CurrentPage+a>=firstPage&&CurrentPage+a<=lastPage){PImage2.viewPage(CurrentPage+a)}}function onOrientationChange(a){setCurrentPage(CurrentPage);UpdatePageNumber();switchPImage();switch(CurrentMode){case"catalog":initializeCatalogViewGeometry();break;case"thumbnail":initializeThumbnailViewGeometry();break}}function onLoadImage(a){}function onPImageTransitionEnd(a){PImage.getDOMNode().className="Page";PImage.setLightWeightMode(false);PImage.showLink();switch(InTransition){case"DoubleClick":if(a.propertyName!="-webkit-transform"){break}setTimeout(function(){normalizePagePos()},10);InTransition=null;break;case"Normalize":if(a.propertyName!="-webkit-transform"){break}InTransition=null;break;case"Zoom":if(a.propertyName!="-webkit-transform"){break}if(!inGesture){setTimeout(function(){normalizePagePos()},10)}InTransition=null;break}a.stopPropagation()}function onScrollLayerTransitionEnd(d){var e=InTransition;InTransition=null;ScrollLayer.className="";ScrollLayer.style.left="0px";PImage.hide();PImage2.setPos((ScrollAreaWidth-PImage2.getWidth())/2,(ScrollAreaHeight-PImage2.getHeight())/2);PImage2.showLink();PImage2.setLightWeightMode(false);var b=PImage;PImage=PImage2;PImage2=b;PImage2.clearPage();var c=getPageStep();var a;switch(e){case"ToRightScroll":a=IsLeftTemplate?CurrentPage+c:CurrentPage-c;break;case"ToLeftScroll":a=IsLeftTemplate?CurrentPage-c:CurrentPage+c;break}if(a>=firstPage&&a<=lastPage){PImage2.viewPage(a)}}function onDoubleClick(c){var e=new Date;if(zoomWork&&e.getTime()-zoomWork.lastZoom<500){return}if(InTransition&&InTransition!="Normalize"){return}var b=c.touches[0].clientX;var a=c.touches[0].clientY;var i=b-PImage.getX();var h=a-PImage.getY();var f;var d;var g;var k;var j;if(PImage.getScale()==1){d=MaxPageWidth;f=d/PImage.getWidth();g=d/PImage.getWidth()*PImage.getScale();k=b-i*g;j=a-h*g;EBUtil.notifyAction("vz","pg="+CurrentPage)}else{d=DefaultPageWidth;f=1;k=parseInt((ScrollAreaWidth-PImage.getWidth())/2);j=parseInt((ScrollAreaHeight-PImage.getHeight())/2)}InTransition="DoubleClick";PImage.hideLink();PImage.getDOMNode().className="Page zoomInOutTransition";PImage.setPosAndScale(k,j,f)}function onClickThumbnail(){setMode("thumbnail")}var TID_dragThumb=null;var goalThumbScrollY;function onDragThumbnailView(c,b){if((ThumbLastRow+1)*(ThumbHeight+ThumbVMargin)<ScreenHeight){return}if(!TID_dragThumb){TID_dragThumb=setTimeout(function(){onTimerDragThumbnailView()},10);goalThumbScrollY=ThumbScrollY}goalThumbScrollY-=b.diffY;if(goalThumbScrollY<-20){goalThumbScrollY=-20}var a=(ThumbLastRow+1)*(ThumbHeight+ThumbVMargin)-ScreenHeight+20;if(goalThumbScrollY>a){goalThumbScrollY=a}}function onTimerDragThumbnailView(){if(CurrentMode!="thumbnail"){TID_dragThumb=null;return}var b=ThumbScrollY;if(Math.abs(goalThumbScrollY-b)<10){ThumbScrollY=goalThumbScrollY;updateThumbnailView();TID_dragThumb=null}else{var a=0.25;ThumbScrollY=b+(goalThumbScrollY-b)*a;updateThumbnailView();TID_dragThumb=setTimeout(function(){onTimerDragThumbnailView()},10)}}var ThumbLastStartPage=null;function updateThumbnailView(){var g=parseInt(ThumbScrollY/(ThumbHeight+ThumbVMargin));var d=firstPage+g*ThumbCols;var i=ThumbScrollY%(ThumbHeight+ThumbVMargin);var b=false;var m;if(ThumbLastStartPage===null||ThumbLastStartPage!=d){b=true;m=d>ThumbLastStartPage?true:false;ThumbLastStartPage=d}var f=(ThumbWidth+ThumbHMargin)*ThumbCols-ThumbHMargin;var h=parseInt((ScreenWidth-f)/2);var k=d;if(b){if(m){var l=k-modifiedPage;for(var a=0;a<ThumbRows;a++){if(ThumbImages[a][0].getPageNumber()!=l){for(var e=a+1;e<ThumbRows;e++){if(ThumbImages[e][0].getPageNumber()==l){var j=ThumbImages[a];ThumbImages[a]=ThumbImages[e];ThumbImages[e]=j}}}l+=ThumbCols}}else{var l=k-modifiedPage+(ThumbRows-1)*ThumbCols;for(var a=ThumbRows-1;a>=0;a--){if(ThumbImages[a][0].getPageNumber()!=l){for(var e=a-1;e>=0;e--){if(ThumbImages[e][0].getPageNumber()==l){var j=ThumbImages[a];ThumbImages[a]=ThumbImages[e];ThumbImages[e]=j}}}l-=ThumbCols}}}for(var a=0;a<ThumbRows;a++){for(var n=0;n<ThumbCols;n++){if(b){if(k>=firstPage&&k<=lastPage){if(ThumbImages[a][n].getPageNumber()!=k){ThumbImages[a][n].viewPage(k);ThumbImages[a][n].setPageNumber(k-modifiedPage);ThumbImages[a][n].show()}}else{ThumbImages[a][n].hide()}}ThumbImages[a][n].setPos((ThumbWidth+ThumbHMargin)*n+h,(ThumbHeight+ThumbVMargin)*a-i);k++}}};