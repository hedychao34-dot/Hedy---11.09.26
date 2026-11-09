import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const evidence = 'openspec/changes/process-doc-bilingual-sync-assistant-prototype-v1/e2e-evidence';
const original = 'If an abnormality is found, isolate the affected lot and notify the line leader.';
const modified = 'If an abnormality is detected, segregate the affected lot and notify the line supervisor.';
const approved = ['Verify the part number.', 'Measure the outside diameter once per hour.'];
const errors: string[] = [];
test.beforeEach(async ({page}) => {
  errors.length = 0;
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {if(m.type() === 'error') errors.push(m.text());});
  page.on('requestfailed', r => errors.push(`${r.url()}: ${r.failure()?.errorText}`));
  page.on('request', r => {if(!r.url().startsWith('http://127.0.0.1:5173') && !r.url().startsWith('data:')) errors.push(`External request: ${r.url()}`);});
  await mkdir(evidence, {recursive:true}); await page.goto('/');
});
test.afterEach(async ({page}) => {expect(errors).toEqual([]); await page.reload();});
const apply = (p:Page) => p.getByRole('button', {name:'套用核准譯文', exact:true}).click();
const preview = (p:Page) => p.getByRole('button', {name:'英文預覽'}).click();
const confirm = (p:Page) => p.getByRole('button', {name:'確認候選',exact:true}).click();
const result = (p:Page) => p.getByTestId('result-30');
async function shot(p:Page, name:string) {await p.screenshot({path:`${evidence}/${name}.png`,fullPage:true});}
async function unchanged(p:Page) {for(let i=0;i<2;i++) {await expect(p.getByTestId(`result-${(i+1)*10}`)).toHaveText(approved[i]); await expect(p.getByTestId(`preview-${(i+1)*10}`)).toContainText(`核准譯文／AP-00${i+1}（虛構）`); await expect(p.getByTestId(`preview-${(i+1)*10}`)).toContainText('已套用核准譯文');}}
async function pending(p:Page) {await expect(result(p)).toHaveText('待確認，尚未納入英文結果');await expect(p.getByText('未完成：1 筆待確認',{exact:true})).toBeVisible();await unchanged(p);}
async function complete(p:Page) {await expect(p.getByText('預覽完成／非正式發行',{exact:true})).toBeVisible();await expect(p.getByText('已完成本次確認，未自動檢查翻譯品質',{exact:true})).toBeVisible();await unchanged(p);}
async function initial(p:Page) {for(const step of [10,20,30]) await expect(p.getByTestId(`edit-${step}`)).toContainText('尚未套用');await expect(p.getByLabel('候選英文')).toHaveValue('');await expect(p.getByLabel('候選英文')).toBeDisabled();}
test('E2E-001 初始資料與邊界',async({page:p})=>{
 await initial(p); for(const text of ['PCP-DEMO-001','虛構零件製程管制計畫','◉ 虛構 PCP／模擬資料','未使用真正翻譯模型','Excel 匯入／匯出不納入 V1','重新整理不保留編輯；可隨時重設示範。','確認零件料號。','每小時量測一次外徑。','發現異常時，隔離該批產品並通知線長。']) await expect(p.getByText(text,{exact:true})).toBeVisible();
 await expect(p.locator('input[type=file],a[download]')).toHaveCount(0);await expect(p.getByRole('button',{name:/上傳|下載/})).toHaveCount(0);await shot(p,'E2E-001-initial');await preview(p);for(const step of [10,20,30])await expect(p.getByTestId(`result-${step}`)).toHaveText('尚未套用');await expect(p.getByText('未完成：尚未套用',{exact:true})).toBeVisible();await shot(p,'E2E-001-preview');
});
test('E2E-002 套用與未確認預覽',async({page:p})=>{await apply(p);await expect(p.getByLabel('候選英文')).toHaveValue(original);await expect(p.getByTestId('edit-30')).toContainText('模擬候選');await expect(p.getByTestId('edit-30')).toContainText('待確認');await expect(p.locator('.counts')).toHaveText('核准套用數 2待確認數 1');await shot(p,'E2E-002-applied');await preview(p);await pending(p);await expect(p.getByLabel('候選英文')).toBeVisible();await shot(p,'E2E-002-preview');});
test('E2E-003 保留候選確認',async({page:p})=>{await apply(p);await confirm(p);await preview(p);await apply(p);await expect(result(p)).toHaveText(original);await expect(p.locator('.counts')).toHaveText('核准套用數 2待確認數 0');for(const loc of [p.getByTestId('edit-30'),p.getByTestId('preview-30')]){await expect(loc).toContainText('模擬候選');await expect(loc).toContainText('本次已確認');await expect(loc).not.toContainText('經人工修改');}await complete(p);await shot(p,'E2E-003-confirmed');});
test('E2E-004 修改、重複套用與撤回確認',async({page:p})=>{await apply(p);await preview(p);await p.getByLabel('候選英文').fill(`  ${modified}  `);await pending(p);await shot(p,'E2E-004-1-edited');await apply(p);await expect(p.getByLabel('候選英文')).toHaveValue(`  ${modified}  `);await confirm(p);await expect(result(p)).toHaveText(modified,{useInnerText:true});expect(await result(p).textContent()).toBe(modified);for(const loc of [p.getByTestId('edit-30'),p.getByTestId('preview-30')]){await expect(loc).toContainText('模擬候選，經人工修改');await expect(loc).toContainText('本次已確認');}await complete(p);await shot(p,'E2E-004-2-confirmed');await p.getByLabel('候選英文').fill(`${modified} Please review.`);await pending(p);await shot(p,'E2E-004-3-reedited');await confirm(p);expect(await result(p).textContent()).toBe(`${modified} Please review.`);await complete(p);await shot(p,'E2E-004-4-reconfirmed');});
test('E2E-005 阻擋空白',async({page:p})=>{await apply(p);for(const value of ['', '   ']){await p.getByLabel('候選英文').fill(value);await confirm(p);await expect(p.getByRole('alert')).toHaveText('請輸入英文候選譯文');}await preview(p);await pending(p);await shot(p,'E2E-005-empty-error');});
test('E2E-007 確認流程不判定翻譯品質',async({page:p})=>{await apply(p);await p.getByLabel('候選英文').fill('人工檢查範例');await confirm(p);await preview(p);await expect(result(p)).toHaveText('人工檢查範例');await expect(p.getByTestId('preview-30')).toContainText('模擬候選，經人工修改');await expect(p.getByTestId('preview-30')).toContainText('本次已確認');await complete(p);await shot(p,'E2E-007-quality-boundary');});
test('E2E-006 重設與重新整理',async({page:p})=>{for(const mode of ['reset','reload']){await apply(p);await p.getByLabel('候選英文').fill('Demo edit.');await confirm(p);await preview(p);if(mode==='reset')await p.getByRole('button',{name:'重設示範',exact:true}).click();else await p.reload();await initial(p);await preview(p);for(const step of [10,20,30])await expect(p.getByTestId(`result-${step}`)).toHaveText('尚未套用');await shot(p,`E2E-006-${mode}`);if(mode==='reset')await p.reload();}});
