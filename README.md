# 製程文件雙語同步助理 Prototype V1

課堂展示用 React + Vite 原型；僅處理內建 PCP-DEMO-001「虛構零件製程管制計畫」。全部文件、AP-001/AP-002 核准記憶及候選均為虛構資料。未使用真正翻譯模型，Excel 匯入／匯出不納入 V1，非正式發行。無後端、帳號或資料庫。

## 開啟方式

在專案根目錄開啟 PowerShell：

```powershell
pnpm.cmd install
pnpm.cmd dev
```

保持終端機開啟，再以瀏覽器開啟 http://127.0.0.1:5173/ 。按 Ctrl+C 停止服務。若連接埠已使用，請先停止先前本專案服務。

## 親自試走

1. 確認頁面顯示虛構資料、模型及 Excel 範圍提示，中文來源為三列唯讀資料。
2. 按「套用核准譯文」：前兩列為「已套用核准譯文」，來源分別為 AP-001、AP-002（虛構）；第三列為「模擬候選／待確認」。
3. 按「英文預覽」：同頁展開三列，第三列顯示「待確認，尚未納入英文結果」，頂部為「未完成：1 筆待確認」。
4. 將「候選英文」改成 `If an abnormality is detected, segregate the affected lot and notify the line supervisor.`，先不確認：預覽仍是待確認佔位。
5. 按「確認候選」：第三列預覽更新成你的文字，前後空白會去除；來源為「模擬候選，經人工修改」，狀態為「本次已確認」，前兩列不變。顯示「預覽完成／非正式發行」與未檢查翻譯品質提示。
6. 再次編輯候選：確認會立即撤回，預覽回到待確認佔位；再次確認後才呈現新文字。
7. 清空或只輸入空白再確認：顯示「請輸入英文候選譯文」。按「重設示範」或重新整理會回復初始狀態。

候選只作本次人工確認，不加入核准譯文庫。系統僅檢查非空白與確認狀態，英文品質由展示者人工檢查；重新整理不保留編輯。

## 建置與原型自測

```powershell
pnpm.cmd build
pnpm.cmd test:e2e
```

E2E 使用本機 Playwright（依使用者授權取代 Playwright MCP）與 Chromium，第一次需 `pnpm.cmd exec playwright install chromium`。測試會自動啟動服務並在結束後停止。案例來源為 OpenSpec 的 e2e-testing.md；截圖與結果保存於變更目錄 e2e-evidence。這是原型自測，非目標客戶驗證。
