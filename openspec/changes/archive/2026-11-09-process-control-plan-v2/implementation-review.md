# V2 實作與原型自測紀錄

- 變更：process-control-plan-v2；schema：spec-driven。
- 日期：2026-11-09（Asia/Taipei）。
- 實作：src/fixture.ts、src/main.tsx、src/style.css、index.html、README.md；測試：tests/prototype.spec.ts、playwright.config.ts。
- 依使用者授權採本機 Playwright 1.65.0 + Chromium；不宣稱使用 MCP，也不將原型自測視為目標客戶驗證。
- 首輪選定 E2E-001～E2E-005，5/5 自動案例通過。截圖複查發現群組標題在窄視窗右端不可見，於任務 1.2 內增加群組文字水平固定，並新增可見範圍斷言。修復迭代 1 次；重測全部五例通過。
- 最終 `pnpm.cmd build` 通過 TypeScript strict 型別檢查及 Vite production build。沙箱的上層路徑讀取錯誤以授權的沙箱外建置解決。
- Playwright 測試啟動的 Vite 已由 runner 自動停止；另啟動服務供使用者試走，非遺留測試程序。

## 規格對照

| 核准範圍 | 實作與觀察 |
|---|---|
| 單筆工序 10 銑削，18 欄中英文 | 共用具型別欄位鍵與群組表頭；測試直接讀取 spec 資料表作預期值，逐欄比對全部中文與英文 |
| 正確欄位與原值保留 | 工序 10、No.10、JIG-010、ΔP、3000 rpm、200 mm/min、20.00 ± 0.02 mm、3 pcs、60 min、DOE N 均限定對應欄檢查，完整文字逐字相符 |
| 反應計畫候選更新 | 唯一可編輯欄為 Reaction Plan；確認後更新該欄，其他 17 欄與所有來源中文的四階段快照一致 |
| 來源辨識與生命週期 | 固定英文標虛構核准；原值標原值保留；候選保留模擬、人工修改與確認標籤；trim、空白阻擋、再次編輯撤回、重複套用及重設均通過 |
| 寬表桌面與窄視窗 | 1440 × 900 及 390 × 844 兩表水平捲動通過；修正後 Process Information 群組標題在最右仍可見 |
| 展示限制 | 無模型／Excel／正式品質判定；未執行 GR&R、能力、DOE 或 CCP 實際驗證。接受非空白中文候選並顯示品質邊界提示 |

完整結果：[results.json](e2e-evidence/results.json)。逐欄觀察：[E2E-002-fields.json](e2e-evidence/E2E-002-fields.json)。四階段比較：[E2E-003-state-comparison.json](e2e-evidence/E2E-003-state-comparison.json)。截圖與逐案狀態：[e2e-testing.md](e2e-testing.md)。

未觀察到 pageerror、console error、失敗請求或外部模型／檔案服務請求；全部規格情境皆有驗收案例對應，未放寬預期。V1 歸檔與證據未改動。V2 尚未歸檔，等待使用者親自試走。
