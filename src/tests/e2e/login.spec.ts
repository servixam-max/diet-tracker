import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Email inválido')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'short');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Mínimo 6 caracteres')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Registrarse');
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to demo mode', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Modo Demo');
    await expect(page).toHaveURL('/dashboard');
  });
});
