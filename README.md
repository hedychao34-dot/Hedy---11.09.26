# 製程文件雙語同步助理 Prototype V2

「完整 PCP 製程列展示」使用唯一 PCP-DEMO-002：工序 10 銑削、機台 No.10，共 18 欄。所有核准譯文、尺寸、公差、抽樣與 CCP 皆為虛構測試資料，非正式製造或品質放行依據。無真正翻譯模型、Excel 匯入／匯出、帳號、後端或資料庫。GR&R、製程能力、DOE 與實際 CCP 驗證未執行。

## 開啟

在專案根目錄 PowerShell 執行：

```powershell
pnpm.cmd install
pnpm.cmd dev
```

保持終端機開啟，在瀏覽器進入 http://127.0.0.1:5173/ 。看到右上角 PROTOTYPE V2 即為本版。若是舊畫面，重新整理。按 Ctrl+C 停止服務。

## 親自驗收

1. 查看工序 10「銑削」及虛構提示；來源表可左右捲動，包含 Characteristics、Methods（含 Sample Plan）、Process Information 群組共 18 欄。
2. 按「套用核准譯文」：13 個固定文字欄套入虛構核准英文，4 個原值欄保留。反應計畫為唯一模擬候選；DOE 的 N 為原值，說明使用固定英文。
3. 按「英文預覽」同頁展開完整 18 欄，按「查看反應計畫結果 →」定位；未確認時該欄顯示待確認佔位，其餘英文可檢視。
4. 在來源區按「前往反應計畫 →」，將反應計畫候選改成：

   `If an out-of-tolerance condition is detected, stop machining, segregate all parts produced since the last accepted inspection, and notify the quality engineer.`

5. 未確認時，預覽仍為待確認。按「確認候選」後，預覽 Reaction Plan 更新為你的文字（去除前後空白），保留「模擬候選，經人工修改」與「本次已確認」。其餘 17 欄不變。
6. 逐欄核對預覽：工序 10、機台 No.10、治具 JIG-010、CCP ΔP、轉速 3000 rpm、進給 200 mm/min、規格 20.00 ± 0.02 mm、抽樣 3 pcs、頻率 60 min、DOE N。不得丟失尾零、變更單位或錯置欄位。
7. 再次編輯反應計畫，預覽立即撤回到待確認；再次確認才更新。清空或只填空白會顯示錯誤。
8. 按「重設示範」或重新整理會回到 V2 初始狀態，不保留編輯。確認只代表本次流程完成，不加入核准譯文庫，不自動判定語言或翻譯品質。

## 建置與原型自測

```powershell
pnpm.cmd build
pnpm.cmd test:e2e
```

本機 Playwright + Chromium 依使用者授權執行；首次可用 `pnpm.cmd exec playwright install chromium` 安裝瀏覽器。測試 runner 會自行啟停 Vite，所以執行前先停止手動啟動的 pnpm.cmd dev。

V2 規格、驗收清單與證據位於 openspec/changes/process-control-plan-v2/；V1 歸檔位於 openspec/changes/archive/2026-11-09-process-doc-bilingual-sync-assistant-prototype-v1/。這是原型自測，非目標客戶驗證。
