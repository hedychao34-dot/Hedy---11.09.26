# process-doc-bilingual-sync Specification

## Purpose

讓製程文件負責人在單一虛構 PCP 的課堂原型中，辨識既有核准譯文與預設候選，透過人工確認控制英文預覽內容，具體呈現雙語同步助理的操作價值與模擬限制，供後續實作與驗收依循。

## Requirements

### Requirement: 固定 PCP 與展示邊界
系統 SHALL 在 V2 桌面展示頁提供 PCP-DEMO-002 的一筆完整唯讀中文製程列，取代 V1 三列。明示「虛構 PCP／模擬資料」、「未使用真正翻譯模型」、「Excel 匯入／匯出不納入 V2」及「非正式製造或品質放行依據」，不提供檔案上傳下載。

#### Scenario: 載入展示
- **WHEN** 使用者開啟 V2 展示頁
- **THEN** 顯示本規格資料表的一筆工序 `10`「銑削」、完整 18 欄與範圍提示；固定英文尚未套用，反應計畫候選尚不可確認

### Requirement: 核准譯文套用
系統 SHALL 以「套用核准譯文」將資料表的固定英文套入相同欄位，原值欄直接保留；Reaction Plan 顯示唯一模擬候選。重複套用不得覆蓋候選文字或確認狀態。核准資料均為虛構，不再沿用 AP-001/AP-002 的舊內容。

#### Scenario: 套用既有核准資料
- **WHEN** 使用者按「套用核准譯文」
- **THEN** 13 個文字欄套用資料表固定英文，4 個原值欄不變，Reaction Plan 顯示資料表候選並為待確認；待確認欄位數為 1

#### Scenario: 重複套用保留人工處理
- **WHEN** Reaction Plan 已被編輯或確認後再次套用
- **THEN** 候選文字與確認狀態不變，其餘 17 欄不重複新增或變動

### Requirement: 人工確認候選
系統 SHALL 僅允許編輯 Reaction Plan 的模擬候選，按「確認候選」後去除前後空白儲存為本次已確認，不加入核准譯文庫；空白或僅空白字元須拒絕。再次編輯立即撤回確認。

#### Scenario: 保留候選確認
- **WHEN** 使用者不改候選直接確認
- **THEN** Reaction Plan 預覽採資料表候選原文，狀態為本次已確認，待確認欄位數為 0

#### Scenario: 修改候選確認
- **WHEN** 使用者改為 `If an out-of-tolerance condition is detected, stop machining, segregate all parts produced since the last accepted inspection, and notify the quality engineer.` 並確認
- **THEN** 只有英文預覽的 Reaction Plan 更新為該文字，其餘 17 欄與來源中文均不變

#### Scenario: 去除前後空白
- **WHEN** 使用者在有效反應計畫候選前後加入空白再確認
- **THEN** 預覽逐字等於去除前後空白後的輸入，保留內文

#### Scenario: 阻擋空白確認
- **WHEN** 使用者清空候選或只輸入空白後確認
- **THEN** 顯示「請輸入英文候選譯文」，維持待確認，不產生反應計畫英文結果

#### Scenario: 再次編輯撤回確認
- **WHEN** 使用者修改已確認的反應計畫候選
- **THEN** 該欄回到待確認，舊文字不再作為預覽結果；其他欄位不變

### Requirement: 英文預覽忠實反映狀態
系統 SHALL 按「英文預覽」在同頁展開同一製程列完整 18 欄，與來源表頭同序同群組。套用前固定譯文欄顯示尚未套用；原值欄仍可見。未確認的 Reaction Plan 顯示「待確認，尚未納入英文結果」，套用後頂部顯示「未完成：1 筆待確認」。全部固定譯文套用且候選確認才顯示「預覽完成／非正式發行」。

#### Scenario: 未完成預覽
- **WHEN** 使用者在套用前或反應計畫候選未確認時查看預覽
- **THEN** 18 欄保持對位，未處理欄顯示對應佔位；候選文字只在編輯區，不混入預覽英文結果

