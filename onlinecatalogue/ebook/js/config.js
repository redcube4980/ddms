var IsLeftTemplate = true;
var modifiedPage = -1;
var LastPDF;		// �Ō��PDF�t�@�C���̔ԍ��B�ȗ�����lastPage�Ɠ����B

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
var FeaturePageSoundRelay = true;	// �y�[�W�����Đ����̎����y�[�W�߂���
var FeatureMapWindow = false;
var FeaturePageResize = true;

// Layout
var LeftViewWidth                 = 233;
var CenterBorderWidth             = 38;
var CenterBorderLeftOpacityStart  = 0.0;
var CenterBorderLeftOpacityEnd    = 1.0;
var CenterBorderRightOpacityStart = 0.7;
var CenterBorderRightOpacityEnd   = 0.0;
var BookMinWidth                  = 300;	// �ŏ��\����
var ScreenSideBarWidth            = 240;	// �ڎ��p�T�C�h�o�[�̕�
var PrintPreviewWidth             = 600;
var PrintingMaxWidth              = 740;
var PrintingMaxHeight             = 900;
var MapWindowImageWidth           = 120;

// FeatureWindowSizeAdjust == true����Window�T�C�Y���
// �X�N���[���T�C�Y�Ɏ��܂�winWidth,winHeight�����������ꍇ�́A
// ���̃T�C�Y��Window�T�C�Y��ύX���܂��B
// ��������ꍇ�́A�ŏ��ɊY������T�C�Y�ɕύX���܂��B
var AdjustWindowSizes = [{winWidth: 1280, winHeight:990},
						{winWidth: 1280, winHeight:960},
						{winWidth: 1152, winHeight:830}];

// Initial State
var InitialStateLeftViewOpened      = true;	// �N�����ɍ��t���[���̕\��
var InitialStateScreenSideBarOpened = false;	// �N�����ɖڎ��\��
var InitialStatePlaySound           = true;	// �N�����̉��������Đ�

// Other parameters
var ScrollStep = 10;
var MultiStageZoomRatio = 1.94;	// FeatureMultiStageZoom == true����1�i��ڂ̊g��{���B���w�莞�͎���
var BookMarkMax = 15;

/*
 * Download Pages
 */
var DLFileMap = new Array();

/*
 * �t�@�C���_�E�����[�h���T�|�[�g����ꍇ�́A�ȉ��̂悤��
 * �_�E�����[�h�y�[�W���w�肵�Ă��������B
 * 
 * DLFileMap["3"] = "download/html/p3.html";
 * DLFileMap["4"] = "download/html/p4.html";
 *
 * DLFileMap["5"] = "download/html/p5.html";
 *
 * DLFileMap["10"] = "download/html/p10.html";
 */
