/*! $Id: copypaste.js 211 2013-09-20 05:47:08Z tomita $ */

/*
 * Input parameters
 * sz: n/z
 * pg
 * x
 * y
 * w
 * h
 */

function copyFromNormalImage()
{
  var pg = parseInt(EBUtil.getQueryParam(window, "pg"), 10);

  var loader = new EBUtil.ImageLoader;

  if (IsLeftTemplate) {
    loader.addImage(EBUtil.imageUrl(pg),   "left");
    loader.addImage(EBUtil.imageUrl(pg+1), "right");
  } else {
    loader.addImage(EBUtil.imageUrl(pg+1), "left");
    loader.addImage(EBUtil.imageUrl(pg),   "right");
  }

  loader.addListener("onload", function () {
		       var canvas = document.createElement("canvas");
		       canvas.setAttribute("width", pageWidth_1X * 2);
		       canvas.setAttribute("height", pageHeight_1Y);

		       var ctx = canvas.getContext("2d");
		       ctx.clearRect(0, 0, pageWidth_1X * 2, pageHeight_1Y);

		       var leftImg  = loader.getImage("left");
		       var rightImg = loader.getImage("right");
		       ctx.drawImage(leftImg,
				     0, 0, pageWidth_1X, pageHeight_1Y,
				     0, 0, pageWidth_1X, pageHeight_1Y);
		       ctx.drawImage(rightImg,
				     0, 0, pageWidth_1X, pageHeight_1Y,
				     pageWidth_1X, 0, pageWidth_1X, pageHeight_1Y);
		       drawCopyArea(canvas);
		     });
  loader.load();
}

function copyFromZoomedImage()
{
  var pg = parseInt(EBUtil.getQueryParam(window, "pg"), 10);

  var loader = new EBUtil.ImageLoader;

  var url = EBUtil.imageUrl(pg);
  if (!url.match || !url.match(/^(.*)(\.[^.]+)$/))
    return;

  var base = RegExp.$1;
  var ext  = RegExp.$2;

  for (var i = 0 ; i < sliceNumber ; i++) {
    loader.addImage(base + "-" + (i+1) + ext, "slice" + i);
  }

  loader.addListener("onload", function () {
		       var canvas = document.createElement("canvas");
		       canvas.setAttribute("width", pageWidth_2X);
		       canvas.setAttribute("height", pageHeight_2Y);

		       var ctx = canvas.getContext("2d");
		       ctx.clearRect(0, 0, pageWidth_2X, pageHeight_2Y);

		       for (var i = 0 ; i < sliceNumber ; i++) {
			 var img = loader.getImage("slice" + i);
			 ctx.drawImage(img,
				       0, 0, pageWidth_2X, sliceImgHeight,
				       0, sliceImgHeight * i, pageWidth_2X, sliceImgHeight);
		       }

		       drawCopyArea(canvas);
		     });
  loader.load();
}

function drawCopyArea(backCanvas)
{
  var x  = parseInt(EBUtil.getQueryParam(window, "x"), 10);
  var y  = parseInt(EBUtil.getQueryParam(window, "y"), 10);
  var w  = parseInt(EBUtil.getQueryParam(window, "w"), 10);
  var h  = parseInt(EBUtil.getQueryParam(window, "h"), 10);
  var x2 = x + w;
  var y2 = y + h;

  // x,y,w,hの範囲補正
  var srcWidth  = backCanvas.getAttribute("width");
  var srcHeight = backCanvas.getAttribute("height");
  if (x < 0)
    x = 0;
  if (x > srcWidth)
    x = srcWidth;
  if (y < 0)
    y = 0;
  if (y > srcHeight)
    y = srcHeight;

  if (x2 < 0)
    x2 = 0;
  if (x2 > srcWidth)
    x2 = srcWidth;
  if (y2 < 0)
    y2 = 0;
  if (y2 > srcHeight)
    y2 = srcHeight;

  w = x2 - x;
  h = y2 - y;

  if (w <= 0 || h <= 0)
    return;


  var srcCtx = backCanvas.getContext("2d");
  var imagedata = srcCtx.getImageData(x, y, w, h);

  var copyarea = document.createElement("canvas");
  copyarea.setAttribute("width", w);
  copyarea.setAttribute("height", h);

  var dstCtx = copyarea.getContext("2d");
  dstCtx.putImageData(imagedata, 0, 0);

  var container = document.getElementById("imgcontainer");
  container.innerHTML = "";
  var img = document.createElement("img");
  img.src = copyarea.toDataURL("image/jpeg");
  container.appendChild(img);

  // windowサイズ調整
  var winW = w + 100;
  if (winW < 490)
    winW = 490;
  window.resizeTo(winW, h + 200);
}

function onLoad()
{
  var sz = EBUtil.getQueryParam(window, "sz");

  switch (sz) {
  case "n":
    copyFromNormalImage();
    break;
  case "z":
    copyFromZoomedImage();
    break;
  }
}