#### Scenario: 完整英文結果
- **WHEN** 已套用固定英文並確認反應計畫後查看預覽
- **THEN** 全部欄位符合資料表英文值，只有反應計畫可被確認文字取代，工序、機台、CCP、尺寸、公差及抽樣數值原樣保留

#### Scenario: 修改候選的四階段預覽
- **WHEN** 使用者依序修改未確認候選、確認、再次編輯、再次確認
- **THEN** Reaction Plan 依序呈現待確認佔位、確認文字、待確認佔位、新確認文字；其餘 17 欄始終不變

### Requirement: 來源與確認狀態持續可辨識
系統 SHALL 在來源表與英文預覽持續以文字標示來源與狀態。固定文字欄為「核准譯文（虛構）」／「已套用核准譯文」，原值欄為「原值保留」。Reaction Plan 為「模擬候選」；trim 後與原候選不同時為「模擬候選，經人工修改」，並分別標示待確認或本次已確認。顏色僅作輔助。

#### Scenario: 確認後保留來源
- **WHEN** 使用者保留或修改 Reaction Plan 候選並確認
- **THEN** 表格與預覽均保留對應模擬來源與本次已確認標示，與其他欄的虛構核准來源及原值來源可用文字區別

### Requirement: 完成標示揭露品質檢查邊界
系統 SHALL 僅驗證候選非空白及確認狀態，不自動判定語言、翻譯品質或正式製程有效性。完成時同時顯示「已完成本次確認，未自動檢查翻譯品質」與「非正式發行」。

#### Scenario: 非空白內容不代表品質通過
- **WHEN** 使用者以「人工檢查範例」確認反應計畫候選
- **THEN** 系統接受並原樣呈現該內容，顯示品質邊界提示，不宣稱語言或製程品質合格

### Requirement: 可重複展示
系統 SHALL 提供「重設示範」，所有編輯僅保存在當次頁面記憶體；重設或重新整理回復 V2 一筆完整製程列的初始狀態並顯示不保留編輯提示。

#### Scenario: 重設或重新整理
- **WHEN** 操作後按重設或重新整理
- **THEN** 回到 PCP-DEMO-002 的工序 10 銑削列，固定譯文尚未套用、候選編輯及確認清除、原值不變，不回到 V1 三列資料

### Requirement: 完整 PCP 欄位與欄群
系統 SHALL 在來源表與英文預覽依下表順序呈現 18 欄。Characteristics 含 4–5；Methods 含 7–14，其中 Sample Plan 含 9–11；Process Information 含 15–18。其餘欄位獨立呈現，不得以欄位內的位置取代欄名對應。

#### Scenario: 顯示完整欄群與欄位順序
- **WHEN** 使用者開啟來源表或英文預覽
- **THEN** 兩表均依資料表欄號 1–18 呈現同名欄位與群組，每欄內容均落在其欄名下

### Requirement: 單筆銑削虛構資料與英文欄位契約
系統 SHALL 使用下表唯一一筆 PCP-DEMO-002 虛構資料。來源類型「固定」表示虛構核准英文，「原值」直接沿用，「候選」須人工確認。所有數值僅供欄位映射驗收；GR&R、能力與 DOE 不編造已執行結果。

#### Scenario: 顯示完整的銑削範例與欄位對位
- **WHEN** 使用者檢視來源及完成英文預覽
- **THEN** 每欄符合下表；英文資料不得移到其他欄或其他製程列，候選欄可由本次確認文字取代

