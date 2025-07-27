const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

describe('Electron App Smoke Test', () => {
  let electronApp;
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
    // Close the app
    if (electronApp) {
      await electronApp.close();
    }

    // Clean up test database
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  test('should launch Electron app and establish database connection', async () => {
    // Launch Electron app
    const args = [path.join(__dirname, '..', 'dist-electron', 'main.cjs')];
    
    // Add minimal args needed for Electron to run
    args.push('--no-sandbox');
    
    // Add additional args for CI environment
    if (process.env.CI) {
      args.push(
        '--disable-dev-shm-usage', 
        '--disable-gpu', 
        '--disable-software-rasterizer',
        '--disable-features=VizDisplayCompositor',
        '--use-gl=swiftshader'
      );
    }

    electronApp = await electron.launch({
      args,
      cwd: path.join(__dirname, '..'),
      timeout: 30000
    });

    // Just verify the app launched
    expect(electronApp).toBeDefined();
    
    // Wait a bit for the database to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verify database was created (this means the app started successfully)
    expect(fs.existsSync(dbPath)).toBe(true);
    
  }, 60000);
});