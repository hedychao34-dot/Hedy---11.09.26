import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { pcp, approvedMemory, mockCandidate } from './fixture';
import './style.css';

function App() {
  const [applied, setApplied] = useState(false);
  const [draft, setDraft] = useState('');
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  const complete = applied && confirmed !== null;
  const pending = applied && confirmed === null;
  function apply() {
    if (!applied) { setDraft(mockCandidate); setApplied(true); }
  }
  function confirm() {
    if (!draft.trim()) { setError('請輸入英文候選譯文'); return; }
    setDraft(draft.trim()); setConfirmed(draft.trim()); setError('');
  }
  function reset() { setApplied(false); setDraft(''); setConfirmed(null); setPreview(false); setError(''); }
  function source(step: number) {
    const row = pcp.rows.find(r => r.step === step)!;
    const match = approvedMemory.find(m => m.chinese === row.chinese);
    if (!applied) return '尚未套用';
    return match ? `核准譯文／${match.id}（虛構）` : draft.trim() !== mockCandidate ? '模擬候選，經人工修改' : '模擬候選';
  }
  function status(step: number) { return !applied ? '尚未套用' : step !== 30 ? '已套用核准譯文' : confirmed !== null ? '本次已確認' : '待確認'; }
  function result(step: number) {
    if (!applied) return '尚未套用';
    return step === 30 ? confirmed ?? '待確認，尚未納入英文結果' : approvedMemory.find(m => m.chinese === pcp.rows.find(r => r.step === step)!.chinese)!.english;
  }
  function badge(step: number) { return <span className={`badge ${step !== 30 ? 'approved' : confirmed !== null ? 'confirmed' : 'pending'}`}>{status(step)}</span>; }
  return <>
    <header className="topbar"><div className="brand"><span className="logo">文</span> PROCESS DOCS <span className="divider">/</span> 雙語工作台</div><span className="version">PROTOTYPE V1</span></header>
    <main className="mx-auto max-w-[1320px] px-8 py-9">
      <div className="eyebrow">製程文件 · 繁中 → 美式英文</div>
      <div className="heading"><div><h1>製程文件雙語同步助理</h1><p className="subtitle">沿用核准譯文，讓每一筆候選經過你的確認。</p></div><span className="demo-label">◉ 虛構 PCP／模擬資料</span></div>
      <div className="scope"><strong>展示範圍</strong><span>內建固定資料</span><span>未使用真正翻譯模型</span><span>Excel 匯入／匯出不納入 V1</span></div>
      <ol className="journey"><li className="active"><b>01</b> 檢視中文來源</li><li className={applied ? 'active' : ''}><b>02</b> 套用核准譯文</li><li className={complete ? 'active' : ''}><b>03</b> 確認候選與預覽</li></ol>
      <section className="panel" aria-label="PCP 編輯工作區">
        <div className="panel-head"><div><div className="eyebrow">{pcp.id}</div><h2>{pcp.title}</h2></div><div className="counts" aria-live="polite"><span>核准套用數 <b>{applied ? 2 : 0}</b></span><span>待確認數 <b>{pending ? 1 : 0}</b></span></div></div>
        <div className="toolbar"><p>中文來源唯讀；核准譯文可沿用，模擬候選由你確認。</p><button className="primary" onClick={apply}>套用核准譯文</button></div>
        <div className="table-wrap"><table aria-label="PCP 中英對照"><thead><tr><th className="step">步驟</th><th>中文原文</th><th className="english">英文譯文／候選</th><th>來源與狀態</th></tr></thead><tbody>{pcp.rows.map(row => <tr key={row.step} data-testid={`edit-${row.step}`}><td className="step">{row.step}</td><td>{row.chinese}</td><td>{row.step !== 30 ? <p lang="en">{result(row.step)}</p> : <><label className="sr-only" htmlFor="candidate">候選英文</label><textarea id="candidate" aria-describedby={error ? 'candidate-error' : 'candidate-help'} aria-invalid={!!error} disabled={!applied} placeholder="套用後顯示模擬候選" value={draft} onChange={e => {setDraft(e.target.value); setConfirmed(null); setError('');}}/><div className="candidate-actions"><small id="candidate-help">僅本次確認，不加入核准譯文庫</small><button disabled={!applied} onClick={confirm}>確認候選</button></div>{error && <p id="candidate-error" role="alert" className="error">{error}</p>}</>}</td><td><div className="source">{source(row.step)}</div>{badge(row.step)}</td></tr>)}</tbody></table></div>
        <div className="panel-foot"><p>重新整理不保留編輯；可隨時重設示範。</p><div><button className="ghost" onClick={reset}>重設示範</button><button className="dark" aria-expanded={preview} aria-controls="preview" onClick={() => setPreview(true)}>英文預覽 ↓</button></div></div>
      </section>
      {preview && <section id="preview" className="panel preview" aria-label="英文預覽"><div className="panel-head"><div><div className="eyebrow">ENGLISH PREVIEW</div><h2>英文預覽</h2></div><strong className={complete ? 'success-text' : 'pending-text'} aria-live="polite">{complete ? '預覽完成／非正式發行' : pending ? '未完成：1 筆待確認' : '未完成：尚未套用'}</strong></div>{complete && <p className="quality">已完成本次確認，未自動檢查翻譯品質</p>}<div className="table-wrap"><table aria-label="英文結果"><thead><tr><th className="step">步驟</th><th>英文結果</th><th>來源與狀態</th></tr></thead><tbody>{pcp.rows.map(row => <tr key={row.step} data-testid={`preview-${row.step}`}><td className="step">{row.step}</td><td data-testid={`result-${row.step}`} lang="en" className={!applied || (row.step === 30 && confirmed === null) ? 'placeholder' : ''}>{result(row.step)}</td><td><div className="source">{source(row.step)}</div>{badge(row.step)}</td></tr>)}</tbody></table></div></section>}
      <footer>課堂展示原型 · 英文品質由展示者人工檢查 · 非正式發行</footer>
    </main>
  </>;
}
createRoot(document.getElementById('root')!).render(<BrowserRouter><Routes><Route path="*" element={<App/>}/></Routes></BrowserRouter>);
