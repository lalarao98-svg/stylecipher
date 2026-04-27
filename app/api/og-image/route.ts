import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StyleCipher/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(5000),
    })

    const html = await response.text()

    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)

    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)

    const imageUrl = ogImageMatch?.[1] || null
    const title = ogTitleMatch?.[1] || null

    return NextResponse.json({ imageUrl, title })
  } catch {
    return NextResponse.json({ imageUrl: null, title: null })
  }
}
