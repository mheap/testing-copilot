import { _electron as electron } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Electron App Smoke Test', () => {
  let dbPath;

  beforeAll(async () => {
    // Create a unique database for testing
    dbPath = path.join(__dirname, '..', 'test-database.sqlite');
    
    // Remove any existing test database
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }

    // Set the database path for testing
    process.env.TEST_DB_PATH = dbPath;
  }, 30000);

  afterAll(async () => {
    // Clean up test database
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  async function launchElectronApp() {
    const args = [path.join(__dirname, '..', 'dist-electron', 'main.js')];
    args.push('--no-sandbox');
    
    // Auto-detect headless mode - needed for CI and environments without display
    const needsHeadless = process.env.CI || !process.env.DISPLAY || process.env.DISPLAY === '';
    
    if (needsHeadless) {
      args.push(
        '--disable-dev-shm-usage', 
        '--disable-gpu', 
        '--disable-software-rasterizer',
        '--disable-features=VizDisplayCompositor',
        '--use-gl=swiftshader'
      );
    }

    return await electron.launch({
      args,
      cwd: path.join(__dirname, '..'),
      timeout: 30000
    });
  }

  test('should launch Electron app and establish database connection', async () => {
    const electronApp = await launchElectronApp();

    try {
      // Just verify the app launched
      expect(electronApp).toBeDefined();
      
      // Wait a bit for the database to initialize
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verify database was created (this means the app started successfully)
      expect(fs.existsSync(dbPath)).toBe(true);
    } finally {
      await electronApp.close();
    }
  }, 60000);

  test('should display correct text on the landing page', async () => {
    const electronApp = await launchElectronApp();

    try {
      // Get the first page (main window)
      const page = await electronApp.firstWindow();
      
      // Wait for page to load
      await page.waitForTimeout(2000);
      
      // Assert that the landing page text is visible
      const element = await page.locator('text=Welcome to the Robots are here application!');
      const isVisible = await element.isVisible();
      expect(isVisible).toBe(true);
    } finally {
      await electronApp.close();
    }
  }, 60000);

  test('should display correct text on the register page', async () => {
    const electronApp = await launchElectronApp();

    try {
      // Get the first page (main window)
      const page = await electronApp.firstWindow();
      
      // Wait for page to load
      await page.waitForTimeout(2000);
      
      // Navigate to register page by clicking the "Get Started" button
      await page.click('text=Get Started');
      
      // Wait for navigation
      await page.waitForTimeout(1000);
      
      // Assert that the register page text is visible
      const element = await page.locator('text=Create your account to get started');
      const isVisible = await element.isVisible();
      expect(isVisible).toBe(true);
    } finally {
      await electronApp.close();
    }
  }, 60000);

  test('should display correct text on the login page', async () => {
    const electronApp = await launchElectronApp();

    try {
      // Get the first page (main window)
      const page = await electronApp.firstWindow();
      
      // Wait for page to load
      await page.waitForTimeout(2000);
      
      // Navigate to login page by clicking the "Sign In" button
      await page.click('text=Sign In');
      
      // Wait for navigation
      await page.waitForTimeout(1000);
      
      // Assert that the login page text is visible
      const element = await page.locator('text=Welcome back! Please sign in to your account');
      const isVisible = await element.isVisible();
      expect(isVisible).toBe(true);
    } finally {
      await electronApp.close();
    }
  }, 60000);
});