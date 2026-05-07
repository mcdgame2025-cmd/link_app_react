const CLOUD_NAME = 'di1fqhtlb'
const API_KEY = '977881125886948'
const API_SECRET = '7BxWQrZaQHDoPPy1fSDQAhIZQr0'

async function generateSignature(timestamp: number): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(`timestamp=${timestamp}${API_SECRET}`)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = await generateSignature(timestamp)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('timestamp', timestamp.toString())
  formData.append('api_key', API_KEY)
  formData.append('signature', signature)
  formData.append('background', 'transparent')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  
  if (data.error) {
    throw new Error(data.error.message)
  }

  return data.secure_url
}