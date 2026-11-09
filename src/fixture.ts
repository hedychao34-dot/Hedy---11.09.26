export const pcp = {
  id: 'PCP-DEMO-001',
  title: '虛構零件製程管制計畫',
  rows: [
    { step: 10, chinese: '確認零件料號。' },
    { step: 20, chinese: '每小時量測一次外徑。' },
    { step: 30, chinese: '發現異常時，隔離該批產品並通知線長。' },
  ],
};
export const approvedMemory = [
  { id: 'AP-001', chinese: '確認零件料號。', english: 'Verify the part number.' },
  { id: 'AP-002', chinese: '每小時量測一次外徑。', english: 'Measure the outside diameter once per hour.' },
];
export const mockCandidate = 'If an abnormality is found, isolate the affected lot and notify the line leader.';
