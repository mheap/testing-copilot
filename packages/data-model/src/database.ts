import { Sequelize } from 'sequelize'
import { initUserModel, User } from './models/User'
import * as path from 'path'

export class Database {
  private sequelize: Sequelize
  private skipBootstrap: boolean
  
  constructor(dbPath?: string, skipBootstrap: boolean = false) {
    const dbLocation = dbPath || path.join(process.cwd(), 'database.sqlite')
    this.skipBootstrap = skipBootstrap
    
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbLocation,
      logging: console.log
    })
    
    // Initialize models
    initUserModel(this.sequelize)
  }
  
  async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate()
      console.log('Database connection established successfully.')
      
      // Sync database
      await this.sequelize.sync()
      console.log('Database synced successfully.')
      
      // Bootstrap test data
      if (!this.skipBootstrap) {
        await this.bootstrapData()
      }
    } catch (error) {
      console.error('Unable to connect to database:', error)
      throw error
    }
  }
  
  async bootstrapData(): Promise<void> {
    try {
      const userCount = await User.count()
      if (userCount === 0) {
        console.log('Bootstrapping test data...')
        await User.create({
          name: 'Test User',
          email: 'test@example.com'
        })
        console.log('Test user created successfully.')
      }
    } catch (error) {
      console.error('Error bootstrapping data:', error)
    }
  }
  
  async getFirstUser() {
    return await User.findOne({ order: [['id', 'ASC']] })
  }
  
  async createUser(name: string, email: string) {
    return await User.create({ name, email })
  }
  
  async close(): Promise<void> {
    await this.sequelize.close()
  }
}