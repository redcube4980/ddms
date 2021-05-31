var IsLeftTemplate = true;
var modifiedPage = -1;
var LastPDF;		// 最後のPDFファイルの番号。省略時はlastPageと同じ。

// Statistics
var BookKey = "";
var NotifyLinkClick = false;
// TrackURL example: http://www.digicata-log.com/stat/capture/
var TrackURL = "";
var AutoAdditionBookKey = false;

var LinkDrawType = "Paint";             // Paint/Border
var LinkOpacityDefault = 0.0;
var LinkOpacityOverlay = 0.4;
var LinkBorderWidth = 2;
var LinkDrawTypeMobileSafari = "Paint"; // Paint/Border
var LinkOpacityDefaultMobileSafari = 0.4;
var LinkBorderWidthMobileSafari = 2;

var FeatureShioriSave = true;
var FeatureWindowSizeAdjust = true;
var FeaturePDFAllBtn = false;
var FeatureMobileSafariLink = true;
var FeatureSmartPhone = true;
var FeatureFrame = true;
var FeatureMultiStageZoom = false;
var FeaturePageSoundRelay = true;	// ページ音声再生時の自動ページめくり
var FeatureMapWindow = false;
var FeaturePageResize = true;

// Layout
var LeftViewWidth                 = 233;
var CenterBorderWidth             = 38;
var CenterBorderLeftOpacityStart  = 0.0;
var CenterBorderLeftOpacityEnd    = 1.0;
var CenterBorderRightOpacityStart = 0.7;
var CenterBorderRightOpacityEnd   = 0.0;
var BookMinWidth                  = 300;	// 最小表示幅
var ScreenSideBarWidth            = 240;	// 目次用サイドバーの幅
var PrintPreviewWidth             = 600;
var PrintingMaxWidth              = 740;
var PrintingMaxHeight             = 900;
var MapWindowImageWidth           = 120;

// FeatureWindowSizeAdjust == true時のWindowサイズ候補
// スクリーンサイズに収まるwinWidth,winHeightが見つかった場合は、
// そのサイズにWindowサイズを変更します。
// 複数ある場合は、最初に該当するサイズに変更します。
var AdjustWindowSizes = [{winWidth: 1280, winHeight:990},
						{winWidth: 1280, winHeight:960},
						{winWidth: 1152, winHeight:830}];

// Initial State
var InitialStateLeftViewOpened      = true;	// 起動時に左フレームの表示
var InitialStateScreenSideBarOpened = false;	// 起動時に目次表示
var InitialStatePlaySound           = true;	// 起動時の音声自動再生

// Other parameters
var ScrollStep = 10;
var MultiStageZoomRatio = 1.94;	// FeatureMultiStageZoom == true時の1段回目の拡大倍率。未指定時は自動
var BookMarkMax = 15;

/*
 * Download Pages
 */
var DLFileMap = new Array();

/*
 * ファイルダウンロードをサポートする場合は、以下のように
 * ダウンロードページを指定してください。
 * 
 * DLFileMap["3"] = "download/html/p3.html";
 * DLFileMap["4"] = "download/html/p4.html";
 *
 * DLFileMap["5"] = "download/html/p5.html";
 *
 * DLFileMap["10"] = "download/html/p10.html";
 */
