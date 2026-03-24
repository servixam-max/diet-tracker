import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display onboarding page', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.locator('text=Paso 1 de 9')).toBeVisible();
  });

  test('should complete step 1 (welcome)', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.locator('text=¡Bienvenido!')).toBeVisible();
    await page.click('button:has-text("Continuar")');
    await expect(page.locator('text=Paso 2 de 9')).toBeVisible();
  });

  test('should validate name field', async ({ page }) => {
    await page.goto('/onboarding');
    await page.click('button:has-text("Continuar")');
    await page.fill('input[aria-label="Nombre"]', 'Test User');
    await page.click('button:has-text("Continuar")');
    await expect(page.locator('text=Paso 3 de 9')).toBeVisible();
  });

  test('should set age with slider', async ({ page }) => {
    await page.goto('/onboarding');
    await page.fill('input[aria-label="Nombre"]', 'Test User');
    await page.click('button:has-text("Continuar")');
    
    const ageSlider = page.locator('input[aria-label="Edad"]');
    await ageSlider.fill('30');
    await page.click('button:has-text("Continuar")');
    await expect(page.locator('text=Paso 3 de 9')).toBeVisible();
  });

  test('should select gender', async ({ page }) => {
    await page.goto('/onboarding');
    await page.fill('input[aria-label="Nombre"]', 'Test User');
    await page.click('button:has-text("Continuar")');
    await page.fill('input[aria-label="Edad"]', '30');
    await page.click('button:has-text("Continuar")');
    
    await page.click('button:has-text("Hombre")');
    await page.click('button:has-text("Continuar")');
    await expect(page.locator('text=Paso 3 de 9')).toBeVisible();
  });

  test('should set weight with slider', async ({ page }) => {
    await page.goto('/onboarding');
    await page.fill('input[aria-label="Nombre"]', 'Test User');
    await page.click('button:has-text("Continuar")');
    await page.fill('input[aria-label="Edad"]', '30');
    await page.click('button:has-text("Hombre")');
    await page.click('button:has-text("Continuar")');
    
    const weightSlider = page.locator('input[aria-label="Peso en kilogramos"]');
    await weightSlider.fill('75');
    await page.click('button:has-text("Continuar")');
    await expect(page.locator('text=Paso 3 de 9')).toBeVisible();
  });

  test('should set height with slider', async ({ page }) => {
    await page.goto('/onboarding');
    await page.fill('input[aria-label="Nombre"]', 'Test User');
    await page.click('button:has-text("Continuar")');
    await page.fill('input[aria-label="Edad"]', '30');
    await page.click('button:has-text("Hombre")');
    await page.click('button:has-text("Continuar")');
    await page.fill('input[aria-label="Peso en kilogramos"]', '75');
    await page.click('button:has-text("Continuar")');
    
    const heightSlider = page.locator('input[aria-label="Altura en centímetros"]');
    await heightSlider.fill('175');
    await page.click('button:has-text("Continuar")');
    await expect(page.locator('text=Paso 4 de 9')).toBeVisible();
  });

  test('should complete all 9 steps', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Step 1: Welcome
    await page.click('button:has-text("Continuar")');
    
    // Step 2: Name
    await page.fill('input[aria-label="Nombre"]', 'Test User');
    await page.click('button:has-text("Continuar")');
    
    // Step 3: Age, Gender
    await page.fill('input[aria-label="Edad"]', '30');
    await page.click('button:has-text("Hombre")');
    await page.click('button:has-text("Continuar")');
    
    // Step 4: Weight, Height
    await page.fill('input[aria-label="Peso en kilogramos"]', '75');
    await page.click('button:has-text("Continuar")');
    await page.fill('input[aria-label="Altura en centímetros"]', '175');
    await page.click('button:has-text("Continuar")');
    
    // Steps 5-9: Complete remaining steps
    for (let i = 5; i <= 9; i++) {
      await page.click('button:has-text("Continuar")');
    }
    
    // Should redirect to dashboard after completion
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate back with back button', async ({ page }) => {
    await page.goto('/onboarding');
    await page.click('button:has-text("Continuar")');
    await page.fill('input[aria-label="Nombre"]', 'Test User');
    await page.click('button:has-text("Continuar")');
    
    await page.click('button[aria-label="Volver"]');
    await expect(page.locator('text=Paso 1 de 9')).toBeVisible();
  });

  test('should display progress indicator', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.locator('div[role="progressbar"]')).toBeVisible();
    await expect(page.locator('text=Paso 1 de 9')).toBeVisible();
  });
});
