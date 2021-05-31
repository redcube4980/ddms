var FrameUtil = {
  // functions
  iframeDoc: function (iframe)
  {
    if (iframe.contentDocument)
      return iframe.contentDocument;
    if (iframe.contentWindow.document)
      return iframe.contentWindow.document;     // IE
    return;
  },

  iframeWin: function (iframe)
  {
    return iframe.contentWindow;
  },

  screenWin: function ()
  {
    return FrameUtil.iframeWin(top.document.getElementById("if_screen"));
  },

  getQueryParam: function (win_or_url, key)
  {
    var query;
    if (typeof win_or_url == "string") {
      query = win_or_url;
    } else {
      query = win_or_url.location.search;
    }
    if (!query)
      return null;

    var re = new RegExp("[?&]" + key + "=([^&]*)");
    if (!query.match(re))
      return null;

    return RegExp.$1;
  },

  setQueryParam: function (win_or_url, name, val)
  {
    var url;
    if (typeof win_or_url == "string") {
      url = win_or_url;
    } else {
      url = win_or_url.location.search;
    }

    var rex = new RegExp("([?&]" + name + "=)([^&]*)");

    if (url.match(rex)) {
      new_url = url.replace(rex, "$1" + val);
    } else {
      new_url = url;
      if (new_url.match(/[?]/))
	new_url += "&";
      else
	new_url += "?";
      new_url += name + "=" + val;
    }
    return new_url;
  },

  // 現在開いているカタログのディレクトリ名を取得
  getCurrentBookDirName: function ()
  {
    var screen = top.document.getElementById("if_screen");
    var win = screen.contentWindow;
    var doc = FrameUtil.iframeDoc(screen);

    var url = win.location.toString();

    if (!url.match(/\/([a-zA-Z0-9_-]+)\/screen\.html/))
      return null;

    var currentBook = RegExp.$1;
    return currentBook;
  },

  // URL指定でカタログを開く(URLはscreen.htmlを指定)
  openBookByURL: function (url, disp_pg)
  {
    var screen = top.document.getElementById("if_screen");
    if (typeof disp_pg != "undefined") {
      url = FrameUtil.setQueryParam(url, "pg", disp_pg);
    }

    FrameUtil.iframeDoc(screen).location.href = url;
  },

  // ディレクトリ名指定でカタログを開く
  _BookPath: "../..",
  openBook: function (bookdir, disp_pg)
  {
    var screen = top.document.getElementById("if_screen");
    var win = screen.contentWindow;
    var book_url = FrameUtil._BookPath + "/" + bookdir + "/screen.html";

    if (typeof disp_pg == "undefined") {
      // ページ番号未指定
      // URLを指定してカタログを開く。指定カタログが開いていた場合も開き直す。
      FrameUtil.iframeDoc(screen).location.href = book_url;
    } else {
      // ページ番号指定
      // 指定カタログが開いていた場合は、ページ移動のみ行う。
      var dirname = FrameUtil.getCurrentBookDirName();
      if (bookdir == dirname) {
	var pg = parseInt(disp_pg, 10) + win.modifiedPage;
	win.gotoPage(pg);
      } else {
	book_url = FrameUtil.setQueryParam(book_url, "pg", disp_pg);
	FrameUtil.iframeDoc(screen).location.href = book_url;
      }
    }
  },

  gotoPage: function (disp_pg)
  {
    var screen = top.document.getElementById("if_screen");
    var win = screen.contentWindow;
    var doc = FrameUtil.iframeDoc(screen);
    if (win.gotoPage) {
      var pg = parseInt(disp_pg, 10) + win.modifiedPage;
      win.gotoPage(pg);
    } else {
      alert("はじめにデジタルカタログを開いて下さい。");	// TODO lang.js
    }
  },

  dummy: null};
