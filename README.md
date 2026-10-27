# KH Portfolio

黃家禾 K.H. NG 的作品集網站。純靜態 HTML / CSS / JavaScript，不需要編譯，推到 GitHub 就會由 GitHub Pages 發布。

## 資料夾結構

```
index.html                 首頁（Hero、About、時間軸、Work Index、Photography、Contact）
projects/                  作品內頁
  cabinet.html             01 組合櫃
  bedroom.html             02 臥室
  bathroom.html            03 浴廁
assets/
  css/tokens.css           顏色、字體、間距（改風格先改這裡）
  css/main.css             版面與元件，依 Bootstrap 5 斷點由小到大撰寫
  js/main.js               入口：選單、捲動淡入、方塊視差
  js/works.js              讀 works.json 產生作品卡片與篩選
  js/timeline.js           d3 經歷時間軸
  js/lightbox.js           圖片放大檢視
  js/i18n.js               中英切換
  data/works.json          作品清單
  data/timeline.json       時間軸資料
  i18n/en.json             英文文案
  img/work/                作品圖
  vendor/d3-lite.min.js    打包好的 d3 子模組
```

## 常見修改

**新增作品**：在 `assets/data/works.json` 的 `works` 複製一筆來改。`cat` 填 `space`、`video` 或 `ui`；`thumb` 留空會顯示灰色方塊佔位；`href` 留空代表內頁還沒做。

**修改時間軸**：編輯 `assets/data/timeline.json`。標示 `[待確認]` 的內容請改成正確資訊。

**放照片**：
- 大頭照：放到 `assets/img/portrait.jpg`，再把 `index.html` 裡 About 區塊的「照片待補」換成 `<img src="assets/img/portrait.jpg" alt="黃家禾">`
- 空拍：放到 `assets/img/photo/`，替換 Photography 區塊的佔位方塊

**聯絡方式**：`index.html` 的 Contact 區塊，把 `[Email]`、`[電話]` 換掉。

**開啟英文**：
1. 填好 `assets/i18n/en.json`，以及 `works.json`、`timeline.json` 裡各筆的 `en` 欄位
2. 把 `assets/js/i18n.js` 的 `ENABLE_EN` 改成 `true`，右上角就會出現「中 / EN」切換

## 響應式斷點（Bootstrap 5）

| 名稱 | 寬度 | 主要變化 |
|---|---|---|
| xs | < 576 | 單欄、漢堡選單 |
| sm | ≥ 576 | 技能 3 欄、照片 3 欄 |
| md | ≥ 768 | 作品 2 欄、圖面並排 |
| lg | ≥ 992 | 桌面導覽列、About 左右分欄、作品 3 欄 |
| xl | ≥ 1200 | 區塊標題橫向排列 |
| xxl | ≥ 1400 | 版心加寬到 1280px |

## 本機預覽

資料用 `fetch` 讀取，直接雙擊 HTML 檔打不開資料，請在資料夾內啟動本機伺服器：

```bash
python3 -m http.server 8000
# 打開 http://localhost:8000
```

## 更新 d3

目前只打包時間軸用到的 `d3-selection`、`d3-scale`、`d3-axis`、`d3-time-format`。需要其他 d3 功能時：

```bash
npm i d3-selection d3-scale d3-axis d3-time-format esbuild
# 在 entry.js 加入要匯出的函式，然後：
npx esbuild entry.js --bundle --format=esm --minify --outfile=assets/vendor/d3-lite.min.js
```

d3 採 ISC 授權，© Mike Bostock。
