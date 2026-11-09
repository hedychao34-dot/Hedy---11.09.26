# E2E Testing Checklist

## Test Setup

- **Start URL / route:** http://127.0.0.1:5173/
- **Viewport(s):** 桌面 1440 × 900；窄視窗 390 × 844。
- **Test data / accounts:** 內建 PCP-DEMO-002 唯一工序 10 銑削；無帳號。固定中英文與原值以 spec 18 欄資料表為準。
- **Prerequisites:** 執行 pnpm.cmd dev；每例以全新頁面開始。若使用既有自動啟停 webServer 的 runner，先停止人工啟動服務。
- **External dependencies:** 無。沿用使用者對可用本機 Playwright 的授權，亦可用 Playwright MCP；執行時如實記錄工具與版本，不混稱。

本清單已使用本機 Playwright 1.65.0 + Chromium 執行原型自測：5/5 通過、0 失敗、0 略過。首輪自動案例全通過；截圖複查後修正窄視窗群組標題 1 輪，再完整重跑 5 項均通過。非目標客戶驗證。結果見 e2e-evidence/results.json。

## 1. 結構、資料與數值

- [x] E2E-001 18 欄與雙表欄群
  - **Priority:** High
  - **Prerequisites:** 初始 V2 頁面。
  - **Steps:**
    1. 桌面開啟頁面，查看 PCP-DEMO-002、工序 10 銑削及全部範圍提示，按「英文預覽」。
    2. 對來源與預覽逐一核對 spec 18 欄的名稱、順序與欄群。
    3. 改為窄視窗，各表水平捲至最右、再回最左。
  - **Expected results:**
    1. 只有一筆工序 10；兩表共用 18 欄順序，Characteristics 含 4–5、Methods 含 7–14、Sample Plan 含 9–11、Process Information 含 15–18。
    2. 最左工序至最右 DOE 均可檢視，沒有重排或隱藏欄位。初始原值可見、固定譯文尚未套用。
    3. 虛構 PCP、非正式製造或品質放行依據、無模型、Excel 不納入 V2 與重新整理不保留提示可見；無檔案上傳下載控制。
  - **Evidence:** 桌面表頭及兩表窄視窗最左／最右截圖，記錄欄群與視窗尺寸。
  - **Last run:** 2026-11-09 22:45 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-001-desktop-preview.png](e2e-evidence/E2E-001-desktop-preview.png), [E2E-001-desktop-source.png](e2e-evidence/E2E-001-desktop-source.png), [E2E-001-narrow-preview-left.png](e2e-evidence/E2E-001-narrow-preview-left.png), [E2E-001-narrow-preview-right.png](e2e-evidence/E2E-001-narrow-preview-right.png), [E2E-001-narrow-source-left.png](e2e-evidence/E2E-001-narrow-source-left.png), [E2E-001-narrow-source-right.png](e2e-evidence/E2E-001-narrow-source-right.png)
  - **Observed evidence:** http://127.0.0.1:5173/；瀏覽器斷言全通過，無 pageerror、console error、失敗或外部服務請求。詳見 e2e-evidence/E2E-001-browser.json。
  - **Cleanup:** 重新整理並恢復桌面。

- [x] E2E-002 完整英文逐欄對位及數值保留
  - **Priority:** Critical
  - **Prerequisites:** 初始頁面。
  - **Steps:**
    1. 按「套用核准譯文」，不改候選直接「確認候選」，按「英文預覽」。
    2. 逐欄核對來源中文及預覽英文，與 spec 18 欄資料表比較；以欄名限定範圍，不能只搜尋整頁。
    3. 在指定欄逐字比對 10、No.10、JIG-010、ΔP、3000 rpm、200 mm/min、20.00 ± 0.02 mm、3 pcs、60 min、DOE N。
  - **Expected results:**
    1. 18 欄英文全部對應正確欄位，未執行研究的說明與 spec 一致，未編造能力或 GR&R 結果。
    2. 數值、識別字、單位、± 與尾零完全保留，不換算、不跨欄；特別檢查規格欄不是 20 ± 0.02 mm。
    3. 表格與預覽的固定英文為虛構核准來源，原值欄顯示原值保留，Reaction Plan 為模擬候選／本次已確認，完成及品質邊界提示可見。
  - **Evidence:** 分段保存能辨識全部欄名及內容的來源／預覽截圖，另保存逐欄字串比較紀錄；單一寬表縮圖不算完整證據。
  - **Last run:** 2026-11-09 22:45 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-002-columns-0.png](e2e-evidence/E2E-002-columns-0.png), [E2E-002-columns-1700.png](e2e-evidence/E2E-002-columns-1700.png), [E2E-002-columns-2350.png](e2e-evidence/E2E-002-columns-2350.png), [E2E-002-columns-3100.png](e2e-evidence/E2E-002-columns-3100.png), [E2E-002-columns-850.png](e2e-evidence/E2E-002-columns-850.png)
  - **Observed evidence:** http://127.0.0.1:5173/；瀏覽器斷言全通過，無 pageerror、console error、失敗或外部服務請求。詳見 e2e-evidence/E2E-002-browser.json。
  - **Field evidence:** [逐欄比對](e2e-evidence/E2E-002-fields.json)
  - **Cleanup:** 重設示範。

## 2. 反應計畫候選

