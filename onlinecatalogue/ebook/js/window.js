/*! $Id: window.js 145 2012-04-10 03:11:01Z tomita $ */

function JSWindow()
{
  var myObj = this;

  this.container = document.createElement("div");
  this.titleNode;
  this.titleBGLeftNode;
  this.titleBGCenterNode;
  this.titleBGRightNode;
  this.titleCloseBtnNode;
  this.titleTextNode;
  this.bodyNode;
  this.clientAreaNode;

  this.container.className = "JSWindow";
  this.container.style.cssText = "position:absolute;top:0px;left:0px;";

  this._buildDOM();

  this.onCreate(this.clientAreaNode);

  EBUtil.importListenerMechanism(this, "listeners");
  this.listeners["onclick"]     = new EBUtil.ListenerList;
  this.listeners["onmousedown"] = new EBUtil.ListenerList;
  this.listeners["ongrab"]      = new EBUtil.ListenerList;
  this.listeners["onclose"]     = new EBUtil.ListenerList;


  this.container.onclick = function (event) {
    myObj.listeners["onclick"].invoke(event, myObj);
    return false;
  }
  this.container.onmousedown = function (event) {
    myObj.listeners["onmousedown"].invoke(event, myObj);
    return false;
  }
  this.titleNode.onmousedown = function (event) {
    myObj.listeners["ongrab"].invoke(event, myObj);
    return false;
  }
  this.titleCloseBtnNode.onclick = function (event) {
    myObj.listeners["onclose"].invoke(event, myObj);
    return false;
  }

  this.setSize(100, 100);
}

JSWindow.prototype._buildDOM = function ()
{
  var nd;

  /*
   * タイトルバー構築
   */
  nd = document.createElement("div");
  nd.className = "JSWindowTitle";
  nd.style.cssText = "position:absolute;top:0px;left:0px;width:100%;";
  nd.style.height = this.TitleBarHeight + "px";
  this.titleNode = nd;
  this.container.appendChild(this.titleNode);

  nd = document.createElement("div");
  nd.className = "JSWindowTitleBGLeft";
  nd.style.cssText = "position:absolute;top:0px;left:0px;width:6px;";
  nd.style.width  = this.TitleBarBGEdgeWidth + "px";
  nd.style.height = this.TitleBarHeight + "px";
  this.titleBGLeftNode = nd;
  this.titleNode.appendChild(this.titleBGLeftNode);

  nd = document.createElement("div");
  nd.className = "JSWindowTitleBGCenter";
  nd.style.cssText = "position:absolute;top:0px;left:0px;";
  nd.style.left   = this.TitleBarBGEdgeWidth + "px";
  nd.style.height = this.TitleBarHeight + "px";
  this.titleBGCenterNode = nd;
  this.titleNode.appendChild(this.titleBGCenterNode);

  nd = document.createElement("div");
  nd.className = "JSWindowTitleBGRight";
  nd.style.cssText = "position:absolute;top:0px;left:0px;";
  nd.style.width  = this.TitleBarBGEdgeWidth + "px";
  nd.style.height = this.TitleBarHeight + "px";
  this.titleBGRightNode = nd;
  this.titleNode.appendChild(this.titleBGRightNode);

  nd = document.createElement("div");
  nd.className = "JSWindowTitleText";
  nd.style.cssText = "position:absolute;top:0px;left:0px;width:100%;height:100%;";
  nd.style.lineHeight = this.TitleBarHeight + "px";
  this.titleTextNode = nd;
  this.titleTextNode.onselectstart = function () {return false;};
  this.titleNode.appendChild(this.titleTextNode);

  nd = document.createElement("div");
  nd.className = "JSWindowTitleCloseBtn";
  nd.style.cssText = "position:absolute;top:0px;left:0px;";
  nd.onmouseover = function () {this.className = "JSWindowTitleCloseBtn RO";}
  nd.onmouseout  = function () {this.className = "JSWindowTitleCloseBtn";}
  this.titleCloseBtnNode = nd;

  /*
   * ウィンドウ本体
   */
  nd = document.createElement("div");
  nd.className = "JSWindowBody";
  nd.style.cssText = "position:absolute;left:0px;width:100%;";
  nd.style.top = this.TitleBarHeight + "px";
  this.bodyNode = nd;
  this.container.appendChild(this.bodyNode);

  /*
   * クライアント領域
   */
  nd = document.createElement("div");
  nd.className = "JSWindowClientArea";
  nd.style.cssText = "position:absolute;top:0px;left:0px;";
  this.clientAreaNode = nd;
  this.bodyNode.appendChild(this.clientAreaNode);

}

