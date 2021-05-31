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

  // ���݊J���Ă���J�^���O�̃f�B���N�g�������擾
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

  // URL�w��ŃJ�^���O���J��(URL��screen.html���w��)
  openBookByURL: function (url, disp_pg)
  {
    var screen = top.document.getElementById("if_screen");
    if (typeof disp_pg != "undefined") {
      url = FrameUtil.setQueryParam(url, "pg", disp_pg);
    }

    FrameUtil.iframeDoc(screen).location.href = url;
  },

  // �f�B���N�g�����w��ŃJ�^���O���J��
  _BookPath: "../..",
  openBook: function (bookdir, disp_pg)
  {
    var screen = top.document.getElementById("if_screen");
    var win = screen.contentWindow;
    var book_url = FrameUtil._BookPath + "/" + bookdir + "/screen.html";

    if (typeof disp_pg == "undefined") {
      // �y�[�W�ԍ����w��
      // URL���w�肵�ăJ�^���O���J���B�w��J�^���O���J���Ă����ꍇ���J�������B
      FrameUtil.iframeDoc(screen).location.href = book_url;
    } else {
      // �y�[�W�ԍ��w��
      // �w��J�^���O���J���Ă����ꍇ�́A�y�[�W�ړ��̂ݍs���B
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
      alert("�͂��߂Ƀf�W�^���J�^���O���J���ĉ������B");	// TODO lang.js
    }
  },

  dummy: null};
