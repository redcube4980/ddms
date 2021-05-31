/*! $Id: page_image.js 181 2012-12-04 09:32:36Z tomita $ */

var UseNormalImage = true;

function PageImage(img_w, img_h, img2_w, img2_h)
{
  this.pageImageWidth  = img_w;		// オリジナル画像のサイズ
  this.pageImageHeight = img_h;
  this.pageLargeImageWidth  = img2_w;	// オリジナル拡大画像のサイズ
  this.pageLargeImageHeight = img2_h;
  this.pageWidth  = img_w;		// 表示サイズ(等倍時)
  this.pageHeight = img_h;

  this.scale      = 1.0;
  this.ratio      = 1.0;	// pageWidthとpageImageWidthの比
  this.lightWeight = false;

  this.currentPage;
  this.visibleLink;
  this.loadSliceImages = false;
  this.loadCompleteSliceImages = false;

  this.containerNode = document.createElement("div");
  this.containerNode.className = "Page";
  this.containerNode.style.position = "absolute";
  this.containerNode.style.top  = "0px";
  this.containerNode.style.left = "0px";
  this.containerNode.style.width  = this.pageWidth + "px";
  this.containerNode.style.height = this.pageHeight + 20 + "px";
  this.containerNode.style.msTransformOrigin = "0px 0px 0";
  this.containerNode.style.msTransform = "translate3d(0px, 0px, 0px) scale(1.0)";

  var myObj = this;
  this.containerNode.addEventListener('mouseup',
			function (event) {myObj.onClickHandler(event)},
			false);


  // build DOM tree
  this.divPageImage = document.createElement("div");
  this.divPageImage.style.position = "absolute";
  this.divPageImage.style.overflow = "hidden";
  this.divPageImage.style.top  = "0px";
  this.divPageImage.style.left = "0px";
  this.divPageImage.style.msTransformOrigin  = "0px 0px 0";
  this.containerNode.appendChild(this.divPageImage);

  this._createDivPageImage();

  this.divSliceImages = document.createElement("div");
  this.divSliceImages.style.position = "absolute";
  this.divSliceImages.style.overflow = "hidden";
  this.divSliceImages.style.top  = "0px";
  this.divSliceImages.style.left = "0px";
  this.divSliceImages.style.msTransformOrigin = "0px 0px 0";
  this.containerNode.appendChild(this.divSliceImages);

  this._createDivSliceImages();

  this.divLinkLayer = document.createElement("div");
  this.containerNode.appendChild(this.divLinkLayer);
  this.divLinkLayer.style.position = "absolute";
  //this.divLinkLayer.style.overflow = "hidden";
  this.divLinkLayer.style.top  = "0px";
  this.divLinkLayer.style.left = "0px";

  this._showLayer(this.divPageImage);
  this._hideLayer(this.divSliceImages);
  //this.showLink();
}

PageImage.prototype._createDivPageImage = function () {
  this.pageImage = new Image;
  this.pageImage.style.backgroundColor = "#aaaaaa";
  this.pageImage.style.width = "auto";

  this.divPageImage.appendChild(this.pageImage);
}

PageImage.prototype._createDivSliceImages = function () {
  var myObj = this;

  this.sliceImages = [];
  for (var i = 0 ; i < 16 ; i++) {
    var img = new Image;
    img.style.width = "auto";
    img.onload = function () {
      for (var slot = 0 ; slot < myObj.sliceImages.length ; slot++) {
	if (!myObj.sliceImages[slot].complete)
	  return;
      }
      
      if (!myObj.loadCompleteSliceImages) {
	myObj.loadCompleteSliceImages = true;
	myObj.onLoadSliceImages();
      }
    }
    this.sliceImages.push(img);
  }

  while (this.divSliceImages.childNodes.length) {
    this.divSliceImages.removeChild(this.divSliceImages.childNodes[0]);
  }
  for (var i = 0 ; i < 16 ; i++) {
    this.divSliceImages.appendChild(this.sliceImages[i]);
  }

}

PageImage.prototype.getDOMNode = function () {
  return this.containerNode;
}

