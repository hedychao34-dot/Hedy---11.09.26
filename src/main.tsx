import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fields, mockCandidate, pcp, type PcpField } from './fixture';
import './style.css';

function Headers({ prefix }: { prefix: string }) {
  const fieldHead = (field: PcpField, rowSpan = 1) => <th key={field.key} id={`${prefix}-head-${field.key}`} data-field={field.key} rowSpan={rowSpan} scope="col"><span>{field.label}</span><small>{field.chineseLabel}</small></th>;
  return <thead><tr className="group-row">
    {fields.slice(0, 3).map(field => fieldHead(field, 3))}
    <th id={`${prefix}-characteristics`} colSpan={2} scope="colgroup"><span className="group-caption">Characteristics <small>特性</small></span></th>
    {fieldHead(fields[5], 3)}
    <th id={`${prefix}-methods`} colSpan={8} scope="colgroup"><span className="group-caption">Methods <small>管制方法與計畫</small></span></th>
    <th id={`${prefix}-information`} colSpan={4} scope="colgroup"><span className="group-caption">Process Information <small>製程資訊</small></span></th>
  </tr><tr>
    {fields.slice(3, 5).map(field => fieldHead(field, 2))}
    {fields.slice(6, 8).map(field => fieldHead(field, 2))}
    <th id={`${prefix}-sampling`} colSpan={3} scope="colgroup"><span className="group-caption">Sample Plan <small>抽樣計畫</small></span></th>
    {fields.slice(11).map(field => fieldHead(field, 2))}
  </tr><tr>{fields.slice(8, 11).map(field => fieldHead(field))}</tr></thead>;
}

