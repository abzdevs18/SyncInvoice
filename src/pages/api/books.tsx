import mysql from 'mysql2/promise'

export default async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root_dev',
      password: 'D3b1an!?',
      database: 'Sample'
    })

    // Your database query goes here. For example:
    const [rows] = await connection.execute('SELECT * FROM books')
    await connection.end()

    // Send the fetched data to another endpoint
    const otherEndpointResponse = await fetch(`${process.env.BASE_URL}/api/test/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000'
      },
      body: JSON.stringify(rows)
    })

    if (!otherEndpointResponse.ok) {
      throw new Error(`Failed to send data to other endpoint: ${otherEndpointResponse.statusText}`)
    }

    const otherEndpointData = await otherEndpointResponse.json()
    return res.json({ success: true, message: 'Data sent successfully!', otherEndpointData })

    // res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