PageImage.prototype.setX = function (x) {
  this.setPos(x, this.getY());
}
PageImage.prototype.setY = function (y) {
  this.setPos(this.getX(), y);
}
PageImage.prototype.setPos = function (x, y) {
  var transform = this.containerNode.style.msTransform;
  transform = transform.replace(/translate3d\(.*?\)/,
				"translate3d(" + parseInt(x) + "px, " + parseInt(y) + "px, 0px)");
  this.containerNode.style.msTransform = transform;
}
PageImage.prototype.setPosAndScale = function (x, y, scale) {
  this.scale = parseFloat(scale).toFixed(3);
  this.containerNode.style.msTransform = "translate3d(" + parseInt(x) + "px, " + parseInt(y) + "px, 0px) scale(" + this.scale + ")";
}

PageImage.prototype.getX = function () {
  if (!this.containerNode.style.msTransform)
    return 0;
  if (this.containerNode.style.msTransform.match(/translate3d\(([0-9.-]+)px,\s*([0-9.-]+)px.*?\)/))
    return parseInt(RegExp.$1);
  return 0;
}
PageImage.prototype.getY = function () {
  if (!this.containerNode.style.msTransform)
    return 0;
  if (this.containerNode.style.msTransform.match(/translate3d\(([0-9.-]+)px,\s*([0-9.-]+)px.*?\)/))
    return parseInt(RegExp.$2);
  return 0;
}

PageImage.prototype.getImageWidth = function(){return this.pageImageWidth;}
PageImage.prototype.getImageHeight = function(){return this.pageImageHeight;}
PageImage.prototype.getWidth = function () {return this.pageWidth;}
PageImage.prototype.getHeight = function () {return this.pageHeight;}
PageImage.prototype.setWidth = function (w) {
  if (this.pageWidth == w)
    return;
  this.ratio = w / this.pageImageWidth;

  this.pageWidth  = w;
  this.pageHeight = this.ratio * this.pageImageHeight;

  this.containerNode.style.width  = this.pageWidth + "px";
  this.containerNode.style.height = this.pageHeight + "px";

  if (this.visibleLink)
    this.createPageLink();

  /*
   * pageImage.style.widthで画像表示サイズを指定すると、
   * コンテナをtranslate3d&scaleした場合に画像が粗くなる。
   * (pageImage.style.widthで縮小表示された画像を元にリサイズされるため。
   *  translate&scaleだとオリジナルの画像がリサイズされるため問題ない)
   * このため、scaleで表示サイズを指定する。
   */
  this.divPageImage.style.msTransform = "translate3d(0px, 0px, 0px) scale(" + this.ratio + ")";
  var r = pageWidth_2X / this.pageImageWidth;
  this.divSliceImages.style.msTransform = "translate3d(0px, 0px, 0px) scale(" + (this.ratio / r) + ")";

  this._updateImageLayer();
}

PageImage.prototype.viewPage = function (pg) {
  this.clearPage();
  this.currentPage = parseInt(pg, 10);
  if (UseNormalImage)
    this._loadImage(pg);
  if (this.visibleLink)
    this.createPageLink();
  this._updateImageLayer();
}

PageImage.prototype.clearPage = function () {
  this.currentPage = null;
  this.loadSliceImages = false;
  this.pageImage.src = "../image/s.gif";
  for (var i = 0 ; i < 16 ; i++) {
    this.sliceImages[i].src = "../image/s.gif";
  }
}

PageImage.prototype.getCurrentPage = function () {
  return this.currentPage;
}

PageImage.prototype.setLightWeightMode = function (mode) {
  var newMode = mode ? true :  false;
  /*
  if (this.lightWeight != newMode) {
    this.lightWeight = newMode;
    this._updateImageLayer();
  }
  */
  this.lightWeight = newMode;
  this._updateImageLayer();
}

PageImage.prototype.show = function () {
  this.containerNode.style.display = "block";
}
PageImage.prototype.hide = function () {
  this.containerNode.style.display = "none";
}

