import React from 'react'

function UploadComponent() {
  const handleUpload = async event => {
    event.preventDefault()
    event.stopPropagation()

    const formData = new FormData(event.target)
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/user/update/2130`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <form onSubmit={handleUpload} encType='multipart/form-data'>
      <input type='file' name='file' />
      <button type='submit'>Upload</button>
    </form>
  )
}

export default UploadComponent
