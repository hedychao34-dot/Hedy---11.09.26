export type FieldKind = 'approved' | 'original' | 'candidate';
export type FieldKey = 'operation' | 'processName' | 'machine' | 'product' | 'process' | 'ccp' | 'specification' | 'evaluation' | 'sampleSize' | 'frequency' | 'responsible' | 'control' | 'reaction' | 'verification' | 'rationale' | 'grr' | 'capability' | 'doe';
export interface PcpField {
  key: FieldKey;
  label: string;
  chineseLabel: string;
  chinese: string;
  english: string;
  kind: FieldKind;
  width: number;
}
export const pcp = { id: 'PCP-DEMO-002', title: '銑削製程管制計畫', operation: '10' };
export const fields: readonly PcpField[] = [
  { key: 'operation', label: 'Op Seq No.', chineseLabel: '工序', chinese: '10', english: '10', kind: 'original', width: 90 },
  { key: 'processName', label: 'Process Name/Op. Description', chineseLabel: '製程名稱', chinese: '銑削', english: 'Milling', kind: 'approved', width: 190 },
  { key: 'machine', label: 'Machine, Device, Jig, Tools for Mfg.', chineseLabel: '機台、設備、治具與工具', chinese: 'CNC 銑床 No.10；定位治具 JIG-010', english: 'CNC milling machine No.10; locating fixture JIG-010', kind: 'approved', width: 250 },
  { key: 'product', label: 'Product', chineseLabel: '產品特性', chinese: '槽寬', english: 'Slot width', kind: 'approved', width: 150 },
  { key: 'process', label: 'Process', chineseLabel: '製程特性', chinese: '主軸轉速 3000 rpm；進給速度 200 mm/min', english: 'Spindle speed 3000 rpm; feed rate 200 mm/min', kind: 'approved', width: 250 },
  { key: 'ccp', label: 'CCP (ΔE/ΔP)', chineseLabel: 'CCP 標記', chinese: 'ΔP', english: 'ΔP', kind: 'original', width: 145 },
  { key: 'specification', label: 'Product/Process Specification', chineseLabel: '規格與公差', chinese: '槽寬 20.00 ± 0.02 mm', english: 'Slot width 20.00 ± 0.02 mm', kind: 'approved', width: 240 },
  { key: 'evaluation', label: 'Evaluation Method', chineseLabel: '量測方法', chinese: '使用數位卡尺量測槽寬', english: 'Measure the slot width using a digital caliper.', kind: 'approved', width: 240 },
  { key: 'sampleSize', label: 'Size', chineseLabel: '抽樣數量', chinese: '3 pcs', english: '3 pcs', kind: 'original', width: 145 },
  { key: 'frequency', label: 'Frequency', chineseLabel: '抽樣頻率', chinese: '每 60 min', english: 'Every 60 min', kind: 'approved', width: 160 },
  { key: 'responsible', label: 'Responsible', chineseLabel: '抽樣負責人', chinese: '製程檢驗員', english: 'Process inspector', kind: 'approved', width: 180 },
  { key: 'control', label: 'Control Method', chineseLabel: '管制方法', chinese: '將量測值記錄於巡檢表，逐件比對規格與公差', english: 'Record the measurements on the in-process inspection sheet and compare each sampled part with the specification and tolerance.', kind: 'approved', width: 320 },
  { key: 'reaction', label: 'Reaction Plan', chineseLabel: '反應計畫', chinese: '發現超差時停止加工，隔離自上次合格檢查後的產品並通知線長', english: 'If an out-of-tolerance condition is detected, stop machining, segregate all parts produced since the last accepted inspection, and notify the line leader.', kind: 'candidate', width: 420 },
  { key: 'verification', label: 'CCP Verification', chineseLabel: 'CCP 驗證', chinese: '品質工程師每班核對 CCP 檢查紀錄；此處僅示範驗證方式，未執行實際驗證', english: 'The quality engineer reviews the CCP inspection records each shift. Demonstration method only; verification has not been performed.', kind: 'approved', width: 320 },
  { key: 'rationale', label: 'Sampling Plan Rationale', chineseLabel: '抽樣計畫理由', chinese: '以固定週期抽樣示範製程監控；未經正式風險評估', english: 'Periodic sampling demonstrates process monitoring; no formal risk assessment has been performed.', kind: 'approved', width: 300 },
  { key: 'grr', label: 'Evaluation Method GR&R (results)', chineseLabel: 'GR&R 結果', chinese: '未執行：無實際量測系統研究資料', english: 'Not performed: no actual measurement system study data.', kind: 'approved', width: 250 },
  { key: 'capability', label: 'Process Capability (results)', chineseLabel: '製程能力結果', chinese: '未執行：無實際製程量測資料', english: 'Not performed: no actual process measurement data.', kind: 'approved', width: 250 },
  { key: 'doe', label: 'DOE (Y/N)', chineseLabel: 'DOE', chinese: 'N；未執行實驗設計', english: 'N; DOE has not been performed.', kind: 'original', width: 230 },
];
export const mockCandidate = fields.find(field => field.key === 'reaction')!.english;