PageImage.prototype._showLayer = function (nd) {
  nd.style.visibility = "visible";
}
PageImage.prototype._hideLayer = function (nd) {
  nd.style.visibility = "hidden";
}

PageImage.prototype._loadImage = function (pg) {
  this.pageImage.src = "../images/" + pg + ".jpg";
}

PageImage.prototype._loadSliceImages = function (pg) {
  this.loadCompleteSliceImages = false;
  for (var i = 0 ; i < 16 ; i++) {
    this.sliceImages[i].src = "../images/" + pg + "-" + (i+1) + ".jpg";
  }
}

PageImage.prototype.imageLoadCompleted = function () {
  return this.pageImage.complete;
}

PageImage.prototype.getRatio = function () {
  return this.ratio;
}

// CSSによるリサイズ。
// 本メソッドでリサイズしてもgetWidth,Height()による
// サイズは変わらないようにする
PageImage.prototype.setScale = function (scale) {
  this.scale = scale;
  var transform = this.containerNode.style.msTransform;
  transform = transform.replace(/scale\(.*?\)/,
				"scale(" + this.scale + ")");
  this.containerNode.style.msTransform = transform;

  this._updateImageLayer();
}

PageImage.prototype.getScale = function () {
  return this.scale;
}


PageImage.prototype.createPageLink = function () {
  var pg = this.currentPage;

  var linkHtml = "";
  var adjLinkRatio = this.getWidth() / this.pageLargeImageWidth;

  if (typeof linkDataCache[pg] != "undefined") {
    var linkHtml = "";
    for (var i = 0 ; i < linkDataCache[pg].length ; i++) {
      linkHtml += this.createLink(linkDataCache[pg][i], 0, 0, adjLinkRatio);
    }
  }

  this.divLinkLayer.innerHTML = linkHtml;
}

PageImage.prototype.createLink = function (linkDataArray, offsetX, offsetY, adjLinkRatio) {
  var temp = linkDataArray[6].split(".");
  var ext = temp[temp.length - 1];

  var ratio = linkRatio;

  var opacity_style_str,event_handler_str;

  var alpha  = LinkOpacityDefaultMobileSafari;
  var alpha2 = alpha;
  opacity_style_str = "opacity:" + alpha + ";";
  event_handler_str =
    '    OnLoad="this.style.opacity=' + alpha + '" ' +
    '    OnMouseOver="this.style.opacity=' + alpha2 + '" ' +
    '    OnMouseOut="this.style.opacity=' + alpha + '" ' +
    '    OnMouseUp="event.stopPropagation()" ';

  var draw_style_str = "";
  var adj_width = 0;
  var adj_height = 0;
  switch (LinkDrawTypeMobileSafari) {
  case "Paint":
  default:
    draw_style_str = "background-color: " + LinkColorType2Value(linkDataArray[7]) + ";";
    break;
  case "Border":
    draw_style_str = "border: " + LinkBorderWidthMobileSafari + "px solid " + LinkColorType2Value(linkDataArray[7]) + ";background-color:rgba(0, 0, 0, 0);";
    adj_width  = LinkBorderWidthMobileSafari * 2;
    adj_height = LinkBorderWidthMobileSafari * 2;
    break;
  }

  var opt = typeof linkDataArray[8] == "undefined" ?
    "" : linkDataArray[8];

  var link_width = linkDataArray[4]*adjLinkRatio*ratio - adj_width;
  if (link_width <= 0)
    link_width = 1;
  var link_height = linkDataArray[5]*adjLinkRatio*ratio - adj_height;
  if (link_height <= 0)
    link_height = 1;

  var html = '<div '
  + 'style="position:absolute; '
  + 'left:' + (offsetX+linkDataArray[2]*adjLinkRatio*ratio) + 'px; '
  + 'top:' + (offsetY+linkDataArray[3]*adjLinkRatio*ratio) + 'px; '
  + 'width:' + link_width + 'px; '
  + 'height:' + link_height + 'px; '
  + 'cursor: pointer; '
  + opacity_style_str + ' '
  + draw_style_str
  + 'z-index:70; '
  + 'visibility:visible;" '
  + event_handler_str
  + 'OnClick="GotoLink(\'' + linkDataArray[1] + '\' , \'' + linkDataArray[6] + '\', ' + linkDataArray[0] + ', \'' + opt + '\')">'
  + '</div>';

  return html;
}

