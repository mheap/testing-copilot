const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

describe('Electron App Registration and Login', () => {
  let electronApp;
  let page;
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

    // Launch Electron app
    const args = [path.join(__dirname, '..', 'dist-electron', 'main.js')];
    
    // Add minimal args needed for Electron to run
    args.push('--no-sandbox');
    
    // Add additional args for CI environment to force offscreen rendering
    if (process.env.CI) {
      args.push(
        '--disable-dev-shm-usage', 
        '--disable-gpu', 
        '--disable-software-rasterizer',
        '--disable-gpu-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      );
    }

    electronApp = await electron.launch({
      args,
      cwd: path.join(__dirname, '..'),
      timeout: 30000
    });

    // Get the first window
    page = await electronApp.firstWindow();
    
    // Wait for the app to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  afterAll(async () => {
    // Close the app
    if (electronApp) {
      await electronApp.close();
    }

    // Clean up test database
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  test('should load the landing page', async () => {
    // Check if the app loaded correctly
    const title = await page.title();
    expect(title).toBe('Robots are here');
    
    // Check if the main heading is visible - use a more flexible selector
    const heading = await page.locator('h1').textContent();
    expect(heading).toContain('Robots are here!');
  });

  test('should navigate to register page', async () => {
    // Click on the "Get Started" button to go to register
    await page.click('text=Get Started');
    
    // Wait for navigation
    await page.waitForTimeout(1000);
    
    // Check if we're on the register page
    const registerHeading = await page.textContent('h1');
    expect(registerHeading).toBe('Register');
  });

  test('should register a new user successfully', async () => {
    // Fill out the registration form
    await page.fill('input[type="text"]', 'John Doe');
    await page.fill('input[type="email"]', 'john.doe@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for the success toast and navigation
    await page.waitForTimeout(2000);
    
    // Check if we were redirected to the login page
    const loginHeading = await page.textContent('h1');
    expect(loginHeading).toBe('Sign In');
  });

  test('should verify user exists in database', async () => {
    // We need to check the database directly
    // Since we can't easily access the Electron main process from here,
    // we'll use a Node.js SQLite connection to verify
    const sqlite3 = require('sqlite3').verbose();
    
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        db.get('SELECT * FROM users WHERE email = ?', ['john.doe@example.com'], (err, row) => {
          if (err) {
            db.close();
            reject(err);
            return;
          }
          
          expect(row).toBeDefined();
          expect(row.name).toBe('John Doe');
          expect(row.email).toBe('john.doe@example.com');
          
          db.close();
          resolve();
        });
      });
    });
  });

  test('should login successfully', async () => {
    // Fill out the login form (any credentials should work since login just gets first user)
    await page.fill('input[type="email"]', 'john.doe@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForTimeout(2000);
    
    // Check if we're on the dashboard
    const dashboardHeading = await page.textContent('h1');
    expect(dashboardHeading).toBe('Dashboard');
    
    // Check if the welcome message contains the user's name
    const welcomeMessage = await page.textContent('h2');
    expect(welcomeMessage).toContain('Welcome back, John Doe');
  });

  test('should logout successfully', async () => {
    // Click the logout button
    await page.click('text=Logout');
    
    // Wait for navigation back to landing page
    await page.waitForTimeout(1000);
    
    // Check if we're back on the landing page
    const heading = await page.textContent('h1');
    expect(heading).toContain('Robots are here!');
  });
});