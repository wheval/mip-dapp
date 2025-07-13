import { NextRequest, NextResponse } from 'next/server'
import { IPFSMetadata, IPFSUploadResponse } from '@/src/services/ipfs.service'

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY
const PINATA_JWT = process.env.PINATA_JWT

export async function POST(request: NextRequest) {
  try {
    const { metadata, name } = await request.json()

    if (!metadata) {
      return NextResponse.json({ error: 'Metadata is required' }, { status: 400 })
    }

    if (!PINATA_JWT && !PINATA_API_KEY) {
      return NextResponse.json(
        { error: 'IPFS service not configured. Please set PINATA_JWT or PINATA_API_KEY.' },
        { status: 500 }
      )
    }

    const body = {
      pinataContent: metadata,
      pinataMetadata: {
        name: name || metadata.name || 'Metadata',
        keyvalues: {
          type: 'metadata',
          collection: metadata.name
        }
      },
      pinataOptions: {
        cidVersion: 1
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (PINATA_JWT) {
      headers['Authorization'] = `Bearer ${PINATA_JWT}`
    } else if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      headers['pinata_api_key'] = PINATA_API_KEY
      headers['pinata_secret_api_key'] = PINATA_SECRET_KEY
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Pinata upload failed:', errorText)
      return NextResponse.json(
        { error: `Pinata upload failed: ${response.status}` },
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
    console.error('IPFS metadata upload failed:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
} 