PageImage.prototype.showLink = function () {
  this.divLinkLayer.style.display = "block";
  this.visibleLink = true;
  this.createPageLink();
}

PageImage.prototype.hideLink = function () {
  this.divLinkLayer.style.display = "none";
  this.visibleLink = false;
}

PageImage.prototype.onLoadSliceImages = function () {
  this._updateImageLayer();
}

PageImage.prototype._updateImageLayer = function () {
  var new_w = this.pageWidth;
  var new_h = this.pageHeight;

  if (!UseNormalImage) {
    if (!this.loadSliceImages) {
      this._loadSliceImages(this.currentPage);
      this.loadSliceImages = true;
    }
    this._showLayer(this.divSliceImages);
    this._hideLayer(this.divPageImage);
    return;
  }

  if (this.lightWeight ||
      this.pageImageWidth > new_w * this.getScale()) {
    this._showLayer(this.divPageImage);
    this._hideLayer(this.divSliceImages);
  } else {
    if (!this.loadSliceImages) {
      this._loadSliceImages(this.currentPage);
      this.loadSliceImages = true;
    }
    // 読み込み完了しているなら通常画像->拡大画像に切り替え
    if (this.loadCompleteSliceImages) {
      this._showLayer(this.divSliceImages);
      this._showLayer(this.divPageImage);
    }
  }
}

PageImage.prototype.onClickHandler = function (event) {
  if (this.onClick)
    this.onClick(event);
}


function PageImageDouble(img_w, img_h, img2_w, img2_h)
{
  this.parent = PageImage;
  this.parent(img_w, img_h, img2_w, img2_h);  // Call super class's constructor

  this.pageWidth  = img_w * 2;		// 2ページ分の表示サイズ
  this.containerNode.style.width  = this.pageWidth + "px";

}
PageImageDouble.prototype = new PageImage();

PageImageDouble.prototype._createDivPageImage = function () {
  this.pageImage = new Image;
  this.pageImage.style.backgroundColor = "#aaaaaa";
  this.pageImage.style.position = "absolute";
  this.pageImage.style.left = "0px";
  this.pageImage.style.top = "0px";
  this.pageImage.style.width = "auto";
  this.pageImage2 = new Image;
  this.pageImage2.style.backgroundColor = "#aaaaaa";
  this.pageImage2.style.position = "absolute";
  this.pageImage2.style.left = this.pageImageWidth + "px";
  this.pageImage2.style.top = "0px";
  this.pageImage2.style.width = "auto";

  this.divPageImage.appendChild(this.pageImage);
  this.divPageImage.appendChild(this.pageImage2);

  this.divPageImage.style.width = this.pageImageWidth*2 + "px";
  this.divPageImage.style.height = this.pageImageHeight + "px";
}

