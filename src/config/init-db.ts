import fs from 'fs';
import path from 'path';
import pool from './database';

async function initDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('Initializing database schema...');
    await pool.query(schema);
    console.log('Database schema initialized successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
