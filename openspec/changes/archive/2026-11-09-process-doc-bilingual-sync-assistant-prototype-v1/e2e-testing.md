# E2E Testing Checklist

本清單已依使用者授權改用本機 Playwright + Chromium 執行；本次為原型自測，非目標客戶驗證。7/7 通過，0 失敗、0 略過，修復迭代 0 次。完整機器結果見 e2e-evidence/results.json。

## Test Setup

- **Start URL / route:** http://127.0.0.1:5173/ ，路由 `/`。
- **Viewport(s):** 桌面 1440 × 900。
- **Test data / accounts:** 內建 PCP-DEMO-001、兩筆虛構核准記憶 AP-001/AP-002 與一筆固定候選；不需帳號。
- **Prerequisites:** 執行 `pnpm.cmd test:e2e`；Playwright 自動以 `pnpm.cmd dev` 啟動本機前端並在結束後停止。無模型、外部 API、Excel 或資料庫依賴。瀏覽器為 Chromium，1440 × 900。

## 1. 載入與核准套用

- [x] E2E-001 初始資料與邊界
  - **Priority:** High
  - **Prerequisites:** 開啟全新頁面。
  - **Steps:**
    1. 開啟 `/`，查看文件標頭、三列來源、操作說明。
    2. 按「英文預覽」。
  - **Expected results:**
    1. 顯示 PCP-DEMO-001 與 specs 指定三列中文、所有虛構／模型／Excel 標示，以及重新整理不保留提示；來源唯讀，沒有上傳下載控制。
    2. 三列英文均為尚未套用，預覽為未完成。
  - **Evidence:** 保存初始頁及預覽截圖、可見文字、URL 與 console 錯誤紀錄。
  - **Last run:** 2026-11-09 21:29 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-001-initial.png](e2e-evidence/E2E-001-initial.png), [E2E-001-preview.png](e2e-evidence/E2E-001-preview.png)
  - **Observed evidence:** http://127.0.0.1:5173/；所有預期斷言通過，無 pageerror、console error、失敗請求或外部服務請求。
  - **Cleanup:** 重新整理。

- [x] E2E-002 套用與未確認預覽
  - **Priority:** Critical
  - **Prerequisites:** 初始頁面。
  - **Steps:**
    1. 按「套用核准譯文」。
    2. 查看三列英文、狀態及來源，再按「英文預覽」。
  - **Expected results:**
    1. 10、20 精確顯示 specs 中的兩筆英文與 AP-001/AP-002；核准套用數 2。30 顯示固定模擬候選、待確認數 1。
    2. 預覽在同頁展開並保留三列，前兩筆英文及虛構核准來源可見；30 顯示「模擬候選」與「待確認，尚未納入英文結果」，候選英文留在編輯區。頂部顯示「未完成：1 筆待確認」。
  - **Evidence:** 保存套用後表格與未完成預覽截圖，記錄英文及狀態文字。
  - **Last run:** 2026-11-09 21:29 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-002-applied.png](e2e-evidence/E2E-002-applied.png), [E2E-002-preview.png](e2e-evidence/E2E-002-preview.png)
  - **Observed evidence:** http://127.0.0.1:5173/；所有預期斷言通過，無 pageerror、console error、失敗請求或外部服務請求。
  - **Cleanup:** 按「重設示範」。

## 2. 候選處理與預覽

- [x] E2E-003 保留候選確認
  - **Priority:** Critical
  - **Prerequisites:** 初始頁面，按「套用核准譯文」。
  - **Steps:**
    1. 不更動候選，按「確認候選」。
    2. 按「英文預覽」，再按一次「套用核准譯文」。
  - **Expected results:**
    1. 30 為本次已確認、待確認數 0，核准數仍為 2；不呈現為既有核准資料。
    2. 三列依 10、20、30 排序，30 等於原候選；表格與預覽均以文字保留前兩列核准來源 ID（虛構），第三列同時顯示「模擬候選」與「本次已確認」。顯示「預覽完成／非正式發行」與「已完成本次確認，未自動檢查翻譯品質」。重複套用保留確認文字及狀態。
  - **Evidence:** 保存完整預覽與狀態截圖。
  - **Last run:** 2026-11-09 21:29 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-003-confirmed.png](e2e-evidence/E2E-003-confirmed.png)
  - **Observed evidence:** http://127.0.0.1:5173/；所有預期斷言通過，無 pageerror、console error、失敗請求或外部服務請求。
  - **Cleanup:** 按「重設示範」。

