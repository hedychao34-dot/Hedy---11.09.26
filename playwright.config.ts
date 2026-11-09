import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', workers: 1, reporter: [['list'], ['json', { outputFile: 'openspec/changes/process-control-plan-v2/e2e-evidence/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:5173', viewport: { width: 1440, height: 900 }, headless: true },
  webServer: { command: 'pnpm.cmd dev', url: 'http://127.0.0.1:5173', reuseExistingServer: false, timeout: 30000 },
});
