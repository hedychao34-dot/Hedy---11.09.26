import { test, expect, type Page } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const changeRoot = 'openspec/changes/process-control-plan-v2';
const evidence = `${changeRoot}/e2e-evidence`;
const keys = ['operation','processName','machine','product','process','ccp','specification','evaluation','sampleSize','frequency','responsible','control','reaction','verification','rationale','grr','capability','doe'];
const originalKeys = ['operation','ccp','sampleSize','doe'];
const changed = 'If an out-of-tolerance condition is detected, stop machining, segregate all parts produced since the last accepted inspection, and notify the quality engineer.';
const pendingText = '待確認，尚未納入英文結果';
let contract: {key:string; label:string; chinese:string; english:string}[];
const browserErrors: string[] = [];
test.beforeAll(async()=>{
  const spec = await readFile(`${changeRoot}/specs/process-doc-bilingual-sync/spec.md`,'utf8');
  contract = spec.split('\n').filter(line=>/^\| \d+ \|/.test(line)).map((line,index)=>{
    const cells=line.split('|').map(c=>c.trim().replaceAll('`',''));
    return {key:keys[index],label:cells[2].split(' / ').at(-1)!,chinese:cells[3],english:cells[4]};
  });
  expect(contract).toHaveLength(18);await mkdir(evidence,{recursive:true});
});
test.beforeEach(async({page})=>{
  browserErrors.length=0;
  page.on('pageerror',e=>browserErrors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')browserErrors.push(m.text());});
  page.on('requestfailed',r=>browserErrors.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5173')&&!r.url().startsWith('data:'))browserErrors.push(`External request: ${r.url()}`);});
  await page.goto('/');
});
test.afterEach(async({page},info)=>{
  await writeFile(`${evidence}/${info.title.slice(0,7)}-browser.json`,JSON.stringify({url:page.url(),viewport:page.viewportSize(),errors:browserErrors},null,2));
  expect(browserErrors).toEqual([]);
  await page.reload();
});
const apply = (p:Page)=>p.getByRole('button',{name:'套用核准譯文',exact:true}).click();
const confirm = (p:Page)=>p.getByRole('button',{name:'確認候選',exact:true}).click();
const preview = (p:Page)=>p.getByRole('button',{name:'英文預覽'}).click();
const candidate = (p:Page)=>p.getByLabel('反應計畫候選英文',{exact:true});
const value = (p:Page,key:string)=>p.getByTestId(`preview-value-${key}`);
async function shot(p:Page,name:string){await p.screenshot({path:`${evidence}/${name}.png`,fullPage:true});}
async function position(p:Page,prefix:string,left:number){await p.getByTestId(`${prefix}-scroll`).evaluate((el,x)=>{el.scrollLeft=x;},left);}
async function segment(p:Page,prefix:string,name:string,left:number){await position(p,prefix,left);await shot(p,name);}
async function snapshot(p:Page){const result:Record<string,string|null>={};for(const key of keys.filter(k=>k!=='reaction'))result[key]=await value(p,key).textContent();return result;}
async function sourceSnapshot(p:Page){return p.locator('[data-testid^="chinese-"]').allTextContents();}
async function checkValues(p:Page,initial=false){
  for(const row of contract){
    await expect(p.getByTestId(`chinese-${row.key}`)).toHaveText(row.chinese);
    const expected=initial&&!originalKeys.includes(row.key)?'尚未套用':row.english;
    if(row.key==='reaction'&&initial)await expect(value(p,row.key)).toHaveText('尚未套用');else expect(await value(p,row.key).textContent()).toBe(expected);
  }
}
async function complete(p:Page){await expect(p.getByText('預覽完成／非正式發行',{exact:true})).toBeVisible();await expect(p.getByText('已完成本次確認，未自動檢查翻譯品質',{exact:true})).toBeVisible();}
async function pending(p:Page){await expect(value(p,'reaction')).toHaveText(pendingText);await expect(p.getByText('未完成：1 筆待確認',{exact:true})).toBeVisible();}

test('E2E-001 18 欄與雙表欄群',async({page:p})=>{
  await expect(p.getByText('PROTOTYPE V2',{exact:true})).toBeVisible();
  for(const text of ['虛構 PCP／模擬資料','非正式製造或品質放行依據','未使用真正翻譯模型','Excel 匯入／匯出不納入 V2','重新整理不保留編輯'])await expect(p.getByText(text,{exact:false}).first()).toBeVisible();
  await expect(candidate(p)).toBeDisabled();await expect(p.locator('input[type=file], a[download]')).toHaveCount(0);await expect(p.getByRole('button',{name:/上傳|下載/})).toHaveCount(0);
  await preview(p);await checkValues(p,true);
  for(const prefix of ['source','preview']){
    const table=p.getByRole('table',{name:prefix==='source'?'PCP 中英對照':'英文結果',exact:true});
    await expect(table.locator('tbody tr')).toHaveCount(1);await expect(table.locator('tbody td')).toHaveCount(18);
    expect(await table.locator('tbody td').evaluateAll(els=>els.map(el=>el.getAttribute('data-field')))).toEqual(keys);
    const headers=await table.locator('th[data-field]').evaluateAll(els=>els.map(el=>({key:el.getAttribute('data-field'),text:el.querySelector('span')?.textContent})));
    for(const row of contract)expect(headers.find(h=>h.key===row.key)?.text).toBe(row.label);
    for(const [group,count] of [['characteristics',2],['methods',8],['sampling',3],['information',4]] as const)await expect(p.locator(`#${prefix}-${group}`)).toHaveAttribute('colspan',String(count));
    await segment(p,prefix,`E2E-001-desktop-${prefix}`,1300);
  }
  await p.setViewportSize({width:390,height:844});
  for(const prefix of ['source','preview']){
    const scroll=p.getByTestId(`${prefix}-scroll`);
    expect(await scroll.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
    await segment(p,prefix,`E2E-001-narrow-${prefix}-left`,0);
    const leftBox=await p.getByTestId(`${prefix}-operation`).boundingBox();expect(leftBox!.x).toBeGreaterThanOrEqual(0);expect(leftBox!.x+leftBox!.width).toBeLessThanOrEqual(390);
    await segment(p,prefix,`E2E-001-narrow-${prefix}-right`,99999);
    const rightBox=await p.getByTestId(`${prefix}-doe`).boundingBox();expect(rightBox!.x).toBeGreaterThanOrEqual(0);expect(rightBox!.x+rightBox!.width).toBeLessThanOrEqual(390);
    const groupBox=await p.locator(`#${prefix}-information .group-caption`).boundingBox();expect(groupBox!.x).toBeGreaterThanOrEqual(0);expect(groupBox!.x+groupBox!.width).toBeLessThanOrEqual(390);
    await position(p,prefix,0);
  }
  await p.setViewportSize({width:1440,height:900});
});

test('E2E-002 完整英文逐欄對位及數值保留',async({page:p})=>{
  await apply(p);await confirm(p);await preview(p);await checkValues(p);await complete(p);
  const tokens:Record<string,string[]>= {operation:['10'],machine:['No.10','JIG-010'],ccp:['ΔP'],process:['3000 rpm','200 mm/min'],specification:['20.00 ± 0.02 mm'],sampleSize:['3 pcs'],frequency:['60 min'],doe:['N']};
  for(const [key,list]of Object.entries(tokens))for(const token of list)await expect(value(p,key)).toContainText(token);
  await expect(value(p,'specification')).not.toHaveText('Slot width 20 ± 0.02 mm');
  for(const row of contract){for(const prefix of ['source','preview']){
    const cell=p.getByTestId(`${prefix}-${row.key}`);
    await expect(cell).toContainText(originalKeys.includes(row.key)?'原值保留':row.key==='reaction'?'模擬候選':'核准譯文（虛構）');
    if(row.key==='reaction')await expect(cell).toContainText('本次已確認');else if(!originalKeys.includes(row.key))await expect(cell).toContainText('已套用核准譯文');
  }}
  const observations=[];for(const row of contract)observations.push({...row,observed:await value(p,row.key).textContent()});
  await writeFile(`${evidence}/E2E-002-fields.json`,JSON.stringify(observations,null,2));
  for(const left of [0,850,1700,2350,3100]){await position(p,'source',left);await position(p,'preview',left);await shot(p,`E2E-002-columns-${left}`);}
  await p.getByRole('button',{name:'重設示範',exact:true}).click();
});

test('E2E-003 四階段候選更新且其他欄位不變',async({page:p})=>{
  await apply(p);await preview(p);const baseline=await snapshot(p);const chinese=await sourceSnapshot(p);const checkpoints=[];
  await p.getByRole('button',{name:'前往反應計畫 →',exact:true}).click();await p.getByRole('button',{name:'查看反應計畫結果 →',exact:true}).click();
  async function checkpoint(name:string){expect(await snapshot(p)).toEqual(baseline);expect(await sourceSnapshot(p)).toEqual(chinese);checkpoints.push({name,other17:await snapshot(p),reaction:await value(p,'reaction').textContent(),chinese:await sourceSnapshot(p)});await shot(p,`E2E-003-${name}`);}
  await candidate(p).fill(`  ${changed}  `);await pending(p);await checkpoint('1-edited');
  await apply(p);await expect(candidate(p)).toHaveValue(`  ${changed}  `);await confirm(p);expect(await value(p,'reaction').textContent()).toBe(changed);await complete(p);
  for(const prefix of ['source','preview']){await expect(p.getByTestId(`${prefix}-reaction`)).toContainText('模擬候選，經人工修改');await expect(p.getByTestId(`${prefix}-reaction`)).toContainText('本次已確認');}
  await checkpoint('2-confirmed');await apply(p);expect(await value(p,'reaction').textContent()).toBe(changed);
  await candidate(p).fill(`${changed} Please review.`);await pending(p);await checkpoint('3-reedited');await confirm(p);expect(await value(p,'reaction').textContent()).toBe(`${changed} Please review.`);await complete(p);await checkpoint('4-reconfirmed');
  await writeFile(`${evidence}/E2E-003-state-comparison.json`,JSON.stringify(checkpoints,null,2));
  await p.getByRole('button',{name:'重設示範',exact:true}).click();
});

test('E2E-004 空白阻擋與品質邊界',async({page:p})=>{
  await apply(p);await preview(p);await position(p,'source',2350);await position(p,'preview',2350);
  for(const input of ['', '   ']){await candidate(p).fill(input);await confirm(p);await expect(p.getByRole('alert')).toHaveText('請輸入英文候選譯文');await pending(p);}
  await shot(p,'E2E-004-empty');await candidate(p).fill('人工檢查範例');await confirm(p);await expect(value(p,'reaction')).toHaveText('人工檢查範例');await complete(p);await shot(p,'E2E-004-quality');await p.getByRole('button',{name:'重設示範',exact:true}).click();
});

test('E2E-005 重設及重新整理回到 V2',async({page:p})=>{
  for(const mode of ['reset','reload']){
    await apply(p);await candidate(p).fill('Demo edit.');await confirm(p);await preview(p);
    if(mode==='reset')await p.getByRole('button',{name:'重設示範',exact:true}).click();else await p.reload();
    await expect(candidate(p)).toHaveValue('');await expect(candidate(p)).toBeDisabled();await preview(p);await checkValues(p,true);
    await expect(p.getByRole('table',{name:'英文結果',exact:true}).locator('tbody tr')).toHaveCount(1);
    await expect(p.getByTestId('chinese-operation')).toHaveText('10');await expect(p.getByTestId('chinese-processName')).toHaveText('銑削');await expect(p.getByText('未完成：尚未套用',{exact:true})).toBeVisible();await shot(p,`E2E-005-${mode}`);
    await apply(p);await expect(candidate(p)).toHaveValue(contract.find(row=>row.key==='reaction')!.english);await p.reload();
  }
});
