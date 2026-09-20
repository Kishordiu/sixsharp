import { test, expect } from '@playwright/test'

test.describe('SIXSHARP - Final QUANTEX Demo Showcase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('researcher can execute the 15-step Hackathon Demo Flow', async ({ page }) => {
    test.setTimeout(60000)

    // 0. AUTHENTICATION & BOOT
    await expect(page).toHaveTitle(/SIXSHARP/i)
    await expect(page.getByText('SIXSHARP').first()).toBeVisible()
    await expect(page.getByText('Quantitative intelligence for multi-asset markets').first()).toBeVisible()

    // Sign up / Sign in flow
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByPlaceholder('Full Name').fill('Test User');
    await page.getByPlaceholder('Institutional Email').fill(uniqueEmail);
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Wait for dashboard to load
    const sidebar = page.locator('aside')
    await expect(sidebar).toBeVisible({ timeout: 15000 });
    
    // 2. MARKET RESEARCH
    await page.getByRole('button', { name: 'Markets', exact: true }).click();
    await expect(page).toHaveURL(/.*\/markets/)

    // 4. STRATEGY LAB
    await page.getByRole('button', { name: 'Strategy Lab', exact: true }).click();
    await expect(page).toHaveURL(/.*\/strategy-lab/)
    
    // 6. SHOW EXECUTION & RESULTS
    // Wait for charts to mount (which happens after backtest loads)
    await expect(page.locator('.tv-lightweight-charts').first()).toBeVisible({ timeout: 15000 })

    // 8. SHOW REGIME & ROBUSTNESS
    await page.getByRole('button', { name: 'Regime Analysis', exact: true }).click();
    await expect(page).toHaveURL(/.*\/regime/)
    
    await page.getByRole('button', { name: 'Robustness Lab', exact: true }).click();
    await expect(page).toHaveURL(/.*\/robustness/)
    await expect(page.getByRole('heading', { name: /Robustness Lab/i })).toBeVisible({ timeout: 10000 })

    // 9. SAVE TO STRATEGY VAULT
    await page.getByRole('button', { name: 'Strategy Lab', exact: true }).click();
    
    // 10. VAULT INSPECTION
    await page.getByRole('button', { name: 'Strategy Vault', exact: true }).click();
    await expect(page).toHaveURL(/.*\/vault/)
    await expect(page.getByRole('heading', { name: /Strategy Vault/i })).toBeVisible({ timeout: 10000 })

    // 11. AI EXPLANATION & VOICE (Quant AI)
    await page.getByRole('button', { name: 'AI Agent', exact: true }).click();
    await expect(page.getByRole('heading', { name: /Quantitative AI Assistant/i }).first()).toBeVisible()
    await page.getByRole('textbox').fill('Explain my backtest results.')
    await page.keyboard.press('Enter')
    await expect(page.locator('.lucide-bot').first()).toBeVisible()

    // 12. BEGINNER MODE & TAMIL
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await page.getByRole('button', { name: /Beginner/i }).click()
    await page.getByRole('button', { name: /Language/i }).click()
    await page.getByRole('button', { name: /தமிழ்/i }).click()
    
    // Ensure translation keys worked (no raw translation keys like 'settings.title')
    await expect(page.getByText('settings.')).toBeHidden()
  })
})
