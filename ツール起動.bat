@echo off
chcp 932 >nul
cd /d "%~dp0"
title ロト＆ナンバーズ 統合構造解析・出目表可視化ツール

echo ======================================================
echo  ロト＆ナンバーズ 統合構造解析・出目表可視化ツール
echo ======================================================
echo.

if not exist "node_modules\" (
    echo [初期設定] 依存パッケージをインストールしています...
    call npm install
    if errorlevel 1 (
        echo [エラー] npm install に失敗しました。Node.js がインストールされているか確認してください。
        pause
        exit /b 1
    )
)

echo [起動] 開発サーバーを起動し、ブラウザを開きます...
echo ※ 終了する場合はこのウィンドウを閉じるか Ctrl+C を押してください。
echo.

start http://localhost:5173/
call npm run dev

pause
