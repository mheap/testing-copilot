const { Database } = require('data-model');
const fs = require('fs');
const path = require('path');

describe('Database Functionality', () => {
  let database;
  let dbPath;

  beforeEach(async () => {
    // Create a unique database for each test
    dbPath = path.join(__dirname, '..', `test-db-${Date.now()}.sqlite`);
    database = new Database(dbPath, true); // Skip bootstrap
    await database.connect();
  });

  afterEach(async () => {
    if (database) {
      await database.close();
    }
    
    // Clean up test database
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  test('should connect to database successfully', async () => {
    // Database should be connected from beforeEach
    expect(database).toBeDefined();
  });

  test('should create a user successfully', async () => {
    const user = await database.createUser('Test User', 'test@example.com');
    
    expect(user).toBeDefined();
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.id).toBeDefined();
  });

  test('should retrieve first user', async () => {
    // Create a user first
    await database.createUser('First User', 'first@example.com');
    await database.createUser('Second User', 'second@example.com');
    
    const firstUser = await database.getFirstUser();
    
    expect(firstUser).toBeDefined();
    expect(firstUser.name).toBe('First User');
    expect(firstUser.email).toBe('first@example.com');
  });

  test('should handle duplicate email error', async () => {
    // Create first user
    await database.createUser('User One', 'duplicate@example.com');
    
    // Try to create second user with same email
    try {
      await database.createUser('User Two', 'duplicate@example.com');
      fail('Should have thrown an error for duplicate email');
    } catch (error) {
      expect(error.message).toContain('Validation error');
    }
  });

  test('should bootstrap test data on empty database', async () => {
    // Manually trigger bootstrap
    await database.bootstrapData();
    
    // Check if the bootstrap data was created
    const firstUser = await database.getFirstUser();
    
    expect(firstUser).toBeDefined();
    expect(firstUser.name).toBe('Test User');
    expect(firstUser.email).toBe('test@example.com');
  });
});