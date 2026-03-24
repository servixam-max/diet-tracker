import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display dashboard title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('¡Hola!');
  });

  test('should display nutrition card', async ({ page }) => {
    await expect(page.locator('text=Calorías de hoy')).toBeVisible();
  });

  test('should display calorie count', async ({ page }) => {
    await expect(page.locator('text=kcal')).toBeVisible();
  });

  test('should display macros', async ({ page }) => {
    await expect(page.locator('text=Proteínas')).toBeVisible();
    await expect(page.locator('text=Carbos')).toBeVisible();
    await expect(page.locator('text=Grasas')).toBeVisible();
  });

  test('should open add food modal', async ({ page }) => {
    await page.click('button:has-text("Añadir comida")');
    await expect(page.locator('text=Añadir comida')).toBeVisible();
  });

  test('should display week day selector', async ({ page }) => {
    await expect(page.locator('text=Lun')).toBeVisible();
    await expect(page.locator('text=Mar')).toBeVisible();
    await expect(page.locator('text=Mié')).toBeVisible();
  });

  test('should select different day', async ({ page }) => {
    await page.click('text=Mar');
    await expect(page.locator('text=Mar')).toHaveClass(/bg-gradient-to-b/);
  });

  test('should display bottom navigation', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Recetas')).toBeVisible();
    await expect(page.locator('text=Compra')).toBeVisible();
    await expect(page.locator('text=Perfil')).toBeVisible();
  });

  test('should navigate to recipes page', async ({ page }) => {
    await page.click('text=Recetas');
    await expect(page).toHaveURL('/recipes');
  });

  test('should navigate to shopping page', async ({ page }) => {
    await page.click('text=Compra');
    await expect(page).toHaveURL('/shopping');
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.click('text=Perfil');
    await expect(page).toHaveURL('/profile');
  });

  test('should refresh data', async ({ page }) => {
    const refreshButton = page.locator('button[aria-label="Actualizar datos"]');
    await refreshButton.click();
    await expect(page.locator('text=Calorías de hoy')).toBeVisible();
  });
});
