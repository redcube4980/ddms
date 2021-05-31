/*! $Id: easybook.js 245 2014-01-10 04:25:54Z tomita $ */
function PageImage(a,b){var c=this;this.loaded=false;this.dispWidth=0;this.dispHeight=0;this.geoWidth=a;this.geoHeight=b;this.lastMouseDown=0;this.lastSrc=null;EBUtil.importListenerMechanism(this,"listeners");this.listeners.onclick=new EBUtil.ListenerList;this.listeners.onmousedown=new EBUtil.ListenerList;this.listeners.onmouseup=new EBUtil.ListenerList;this.listeners.onload=new EBUtil.ListenerList;this.container=document.createElement("div");this.pageImage=null;this.cover=null;this._buildNode();this.container.style.cssText="position:absolute;top:0px;left:0px;";this.container.onmouseup=function(d){c._onMouseUp(d)};this.container.onmouseup=function(d){c._onMouseUp(d)};this.container.onmousedown=function(d){c._onMouseDown(d);return false};this.pageImage.onload=function(){c._onLoad()};this.setWidth(300)}PageImage.prototype.setGeometry=function(a,b){this.geoWidth=a;this.geoHeight=b;this.setWidth(this.getWidth())};PageImage.prototype.setPos=function(a,b){this.container.style.left=parseInt(a,10)+"px";this.container.style.top=parseInt(b,10)+"px"};PageImage.prototype.getPosX=function(){return parseInt(this.container.style.left,10)};PageImage.prototype.getPosY=function(){return parseInt(this.container.style.top,10)};PageImage.prototype.setWidth=function(a){this.dispWidth=parseInt(a,10);this.dispHeight=parseInt(this.geoHeight*this.dispWidth/this.geoWidth);this.pageImage.style.width=this.dispWidth+"px";this.pageImage.style.height=this.dispHeight+"px";this.container.style.width=this.dispWidth+"px";this.container.style.height=this.dispHeight+"px"};PageImage.prototype.getWidth=function(){return this.dispWidth};PageImage.prototype.getHeight=function(){return this.dispHeight};PageImage.prototype.setWidth2=function(a){this.pageImage.style.width=a+"px";this.container.style.width=a+"px"};PageImage.prototype.load=function(a){if(this.lastSrc==a){if(this.loaded){this.listeners.onload.invoke()}return}this.lastSrc=a;this.loaded=false;this.pageImage.src=a};PageImage.prototype.isLoaded=function(){return this.loaded};PageImage.prototype.containerNode=function(){return this.container};PageImage.prototype._onLoad=function(){this.loaded=true;this.listeners.onload.invoke()};PageImage.prototype._onMouseUp=function(b){var c=b||window.event;var d={x:EBUtil.layerX(c),y:EBUtil.layerY(c)};this.listeners.onmouseup.invoke(c,d);var a=new Date();if(a.getTime()-this.lastMouseDown<500){this.listeners.onclick.invoke(c,d)}};PageImage.prototype._onMouseDown=function(b){var c=b||window.event;var a=new Date();this.lastMouseDown=a.getTime();var d={x:EBUtil.layerX(c),y:EBUtil.layerY(c)};this.listeners.onmousedown.invoke(c,d)};PageImage.prototype._buildNode=function(){var b=this;var a;while(this.container.childNodes.length){this.container.removeChild(this.container.childNodes[0])}this.pageImage=document.createElement("img");this.container.appendChild(this.pageImage);this.cover=document.createElement("div");this.cover.style.cssText="position:absolute;top:0px;left:0px;width:100%;height:100%;";this.container.appendChild(this.cover)};function PageSliceImage(a,b){var c=this;this.loaded=false;this.loadedNum=0;this.dispWidth=0;this.dispHeight=0;this.geoWidth=a;this.geoHeight=b;this.lastMouseDown=0;this.sliceNumber=1;this.lastSrc=null;this.overWrap=false;EBUtil.importListenerMechanism(this,"listeners");this.listeners.onclick=new EBUtil.ListenerList;this.listeners.onmousedown=new EBUtil.ListenerList;this.listeners.onmouseup=new EBUtil.ListenerList;this.listeners.onload=new EBUtil.ListenerList;this.container=document.createElement("div");this.pageImages=[];this.cover=null;this._buildNode();this.container.style.cssText="position:absolute;top:0px;left:0px;";this.container.onmouseup=function(d){c._onMouseUp(d)};this.container.onmousedown=function(d){c._onMouseDown(d)};this.setWidth(300)}PageSliceImage.prototype.setGeometry=function(a,b){this.geoWidth=a;this.geoHeight=b;this.setWidth(this.getWidth())};PageSliceImage.prototype.setPos=function(a,b){this.container.style.left=parseInt(a,10)+"px";this.container.style.top=parseInt(b,10)+"px"};PageSliceImage.prototype.getPosX=function(){return parseInt(this.container.style.left,10)};PageSliceImage.prototype.getPosY=function(){return parseInt(this.container.style.top,10)};PageSliceImage.prototype.setWidth=function(b){this.dispWidth=parseInt(b,10);var c=(this.geoHeight/this.sliceNumber)/this.geoWidth;var a=parseInt(this.dispWidth*c,10);this.dispHeight=a*this.sliceNumber;for(i=0;i<this.sliceNumber;i++){this.pageImages[i].style.width=this.dispWidth+"px";this.pageImages[i].style.height=a+"px";if(this.overWrap){this.pageImages[i].style.top=(a-0.8)*i+"px"}else{this.pageImages[i].style.top=a*i+"px"}}this.container.style.width=this.dispWidth+"px";this.container.style.height=this.dispHeight+"px"};PageSliceImage.prototype.getWidth=function(){return this.dispWidth};PageSliceImage.prototype.getHeight=function(){return this.dispHeight};PageSliceImage.prototype.setWidth2=function(a){for(i=0;i<this.sliceNumber;i++){this.pageImages[i].style.width=a+"px"}this.container.style.width=a+"px"};PageSliceImage.prototype.load=function(c){if(!c.match||!c.match(/^(.*)(\.[^.]+)$/)){return}var b=RegExp.$1;var a=RegExp.$2;if(this.lastSrc==c){if(this.loaded){this.listeners.onload.invoke()}return}this.lastSrc=c;this.loaded=false;this.loadedNum=0;for(i=0;i<this.sliceNumber;i++){this.pageImages[i].src=b+"-"+(i+1)+a}};PageSliceImage.prototype.isLoaded=function(){return this.loaded};PageSliceImage.prototype.containerNode=function(){return this.container};PageSliceImage.prototype._onLoad=function(){this.loadedNum++;if(this.loadedNum==this.sliceNumber){this.loaded=true;this.listeners.onload.invoke()}};PageSliceImage.prototype._onMouseUp=function(d){var f=d||window.event;var g={x:EBUtil.layerX(f),y:EBUtil.layerY(f)};if(f.srcElement&&typeof f.srcElement._idx!="undefined"){var c=(this.geoHeight/this.sliceNumber)/this.geoWidth;var b=parseInt(this.dispWidth*c,10);g.y=f.srcElement._idx*b+g.y}this.listeners.onmouseup.invoke(f,g);var a=new Date();if(a.getTime()-this.lastMouseDown<500){this.listeners.onclick.invoke(f,g)}};PageSliceImage.prototype._onMouseDown=function(d){var f=d||window.event;var a=new Date();this.lastMouseDown=a.getTime();var g={x:EBUtil.layerX(f),y:EBUtil.layerY(f)};if(f.srcElement&&typeof f.srcElement._idx!="undefined"){var c=(this.geoHeight/this.sliceNumber)/this.geoWidth;var b=parseInt(this.dispWidth*c,10);g.y=f.srcElement._idx*b+g.y}this.listeners.onmousedown.invoke(f,g)};PageSliceImage.prototype._buildNode=function(){var b=this;var a;while(this.container.childNodes.length){this.container.removeChild(this.container.childNodes[0])}this.pageImages=[];for(a=0;a<this.sliceNumber;a++){this.pageImages[a]=document.createElement("img");this.pageImages[a].style.cssText="position:absolute;top:0px;left:0px;";this.pageImages[a].onload=function(){b._onLoad()};this.pageImages[a]._idx=a;this.container.appendChild(this.pageImages[a])}this.cover=document.createElement("div");this.cover.style.cssText="position:absolute;top:0px;left:0px;width:100%;height:100%;";this.container.appendChild(this.cover)};PageSliceImage.prototype.setSliceNumber=function(a){this.sliceNumber=a;this._buildNode()};PageSliceImage.prototype.setOverWrapMode=function(a){this.overWrap=a;this.setWidth(this.getWidth())};function PageCompositeImage(a,b){var c=this;this.dispWidth=0;this.geoWidth=a;this.geoHeight=b;this.sliceNumber=1;this.normalWidthMax=100;this.pendingSliceImageSrc=null;this.sliceImageLoadStatus=0;this.forceNormalImage=false;EBUtil.importListenerMechanism(this,"listeners");this.listeners.onclick=new EBUtil.ListenerList;this.listeners.onmousedown=new EBUtil.ListenerList;this.listeners.onmouseup=new EBUtil.ListenerList;this.listeners.onload=new EBUtil.ListenerList;this.pageImage=null;this.pageSliceImage=null;this.container=document.createElement("div");this._buildNode();this.container.style.cssText="position:absolute;top:0px;left:0px;";this.setWidth(300)}PageCompositeImage.prototype.setGeometry=function(a,b){this.geoWidth=a;this.geoHeight=b;this.setWidth(this.getWidth())};PageCompositeImage.prototype.setPos=function(a,b){this.container.style.left=parseInt(a,10)+"px";this.container.style.top=parseInt(b,10)+"px"};PageCompositeImage.prototype.getPosX=function(){return parseInt(this.container.style.left,10)};PageCompositeImage.prototype.getPosY=function(){return parseInt(this.container.style.top,10)};PageCompositeImage.prototype.setWidth=function(a){this.dispWidth=parseInt(a,10);this.pageImage.setWidth(a);this.pageSliceImage.setWidth(a);if(!this.forceNormalImage&&this.dispWidth>=this.normalWidthMax&&this.sliceImageLoadStatus==0&&this.pendingSliceImageSrc){this.sliceImageLoadStatus=1;this.pageSliceImage.load(this.pendingSliceImageSrc)}this._updateLayer()};PageCompositeImage.prototype.getWidth=function(){return this.dispWidth};PageCompositeImage.prototype.getHeight=function(){if(this.dispWidth>=this.normalWidthMax){return this.pageSliceImage.getHeight()}else{return this.pageImage.getHeight()}};PageCompositeImage.prototype.setWidth2=function(a){this.pageImage.setWidth2(a);this.pageSliceImage.setWidth2(a)};PageCompositeImage.prototype.load=function(a){this.pageImage.load(a);if(this.forceNormalImage||this.dispWidth<this.normalWidthMax){this.pendingSliceImageSrc=a;this.sliceImageLoadStatus=0}else{this.sliceImageLoadStatus=1;this.pageSliceImage.load(a)}};PageCompositeImage.prototype.isLoaded=function(){return this.loaded};PageCompositeImage.prototype.containerNode=function(){return this.container};PageCompositeImage.prototype._onLoad=function(){this.loaded=true;this.listeners.onload.invoke()};PageCompositeImage.prototype._onClick=function(a,b){this.listeners.onclick.invoke(a,b)};PageCompositeImage.prototype._onMouseUp=function(a,b){this.listeners.onmouseup.invoke(a,b)};PageCompositeImage.prototype._onMouseDown=function(a,b){this.listeners.onmousedown.invoke(a,b)};PageCompositeImage.prototype.setSliceNumber=function(a){this.sliceNumber=a;this._buildNode()};PageCompositeImage.prototype.setNormalWidthMax=function(a){this.normalWidthMax=a};PageCompositeImage.prototype._buildNode=function(){var a=this;while(this.container.childNodes.length){this.container.removeChild(this.container.childNodes[0])}this.pageImage=new PageImage(this.geoWidth,this.geoHeight);this.pageSliceImage=new PageSliceImage(this.geoWidth,this.geoHeight);this.pageSliceImage.setSliceNumber(this.sliceNumber);this.pageImage.setWidth(this.dispWidth);this.pageSliceImage.setWidth(this.dispWidth);this.pageImage.addListener("onclick",function(b,c){a._onClick(b,c)});this.pageImage.addListener("onmouseup",function(b,c){a._onMouseUp(b,c)});this.pageImage.addListener("onmousedown",function(b,c){a._onMouseDown(b,c)});this.pageImage.addListener("onload",function(){a._onLoad()});this.pageSliceImage.addListener("onclick",function(b,c){a._onClick(b,c)});this.pageSliceImage.addListener("onmouseup",function(b,c){a._onMouseUp(b,c)});this.pageSliceImage.addListener("onmousedown",function(b,c){a._onMouseDown(b,c)});this.pageSliceImage.addListener("onload",function(){a.sliceImageLoadStatus=2;a._updateLayer()});this.container.appendChild(this.pageImage.containerNode());this.container.appendChild(this.pageSliceImage.containerNode());this._updateLayer()};PageCompositeImage.prototype._updateLayer=function(){if(this.forceNormalImage||this.dispWidth<this.normalWidthMax){this.pageImage.containerNode().style.display="block";this.pageSliceImage.containerNode().style.display="none"}else{if(this.sliceImageLoadStatus==2){this.pageImage.containerNode().style.display="none";this.pageSliceImage.containerNode().style.display="block"}else{this.pageImage.containerNode().style.display="block";this.pageSliceImage.containerNode().style.display="none"}}};PageCompositeImage.prototype.setForceNormalImage=function(a){this.forceNormalImage=a;if(!this.forceNormalImage&&this.dispWidth>=this.normalWidthMax&&this.sliceImageLoadStatus==0&&this.pendingSliceImageSrc){this.sliceImageLoadStatus=1;this.pageSliceImage.load(this.pendingSliceImageSrc)}this._updateLayer()};function EBook(){var b=this;this.leftTemplate=true;this.currentPage=0;this.dispWidth=0;this.inAnimation=false;this.pageGeometryWidth=300;this.pageGeometryHeight=400;this.firstPage=0;this.lastPage=0;this.caches=[new Image,new Image,new Image,new Image];this.cacheNext=0;EBUtil.importListenerMechanism(this,"listeners");this.listeners.onclick=new EBUtil.ListenerList;this.listeners.pagechange=new EBUtil.ListenerList;this.pageL=new PageImage(this.pageGeometryWidth,this.pageGeometryHeight);this.pageR=new PageImage(this.pageGeometryWidth,this.pageGeometryHeight);this.pageL2=new PageImage(this.pageGeometryWidth,this.pageGeometryHeight);this.pageR2=new PageImage(this.pageGeometryWidth,this.pageGeometryHeight);this.pageL.addListener("onclick",function(c,d){b._onClickPage(c,true,d)});this.pageR.addListener("onclick",function(c,d){b._onClickPage(c,false,d)});this.pageL2.addListener("onclick",function(c,d){b._onClickPage(c,true,d)});this.pageR2.addListener("onclick",function(c,d){b._onClickPage(c,false,d)});this.pageL.load("skinimage/s.gif");this.pageR.load("skinimage/s.gif");this.pageL2.load("skinimage/s.gif");this.pageR2.load("skinimage/s.gif");this.container=document.createElement("div");this.container.style.cssText="position:absolute;top:0px;left:0px;";this.layers=[];for(var a=0;a<this.LayersNum;a++){this.layers[a]=document.createElement("div")}for(a=0;a<this.layers.length;a++){this.container.appendChild(this.layers[a])}this.pageR.setPos(300,0);this.pageR2.setPos(300,0);this._putPageImage(this.FGPageLayerIdx,this.pageL);this._putPageImage(this.FGPageLayerIdx,this.pageR);this.setWidth(300)}EBook.prototype.AnimationInterval=1;EBook.prototype.AnimationStep=1;EBook.prototype.LayersNum=2;EBook.prototype.FGPageLayerIdx=1;EBook.prototype.BGPageLayerIdx=0;EBook.prototype.containerNode=function(){return this.container};EBook.prototype.setLeftTemplate=function(a){return this.leftTemplate=a};EBook.prototype.setFirstPage=function(a){return this.firstPage=a};EBook.prototype.setLastPage=function(a){return this.lastPage=a};EBook.prototype.setLayerVisible=function(a,b){this.layers[a].style.visibility=b?"visible":"hidden"};EBook.prototype.setPageGeometry=function(a,b){this.pageGeometryWidth=a;this.pageGeometryHeight=b;this.pageL.setGeometry(a,b);this.pageR.setGeometry(a,b);this.pageL2.setGeometry(a,b);this.pageR2.setGeometry(a,b)};EBook.prototype.setWidth=function(b){if(b<0){return}this.dispWidth=parseInt(b,10);var a=parseInt(this.dispWidth/2);this.pageL.setWidth(a);this.pageR.setWidth(a);this.pageR.setPos(a,0);this.pageL2.setWidth(a);this.pageR2.setWidth(a);this.pageR2.setPos(a,0)};EBook.prototype.getWidth=function(){return this.dispWidth};EBook.prototype.getHeight=function(){return this.pageL.getHeight()};EBook.prototype.setPos=function(a,b){this.container.style.left=a+"px";this.container.style.top=b+"px"};EBook.prototype.getPosX=function(){return parseInt(this.container.style.left,10)};EBook.prototype.getPosY=function(){return parseInt(this.container.style.top,10)};EBook.prototype.turnToRight=function(){var b=this;var a=this.currentPage+EBUtil.toRightStep(b.leftTemplate);if(a<this.firstPage||a>this.lastPage){return}if(this.inAnimation){return}this.inAnimation=true;this._startRightAnimation(function(){b.currentPage+=EBUtil.toRightStep(b.leftTemplate);b.inAnimation=false;b._preloadImage(b.currentPage+EBUtil.toRightStep(b.leftTemplate));b.listeners.pagechange.invoke()})};EBook.prototype.turnToLeft=function(){var b=this;var a=this.currentPage+EBUtil.toLeftStep(b.leftTemplate);if(a<this.firstPage||a>this.lastPage){return}if(this.inAnimation){return}this.inAnimation=true;this._startLeftAnimation(function(){b.currentPage+=EBUtil.toLeftStep(b.leftTemplate);b.inAnimation=false;b._preloadImage(b.currentPage+EBUtil.toLeftStep(b.leftTemplate));b.listeners.pagechange.invoke()})};EBook.prototype.turnToRightMost=function(){var a=this.leftTemplate?lastPage:firstPage;if((a&1)==0){a--}if(a==this.currentPage){return}this.currentPage=a+EBUtil.toLeftStep(this.leftTemplate,2);this.turnToRight()};EBook.prototype.turnToLeftMost=function(){var a=this.leftTemplate?firstPage:lastPage;if((a&1)==0){a--}if(a==this.currentPage){return}this.currentPage=a+EBUtil.toRightStep(this.leftTemplate,2);this.turnToLeft()};EBook.prototype.gotoPage=function(b){var a=this;if(b<this.firstPage||b>this.lastPage){return}if((b&1)==0){b--}if(b==this.currentPage){return}if(b<this.currentPage){this.currentPage=b+2;if(this.leftTemplate){this.turnToLeft()}else{this.turnToRight()}}else{this.currentPage=b-2;if(this.leftTemplate){this.turnToRight()}else{this.turnToLeft()}}};EBook.prototype._startRightAnimation=function(c){var d=this;var a=new Date;var b={status:1,page_width:d.pageR.getWidth(),oncomplete:typeof c!="undefined"?c:null,width:d.pageR.getWidth(),start_time:a.getTime(),dummy:null};this.pageR2.setPos(b.page_width,0);this.pageR2.setWidth2(b.page_width);this._putPageImage(this.BGPageLayerIdx,this.pageR2);if(this.leftTemplate){this.pageL2.load(EBUtil.imageUrl(this.currentPage+2));this.pageR2.load(EBUtil.imageUrl(this.currentPage+3))}else{this.pageL2.load(EBUtil.imageUrl(this.currentPage-1));this.pageR2.load(EBUtil.imageUrl(this.currentPage-2))}setTimeout(function(){d._toRightAnimationTimer(b)},this.AnimationInterval)};EBook.prototype._startLeftAnimation=function(c){var d=this;var a=new Date;var b={status:1,page_width:d.pageR.getWidth(),oncomplete:typeof c!="undefined"?c:null,width:d.pageR.getWidth(),start_time:a.getTime(),dummy:null};this.pageL2.setPos(0,0);this.pageL2.setWidth2(b.page_width);this._putPageImage(this.BGPageLayerIdx,this.pageL2);if(this.leftTemplate){this.pageL2.load(EBUtil.imageUrl(this.currentPage-2));this.pageR2.load(EBUtil.imageUrl(this.currentPage-1))}else{this.pageL2.load(EBUtil.imageUrl(this.currentPage+3));this.pageR2.load(EBUtil.imageUrl(this.currentPage+2))}setTimeout(function(){d._toLeftAnimationTimer(b)},this.AnimationInterval)};EBook.prototype._toRightAnimationTimer=function(a){var e=this;var c=this.AnimationInterval;switch(a.status){case 1:if(!this.pageL2.isLoaded()||!this.pageR2.isLoaded()){var b=new Date;if(b.getTime()-a.start_time>5000){a.status=2;break}c=100;break}a.status=2;case 2:var d=parseInt(a.page_width/this.AnimationStep);a.width=a.width-d;if(a.width<=0){this._removePageImage(this.pageR);a.width=0;this.pageL2.setWidth2(0);this.pageL2.setPos(a.page_width,0);this._putPageImage(this.FGPageLayerIdx,this.pageL2);a.status=3;break}this.pageR.setWidth2(a.width);break;case 3:var d=parseInt(a.page_width/this.AnimationStep);a.width=a.width+d;if(a.width>=a.page_width){this.pageL2.setWidth2(a.page_width);this.pageL2.setPos(0,0);this._removePageImage(this.pageL);this._putPageImage(this.FGPageLayerIdx,this.pageR2);this._swapPageImage();this.pageL2.load("skinimage/s.gif");this.pageR2.load("skinimage/s.gif");if(a.oncomplete){a.oncomplete()}return}this.pageL2.setWidth2(a.width);this.pageL2.setPos(a.page_width-a.width,0)}setTimeout(function(){e._toRightAnimationTimer(a)},c)};EBook.prototype._toLeftAnimationTimer=function(a){var e=this;var c=this.AnimationInterval;switch(a.status){case 1:if(!this.pageL2.isLoaded()||!this.pageR2.isLoaded()){var b=new Date;if(b.getTime()-a.start_time>5000){a.status=2;break}c=100;break}a.status=2;case 2:var d=parseInt(a.page_width/this.AnimationStep);a.width=a.width-d;if(a.width<=0){this._removePageImage(this.pageL);a.width=0;this.pageR2.setWidth2(0);this.pageR2.setPos(a.page_width,0);this._putPageImage(this.FGPageLayerIdx,this.pageR2);a.status=3;break}this.pageL.setWidth2(a.width);this.pageL.setPos(a.page_width-a.width,0);break;case 3:var d=parseInt(a.page_width/this.AnimationStep);a.width=a.width+d;if(a.width>=a.page_width){this.pageR2.setWidth2(a.page_width);this._removePageImage(this.pageR);this._putPageImage(this.FGPageLayerIdx,this.pageL2);this._swapPageImage();this.pageL2.load("skinimage/s.gif");this.pageR2.load("skinimage/s.gif");if(a.oncomplete){a.oncomplete()}return}this.pageR2.setWidth2(a.width)}setTimeout(function(){e._toLeftAnimationTimer(a)},c)};EBook.prototype.setCurrentPage=function(a){if((a&1)==0){a--}this.currentPage=a;if(this.leftTemplate){this.pageL.load(EBUtil.imageUrl(a));this.pageR.load(EBUtil.imageUrl(a+1))}else{this.pageL.load(EBUtil.imageUrl(a+1));this.pageR.load(EBUtil.imageUrl(a))}this.listeners.pagechange.invoke()};EBook.prototype.getCurrentPage=function(){return this.currentPage};EBook.prototype._onClickPage=function(b,a,f){var c=b||window.event;var d;if(c.button==2||c.button==3){d=false}else{d=true}this.listeners.onclick.invoke(a?0:1,d?0:1,f)};EBook.prototype._putPageImage=function(a,b){if(b.containerNode().parentNode){b.containerNode().parentNode.removeChild(b.containerNode())}this.layers[a].appendChild(b.containerNode())};EBook.prototype._removePageImage=function(a){if(a.containerNode().parentNode){a.containerNode().parentNode.removeChild(a.containerNode())}};EBook.prototype._swapPageImage=function(){var a;a=this.pageL;this.pageL=this.pageL2;this.pageL2=a;a=this.pageR;this.pageR=this.pageR2;this.pageR2=a};EBook.prototype._preloadImage=function(a){if(a>=this.firstPage&&a<=this.lastPage){this.caches[this.cacheNext].src=EBUtil.imageUrl(a)}this.cacheNext=(this.cacheNext+1)%this.caches.length;if(a+1>=this.firstPage&&a+1<=this.lastPage){this.caches[this.cacheNext].src=EBUtil.imageUrl(a+1)}this.cacheNext=(this.cacheNext+1)%this.caches.length};function EBookBorder(){this.x=0;this.y=0;this.width=0;this.height=0;this.geoTopHeight=8;this.geoLeftTopMarginTop=7;this.geoLeftTopWidth=8;this.geoLeftTopHeight=6;this.geoLeftWidth=8;this.geoLeftBottomWidth=8;this.geoLeftBottomHeight=8;this.geoRightTopMarginTop=7;this.geoRightTopWidth=8;this.geoRightTopHeight=6;this.geoRightWidth=8;this.geoRightBottomWidth=8;this.geoRightBottomHeight=8;this.geoBottomHeight=8;this.container=document.createElement("div");this.container.className="bookborder";this.container.style.cssText="position:absolute;top:0px;left:0px;";this.top=document.createElement("div");this.top.className="top";this.top.style.top="0px";this.top.style.left=this.geoLeftTopWidth+"px";this.top.style.height=this.geoTopHeight+"px";this.container.appendChild(this.top);this.lefttop=document.createElement("div");this.lefttop.className="lefttop";this.lefttop.style.top=this.geoLeftTopMarginTop+"px";this.lefttop.style.left="0px";this.lefttop.style.width=this.geoLeftTopWidth+"px";this.lefttop.style.height=this.geoLeftTopHeight+"px";this.container.appendChild(this.lefttop);this.left=document.createElement("div");this.left.className="left";this.left.style.top=this.geoLeftTopMarginTop+this.geoLeftTopHeight+"px";this.left.style.left="0px";this.left.style.width=this.geoLeftWidth+"px";this.container.appendChild(this.left);this.leftbottom=document.createElement("div");this.leftbottom.className="leftbottom";this.leftbottom.style.left="0px";this.leftbottom.style.width=this.geoLeftBottomWidth+"px";this.leftbottom.style.height=this.geoLeftBottomHeight+"px";this.container.appendChild(this.leftbottom);this.righttop=document.createElement("div");this.righttop.className="righttop";this.righttop.style.top=this.geoRightTopMarginTop+"px";this.righttop.style.width=this.geoRightTopWidth+"px";this.righttop.style.height=this.geoRightTopHeight+"px";this.container.appendChild(this.righttop);this.right=document.createElement("div");this.right.className="right";this.right.style.top=this.geoRightTopMarginTop+this.geoRightTopHeight+"px";this.right.style.width=this.geoRightWidth+"px";this.container.appendChild(this.right);this.rightbottom=document.createElement("div");this.rightbottom.className="rightbottom";this.rightbottom.style.width=this.geoRightBottomWidth+"px";this.rightbottom.style.height=this.geoRightBottomHeight+"px";this.container.appendChild(this.rightbottom);this.bottom=document.createElement("div");this.bottom.className="bottom";this.bottom.style.left=this.geoLeftBottomWidth+"px";this.bottom.style.height=this.geoBottomHeight+"px";this.container.appendChild(this.bottom);this.setPos(0,0);this.setSize(100,100)}EBookBorder.prototype.containerNode=function(){return this.container};EBookBorder.prototype.setSize=function(a,b){if(a<0||b<0){return}this.width=parseInt(a,10);this.height=parseInt(b,10);this._layout()};EBookBorder.prototype.getSize=function(){return[this.width,this.height]};EBookBorder.prototype.setPos=function(a,b){this.x=a;this.y=b;this.container.style.left=this.x-this.geoLeftWidth+"px";this.container.style.top=this.y-this.geoTopHeight+"px"};EBookBorder.prototype.getPosX=function(){return this.x};EBookBorder.prototype.getPosY=function(){return this.y};EBookBorder.prototype._layout=function(){this.top.style.width=this.width+"px";this.bottom.style.width=this.width+"px";var c=this.height-(this.geoLeftTopMarginTop+this.geoLeftTopHeight-this.geoTopHeight);this.left.style.height=c+"px";this.right.style.height=c+"px";var a=this.geoLeftTopMarginTop+this.geoLeftTopHeight+c;var b=this.geoLeftTopWidth+this.width;this.leftbottom.style.top=a+"px";this.righttop.style.left=b+"px";this.right.style.left=b+"px";this.rightbottom.style.top=a+"px";this.rightbottom.style.left=b+"px";this.bottom.style.top=a+"px"};function EBookCenterBorder(){var b=this;this.width=0;this.height=0;this.layoutedWidth;this.container=document.createElement("div");this.container.className="centerborder";this.container.style.cssText="position:absolute;top:0px;left:0px;";this.leftSide=document.createElement("div");this.leftSide.style.cssText="position:absolute;top:0px;left:0px;overflow:hidden;";this.container.appendChild(this.leftSide);this.rightSide=document.createElement("div");this.rightSide.style.cssText="position:absolute;top:0px;left:0px;overflow:hidden";this.container.appendChild(this.rightSide);EBUtil.importListenerMechanism(this,"listeners");this.listeners.onclick=new EBUtil.ListenerList;this.container.onclick=function(c){b._onClick(c)};var a=new EBUtil.Platform;if(!a.supportOpacity()&&a.supportDXFilter()){this._layout=this._layoutIE}else{this._layout=this._layoutStd}this.setPos(0,0);this.setSize(20,200)}EBookCenterBorder.prototype.LeftOpacityStart=CenterBorderLeftOpacityStart;EBookCenterBorder.prototype.LeftOpacityEnd=CenterBorderLeftOpacityEnd;EBookCenterBorder.prototype.RightOpacityStart=CenterBorderRightOpacityStart;EBookCenterBorder.prototype.RightOpacityEnd=CenterBorderRightOpacityEnd;EBookCenterBorder.prototype.containerNode=function(){return this.container};EBookCenterBorder.prototype.setSize=function(a,b){if(a<0||b<0){return}this.width=parseInt(a,10);this.height=parseInt(b,10);this._layout()};EBookCenterBorder.prototype.getSize=function(){return[this.width,this.height]};EBookCenterBorder.prototype.setPos=function(a,b){this.container.style.left=parseInt(a,10)+"px";this.container.style.top=parseInt(b,10)+"px"};EBookCenterBorder.prototype.getPosX=function(){return parseInt(this.container.style.left,10)};EBookCenterBorder.prototype.getPosY=function(){return parseInt(this.container.style.top,10)};EBookCenterBorder.prototype._layoutStd=function(){this.container.style.width=this.width+"px";this.container.style.height=this.height+"px";this.leftSide.style.height=this.height+"px";this.rightSide.style.height=this.height+"px";var c=parseInt(this.width/2);var d=parseInt(this.width/2);this.leftSide.style.width=c+"px";this.rightSide.style.left=parseInt(this.width/2)+"px";this.rightSide.style.width=d+"px";if(this.width!==this.layoutedWidth){this.layoutedWidth=this.width;this.leftSide.innerHTML="";this.rightSide.innerHTML="";var b=this.width<=20?1:parseInt(this.width/20);for(var a=0;a<c;a+=b){var e=document.createElement("div");e.style.cssText="position:absolute;top:0px;height:100%;background-color:#aaaaaa";e.style.left=a+"px";e.style.width=b+"px";e.style.backgroundImage="url(./skinimage/book/leftborder.gif)";e.style.backgroundPosition=-a+"px 0px";EBUtil.setOpacity(e,this.LeftOpacityStart+(this.LeftOpacityEnd-this.LeftOpacityStart)*a/(c-1));this.leftSide.appendChild(e)}for(var a=0;a<d;a+=b){var e=document.createElement("div");e.style.cssText="position:absolute;top:0px;height:100%;background-color:#aaaaaa";e.style.left=a+"px";e.style.width=b+"px";e.style.backgroundImage="url(./skinimage/book/rightborder.gif)";e.style.backgroundPosition=-a+"px 0px";EBUtil.setOpacity(e,this.RightOpacityStart+(this.RightOpacityEnd-this.RightOpacityStart)*a/(d-1));this.rightSide.appendChild(e)}}};EBookCenterBorder.prototype._layoutIE=function(){this.container.style.width=this.width+"px";this.container.style.height=this.height+"px";this.leftSide.style.height=this.height+"px";this.rightSide.style.height=this.height+"px";var a=parseInt(this.width/2);var b=parseInt(this.width/2);this.leftSide.style.width=a+"px";this.rightSide.style.left=parseInt(this.width/2)+"px";this.rightSide.style.width=b+"px";this.leftSide.style.backgroundColor="#aaaaaa";this.leftSide.style.filter="alpha(Opacity="+parseInt(this.LeftOpacityStart*100)+",FinishOpacity="+parseInt(this.LeftOpacityEnd*100)+",Style=1,StartX=0,FinishX=100,StartY=0,FinishY=0)";this.leftSide.style.backgroundImage="url(./skinimage/book/leftborder.gif)";this.rightSide.style.backgroundColor="#aaaaaa";this.rightSide.style.filter="alpha(Opacity="+parseInt(this.RightOpacityStart*100)+",FinishOpacity="+parseInt(this.RightOpacityEnd*100)+",Style=1,StartX=0,FinishX=100,StartY=0,FinishY=0)";this.rightSide.style.backgroundImage="url(./skinimage/book/rightborder.gif)"};EBookCenterBorder.prototype._onClick=function(a){var b=a||window.event;this.listeners.onclick.invoke(b)};function EBookLink(){this.width=0;this.height=0;this.links=[];this.container=document.createElement("div");this.container.style.cssText="position:absolute;top:0px;left:0px;";var b,c;var a=new EBUtil.Platform;if(!a.supportOpacity()&&a.supportDXFilter()){b=parseInt(LinkOpacityDefault*100);c=parseInt(LinkOpacityOverlay*100);this.opacityStyleText="filter:alpha(opacity="+b+");";this.eventHandlerText="    OnLoad=\"this.style.filter='alpha(opacity="+b+")'\"     OnMouseOver=\"this.style.filter='alpha(opacity="+c+")'\"     OnMouseOut=\"this.style.filter='alpha(opacity="+b+")'\" ";this.divInnerHtml='<table style="width:100%;height:100%; border-collapse:collapse;"><tr><td style="background-color:white;filter:alpha(opacity=0);"></td></tr></table>'}else{b=LinkOpacityDefault;c=LinkOpacityOverlay;this.opacityStyleText="opacity:"+b+";";this.eventHandlerText='    OnLoad="this.style.opacity='+b+'"     OnMouseOver="this.style.opacity='+c+'"     OnMouseOut="this.style.opacity='+b+'" ';this.divInnerHtml=""}this.setPos(0,0);this.setSize(100,100)}EBookLink.prototype.LinkColorMap={R:"#FF0000",G:"#00FF00",B:"#0000FF",C:"#00FFFF",M:"#FF00FF",Y:"#FFFF00",K:"#FFFFFF"};EBookLink.prototype.containerNode=function(){return this.container};EBookLink.prototype.setSize=function(a,b){if(a<0||b<0){return}this.width=parseInt(a,10);this.height=parseInt(b,10);this._update()};EBookLink.prototype.getSize=function(){return[this.width,this.height]};EBookLink.prototype.setPos=function(a,b){this.container.style.left=parseInt(a,10)+"px";this.container.style.top=parseInt(b,10)+"px"};EBookLink.prototype.getPosX=function(){return parseInt(this.container.style.left,10)};EBookLink.prototype.getPosY=function(){return parseInt(this.container.style.top,10)};EBookLink.prototype.clear=function(){this.links=[];this.container.innerHTML=""};EBookLink.prototype.setLink=function(a){this.links=this.links.concat(a);this._update()};EBookLink.prototype._linkColorType2Value=function(a){if(this.LinkColorMap[a]){return this.LinkColorMap[a]}return"#FFFFFF"};EBookLink.prototype._getMessage=function(a,b){var c="";if(a=="L"){c=Lang.LinkMessageForTypeL+b}else{if(a=="E"){c=Lang.LinkMessageForTypeL+b}else{if(a=="G"){if(b>0){c=Lang.LinkMessageForTypeG+b}else{c=Lang.LinkMessageForTypeG}}else{if(a=="M"){c=Lang.LinkMessageForTypeM+b}}}}return c};EBookLink.prototype._update=function(){var g="";var j=this.height/pageHeight_1Y;var c=this.width/pageWidth_1X;for(var f=0;f<this.links.length;f++){var k=this.links[f];var d=this._linkColorType2Value(k[7]);var b="";switch(LinkDrawType){case"Paint":default:b="background-color: "+d+";";break;case"Border":b="border: "+LinkBorderWidth+"px solid "+d+";background-color:rgba(0, 0, 0, 0);";break}var e=k[4]*c;var h=k[5]*j;if(LinkDrawType=="Border"){e-=LinkBorderWidth*2;h-=LinkBorderWidth*2;if(e<=0){e=1}if(h<=0){h=1}}var a=typeof k[8]=="undefined"?"":k[8];g+='<div style="position:absolute; left:'+k[2]*c+"px; top:"+k[3]*j+"px; width:"+e+"px; height:"+h+"px; cursor:pointer;"+this.opacityStyleText+" "+b+'visibility:visible;" title="'+this._getMessage(k[1],k[6])+'" '+this.eventHandlerText+"OnClick=\"gotoLink('"+k[1]+"' , '"+k[6]+"', "+k[0]+", '"+a+"')\">"+this.divInnerHtml+"</div>"}this.container.innerHTML=g};function EBookBookMark(){this.width=0;this.height=0;this.currentPage=0;this.bookmarks={};this.nodes={};this.bookmarkNum=0;this.leftTemplate=true;this.container=document.createElement("div");this.container.style.cssText="position:absolute;top:0px;left:0px;";this.setPos(0,0);this.setSize(100,100)}EBookBookMark.prototype.containerNode=function(){return this.container};EBookBookMark.prototype.setLeftTemplate=function(a){return this.leftTemplate=a};EBookBookMark.prototype.setSize=function(a,b){if(a<0||b<0){return}this.width=parseInt(a,10);this.height=parseInt(b,10);this._update()};EBookBookMark.prototype.getSize=function(){return[this.width,this.height]};EBookBookMark.prototype.setPos=function(a,b){this.container.style.left=parseInt(a,10)+"px";this.container.style.top=parseInt(b,10)+"px"};EBookBookMark.prototype.getPosX=function(){return parseInt(this.container.style.left,10)};EBookBookMark.prototype.getPosY=function(){return parseInt(this.container.style.top,10)};EBookBookMark.prototype.setCurrentPage=function(a){a=parseInt(a,10);if((a&1)==0){a--}this.currentPage=a;this._update()};EBookBookMark.prototype.getCurrentPage=function(){return this.currenPage};EBookBookMark.prototype.count=function(){return this.bookmarkNum};EBookBookMark.prototype.exists=function(a){a=parseInt(a,10);return this.bookmarks[a]?true:false};EBookBookMark.prototype.getPages=function(){var a=[];for(var b in this.bookmarks){a.push(b)}return a};EBookBookMark.prototype.clear=function(){this.container.innerHTML="";this.bookmarks={};this.nodes={};this.bookmarkNum=0;this._update()};EBookBookMark.prototype.add=function(b,a){b=parseInt(b,10);this.bookmarks[b]=a;if(!this.nodes[b]){this.nodes[b]=this._createBookMarkNode();this.container.appendChild(this.nodes[b]);this.nodes[b].onclick=function(){EZBook.gotoPage(b)};this.bookmarkNum++}this._update()};EBookBookMark.prototype.remove=function(a){a=parseInt(a,10);delete this.bookmarks[a];if(this.nodes[a]){this.container.removeChild(this.nodes[a]);delete this.nodes[a];this.bookmarkNum--}this._update()};EBookBookMark.prototype._update=function(){var h=90;var f=parseInt(h*0.4);var j=10;var c=5;var a=parseInt(this.height/this.bookmarkNum-c);if(a>40){a=40}var b=a+5;for(var g in this.bookmarks){var d=this.nodes[g];var e;if(this.currentPage>=g){e=this.leftTemplate?true:false}else{e=this.leftTemplate?false:true}if(e){d.style.textAlign="left";d.style.left=-f+"px";if(this.currentPage==g||this.currentPage+1==g){d.style.width=h+"px"}else{d.style.width=f+"px"}}else{d.style.textAlign="right";if(this.currentPage==g||this.currentPage+1==g){d.style.left=this.width-(h-f)+"px";d.style.width=h+"px"}else{d.style.left=this.width+"px";d.style.width=f+"px"}}d.style.top=j+"px";d.style.height=a+"px";d.innerHTML='<p style="line-height:'+a+'px;">'+this.bookmarks[g]+"</p>";j+=b}};EBookBookMark.prototype._createBookMarkNode=function(){var a=document.createElement("div");a.className="bookmarktab";return a};