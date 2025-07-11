import { NextRequest, NextResponse } from 'next/server'
import { IPFSUploadResponse } from '@/lib/ipfs-service'

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY
const PINATA_JWT = process.env.PINATA_JWT

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    if (!PINATA_JWT && !PINATA_API_KEY) {
      return NextResponse.json(
        { error: 'IPFS service not configured. Please set PINATA_JWT or PINATA_API_KEY.' },
        { status: 500 }
      )
    }

    const pinataFormData = new FormData()
    pinataFormData.append('file', file)
    
    const metadata = {
      name: file.name,
      keyvalues: {
        type: 'media',
        size: file.size.toString(),
        contentType: file.type
      }
    }
    pinataFormData.append('pinataMetadata', JSON.stringify(metadata))
    
    const options = {
      cidVersion: 1
    }
    pinataFormData.append('pinataOptions', JSON.stringify(options))

    const headers: Record<string, string> = {}

    if (PINATA_JWT) {
      headers['Authorization'] = `Bearer ${PINATA_JWT}`
    } else if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      headers['pinata_api_key'] = PINATA_API_KEY
      headers['pinata_secret_api_key'] = PINATA_SECRET_KEY
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers,
      body: pinataFormData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Pinata file upload failed:', errorText)
      return NextResponse.json(
        { error: `Pinata file upload failed: ${response.status}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    const uploadResponse: IPFSUploadResponse = {
      hash: result.IpfsHash,
      url: `ipfs://${result.IpfsHash}`,
      gateway: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    }

    return NextResponse.json(uploadResponse)
  } catch (error) {
    console.error('IPFS file upload failed:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
} 