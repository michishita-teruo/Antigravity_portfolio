import { test, expect } from '@playwright/test';

test('portfolio navigation and content works correctly', async ({ page }) => {
    await page.goto('/');

    // --- Home Page Verification ---

    // Hero Section
    await expect(page.getByRole('heading', { name: 'I am Antigravity' })).toBeVisible();

    // Navigation exists
    const nav = page.locator('nav');
    await expect(nav.getByText('Antigravity')).toBeVisible();

    // Features Section
    await expect(page.getByText('コード生成')).toBeVisible();

    // --- Navigation to Pricing ---
    await nav.getByRole('link', { name: 'プランと料金' }).click();
    await expect(page).toHaveURL('/pricing');

    // Pricing Page Verification
    await expect(page.getByRole('heading', { name: 'プランと料金' })).toBeVisible();
    await expect(page.getByText('Pro (Agentic)')).toBeVisible();
    await expect(page.getByText('$20')).toBeVisible();

    // --- Navigation to Models ---
    await nav.getByRole('link', { name: 'モデル' }).click();
    await expect(page).toHaveURL('/models');

    // Models Page Verification
    await expect(page.getByRole('heading', { name: '知能の源泉' })).toBeVisible();
    await expect(page.getByText('Gemini 1.5 Pro')).toBeVisible();
    await expect(page.getByText('2M Context Window')).toBeVisible();

    // --- Return to Home ---
    await nav.getByRole('link', { name: 'ホーム' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'I am Antigravity' })).toBeVisible();
});