PageImageDouble.prototype._createDivSliceImages = function () {
  var myObj = this;

  this.divSliceImagesLeft  = document.createElement("div");
  this.divSliceImagesLeft.style.position = "absolute";
  this.divSliceImagesLeft.style.overflow = "hidden";
  this.divSliceImagesLeft.style.top  = "0px";
  this.divSliceImagesLeft.style.left = "0px";
  this.divSliceImagesLeft.style.width = this.pageLargeImageWidth + "px";
  this.divSliceImagesRight = document.createElement("div");
  this.divSliceImagesRight.style.position = "absolute";
  this.divSliceImagesRight.style.overflow = "hidden";
  this.divSliceImagesRight.style.top  = "0px";
  this.divSliceImagesRight.style.left = this.pageLargeImageWidth + "px";
  this.divSliceImagesRight.style.width = this.pageLargeImageWidth + "px";
  this.divSliceImages.appendChild(this.divSliceImagesLeft);
  this.divSliceImages.appendChild(this.divSliceImagesRight);

  this.divSliceImages.style.width  = this.pageLargeImageWidth*2 + "px";
  this.divSliceImages.style.height = this.pageLargeImageHeight + "px";

  this.sliceImages = [];
  this.sliceImages2 = [];
  for (var i = 0 ; i < 16 ; i++) {
    var img  = new Image;
    var img2 = new Image;
    img.style.width  = "auto";
    img2.style.width = "auto";
    img.onload = function () {
      for (var slot = 0 ; slot < myObj.sliceImages.length ; slot++) {
	if (!myObj.sliceImages[slot].complete)
	  return;
      }
      
      if (!myObj.loadCompleteSliceImages) {
	myObj.loadCompleteSliceImages = true;
	myObj.onLoadSliceImages();
      }
    }
    img2.onload = function () {
      for (var slot = 0 ; slot < myObj.sliceImages2.length ; slot++) {
	if (!myObj.sliceImages2[slot].complete)
	  return;
      }
      
      if (!myObj.loadCompleteSliceImages) {
	myObj.loadCompleteSliceImages = true;
	myObj.onLoadSliceImages();
      }
    }

    this.sliceImages.push(img);
    this.sliceImages2.push(img2);
  }

  while (this.divSliceImagesLeft.childNodes.length) {
    this.divSliceImagesLeft.removeChild(this.divSliceImagesLeft.childNodes[0]);
  }
  while (this.divSliceImagesRight.childNodes.length) {
    this.divSliceImagesRight.removeChild(this.divSliceImagesRight.childNodes[0]);
  }
  for (var i = 0 ; i < 16 ; i++) {
    this.divSliceImagesLeft.appendChild(this.sliceImages[i]);
    this.divSliceImagesRight.appendChild(this.sliceImages2[i]);
  }

}

PageImageDouble.prototype._loadImage = function (pg) {
  if (IsLeftTemplate) {
    this.pageImage.src = "../images/" + pg + ".jpg";
    this.pageImage2.src = "../images/" + (pg+1) + ".jpg";
  } else {
    this.pageImage.src = "../images/" + (pg+1) + ".jpg";
    this.pageImage2.src = "../images/" + pg + ".jpg";
  }
}

PageImageDouble.prototype._loadSliceImages = function (pg) {
  this.loadCompleteSliceImages = false;
  for (var i = 0 ; i < 16 ; i++) {
    if (IsLeftTemplate) {
      this.sliceImages[i].src  = "../images/" + pg + "-" + (i+1) + ".jpg";
      this.sliceImages2[i].src = "../images/" + (pg+1) + "-" + (i+1) + ".jpg";
    } else {
      this.sliceImages[i].src = "../images/" + (pg+1) + "-" + (i+1) + ".jpg";
      this.sliceImages2[i].src  = "../images/" + pg + "-" + (i+1) + ".jpg";
    }
  }
}

PageImageDouble.prototype.setWidth = function (w) {
  if (this.pageWidth == w)
    return;
  this.ratio = w / 2 / this.pageImageWidth;

  this.pageWidth  = w;
  this.pageHeight = this.ratio * this.pageImageHeight;

  this.containerNode.style.width  = this.pageWidth + "px";
  this.containerNode.style.height = this.pageHeight + "px";

  if (this.visibleLink)
    this.createPageLink();

  /*
   * pageImage.style.widthで画像表示サイズを指定すると、
   * コンテナをtranslate3d&scaleした場合に画像が粗くなる。
   * (pageImage.style.widthで縮小表示された画像を元にリサイズされるため。
   *  translate&scaleだとオリジナルの画像がリサイズされるため問題ない)
   * このため、scaleで表示サイズを指定する。
   */
  this.divPageImage.style.msTransform = "translate3d(0px, 0px, 0px) scale(" + this.ratio + ")";
  var r = pageWidth_2X / this.pageImageWidth;
  this.divSliceImages.style.msTransform = "translate3d(0px, 0px, 0px) scale(" + (this.ratio / r) + ")";

  this._updateImageLayer();
}