JSWindow.prototype.TitleBarHeight      = 20;
JSWindow.prototype.TitleBarBGEdgeWidth = 6;
JSWindow.prototype.WindowBorderWidth   = 1;
JSWindow.prototype.WindowStyle = {close_btn: false};

JSWindow.prototype.getContainerNode = function ()
{
  return this.container;
}

JSWindow.prototype.setPos = function (x, y)
{
  this.container.style.left = parseInt(x, 10) + "px";
  this.container.style.top  = parseInt(y, 10) + "px";
}
JSWindow.prototype.getPosX = function ()
{
  return parseInt(this.container.style.left, 10);
}
JSWindow.prototype.getPosY = function ()
{
  return parseInt(this.container.style.top, 10);
}

JSWindow.prototype.setSize = function (w, h)
{
  this.container.style.width  = w + "px";
  this.container.style.height = h + "px";

  this._update();
}
JSWindow.prototype.getWidth = function ()
{
  return parseInt(this.container.style.width, 10);
}
JSWindow.prototype.getHeight = function ()
{
  return parseInt(this.container.style.height, 10);
}

JSWindow.prototype.setClientSize = function (w, h)
{
  this.setSize(w + this.WindowBorderWidth * 2,
	       h + this.WindowBorderWidth + this.TitleBarHeight);
}
JSWindow.prototype.getClientWidth = function ()
{
  return parseInt(this.clientAreaNode.style.width, 10);
}
JSWindow.prototype.getClientHeight = function ()
{
  return parseInt(this.clientAreaNode.style.height, 10);
}

JSWindow.prototype.show = function ()
{
  this.container.style.display = "block";
}
JSWindow.prototype.hide = function ()
{
  this.container.style.display = "none";
}

JSWindow.prototype.setTitle = function (title)
{
  this.titleTextNode.innerHTML = title;
}

JSWindow.prototype.setWindowStyle = function (key, value)
{
  this.WindowStyle[key] = value;
  this._update();
}

JSWindow.prototype._update = function ()
{
  var w = this.getWidth();
  var h = this.getHeight();

  // タイトルバー背景
  this.titleBGCenterNode.style.width = (w - this.TitleBarBGEdgeWidth * 2) + "px";
  this.titleBGRightNode.style.left = (w - this.TitleBarBGEdgeWidth) + "px";

  if (this.WindowStyle.close_btn) {
    if (!this.titleCloseBtnNode.parentNode)
      this.titleNode.appendChild(this.titleCloseBtnNode);
    this.titleCloseBtnNode.style.left = (w - 20) + "px";
    this.titleCloseBtnNode.style.top  = "4px";
  } else {
    if (this.titleCloseBtnNode.parentNode)
      this.titleNode.removeChild(this.titleCloseBtnNode);
  }

  this.bodyNode.style.height = (h - this.TitleBarHeight) + "px";

  this.clientAreaNode.style.left = this.WindowBorderWidth + "px";
  this.clientAreaNode.style.width  = (w - this.WindowBorderWidth * 2) + "px";
  this.clientAreaNode.style.height = (h - this.TitleBarHeight - this.WindowBorderWidth) + "px";

  this.onDraw(this.clientAreaNode);
}

JSWindow.prototype.updateClientArea = function ()
{
  this.onDraw(this.clientAreaNode);
}

// for override
JSWindow.prototype.onCreate = function (client)
{
}

// for override
JSWindow.prototype.onDraw = function (client)
{
  client.innerHTML = "";
}

/*
 * Window Manager
 */

function JSWindowManager(layer)
{
  var myObj = this;

  this.layer = layer;
  this.lastWinPos = {x: 10, y: 10};
  this.grabbedWin = null;
  this.grabPos = {x:null, y:null};
  this.screenRect = {x0: 0, y0: 0,
		     x1: EBUtil.winWidth() - 1, y1:EBUtil.winHeight() - 1};

  this.windowList = [];

  this._onDragWindow = function(event) {
    var e = event || window.event;

    var pos = EBUtil.getMousePos(e);

    if (myObj.grabbedWin) {
      var pos = EBUtil.getMousePos(e);
      var win = myObj.grabbedWin;

      // 移動範囲チェック
      var x = pos.x - myObj.grabPos.x;
      var y = pos.y - myObj.grabPos.y;
      if (x < myObj.screenRect.x0)
	x = myObj.screenRect.x0;
      if (y < myObj.screenRect.y0)
	y = myObj.screenRect.y0;
      if (x + win.getWidth() > myObj.screenRect.x1)
	x = myObj.screenRect.x1 - win.getWidth();
      if (y + win.getHeight() > myObj.screenRect.y1)
	y = myObj.screenRect.y1 - win.getHeight();

      win.setPos(x, y);
    }
  }
  this._onReleaseWindow = function() {
    EBUtil.stopMouseCapture("mousemove", myObj._onDragWindow);
    EBUtil.stopMouseCapture("mouseup",   myObj._onReleaseWindow);
    myObj.grabbedWin = null;
  }
}

