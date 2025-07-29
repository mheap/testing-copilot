import { _electron as electron } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Database } from 'data-model';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Register Functionality E2E Test', () => {
  let dbPath;
  let database;

  beforeAll(async () => {
    // Create a unique database for testing
    dbPath = path.join(__dirname, '..', 'test-register-database.sqlite');
    
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

  test('should register a new user and save to database', async () => {
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
      
      // Assert that the register page is loaded
      const registerHeading = await page.locator('text=Create your account to get started');
      const isVisible = await registerHeading.isVisible();
      expect(isVisible).toBe(true);
      
      // Fill in the registration form
      await page.fill('input[type="text"]', 'Bob');
      await page.fill('input[type="email"]', 'bob@example.com');
      await page.fill('input[type="password"]', 'password');
      
      // Check console for any errors before submitting
      const consoleMessages = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      // Submit the form
      await page.click('button[type="submit"]');
      
      // Wait a bit for the registration to process
      await page.waitForTimeout(3000);
      
      // Check if we've been redirected to login page (success case)
      const loginPageIndicator = await page.locator('text=Welcome back! Please sign in to your account');
      const isOnLoginPage = await loginPageIndicator.isVisible();
      
      // The registration should succeed and redirect to login page
      expect(isOnLoginPage).toBe(true);
      
      // Wait a bit more to ensure the registration was processed
      await page.waitForTimeout(2000);
      
    } finally {
      await electronApp.close();
    }
    
    // Verify the user was actually saved to the database
    database = new Database(dbPath, true);
    await database.connect();
    
    try {
      const users = await database.sequelize.models.User.findAll({
        where: { email: 'bob@example.com' }
      });
      
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Bob');
      expect(users[0].email).toBe('bob@example.com');
      
      console.log('User successfully saved to database:', users[0].toJSON());
    } finally {
      if (database) {
        await database.close();
      }
    }
  }, 90000);
});