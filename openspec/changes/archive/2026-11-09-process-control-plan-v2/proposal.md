# Proposal

## Why

V1 的精簡三列資料能展示譯文確認流程，但無法驗收完整 PCP 的欄位對應及尺寸、公差、抽樣數值是否保留。V2「完整 PCP 製程列展示」改用一筆工序 10「銑削」的完整虛構製程列，讓展示者逐欄核對中文來源與英文預覽，並在反應計畫欄驗收人工修改結果。

## What Changes

- 保留已整理的 18 欄與欄群表頭，以一筆工序 `10`、機台 `No.10` 的銑削資料取代 V1 三筆範例。
- spec 提供全部欄位的中文、固定美式英文及資料來源類型；反應計畫為唯一可編輯的模擬候選，其餘欄位使用固定虛構核准譯文或原值保留。
- 同頁英文預覽呈現完整 18 欄，依欄名對位；工序、機台、CCP、尺寸、公差、抽樣及其他數值字串原樣保留。
- 候選修改後須確認才更新預覽的 Reaction Plan；來源、空白檢查、撤回確認與重設沿用 V1 原則，作用對象改為同一製程列的反應計畫欄。
- 具體尺寸為已授權自製的虛構測試值；GR&R、製程能力與 DOE 仍如實標示未執行，不編造研究結果。
- 不納入 Excel 匯入／匯出、真正翻譯模型、後端、持久化或正式發行。本次只更新規格，不實作或測試。

## Capabilities

### New Capabilities

無。

### Modified Capabilities

- `process-doc-bilingual-sync`：將三筆精簡範例改為單筆完整 PCP，擴充欄位對應與原值保留契約，候選確認移至 Reaction Plan。delta 明確修改 V1 既有要求，避免主規格仍要求三列造成衝突。

## Impact

後續實作預計調整 src/fixture.ts、src/main.tsx、src/style.css、tests/prototype.spec.ts 與 README.md；不新增執行期依賴。現有程式仍是 V1，V1 歸檔與其自測證據保留。此次資料與欄位依使用者確認及現有 V2 的 18 欄整理，不宣稱已重新核對未取得的原始表頭圖片；背景文件使用實際存在的 .agents/skills/openspec-propose/OpenSpec_作業起步.md。