PageImageDouble.prototype.clearPage = function () {
  this.currentPage = null;
  this.loadSliceImages = false;
  this.pageImage.src = "../skinimage/s.gif";
  for (var i = 0 ; i < 16 ; i++) {
    this.sliceImages[i].src = "../skinimage/s.gif";
    this.sliceImages2[i].src = "../skinimage/s.gif";
  }
}

PageImageDouble.prototype.createPageLink = function () {
  var linkHtml = "";
  var adjLinkRatio = this.getWidth() / 2 / this.pageLargeImageWidth;

  var pg = this.currentPage;

  var pg_offset,pg2_offset;
  if (IsLeftTemplate) {
    pg_offset  = 0;
    pg2_offset = this.getWidth() / 2;
  } else {
    pg_offset  = this.getWidth() / 2;
    pg2_offset = 0;
  }

  if (typeof linkDataCache[pg] != "undefined") {
    for (var i = 0 ; i < linkDataCache[pg].length ; i++) {
      linkHtml += this.createLink(linkDataCache[pg][i],
				  pg_offset, 0, adjLinkRatio);
    }
  }
  pg++;
  if (typeof linkDataCache[pg] != "undefined") {
    for (var i = 0 ; i < linkDataCache[pg].length ; i++) {
      linkHtml += this.createLink(linkDataCache[pg][i],
				  pg2_offset, 0, adjLinkRatio);
    }
  }

  this.divLinkLayer.innerHTML = linkHtml;
}

PageImageDouble.prototype._updateImageLayer = function () {
  var new_w = this.pageWidth;
  var new_h = this.pageHeight;

  if (!UseNormalImage) {
    if (!this.loadSliceImages) {
      this._loadSliceImages(this.currentPage);
      this.loadSliceImages = true;
    }
    this._showLayer(this.divSliceImages);
    this._hideLayer(this.divPageImage);
    return;
  }

  if (this.lightWeight ||
      this.pageImageWidth * 2 > new_w * this.getScale()) {
    this._showLayer(this.divPageImage);
    this._hideLayer(this.divSliceImages);
  } else {
    if (!this.loadSliceImages) {
      this._loadSliceImages(this.currentPage);
      this.loadSliceImages = true;
    }
    // 読み込み完了しているなら通常画像->拡大画像に切り替え
    if (this.loadCompleteSliceImages) {
      this._showLayer(this.divSliceImages);
      this._showLayer(this.divPageImage);
    }
  }
}

/*
 * Thumbnail Image
 */

function ThumbImage(img_w, img_h)
{
  this.pageImageWidth  = img_w;		// オリジナル画像のサイズ
  this.pageImageHeight = img_h;
  this.containerWidth  = img_w;		// 表示コンテナサイズ
  this.containerHeight = img_h;
  this.pageNumberHeight = ThumbPageNumberHeight;
  this.containerHeight += this.pageNumberHeight;

  this.pageImageDispWidth;		// 画像表示サイズ
  this.pageImageDispHeight;		// コンテナ内に収まるように計算された値

  this.currentPage;
  this.pageNumber = 0;		// 表示用ページ番号

  this.pageImage = new Image;
  this.pageImage.style.backgroundColor = "#aaaaaa";

  this.containerNode = document.createElement("div");
  this.containerNode.className = "ThumbPage";
  this.containerNode.style.position = "absolute";
  this.containerNode.style.top  = "0px";
  this.containerNode.style.left = "0px";
  this.containerNode.style.width  = this.containerWidth + "px";
  this.containerNode.style.height = this.containerHeight + "px";

  var myObj = this;
  this.containerNode.addEventListener('mouseup',
			function (event) {myObj.onClickHandler(event)},
			false);


  // build DOM tree
  this.divPageImage = document.createElement("div");
  this.divPageImage.style.position = "absolute";
  this.divPageImage.style.overflow = "hidden";
  this.divPageImage.style.top  = "0px";
  this.divPageImage.style.left = "5px";
  this.divPageImage.appendChild(this.pageImage);
  this.containerNode.appendChild(this.divPageImage);

  this.pageNumberNode = document.createElement("span");
  this.pageNumberNode.className = "ThumbPageNumber";
  this.pageNumberNode.style.position = "absolute";
  this.containerNode.appendChild(this.pageNumberNode);

  this._calcImageDispSize();
  this._updateImageLayer();
}