| # | 欄位 | 中文來源／原值 | 英文固定值／模擬候選 | 類型 |
|---|---|---|---|---|
| 1 | Op Seq No. | `10` | `10` | 原值 |
| 2 | Process Name/Op. Description | 銑削 | Milling | 固定 |
| 3 | Machine, Device, Jig, Tools for Mfg. | CNC 銑床 No.10；定位治具 JIG-010 | CNC milling machine No.10; locating fixture JIG-010 | 固定 |
| 4 | Characteristics / Product | 槽寬 | Slot width | 固定 |
| 5 | Characteristics / Process | 主軸轉速 3000 rpm；進給速度 200 mm/min | Spindle speed 3000 rpm; feed rate 200 mm/min | 固定 |
| 6 | CCP (ΔE/ΔP) | `ΔP` | `ΔP` | 原值 |
| 7 | Methods / Product/Process Specification | 槽寬 20.00 ± 0.02 mm | Slot width 20.00 ± 0.02 mm | 固定 |
| 8 | Methods / Evaluation Method | 使用數位卡尺量測槽寬 | Measure the slot width using a digital caliper. | 固定 |
| 9 | Methods / Sample Plan / Size | `3 pcs` | `3 pcs` | 原值 |
| 10 | Methods / Sample Plan / Frequency | 每 60 min | Every 60 min | 固定 |
| 11 | Methods / Sample Plan / Responsible | 製程檢驗員 | Process inspector | 固定 |
| 12 | Methods / Control Method | 將量測值記錄於巡檢表，逐件比對規格與公差 | Record the measurements on the in-process inspection sheet and compare each sampled part with the specification and tolerance. | 固定 |
| 13 | Methods / Reaction Plan | 發現超差時停止加工，隔離自上次合格檢查後的產品並通知線長 | If an out-of-tolerance condition is detected, stop machining, segregate all parts produced since the last accepted inspection, and notify the line leader. | 候選 |
| 14 | Methods / CCP Verification | 品質工程師每班核對 CCP 檢查紀錄；此處僅示範驗證方式，未執行實際驗證 | The quality engineer reviews the CCP inspection records each shift. Demonstration method only; verification has not been performed. | 固定 |
| 15 | Process Information / Sampling Plan Rationale | 以固定週期抽樣示範製程監控；未經正式風險評估 | Periodic sampling demonstrates process monitoring; no formal risk assessment has been performed. | 固定 |
| 16 | Process Information / Evaluation Method GR&R (results) | 未執行：無實際量測系統研究資料 | Not performed: no actual measurement system study data. | 固定 |
| 17 | Process Information / Process Capability (results) | 未執行：無實際製程量測資料 | Not performed: no actual process measurement data. | 固定 |
| 18 | Process Information / DOE (Y/N) | N；未執行實驗設計 | N; DOE has not been performed. | 原值與固定說明 |

DOE 的 `N` 為原值，其說明為固定英文；此欄在套用計數中歸為原值欄，不另計文字欄。CCP `ΔP` 為虛構分類標記，不代表完成實際 CCP 判定或驗證。

### Requirement: 識別字與數值字串原樣保留
系統 SHALL 在英文預覽正確欄位逐字保留工序 `10`、機台 `No.10`、治具 `JIG-010`、CCP `ΔP`、`3000 rpm`、`200 mm/min`、`20.00 ± 0.02 mm`、`3 pcs`、`60 min` 及 DOE `N`。不得四捨五入、移除尾零、更換符號、換算單位或混置欄位。

#### Scenario: 數值與標記逐欄保留
- **WHEN** 套用並確認後查看英文預覽，或修改反應計畫後再次確認
- **THEN** 上述字串均存在資料表指定欄位且逐字一致，例如規格仍為 `20.00 ± 0.02 mm`，不是 `20 ± 0.02 mm`；抽樣 Size 仍為 `3 pcs`，Frequency 仍包含 `60 min`

### Requirement: 寬表可檢視且欄位關係可辨識
系統 SHALL 在桌面及較窄視窗提供來源與預覽表的水平捲動；欄名及群組需可辨識，不隱藏或重排欄位。

#### Scenario: 窄視窗檢視完整 PCP 表格
- **WHEN** 使用者在 390 × 844 視窗水平捲動來源或預覽
- **THEN** 可從工序欄看到最右 DOE 欄，欄位順序與群組保持一致
