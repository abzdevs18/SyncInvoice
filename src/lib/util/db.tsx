// db.ts
import { createConnection, Connection, ConnectionConfig } from 'mysql2'

const dbConfig = {
  host: 'localhost',
  user: 'root_dev',
  password: 'D3b1an!?',
  database: 'Sample'
}

export const connectToDB = (): Connection => {
  const connection = createConnection(dbConfig)
  connection.connect(error => {
    if (error) {
      console.error('Error connecting to DB:', error)
      process.exit(1)
    }
  })
  return connection
}
// pages/api/db.js
import mysql from 'mysql2/promise'

export default async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    // Your database query goes here. For example:
    const [rows] = await connection.execute('SELECT * FROM my_table')
    await connection.end()

    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
