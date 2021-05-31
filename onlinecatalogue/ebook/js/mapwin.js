/*! $Id: mapwin.js 145 2012-04-10 03:11:01Z tomita $ */
// 拡大窓

function MapWindow()
{
  this.viewport;
  this.image;
  this.alphaLayer;
  this.grabPos = {x:null, y:null};

  this.parent = JSWindow;
  this.parent();

  var myObj = this;

  this._onDrag = function(event) {
    var e = event || window.event;

    var pos = EBUtil.getMousePos(e);
    var x = pos.x - myObj.grabPos.x;
    var y = pos.y - myObj.grabPos.y;
    var yMargin = 20;	// Viewportで端までスクロールできるようにするためのマージン
    if (x < 0)
      x = 0;
    if (x + myObj.viewport.getWidth() >=  myObj.getClientWidth())
      x = myObj.getClientWidth() - myObj.viewport.getWidth();
    if (y < 0 - yMargin)
      y = 0 - yMargin;
    if (y + myObj.viewport.getHeight() >=  myObj.getClientHeight() + yMargin)
      y = myObj.getClientHeight() - myObj.viewport.getHeight() + yMargin;

    myObj.viewport.setPos(x, y);
    myObj.syncZoomedPage();
    return false;
  }
  this._onRelease = function() {
    EBUtil.stopMouseCapture("mousemove", myObj._onDrag);
    EBUtil.stopMouseCapture("mouseup",   myObj._onRelease);
    myObj.grabbedWin = null;
  }

  this.setTitle("拡大ナビゲーション");
  this.titleTextNode.style.fontSize = "10px";
}
MapWindow.prototype = new JSWindow;
MapWindow.prototype.WindowStyle["close_btn"] = true;

MapWindow.prototype.setImage = function (src)
{
  this.image.src = src;
  this.viewport.setImage(src,  this.getClientWidth(),  this.getClientHeight());
}

MapWindow.prototype.syncZoomedPage = function ()
{
  var x = this.viewport.getPosX();
  var y = this.viewport.getPosY();
  x = x * ZoomedPage.getWidth()  / this.getWidth();
  y = y * ZoomedPage.getHeight() / this.getHeight();

  var posX = -x;
  var posY = -y;

  var tmp = normalizeZoomedPos(posX, posY,
			       ZoomedPage.getWidth(),
			       ZoomedPage.getHeight());
  ZoomedPage.setPos(tmp.x, tmp.y);
  ZoomedBookLink.setPos(tmp.x, tmp.y);
  updateScrollButton();
}

MapWindow.prototype.onCreate = function (client)
{
  var myObj = this;

  this.image = document.createElement("img");
  this.image.style.cssText = "position:absolute;top:0px;left:0px;width:100%;height:100%;";
  client.appendChild(this.image);

  this.alphaLayer = document.createElement("div");
  this.alphaLayer.style.cssText = "position:absolute;top:0px;left:0px;width:100%;height:100%;";
  this.alphaLayer.style.backgroundColor = "#000000";
  EBUtil.setOpacity(this.alphaLayer, "0.6");
  client.appendChild(this.alphaLayer);

  this.viewport = new MapWindowViewPort;
  this.viewport.setSize(50, 50);
  client.appendChild(this.viewport.getContainerNode());

  this.viewport.getContainerNode().onmousedown = function (event) {
    var e = event || window.event;

    var pos = EBUtil.getMousePos(e);
    myObj.grabPos.x = pos.x - myObj.viewport.getPosX();
    myObj.grabPos.y = pos.y - myObj.viewport.getPosY();
    EBUtil.startMouseCapture("mousemove", myObj._onDrag);
    EBUtil.startMouseCapture("mouseup",   myObj._onRelease);
  }
}

MapWindow.prototype.onDraw = function (client)
{
  if (!MainArea)
    return;
  if (!BookContext.zoomed)
    return;

  var x = ZoomedPage.getPosX();
  var y = ZoomedPage.getPosY();
  var w = ZoomedPage.getWidth();
  var h = ZoomedPage.getHeight();

  if (w == 0 || h == 0)
    return;

  // Viewportのサイズを計算
  var w_ratio = parseFloat(MainArea.offsetWidth) / w;
  var h_ratio = parseFloat(MainArea.offsetHeight) / h;

  var mapWidth  = this.getClientWidth();
  var mapHeight = this.getClientHeight();

  var vpWidth  = parseInt(mapWidth * w_ratio);
  var vpHeight = parseInt(mapHeight * h_ratio);
  this.viewport.setSize(vpWidth, vpHeight);

  // ViewPortの位置を計算
  var vpTop  = -y;
  var vpLeft = -x;
  vpTop  = parseInt(vpTop * this.getHeight() / h, 10);
  vpLeft = parseInt(vpLeft * this.getWidth() / w, 10);
  this.viewport.setPos(vpLeft, vpTop);
}


function MapWindowViewPort()
{
  this.image;

  this.parent = EBUtil.Sprite;
  this.parent();
}
MapWindowViewPort.prototype = new EBUtil.Sprite;

MapWindowViewPort.prototype.setPos = function (x, y)
{
  MapWindow.prototype.setPos.apply(this, arguments);
  // MapWindowの背景画像と重なるように画像表示位置更新
  this.image.style.left = (-x) + "px";
  this.image.style.top  = (-y) + "px";
}

  MapWindowViewPort.prototype.setImage = function (src, w, h)
{
  this.image.src = src;
  this.image.style.width  = w + "px";
  this.image.style.height = h + "px";
}

MapWindowViewPort.prototype.onCreate = function ()
{
  this.image = document.createElement("img");
  this.image.style.cssText = "position:absolute;";
  this.container.appendChild(this.image);
  this.container.style.cursor = "pointer";
}