ThumbImage.prototype.getDOMNode = function () {
  return this.containerNode;
}

ThumbImage.prototype.setX = function (x) {
  this.containerNode.style.left = parseInt(x) + "px";
}
ThumbImage.prototype.setY = function (y) {
  this.containerNode.style.top = parseInt(y) + "px";
}
ThumbImage.prototype.setPos = function (x, y) {
  this.setX(x);
  this.setY(y);
}

ThumbImage.prototype.getX = function () {
  return parseInt(this.containerNode.style.left);
}
ThumbImage.prototype.getY = function () {
  return parseInt(this.containerNode.style.top);
}

ThumbImage.prototype.getImageWidth = function(){return this.pageImageWidth;}
ThumbImage.prototype.getImageHeight = function(){return this.pageImageHeight;}

// 画像サイズではなくコンテナサイズなので注意
ThumbImage.prototype.getWidth = function () {return this.containerWidth;}
ThumbImage.prototype.getHeight = function () {return this.containerHeight;}
ThumbImage.prototype.setWidth = function (w) {
  this.containerWidth  = w;

  this.containerNode.style.width  = this.containerWidth + "px";

  this._calcImageDispSize();
  this._updateImageLayer();
}
ThumbImage.prototype.setHeight = function (h) {
  this.containerHeight  = h;

  this.containerNode.style.height  = this.containerHeight + "px";

  this._calcImageDispSize();
  this._updateImageLayer();
}

ThumbImage.prototype.viewPage = function (pg) {
  this.currentPage = pg;
  this.clearPage();
  this._loadImage(pg);
  this._updateImageLayer();
}

ThumbImage.prototype.clearPage = function () {
  this.pageImage.src = "../image/s.gif";
}

ThumbImage.prototype.getPageNumber = function () {return this.pageNumber;}
ThumbImage.prototype.setPageNumber = function (n) {
  this.pageNumber = n;
  this._updateImageLayer();
}

ThumbImage.prototype.show = function () {
  this.containerNode.style.display = "block";
}
ThumbImage.prototype.hide = function () {
  this.containerNode.style.display = "none";
}

ThumbImage.prototype._loadImage = function (pg) {
  this.pageImage.src = "../thumbnails/" + pg + ".jpg";
}

ThumbImage.prototype._calcImageDispSize = function () {
  var img_area_w = this.containerWidth;
  var img_area_h = this.containerHeight - this.pageNumberHeight;

  // 表示エリアに収まるようにサイズを計算
  var aspect_ratio = img_area_w / img_area_h;
  var r = pageWidth_1X / pageHeight_1Y;
  // 高さを表示エリアに合わせる
  var h = img_area_h;
  var w = h * r;
  if (w > img_area_w) {
    w =  img_area_w;
    h = w / r;
  }

  // 1pxの余白が見苦しいので補正
  w = parseInt(w);
  if (w == this.containerWidth - 1)
    w++;

  this.pageImageDispWidth = w;
  this.pageImageDispHeight = parseInt(h);
}

ThumbImage.prototype._updateImageLayer = function () {

  this.pageImage.style.width  = this.pageImageDispWidth  + "px";
  this.pageImage.style.height = this.pageImageDispHeight + "px";
  this.divPageImage.style.top    = "0px";
  this.divPageImage.style.left   = parseInt((this.containerWidth - this.pageImageDispWidth) / 2) + "px";

  var pg = this.pageNumber;
  if (pg < 0)
    pg = 0;
  this.pageNumberNode.innerHTML = pg;
  this.pageNumberNode.style.left = parseInt(this.containerNode.offsetWidth)
    - parseInt(this.pageNumberNode.offsetWidth) + "px";
  this.pageNumberNode.style.top = parseInt(this.containerNode.offsetHeight)
    - parseInt(this.pageNumberNode.offsetHeight) + "px";
}

ThumbImage.prototype.onClickHandler = function (event) {
  if (this.onClick)
    this.onClick(event);
}