function App() {
  const [applied, setApplied] = useState(false);
  const [draft, setDraft] = useState('');
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  const sourceScroll = useRef<HTMLDivElement>(null);
  const previewScroll = useRef<HTMLDivElement>(null);
  const complete = applied && confirmed !== null;
  const pending = applied && confirmed === null;
  function apply() { if (!applied) {setApplied(true); setDraft(mockCandidate);} }
  function confirm() {
    if (!draft.trim()) {setError('請輸入英文候選譯文'); return;}
    setDraft(draft.trim()); setConfirmed(draft.trim()); setError('');
  }
  function reset() {
    setApplied(false); setDraft(''); setConfirmed(null); setPreview(false); setError('');
    sourceScroll.current?.scrollTo({left: 0});
  }
  function jumpReaction(target: 'source' | 'preview') {
    const container = target === 'source' ? sourceScroll.current : previewScroll.current;
    const cell = container?.querySelector<HTMLElement>('[data-field="reaction"]');
    if (container && cell) {
      container.scrollTo({left: cell.offsetLeft - 280});
      container.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }
  function result(field: PcpField) {
    if (field.kind === 'original') return field.english;
    if (!applied) return '尚未套用';
    return field.kind === 'candidate' ? confirmed ?? '待確認，尚未納入英文結果' : field.english;
  }
  function source(field: PcpField) {
    if (field.kind === 'original') return '原值保留';
    if (field.kind === 'approved') return '核准譯文（虛構）';
    return applied && draft.trim() !== mockCandidate ? '模擬候選，經人工修改' : '模擬候選';
  }
  function status(field: PcpField) {
    if (field.kind === 'original') return '原值保留';
    if (!applied) return '尚未套用';
    return field.kind === 'approved' ? '已套用核准譯文' : confirmed !== null ? '本次已確認' : '待確認';
  }
  function metadata(field: PcpField) {
    return <div className="cell-meta"><span className="source">{source(field)}</span>{field.kind !== 'original' && <span className={`badge ${field.kind === 'approved' ? 'approved' : confirmed !== null ? 'confirmed' : 'pending'}`}>{status(field)}</span>}</div>;
  }
  function table(isPreview: boolean) {
    const prefix = isPreview ? 'preview' : 'source';
    return <div className="table-wrap pcp-scroll" data-testid={`${prefix}-scroll`} ref={isPreview ? previewScroll : sourceScroll} role="region" aria-label={isPreview ? '英文預覽水平捲動區' : '中文來源水平捲動區'} tabIndex={0}>
      <table className="pcp-table" aria-label={isPreview ? '英文結果' : 'PCP 中英對照'}>
        <colgroup>{fields.map(field => <col key={field.key} style={{width: field.width}}/>)}</colgroup>
        <Headers prefix={prefix}/>
        <tbody><tr>{fields.map(field => <td key={field.key} data-field={field.key} data-testid={`${prefix}-${field.key}`} headers={`${prefix}-head-${field.key}`} className={field.kind === 'candidate' ? 'reaction-cell' : ''}>
          {!isPreview && <><p className="cell-zh" data-testid={`chinese-${field.key}`}>{field.chinese}</p><div className="cell-divider"/></>}
          {!isPreview && field.kind === 'candidate' ? <>
            <label className="input-label" htmlFor="reaction">反應計畫候選英文</label>
            <textarea id="reaction" aria-describedby={error ? 'candidate-error' : 'candidate-help'} aria-invalid={!!error} disabled={!applied} placeholder="套用後顯示模擬候選" value={draft} onChange={e => {setDraft(e.target.value); setConfirmed(null); setError('');}}/>
            <div className="candidate-actions"><small id="candidate-help">僅本次確認，不加入核准譯文庫</small><button disabled={!applied} onClick={confirm}>確認候選</button></div>
            {error && <p id="candidate-error" role="alert" className="error">{error}</p>}
          </> : <p lang="en" data-testid={`${prefix}-value-${field.key}`} className={`cell-en ${result(field).startsWith('待確認') || result(field) === '尚未套用' ? 'placeholder' : ''}`}>{result(field)}</p>}
          {metadata(field)}
        </td>)}</tr></tbody>
      </table>
    </div>;
  }
  return <>
    <header className="topbar"><div className="brand"><span className="logo">文</span><span>PROCESS DOCS</span><span className="divider">/</span><span>雙語工作台</span></div><span className="version">PROTOTYPE V2</span></header>
    <main className="mx-auto max-w-[1440px] px-8 py-9">
      <div className="eyebrow">製程文件 · 繁中 → 美式英文</div>
      <div className="heading"><div><h1>完整 PCP 製程列展示</h1><p className="subtitle">逐欄對照完整製程資料，確認反應計畫的英文內容。</p></div><span className="demo-label">◉ 虛構 PCP／模擬資料</span></div>
      <div className="scope"><strong>展示範圍</strong><span>單筆銑削 · 18 欄</span><span>未使用真正翻譯模型</span><span>Excel 匯入／匯出不納入 V2</span></div>
      <p className="disclaimer">非正式製造或品質放行依據。尺寸、公差、抽樣及 ΔP 均為虛構測試資料；GR&R、製程能力、DOE 與 CCP 實際驗證均未執行。</p>
      <ol className="journey"><li className="active"><b>01</b> 檢視完整製程列</li><li className={applied ? 'active' : ''}><b>02</b> 套用核准譯文</li><li className={complete ? 'active' : ''}><b>03</b> 確認反應計畫</li></ol>
      <section className="panel" aria-label="PCP 編輯工作區">
        <div className="panel-head"><div><div className="eyebrow">{pcp.id} · 工序 {pcp.operation}</div><h2>{pcp.title}</h2></div><div className="counts" aria-live="polite"><span>核准套用欄位 <b>{applied ? 13 : 0}</b></span><span>原值欄位 <b>4</b></span><span>待確認欄位 <b>{pending ? 1 : 0}</b></span></div></div>
        <div className="toolbar"><p>中文來源唯讀；向右捲動查看 18 欄。唯一候選位於 Reaction Plan。</p><div className="toolbar-buttons"><button onClick={() => jumpReaction('source')}>前往反應計畫 →</button><button className="primary" onClick={apply}>套用核准譯文</button></div></div>
        {table(false)}
        <div className="panel-foot"><p>重新整理不保留編輯；可隨時重設示範。</p><div><button className="ghost" onClick={reset}>重設示範</button><button className="dark" aria-expanded={preview} aria-controls="preview" onClick={() => setPreview(true)}>英文預覽 ↓</button></div></div>
      </section>
      {preview && <section id="preview" className="panel preview" aria-label="英文預覽"><div className="panel-head"><div><div className="eyebrow">ENGLISH PREVIEW · {pcp.id}</div><h2>英文預覽</h2></div><strong className={complete ? 'success-text' : 'pending-text'} aria-live="polite">{complete ? '預覽完成／非正式發行' : pending ? '未完成：1 筆待確認' : '未完成：尚未套用'}</strong></div>{complete && <p className="quality">已完成本次確認，未自動檢查翻譯品質</p>}<div className="toolbar"><p>與中文來源共用欄位順序；工序、CCP 與數值原樣保留。</p><button onClick={() => jumpReaction('preview')}>查看反應計畫結果 →</button></div>{table(true)}</section>}
      <footer>課堂展示原型 · 英文品質由展示者人工檢查 · 非正式發行</footer>
    </main>
  </>;
}
createRoot(document.getElementById('root')!).render(<BrowserRouter><Routes><Route path="*" element={<App/>}/></Routes></BrowserRouter>);
