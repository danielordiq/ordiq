
import { test, expect } from '@playwright/test';

test.describe('Assessment Flow', () => {
  test('should complete assessment wizard and show High risk badge', async ({ page }) => {
    await test.step('Navigate to home page', async () => {
      await page.goto('/');
    });

    await test.step('Click Add new assessment button', async () => {
      await page.click('text=Add new assessment');
    });

    await test.step('Select Automated CV screening from dropdown', async () => {
      await page.selectOption('select', 'Automated CV-screening');
    });

    await test.step('Navigate through wizard steps', async () => {
      // Click Next button repeatedly until wizard finishes
      let nextButton = page.locator('button:has-text("Next")');
      
      while (await nextButton.isVisible()) {
        await nextButton.click();
        // Wait a bit for any navigation or state changes
        await page.waitForTimeout(500);
        
        // Check if we've reached the end (no more Next button)
        if (!(await nextButton.isVisible())) {
          break;
        }
      }
    });

    await test.step('Verify High risk badge is displayed', async () => {
      const riskBadge = page.locator('.risk-badge');
      await expect(riskBadge).toBeVisible();
      await expect(riskBadge).toContainText('High');
    });
  });
});