- [x] E2E-003 四階段候選更新且其他欄位不變
  - **Priority:** Critical
  - **Prerequisites:** 初始頁面，按套用與英文預覽。
  - **Steps:**
    1. 在 Reaction Plan 候選輸入 `If an out-of-tolerance condition is detected, stop machining, segregate all parts produced since the last accepted inspection, and notify the quality engineer.`，前後各加兩個空白，先不確認。
    2. 再次套用，確認編輯保留，按「確認候選」。
    3. 在已確認候選尾端加 ` Please review.`，先不確認。
    4. 再次確認；在每個階段比對其餘 17 欄及來源中文。
  - **Expected results:**
    1. 未確認時 Reaction Plan 顯示「待確認，尚未納入英文結果」，頂部「未完成：1 筆待確認」。
    2. 首次確認後，只有 Reaction Plan 更新，逐字等於 trim 後輸入；顯示人工修改模擬來源與本次已確認。
    3. 再次編輯立即撤回確認並清除預覽舊結果，重新確認才顯示新文字。
    4. 四個階段其餘 17 欄內容、數值與來源中文均不變，工序 10 的 Process Name 仍是 Milling。確認後保留非正式發行與未檢查翻譯品質提示。
  - **Evidence:** 四個狀態的 Reaction Plan 及鄰近欄位截圖；另存其餘 17 欄前後比對，包含 E2E-002 全部數值字串。
  - **Last run:** 2026-11-09 22:45 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-003-1-edited.png](e2e-evidence/E2E-003-1-edited.png), [E2E-003-2-confirmed.png](e2e-evidence/E2E-003-2-confirmed.png), [E2E-003-3-reedited.png](e2e-evidence/E2E-003-3-reedited.png), [E2E-003-4-reconfirmed.png](e2e-evidence/E2E-003-4-reconfirmed.png)
  - **Observed evidence:** http://127.0.0.1:5173/；瀏覽器斷言全通過，無 pageerror、console error、失敗或外部服務請求。詳見 e2e-evidence/E2E-003-browser.json。
  - **State evidence:** [四階段及其他 17 欄比對](e2e-evidence/E2E-003-state-comparison.json)
  - **Cleanup:** 重設示範。

- [x] E2E-004 空白阻擋與品質邊界
  - **Priority:** High
  - **Prerequisites:** 初始頁面，按套用與英文預覽。
  - **Steps:**
    1. 清空反應計畫候選後確認，再以三個空白字元重試。
    2. 改填「人工檢查範例」並確認。
  - **Expected results:**
    1. 兩種空白均顯示「請輸入英文候選譯文」，保持待確認及佔位。
    2. 非空白中文可確認並原樣出現在 Reaction Plan，品質邊界及非正式發行標示可見；不宣稱翻譯品質合格。
  - **Evidence:** 空白錯誤與品質邊界截圖，記錄瀏覽器 console／network 錯誤。
  - **Last run:** 2026-11-09 22:45 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-004-empty.png](e2e-evidence/E2E-004-empty.png), [E2E-004-quality.png](e2e-evidence/E2E-004-quality.png)
  - **Observed evidence:** http://127.0.0.1:5173/；瀏覽器斷言全通過，無 pageerror、console error、失敗或外部服務請求。詳見 e2e-evidence/E2E-004-browser.json。
  - **Cleanup:** 重設示範。

- [x] E2E-005 重設及重新整理回到 V2
  - **Priority:** High
  - **Prerequisites:** 初始頁面。
  - **Steps:**
    1. 套用、修改反應計畫為 Demo edit.、確認並展開預覽，按「重設示範」。
    2. 重做操作，這次重新整理；兩次均重新開啟預覽檢查。
  - **Expected results:**
    1. 兩次均回到唯一工序 10 銑削，18 欄中文與原值符合 spec，固定英文尚未套用，候選編輯及確認清除。
    2. 不出現 V1 三列或舊英文結果；原值字串不變，可重新套用操作。
  - **Evidence:** 兩種回復後截圖及可見文字，記錄無外部模型或檔案服務請求。
  - **Last run:** 2026-11-09 22:45 Asia/Taipei — PASS
  - **Screenshot evidence:** [E2E-005-reload.png](e2e-evidence/E2E-005-reload.png), [E2E-005-reset.png](e2e-evidence/E2E-005-reset.png)
  - **Observed evidence:** http://127.0.0.1:5173/；瀏覽器斷言全通過，無 pageerror、console error、失敗或外部服務請求。詳見 e2e-evidence/E2E-005-browser.json。
  - **Cleanup:** 重新整理；停止本輪測試啟動的服務。

## Traceability

| Spec scenario | E2E case(s) | Notes |
|---|---|---|
| 載入展示 | E2E-001 | 單筆資料與範圍 |
| 套用既有核准資料 | E2E-002、003 | 固定欄與候選欄 |
| 重複套用保留人工處理 | E2E-003 | 編輯不得被覆蓋 |
| 保留候選確認 | E2E-002 | 原候選完整預覽 |
| 修改候選確認 | E2E-003 | 限定 Reaction Plan |
| 去除前後空白 | E2E-003 | trim 後逐字相符 |
| 阻擋空白確認 | E2E-004 | 空字串與純空白 |
| 再次編輯撤回確認 | E2E-003 | 舊結果移除 |
| 未完成預覽 | E2E-001、003 | 初始與候選未確認 |
| 完整英文結果 | E2E-002 | 全 18 欄 |
| 修改候選的四階段預覽 | E2E-003 | 其他 17 欄不變 |
| 確認後保留來源 | E2E-002、003 | 核准、模擬、原值來源 |
| 非空白內容不代表品質通過 | E2E-004 | 人工檢查 |
| 重設或重新整理 | E2E-005 | V2 初始值 |
| 顯示完整欄群與欄位順序 | E2E-001 | 群組與欄名 |
| 顯示完整的銑削範例與欄位對位 | E2E-002 | 逐欄對照 |
| 數值與標記逐欄保留 | E2E-002、003 | 原字串限定欄位 |
| 窄視窗檢視完整 PCP 表格 | E2E-001 | 來源與預覽兩表 |