- [x] E2E-004 修改、重複套用與撤回確認
  - **Priority:** Critical
  - **Prerequisites:** 初始頁面，按「套用核准譯文」。
  - **Steps:**
    1. 按「英文預覽」，將候選改成 `If an abnormality is detected, segregate the affected lot and notify the line supervisor.`，前後各加兩個空白；先不確認，查看預覽。
    2. 再按「套用核准譯文」，確認編輯保留，再按「確認候選」，查看已展開預覽。
    3. 將候選尾端加上 ` Please review.`，先不確認，查看預覽。
    4. 再按「確認候選」，查看預覽。
  - **Expected results:**
    1. 首次修改未確認時，30 顯示「待確認，尚未納入英文結果」，頂部顯示「未完成：1 筆待確認」。
    2. 重複套用未清除編輯；首次確認後預覽逐字等於去除前後空白後的輸入。表格與預覽第三列均顯示「模擬候選，經人工修改」及「本次已確認」。
    3. 再次編輯立即撤回確認，第三列回到待確認佔位，頂部恢復未完成提示。
    4. 再次確認後逐字呈現去除前後空白後的新文字，顯示完成與品質邊界提示；四個狀態中的前兩筆核准英文、來源與狀態始終不變。
  - **Evidence:** 保存修改未確認、確認、再次編輯、再次確認四個狀態截圖及可見文字，包含來源與狀態標籤。
  - **Last run:** 2026-11-09 21:29 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-004-1-edited.png](e2e-evidence/E2E-004-1-edited.png), [E2E-004-2-confirmed.png](e2e-evidence/E2E-004-2-confirmed.png), [E2E-004-3-reedited.png](e2e-evidence/E2E-004-3-reedited.png), [E2E-004-4-reconfirmed.png](e2e-evidence/E2E-004-4-reconfirmed.png)
  - **Observed evidence:** http://127.0.0.1:5173/；所有預期斷言通過，無 pageerror、console error、失敗請求或外部服務請求。
  - **Cleanup:** 按「重設示範」。

- [x] E2E-005 阻擋空白
  - **Priority:** High
  - **Prerequisites:** 初始頁面，按「套用核准譯文」。
  - **Steps:**
    1. 清空候選並按「確認候選」，再以三個空白字元重試。
    2. 按「英文預覽」。
  - **Expected results:**
    1. 兩次均顯示「請輸入英文候選譯文」並保持待確認。
    2. 第三列只有待確認佔位，整體未完成。
  - **Evidence:** 保存錯誤提示與預覽狀態截圖。
  - **Last run:** 2026-11-09 21:29 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-005-empty-error.png](e2e-evidence/E2E-005-empty-error.png)
  - **Observed evidence:** http://127.0.0.1:5173/；所有預期斷言通過，無 pageerror、console error、失敗請求或外部服務請求。
  - **Cleanup:** 按「重設示範」。

## 3. 重複展示

- [x] E2E-007 確認流程不判定翻譯品質
  - **Priority:** High
  - **Prerequisites:** 初始頁面，按「套用核准譯文」。
  - **Steps:**
    1. 將候選改成「人工檢查範例」，按「確認候選」與「英文預覽」。
  - **Expected results:**
    1. 非空白內容可確認且原樣呈現，第三列保留人工修改的模擬來源與本次已確認標示。
    2. 顯示「已完成本次確認，未自動檢查翻譯品質」與「非正式發行」，無語言或翻譯品質通過宣稱。
  - **Evidence:** 保存預覽、來源及品質邊界提示截圖。
  - **Last run:** 2026-11-09 21:29 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-007-quality-boundary.png](e2e-evidence/E2E-007-quality-boundary.png)
  - **Observed evidence:** http://127.0.0.1:5173/；所有預期斷言通過，無 pageerror、console error、失敗請求或外部服務請求。
  - **Cleanup:** 按「重設示範」。

- [x] E2E-006 重設與重新整理
  - **Priority:** High
  - **Prerequisites:** 初始頁面。
  - **Steps:**
    1. 套用核准譯文、修改候選為 `Demo edit.` 並確認，按「重設示範」。
    2. 重做上述操作，這次重新整理瀏覽器。
  - **Expected results:**
    1. 兩種方式均回復初始三列與尚未套用狀態，清除編輯與確認；預覽無舊英文結果，仍保留範圍標示，可重新套用。
  - **Evidence:** 保存兩次回復後狀態、console 及 network 錯誤；確認操作沒有翻譯模型或檔案服務請求。
  - **Last run:** 2026-11-09 21:29 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-006-reload.png](e2e-evidence/E2E-006-reload.png), [E2E-006-reset.png](e2e-evidence/E2E-006-reset.png)
  - **Observed evidence:** http://127.0.0.1:5173/；所有預期斷言通過，無 pageerror、console error、失敗請求或外部服務請求。
  - **Cleanup:** 重新整理。

## Traceability

| Spec scenario | E2E case(s) | Notes |
|---|---|---|
| 載入展示 | E2E-001 | 展示方式、模擬與 Excel 邊界 |
| 套用既有核准資料 | E2E-002 | 完整英文與來源 |
| 重複套用保留人工處理 | E2E-003、E2E-004 | 編輯與確認兩種狀態 |
| 保留候選確認 | E2E-003 | 人工確認不等於核准記憶 |
| 修改候選確認 | E2E-004 | 修改反映於預覽 |
| 去除前後空白 | E2E-004 | 正規化後逐字比對 |
| 修改候選的四階段預覽 | E2E-004 | 四個狀態均保存證據 |
| 確認後保留來源 | E2E-003、E2E-004 | 原候選與人工修改均保留文字來源 |
| 非空白內容不代表品質通過 | E2E-007 | 只驗證確認流程 |
| 阻擋空白確認 | E2E-005 | 空值及純空白 |
| 再次編輯撤回確認 | E2E-004 | 防止過期結果 |
| 未完成預覽 | E2E-001、E2E-002、E2E-005 | 初始與待確認 |
| 完整英文結果 | E2E-003、E2E-004 | 保留及修改結果 |
| 重設或重新整理 | E2E-006 | 記憶體生命週期 |

