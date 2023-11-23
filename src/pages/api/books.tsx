import sql from 'mssql'

const sqlConfig = {
  user: 'AbuevaC',
  password: 'Sun112223!',
  database: 'SUNPLUSADV',
  server: 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

export default async (req, res) => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig)
    const result = await sql.query`SELECT TOP 1 * FROM EDU_A_SALFLDG`

    // Assuming you want to continue sending data to another endpoint
    const otherEndpointResponse = await fetch(`${process.env.BASE_URL}/api/test/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000'
      },
      body: JSON.stringify(result.recordset)
    })

    if (!otherEndpointResponse.ok) {
      throw new Error(`Failed to send data to other endpoint: ${otherEndpointResponse.statusText}`)
    }

    const otherEndpointData = await otherEndpointResponse.json()
    return res.json({ success: true, message: 'Data sent successfully!', otherEndpointData })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
