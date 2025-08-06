// app/upload/page.tsx
'use client'

import { useState, ChangeEvent } from 'react'
import { api } from '../lib/api'
import { Button } from '../components/ui/button'

export default function UploadPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  const handleCsvChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0])
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0])
    }
  }

  const uploadCsv = async () => {
    if (!csvFile) return alert('Select a CSV file first')
    const formData = new FormData()
    formData.append('file', csvFile)

    try {
      setMessage('Uploading CSV...')
      await api.post('/upload/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage('CSV uploaded successfully!')
      setCsvFile(null)
    } catch (error) {
      setMessage('Upload failed.')
      console.error(error)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return alert('Select an image first')
    const formData = new FormData()
    formData.append('file', imageFile)

    try {
      setMessage('Uploading image...')
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage('Image uploaded! Classification: ' + res.data.classification)
      setImageFile(null)
    } catch (error) {
      setMessage('Upload failed.')
      console.error(error)
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Data</h1>

      <section className="mb-8">
        <label className="block mb-2 font-medium">Upload CSV File</label>
        <input type="file" accept=".csv" onChange={handleCsvChange} />
        <Button className="mt-4" onClick={uploadCsv} disabled={!csvFile}>
          Upload CSV
        </Button>
      </section>

      <section>
        <label className="block mb-2 font-medium">Upload Water Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <Button className="mt-4" onClick={uploadImage} disabled={!imageFile}>
          Upload Image
        </Button>
      </section>

      {message && <p className="mt-6 text-green-600">{message}</p>}
    </main>
  )
}
