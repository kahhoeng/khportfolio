# KH Portfolio

黃家禾 K.H Design 的作品集網站。純靜態 HTML / CSS / JavaScript，不需要編譯，推到 GitHub 就會由 GitHub Pages 發布。

## 資料夾結構

```
index.html                 入口頁：選「室內設計」或「行銷設計」
interior.html              室內設計作品集（投室內設計職缺時給這個網址）
marketing.html             行銷設計作品集（投行銷設計職缺時給這個網址）
works.html                 全部作品（不從入口連過去，只給直接網址）
projects/                  作品內頁
  case.html?id=作品id      通用內頁，資料在 assets/data/cases.json
  studio-grid.html         板橋小套房
  emerald.html             綠翡翠
assets/
  css/tokens.css           顏色、字體、間距（改風格先改這裡）
  css/main.css             版面與元件，依 Bootstrap 5 斷點由小到大撰寫
  js/main.js               入口：選單、捲動淡入、方塊動態
  js/works-index.js        Work Index（landing page 依 works.json 的 tracks 分列）
  js/track.js              作品內頁只連回同一個領域（室內／行銷），不會連到另一邊
  js/timeline.js           d3 經歷時間軸
  js/lightbox.js           圖片放大檢視
  js/i18n.js               中英切換
  data/works.json          作品清單；tracks 決定兩個 landing page 各放哪些作品
  data/cases.json          作品內頁的文字與圖片
  data/timeline.json       時間軸資料
  img/case/                作品圖（已裁切、去個資、壓縮）
  img/work/                課程作品圖
tools/resources.py         產生下方「資源清單」（GitHub Actions 推上去時自動執行）
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

<!-- RESOURCES:START -->
## 資源清單

> 自動產生，請勿手動修改。更新時間：2026-10-29

**總計 15.7 MB**，共 144 個檔案，約佔 GitHub Pages 建議上限（1 GB）的 1.5%。

### 分類小計

| 分類 | 檔案數 | 大小 |
|---|---:|---:|
| 作品圖（assets/img/case） | 81 | 13.1 MB |
| 課程作品圖（assets/img/work） | 27 | 2.2 MB |
| 頁面（HTML） | 11 | 154.5 KB |
| 程式（assets/js、vendor） | 8 | 82.2 KB |
| 資料（assets/data、i18n） | 4 | 54.1 KB |
| 樣式（assets/css） | 2 | 38.8 KB |
| 其他圖片（logo、點陣、大頭照） | 6 | 38.1 KB |
| 字型（assets/fonts） | 3 | 30.0 KB |
| 其他 | 2 | 24 B |

### 檔案明細（由大到小）

<details><summary>展開全部檔案</summary>

| 檔案 | 大小 |
|---|---:|
| `assets/img/case/dsg_site2.jpg` | 441.6 KB |
| `assets/img/case/dsg_site4.jpg` | 392.2 KB |
| `assets/img/case/web_fss.jpg` | 376.1 KB |
| `assets/img/case/dsg_site3.jpg` | 366.6 KB |
| `assets/img/case/dsg_site1.jpg` | 363.4 KB |
| `assets/img/case/web_home.jpg` | 357.1 KB |
| `assets/img/case/web_weld.jpg` | 356.6 KB |
| `assets/img/case/ikea_1.jpg` | 336.8 KB |
| `assets/img/case/ikea_cover.jpg` | 336.4 KB |
| `assets/img/case/sky_p3.jpg` | 326.1 KB |
| `assets/img/case/sky_p1.jpg` | 320.9 KB |
| `assets/img/case/ikea_2.jpg` | 274.2 KB |
| `assets/img/case/web_mock.jpg` | 272.5 KB |
| `assets/img/case/sky_p4.jpg` | 267.8 KB |
| `assets/img/case/sky_p2.jpg` | 266.7 KB |
| `assets/img/work/studio_render.jpg` | 265.0 KB |
| `assets/img/case/ikea_4.jpg` | 259.1 KB |
| `assets/img/case/sky_flow.jpg` | 255.2 KB |
| `assets/img/case/vm_truck.jpg` | 246.8 KB |
| `assets/img/case/rma_warranty_1.jpg` | 244.7 KB |
| `assets/img/case/rma_form.jpg` | 219.2 KB |
| `assets/img/work/emerald_render.jpg` | 217.0 KB |
| `assets/img/case/web_landing.jpg` | 213.3 KB |
| `assets/img/case/ikea_3.jpg` | 204.3 KB |
| `assets/img/case/vm_cam.jpg` | 202.5 KB |
| `assets/img/case/vm_blue.jpg` | 200.4 KB |
| `assets/img/case/sky_flow2.jpg` | 199.2 KB |
| `assets/img/case/next_kv.jpg` | 194.7 KB |
| `assets/img/work/cab_front.jpg` | 194.0 KB |
| `assets/img/case/sh_v2.jpg` | 184.1 KB |
| `assets/img/case/vm_shield.jpg` | 173.8 KB |
| `assets/img/work/cab_inner.jpg` | 171.8 KB |
| `assets/img/case/sky_fm.jpg` | 170.7 KB |
| `assets/img/work/cab_3d.jpg` | 170.3 KB |
| `assets/img/case/rma_warranty_2.jpg` | 168.2 KB |
| `assets/img/case/sky_dash.jpg` | 166.8 KB |
| `assets/img/work/emerald_02_layout.png` | 164.1 KB |
| `assets/img/case/sky_fm2.jpg` | 160.9 KB |
| `assets/img/case/ikea_6.jpg` | 160.2 KB |
| `assets/img/case/vm_hero.jpg` | 159.8 KB |
| `assets/img/case/rma_faq.jpg` | 158.2 KB |
| `assets/img/case/dfi_cra.jpg` | 156.3 KB |
| `assets/img/case/m360v_2.jpg` | 153.7 KB |
| `assets/img/case/sky_home.jpg` | 152.1 KB |
| `assets/img/case/ikea_7.jpg` | 151.0 KB |
| `assets/img/case/rma_sop_1.jpg` | 150.3 KB |
| `assets/img/work/emerald_01_survey.png` | 141.7 KB |
| `assets/img/case/next_sol.jpg` | 139.0 KB |
| `assets/img/case/next_dm.jpg` | 137.7 KB |
| `assets/img/case/vm_sop.jpg` | 130.2 KB |
| `assets/img/case/ikea_8.jpg` | 129.1 KB |
| `assets/img/case/vm_seat.jpg` | 125.4 KB |
| `assets/img/case/rma_sop_2.jpg` | 119.7 KB |
| `assets/img/case/rma_shipping.jpg` | 119.2 KB |
| `assets/img/case/next_core.jpg` | 117.2 KB |
| `assets/img/case/m360v_4.jpg` | 111.9 KB |
| `assets/img/work/studio_08_power.png` | 109.1 KB |
| `assets/img/case/next_about.jpg` | 108.9 KB |
| `assets/img/case/sh_banner.jpg` | 108.2 KB |
| `assets/img/case/sh_cat.jpg` | 104.1 KB |
| `assets/img/case/next_home.jpg` | 104.0 KB |
| `assets/img/case/web_ia1.jpg` | 103.3 KB |
| `assets/img/case/vm_rising2.jpg` | 100.1 KB |
| `assets/img/case/m360v_3.jpg` | 99.0 KB |
| `assets/img/case/ikea_5.jpg` | 96.9 KB |
| `assets/img/case/dfi_blog1.jpg` | 94.9 KB |
| `assets/img/case/dfi_blog2.jpg` | 93.1 KB |
| `assets/img/case/m360v_1.jpg` | 92.4 KB |
| `assets/img/case/vm_edm.jpg` | 89.4 KB |
| `assets/img/case/sh_story.jpg` | 82.7 KB |
| `assets/img/case/dfi_li2.jpg` | 81.8 KB |
| `assets/img/case/dfi_li1.jpg` | 81.8 KB |
| `assets/img/case/dsg_pick.jpg` | 78.7 KB |
| `assets/img/case/web_wf.jpg` | 77.7 KB |
| `assets/img/case/vm_rising3.jpg` | 77.1 KB |
| `assets/img/work/cab_back3d.jpg` | 77.0 KB |
| `assets/img/case/dsg_plan.jpg` | 75.7 KB |
| `assets/img/case/vm_rising4.jpg` | 73.5 KB |
| `assets/img/case/sky_compare.jpg` | 72.9 KB |
| `assets/img/case/sh_v1.jpg` | 72.7 KB |
| `assets/img/case/dsg_vr2.jpg` | 72.5 KB |
| `assets/img/work/studio_04_partition.png` | 69.7 KB |
| `assets/img/case/dsg_vr1.jpg` | 67.0 KB |
| `assets/img/work/studio_02_layout.png` | 66.2 KB |
| `assets/img/case/vm_zone.jpg` | 65.8 KB |
| `assets/img/case/rma_flow_v1.jpg` | 64.7 KB |
| `assets/img/work/studio_05_floor.png` | 64.1 KB |
| `assets/img/work/cab_top.jpg` | 62.9 KB |
| `assets/img/case/sky_adv.jpg` | 61.1 KB |
| `assets/img/case/dfi_sop.jpg` | 61.0 KB |
| `assets/img/case/vm_rising5.jpg` | 59.7 KB |
| `assets/img/case/vm_rising1.jpg` | 57.8 KB |
| `assets/img/work/cab_side.jpg` | 55.7 KB |
| `assets/img/case/web_ia2.jpg` | 52.6 KB |
| `assets/img/work/studio_03_demo.png` | 49.7 KB |
| `assets/img/work/studio_07_plumbing.png` | 46.8 KB |
| `assets/img/work/bath_plan.png` | 44.6 KB |
| `assets/vendor/d3-lite.min.js` | 44.5 KB |
| `assets/img/work/bed_elevA.png` | 41.4 KB |
| `assets/img/work/studio_01_survey.png` | 40.3 KB |
| `assets/img/case/rma_flow_v2.jpg` | 38.3 KB |
| `assets/data/cases.json` | 38.3 KB |
| `assets/css/main.css` | 36.2 KB |
| `assets/img/work/bed_elevB.png` | 35.8 KB |
| `assets/img/work/bed_circuit.png` | 34.0 KB |
| `assets/img/work/bath_elev.png` | 31.3 KB |
| `assets/img/work/bed_layout.png` | 27.7 KB |
| `assets/img/work/bed_survey.png` | 27.0 KB |
| `assets/img/work/studio_06_ceiling.png` | 23.9 KB |
| `marketing.html` | 23.8 KB |
| `interior.html` | 22.8 KB |
| `projects/case.html` | 20.1 KB |
| `assets/img/portrait.jpg` | 19.5 KB |
| `projects/emerald.html` | 18.8 KB |
| `assets/img/work/bed_lightpos.png` | 17.1 KB |
| `assets/img/work/bed_ceiling.png` | 16.7 KB |
| `projects/studio-grid.html` | 16.4 KB |
| `assets/fonts/GenWanMin2TW-M-latin.woff2` | 12.9 KB |
| `projects/studio.html` | 12.8 KB |
| `assets/fonts/GenWanMin2TW-R-latin.woff2` | 12.8 KB |
| `assets/data/works.json` | 11.5 KB |
| `projects/bedroom.html` | 11.2 KB |
| `assets/js/works-index.js` | 10.8 KB |
| `projects/cabinet.html` | 9.7 KB |
| `assets/img/logo/kh-design-lockup.svg` | 9.2 KB |
| `assets/js/main.js` | 7.8 KB |
| `index.html` | 7.4 KB |
| `projects/bathroom.html` | 7.2 KB |
| `assets/js/timeline.js` | 6.1 KB |
| `assets/img/logo/kh-design-wordmark.svg` | 5.4 KB |
| `assets/js/works.js` | 4.8 KB |
| `assets/fonts/GenWanMin-OFL.txt` | 4.4 KB |
| `works.html` | 4.2 KB |
| `assets/js/track.js` | 3.7 KB |
| `assets/data/timeline.json` | 3.2 KB |
| `assets/css/tokens.css` | 2.6 KB |
| `assets/js/i18n.js` | 2.4 KB |
| `assets/js/lightbox.js` | 2.2 KB |
| `assets/img/dots/matrix_dot_1.svg` | 1.6 KB |
| `assets/img/dots/matrix_dot_2.svg` | 1.6 KB |
| `assets/i18n/en.json` | 1.1 KB |
| `assets/img/dots/progress_dot.svg` | 790 B |
| `.gitignore` | 24 B |
| `.nojekyll` | 0 B |

</details>
<!-- RESOURCES:END -->
