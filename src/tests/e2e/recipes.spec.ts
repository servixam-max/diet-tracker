import { test, expect } from '@playwright/test';

test.describe('Recipe Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to recipes page', async ({ page }) => {
    await page.click('text=Recetas');
    await expect(page).toHaveURL('/recipes');
  });

  test('should display recipes list', async ({ page }) => {
    await page.click('text=Recetas');
    await expect(page.locator('text=Recetas')).toBeVisible();
  });

  test('should display empty state when no recipes', async ({ page }) => {
    await page.click('text=Recetas');
    await expect(page.locator('text=No hay recetas guardadas')).toBeVisible();
  });

  test('should filter recipes by supermarket', async ({ page }) => {
    await page.click('text=Recetas');
    await page.click('button:has-text("Mercadona")');
    await expect(page.locator('text=Recetas de Mercadona')).toBeVisible();
  });

  test('should open recipe detail', async ({ page }) => {
    await page.click('text=Recetas');
    const firstRecipe = page.locator('[data-testid="recipe-card"]').first();
    await firstRecipe.click();
    await expect(page.locator('text=Ingredientes')).toBeVisible();
  });

  test('should share recipe', async ({ page }) => {
    await page.click('text=Recetas');
    const shareButton = page.locator('button[aria-label="Compartir"]').first();
    await shareButton.click();
    await expect(page.locator('text=Compartir')).toBeVisible();
  });

  test('should copy recipe link', async ({ page }) => {
    await page.click('text=Recetas');
    const shareButton = page.locator('button[aria-label="Compartir"]').first();
    await shareButton.click();
    await page.click('button:has-text("Copiar")');
    await expect(page.locator('text=Enlace copiado')).toBeVisible();
  });
});
