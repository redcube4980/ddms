var Lang = {
  WindowTitle: "デジタルカタログ",

  GoFirstAlt:         "最初のページへ移動",
  GoPrevAlt:          "1ページ戻る",
  GoNextAlt:          "1ページ進む",
  GoLastAlt:          "最終のページへ移動",
  GotoButtonAlt:      "ページ数を指定して移動",
  TOCButtonAlt:       "目次を表示",
  BookMarkButtonAlt:  "「しおり挿入ボタン」をカタログの左下に表示",
  PDFButtonAlt:       "PDFファイルを開く",
  PrintButtonAlt:     "表示画像を印刷",
  DownloadButtonAlt:  "図面ダウンロード",
  SoundButtonAlt:     "音声 ON/OFF",
  CopyModeButtonAlt:  "コピー",
  AutoFeedButtonAlt:  "自動ページめくり ON/OFF",
  FrameButtonAlt:     "フレーム開閉",

  LinkMessageForTypeL : "Go to Web : ",          //Go to Web page
  LinkMessageForTypeG : "Go to Page : ",         //Go to page
  LinkMessageForTypeM : "Go to Media : ",        //Go to media

  PrintLeftPageText:  "左ページ",
  PrintRightPageText: "右ページ",
  PrintPageTwoText:   "両ページ",
  PrintPrintText:     "印  刷",

  BookMarkLimitOverText: "BookMarkの制限数を越えました。",
  CantCreateMPlayerText: "MediaPlayerを生成できませんでした。",

  SideBarCloseText: "閉じる",

  ContentsText:     "目次",	// スマートフォン目次
  BackText:         "戻る",
  SmartPhoneUnsupported:  "スマートフォンでの閲覧には対応しておりません。",

  SearchText:       "検索",	// スマートフォン検索
  SearchResultText:  "検索結果",	// スマートフォン検索

  SideBarCloseBtnHTML: '<div style="margin-top:15px;margin-left:20px;"><a href="javascript:void(0)" onclick="SideBar.close();"><img src="./skinimage/sidebar/mokuji_close.gif" border="0" /></a></div>',

  // Formatted Text
  PageRangeOverTextFunc: function (disp_pg_first, disp_pg_last) {
    return "[ " + disp_pg_first + " - " + disp_pg_last + " ] の範囲のページ番号を入力ください。";
  },

  dummy : null};