JSWindowManager.prototype.setScreentRect = function (x0, y0, x1, y1)
{
  this.screenRect.x0 = x0;
  this.screenRect.y0 = y0;
  this.screenRect.x1 = x1;
  this.screenRect.y1 = y1;

  // window位置の調整
  for (var i = 0 ; i < this.windowList.length ; i++) {
    var win = this.windowList[i];
    var x = win.getPosX();
    var y = win.getPosY();
    if (x < this.screenRect.x0)
      x = this.screenRect.x0;
    if (y < this.screenRect.y0)
      y = this.screenRect.y0;
    if (x + win.getWidth() > this.screenRect.x1)
      x = this.screenRect.x1 - win.getWidth();
    if (y + win.getHeight() > this.screenRect.y1)
      y = this.screenRect.y1 - win.getHeight();

    win.setPos(x, y);
  }
}

JSWindowManager.prototype.addWindow = function (win)
{
  var i = 0;
  for (i = 0 ; i < this.windowList.length ; i++) {
    if (this.windowList[i] == win)
      return false;	// 登録済み
  }

  this.lastWinPos.x += 20;
  this.lastWinPos.y += 20;

  if (this.lastWinPos.x < this.screenRect.x0)
    this.lastWinPos.x = this.screenRect.x0 + 10;
  if (this.lastWinPos.y < this.screenRect.y0)
    this.lastWinPos.y = this.screenRect.y0 + 10;
  if (this.lastWinPos.x + win.getWidth() > this.screenRect.x1)
    this.lastWinPos.x = this.screenRect.x0 + 10;
  if (this.lastWinPos.y + win.getHeight() > this.screenRect.y1)
    this.lastWinPos.y = this.screenRect.y0 + 10;

  win.setPos(this.lastWinPos.x, this.lastWinPos.y);

  // windowにmanagerのワークエリアを追加
  win._mgr = {manager: this,
	      onmousedown: function (event, w) {
      w._mgr.manager.raiseWindow(w);
    },
	      ongrab: function (event, w) {
      var e = event || window.event;

      var mgr = w._mgr.manager;
      mgr.grabbedWin = w;

      var pos = EBUtil.getMousePos(e);
      mgr.grabPos.x = pos.x - w.getPosX();
      mgr.grabPos.y = pos.y - w.getPosY();
      EBUtil.startMouseCapture("mousemove", mgr._onDragWindow);
      EBUtil.startMouseCapture("mouseup",   mgr._onReleaseWindow);
    },
	      onclose: function (event, w) {
      //w._mgr.manager.removeWindow(w);
      w.hide();
    }
  };
  win.addListener("onmousedown", win._mgr.onmousedown);
  win.addListener("ongrab",      win._mgr.ongrab);
  win.addListener("onclose",     win._mgr.onclose);

  this.layer.appendChild(win.getContainerNode());
  this.windowList.push(win);
  this._updateOrder();

  return true;
}


JSWindowManager.prototype.removeWindow = function (win)
{
  var i = 0;
  for (i = 0 ; i < this.windowList.length ; i++) {
    if (this.windowList[i] == win) {
      win.removeListener("onclick", win._mgr.onclick);
      win.removeListener("ongrab",  win._mgr.ongrab);
      win.removeListener("onclose", win._mgr.onclose);
      delete win._mgr;

      this.layer.removeChild(win.getContainerNode());

      this.windowList.splice(i, 1);
      this._updateOrder();
      return true;
    }
  }

  return false;
}

JSWindowManager.prototype.raiseWindow = function (win)
{
  var i = 0;
  for (i = 0 ; i < this.windowList.length ; i++) {
    if (this.windowList[i] == win) {
      if (i != 0) {
	// 配列の先頭へ
	this.windowList.splice(i, 1);
	this.windowList.unshift(win);
	this._updateOrder();
      }
      return true;
    }
  }

  return false;
}

JSWindowManager.prototype._updateOrder = function ()
{
  /*
  zIndex = 1000;
  for (var i = 0 ; i < this.windowList.length ; i++) {
    this.windowList[i].getContainerNode().style.zIndex = zIndex--;
  }
  */
  for (var i = this.windowList.length - 1 ; i >= 0 ; i--) {
    var nd = this.windowList[i].getContainerNode();
    this.layer.removeChild(nd);
    this.layer.appendChild(nd);
  }
}

