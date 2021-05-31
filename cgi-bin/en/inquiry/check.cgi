#!/usr/local/bin/perl

#┌─────────────────────────────────
#│ CLIP MAIL (UTF-8) : check.cgi - 2013/08/18
#│ copyright (c) KentWeb
#│ http://www.kent-web.com/
#└─────────────────────────────────

# モジュール宣言
use strict;
use CGI::Carp qw(fatalsToBrowser);

# 外部ファイル取り込み
require './init.cgi';
my %cf = init();

print <<EOM;
Content-type: text/html; charset=utf-8

<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title>Check Mode</title>
</head>
<body>
<b>Check Mode: [ $cf{version} ]</b>
<ul>
<li>Perlバージョン : $]
EOM

# sendmailチェック
print "<li>sendmailパス : ";
if (-e $cf{sendmail}) {
	print "OK\n";
} else {
	print "NG → $cf{sendmail}\n";
}

# ディレクトリ
if (-d $cf{upldir}) {
	print "<li>一時ディレクトリパス : OK\n";

	if (-r $cf{upldir} && -w $cf{upldir} && -x $cf{upldir}) {
		print "<li>一時ディレクトリパーミッション : OK\n";
	} else {
		print "<li>一時ディレクトリパーミッション : NG\n";
	}
} else {
	print "<li>一時ディレクトリパス : NG\n";
}

# ログファイル
$cf{base64} = './lib/base64.pl';
my %log = (logfile => 'ログファイル', sesfile => 'セッションファイル', base64 => 'BASE64ライブラリ');
foreach ( keys %log ) {
	if (-f $cf{$_}) {
		print "<li>$log{$_}パス : OK\n";

		if ($_ ne 'base64') {
			if (-r $cf{$_} && -w $cf{$_}) {
				print "<li>$log{$_}パーミッション : OK\n";
			} else {
				print "<li>$log{$_}パーミッション : NG\n";
			}
		}
	} else {
		print "<li>$log{$_}パス : NG\n";
	}
}

# テンプレート
foreach (qw(conf.html err1.html err2.html thx.html mail.txt reply.txt)) {
	print "<li>テンプレートパス ( $_ ) : ";

	if (-f "$cf{tmpldir}/$_") {
		print "OK\n";
	} else {
		print "NG\n";
	}
}

print <<EOM;
</ul>
</body>
</html>
EOM
exit;


