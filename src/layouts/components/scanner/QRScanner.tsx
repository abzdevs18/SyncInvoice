import React, { useState } from 'react'
import QrReader from 'react-qr-reader'

const QRScanner = () => {
  const [result, setResult] = useState('')

  const handleScan = data => {
    if (data) {
      setResult(data)
    }
  }

  const handleError = error => {
    console.error('QR Code Scanner Error:', error)
  }

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QRScanner />
      <p>Scanned Result: {result}</p>
      <button onClick={() => setResult('')}>Clear Result</button>
    </div>
  )
}

export default QRScanner
