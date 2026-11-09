# V1 實作與原型自測紀錄

- 變更：process-doc-bilingual-sync-assistant-prototype-v1，schema：spec-driven。
- 日期：2026-11-09，Asia/Taipei。
- 測試方式：依使用者「你直接用可以用的playwright」授權，以本機 Playwright 1.65.0 + Chromium 取代 MCP；原案例、預期與範圍不變。
- 第一輪實作檔案：package.json、pnpm-lock.yaml、pnpm-workspace.yaml、index.html、tsconfig.json、vite.config.ts、src/fixture.ts、src/main.tsx、src/style.css、README.md、playwright.config.ts、tests/prototype.spec.ts。
- 首輪選定全部案例 E2E-001、002、003、004、005、007、006（清單順序）。結果 7 通過、0 失敗、0 略過；無修復迭代。測試結束已停止其 Vite 服務。
- `pnpm.cmd build` 通過 TypeScript strict 型別檢查與 Vite production build。
- 安裝時 pnpm 阻擋 esbuild 建置腳本，已限定允許 esbuild 並完成安裝；沙箱造成 Vite 路徑讀取權限錯誤後，經授權在沙箱外成功建置與執行測試。

## 範圍與實際介面對照

| 規格 | 實際實作與驗證 |
|---|---|
| 單一內建 PCP、兩筆核准、一筆候選 | fixture 與 specs 三列逐欄比對一致；001、002 通過 |
| 來源及狀態以文字持續辨識 | 編輯表與英文結果均保留 AP 來源／模擬候選，人工修改標示與確認狀態分列；003、004 截圖核對 |
| 候選確認與前後空白 | trim 儲存、空白阻擋、再次編輯撤回確認；004、005 通過 |
| 同頁英文預覽與四階段更新 | 未確認不進結果、確認後逐字匹配、前兩筆不變；004 四個檢查點皆有截圖 |
| 品質檢查邊界 | 不判斷英文或品質；007 接受中文非空白確認並顯示邊界提示 |
| 重設與記憶體狀態 | 重設與重新整理皆回到初始值；006 通過 |
| 模型與 Excel 不納入 | 介面有範圍標示、無檔案上傳下載；全部測試無外部服務請求 |
| 桌面展示與開啟說明 | 1440 × 900 全頁截圖核對；README 提供啟動及親自試走步驟 |

完整測試斷言結果見 [results.json](e2e-evidence/results.json)，逐案證據見 [e2e-testing.md](e2e-testing.md)。未觀察到使案例失效的瀏覽器 console error、pageerror 或失敗請求。畫面使用同頁下方預覽，1440 × 900 視窗需向下捲動查看完整結果。

本次實作與核准規格無未處理偏差；未進行正式資料、翻譯品質、目標客戶或手機版驗證。等待使用者親自試走；尚未歸檔，未建立 V2。
