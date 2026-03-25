import { test, expect } from '@playwright/test';

test.describe('Full Diet Tracker Test', () => {
  const TEST_EMAIL = 'test_full_2@demo.com';
  const TEST_PASSWORD = 'TestPassword123!';
  const TEST_NAME = 'Test User';

  test('Register new user', async ({ page }) => {
    test.setTimeout(90000);
    
    await page.goto('/login');
    await page.waitForSelector('input[placeholder="Email"]');
    
    // Toggle to register mode - button text is "¿No tienes cuenta? Regístrate"
    await page.click('button:has-text("Regístrate")');
    await page.waitForTimeout(1000);
    
    // Wait for name input to appear
    await page.waitForSelector('input[placeholder="Nombre"]', { timeout: 5000 });
    
    // Fill form
    await page.fill('input[placeholder="Email"]', TEST_EMAIL);
    await page.fill('input[placeholder="Contraseña"]', TEST_PASSWORD);
    await page.fill('input[placeholder="Nombre"]', TEST_NAME);
    
    // Submit - button text changes to "Crear cuenta"
    await page.click('button:has-text("Crear cuenta")');
    
    // Wait for redirect
    await page.waitForURL('/dashboard', { timeout: 30000 });
    console.log('✓ Registration successful');
  });

  test('Complete onboarding', async ({ page }) => {
    test.setTimeout(120000);
    
    await page.goto('/login');
    await page.waitForSelector('input[placeholder="Email"]');
    await page.fill('input[placeholder="Email"]', TEST_EMAIL);
    await page.fill('input[placeholder="Contraseña"]', TEST_PASSWORD);
    await page.click('button:has-text("Iniciar sesión")');
    await page.waitForURL('/dashboard', { timeout: 30000 });
    
    await page.goto('/onboarding');
    await page.waitForSelector('text=Paso 1 de 9');
    
    // Step 1
    console.log('Step 1');
    await page.click('button:has-text("Continuar")');
    await page.waitForTimeout(500);
    
    // Step 2: Name
    console.log('Step 2');
    await page.waitForSelector('input[aria-label="Nombre"]');
    await page.fill('input[aria-label="Nombre"]', TEST_NAME);
    await page.click('button:has-text("Continuar")');
    await page.waitForTimeout(500);
    
    // Step 3: Age, Gender
    console.log('Step 3');
    await page.fill('input[aria-label="Edad"]', '30');
    await page.click('button:has-text("Hombre")');
    await page.click('button:has-text("Continuar")');
    await page.waitForTimeout(500);
    
    // Step 4: Weight
    console.log('Step 4');
    await page.fill('input[aria-label="Peso"]', '75');
    await page.click('button:has-text("Continuar")');
    await page.waitForTimeout(500);
    
    // Step 5: Height
    console.log('Step 5');
    await page.fill('input[aria-label="Altura"]', '175');
    await page.click('button:has-text("Continuar")');
    await page.waitForTimeout(500);
    
    // Step 6: Activity
    console.log('Step 6');
    await page.click('button:has-text("Moderadamente activo")');
    await page.click('button:has-text("Continuar")');
    await page.waitForTimeout(500);
    
    // Step 7: Goal
    console.log('Step 7');
    await page.click('button:has-text("Mantener peso")');
    await page.click('button:has-text("Continuar")');
    await page.waitForTimeout(500);
    
    // Step 8: Skip dietary
    console.log('Step 8');
    await page.click('button:has-text("Continuar")');
    await page.waitForTimeout(500);
    
    // Step 9: Servings
    console.log('Step 9');
    await page.click('button:has-text("1 persona")');
    await page.waitForTimeout(500);
    
    // Finish
    await page.click('button:has-text("¡Empezar!")');
    await page.waitForTimeout(2000);
    
    await page.waitForURL('/dashboard', { timeout: 30000 });
    console.log('✓ Onboarding complete');
  });

  test('Weekly plan', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/login');
    await page.waitForSelector('input[placeholder="Email"]');
    await page.fill('input[placeholder="Email"]', TEST_EMAIL);
    await page.fill('input[placeholder="Contraseña"]', TEST_PASSWORD);
    await page.click('button:has-text("Iniciar sesión")');
    await page.waitForURL('/dashboard', { timeout: 30000 });
    
    await page.goto('/weekly-plan');
    await page.waitForURL('/weekly-plan');
    console.log('✓ Weekly plan accessible');
  });

  test('Recipes', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/login');
    await page.waitForSelector('input[placeholder="Email"]');
    await page.fill('input[placeholder="Email"]', TEST_EMAIL);
    await page.fill('input[placeholder="Contraseña"]', TEST_PASSWORD);
    await page.click('button:has-text("Iniciar sesión")');
    await page.waitForURL('/dashboard', { timeout: 30000 });
    
    await page.goto('/recipes');
    await page.waitForURL('/recipes');
    console.log('✓ Recipes accessible');
  });
});
