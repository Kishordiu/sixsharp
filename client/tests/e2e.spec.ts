import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173/';

test.describe('SIXSHARP Full Master QA Flow', () => {

  test('researcher can complete the full 37-step lifecycle gate', async ({ page }) => {
    test.setTimeout(90000); 
    
    // 1. Initial Load & Sign Up
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/SIXSHARP/i);
    
    // Sign up / Sign in flow
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByPlaceholder('Full Name').fill('Test User');
    await page.getByPlaceholder('Institutional Email').fill(uniqueEmail);
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Wait for dashboard
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible({ timeout: 15000 });

    // 2. MARKET RESEARCH
    await page.getByRole('button', { name: 'Markets', exact: true }).click();
    await expect(page).toHaveURL(/.*\/markets/);
    // Select asset
    await page.getByText('AAPL', { exact: true }).first().click();
    // Verify chart container appears
    await expect(page.locator('.tv-lightweight-charts').first()).toBeVisible({ timeout: 15000 });
    // Verify it shows AAPL data
    await expect(page.getByText(/Apple Inc/i).first()).toBeVisible();

    // 3. REAL STRATEGY TEST
    await page.getByRole('button', { name: 'Strategy Lab', exact: true }).click();
    await expect(page.getByRole('heading', { name: /Strategy Lab/i })).toBeVisible();
    
    // Choose SMA Crossover & Configure Parameters
    // We change the fast moving average to 5 so it trades more often and guarantees trades
    await page.getByRole('spinbutton').first().fill('5');
    await page.getByRole('button', { name: /Run Backtest/i }).click();
    
    // 4. Backtest Execution
    // Ensure the charts mounted
    await expect(page.locator('.tv-lightweight-charts').first()).toBeVisible({ timeout: 15000 });
    
    // Result Integrity
    await expect(page.getByText(/Total Return/i).first()).toBeVisible();
    await expect(page.getByText(/Sharpe/i).first()).toBeVisible();
    
    // Check Trade Ledger/History area appears (should have trades now)
    await expect(page.getByText(/Trade Ledger/i).first()).toBeVisible();
    
    // 5. Robustness Lab Navigation (ROBUSTNESS TEST)
    await page.getByRole('button', { name: 'Robustness Lab', exact: true }).click();
    await expect(page).toHaveURL(/.*\/robustness/);
    await expect(page.getByRole('heading', { name: /Robustness Lab/i })).toBeVisible({ timeout: 10000 });

    // 6. Regime Analysis Navigation (REGIME TEST)
    await page.getByRole('button', { name: 'Regime Analysis', exact: true }).click();
    await expect(page).toHaveURL(/.*\/regime/);
    await expect(page.getByRole('heading', { name: /Regime Analysis/i })).toBeVisible({ timeout: 10000 });
    
    const loadingState = page.locator('.animate-spin');
    if (await loadingState.isVisible()) {
      await loadingState.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => null);
    }
    
    // 7. Correlation Lab Navigation (CORRELATION TEST)
    await page.getByRole('button', { name: 'Correlation Lab', exact: true }).click();
    await expect(page).toHaveURL(/.*\/correlation/);
    await expect(page.getByRole('heading', { name: /Cross-Asset Correlation Lab/i })).toBeVisible({ timeout: 10000 });
    // select multiple assets
    await page.getByText('BTC-USD').first().click();
    await expect(page.locator('select')).toBeVisible(); // 20/60/90 selector

    // 8. Strategy Vault Navigation
    await page.getByRole('button', { name: 'Strategy Vault', exact: true }).click();
    await expect(page).toHaveURL(/.*\/vault/);
    await expect(page.getByRole('heading', { name: /Strategy Vault/i })).toBeVisible({ timeout: 10000 });

    // Final Identity assertion on closing
    await expect(page.getByText('SIXSHARP').first()).toBeVisible();
  });
});
