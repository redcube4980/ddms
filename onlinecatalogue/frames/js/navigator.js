// $Id: navigator.js 284 2007-04-30 07:25:45Z tomita $

function Navigator(id)
{
  if (id)
    this.container = document.getElementById(id);
  else
    this.container = document.createElement("div");

  this._base_num = 1;
  this._total = 10;
  this._current = 1;
  this._width = 10;

  if (document.all)
    this._spc_html = "&nbsp; ";
  else
    this._spc_html = " ";

  this._build();
}

Navigator.prototype.NumberClassName = "navi_number";
Navigator.prototype.NumberCurrentClassName = "navi_number_current";
Navigator.prototype.ActArrowClassName = "navi_act_arrow";
Navigator.prototype.InactArrowClassName = "navi_inact_arrow";

Navigator.prototype.getContainerNode = function () {return this.container}

Navigator.prototype.total = function (total) {
  if (typeof total == "undefined")
    return this._total;

  this._total = total;
  this._build();
}

Navigator.prototype.current = function (current) {
  if (typeof current == "undefined")
    return this._current;

  if (current < this._base_num || current > this._base_num + this._total - 1)
    return;	// out of range

  this._current = current;
  this._build();
}

Navigator.prototype.width = function (width) {
  if (typeof width == "undefined")
    return this._width;

  this._width = width;
  this._build();
}

Navigator.prototype._build = function () {
  var myObj = this;

  var start = this._current - parseInt(this._width / 2);
  if (start < this._base_num)
    start = this._base_num;

  var end = start + this._width - 1;
  if (end >= this._base_num + this._total) {
    end = this._base_num + this._total - 1;
    // 終了位置の切捨てがあった場合は、幅が小さくならないように
    // 開始位置を巻戻す
    start = end - this._width + 1;
    if (start < this._base_num)
      start = this._base_num;
  }

  this.container.innerHTML = "";

  var span = document.createElement("span");
  span.innerHTML = "&lt;";
  if (this._current > this._base_num) {
    span.className = this.ActArrowClassName;
    span.onclick = function () {
      myObj.current(myObj._current - 1);
      myObj.onMove(myObj._current);}
  } else {
    span.className = this.InactArrowClassName;
  }
  this.container.appendChild(span);

  for (var i = start ; i <= end ; i++) {
    var span = document.createElement("span");
    span._number = i;
    span.innerHTML = i;
    span.onclick = function () {
      var n = this._number;
      myObj.current(n);
      myObj.onMove(n);}

    if (i == this._current)
      span.className = this.NumberCurrentClassName;
    else
      span.className = this.NumberClassName;

    // 横幅が大きいときに改行されるようにスペース挿入 
    var spc = document.createElement("span");
    spc.innerHTML = this._spc_html;
    this.container.appendChild(spc);

    this.container.appendChild(span);
  }

  var spc = document.createElement("span");
  spc.innerHTML = this._spc_html;
  this.container.appendChild(spc);

  var span = document.createElement("span");
  span.innerHTML = "&gt;";
  if (this._current < this._base_num + this._total - 1) {
    span.className = this.ActArrowClassName;
    span.onclick = function () {
      myObj.current(myObj._current + 1);
      myObj.onMove(myObj._current);}
  } else {
    span.className = this.InactArrowClassName;
  }
  this.container.appendChild(span);
}


// For override
  Navigator.prototype.onMove    = function (curr) {}
