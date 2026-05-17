export type SubstackPost = {
  title: string
  description: string
  link: string
  pubDate: string
}

function extractCdata(xml: string, tag: string): string {
  const cdataMatch = xml.match(new RegExp(`<${tag}><\\!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
  if (cdataMatch) return cdataMatch[1].trim()
  const plainMatch = xml.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`))
  return plainMatch ? plainMatch[1].trim() : ''
}

export async function getSubstackPosts(limit = 3): Promise<SubstackPost[]> {
  try {
    const res = await fetch('https://whoff.substack.com/feed', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
    return items.slice(0, limit).map(item => ({
      title: extractCdata(item, 'title'),
      description: extractCdata(item, 'description'),
      link: extractCdata(item, 'link') || item.match(/<link>([^<]+)<\/link>/)?.[1] || '',
      pubDate: item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] || '',
    }))
  } catch {
    return []
  }
}

export function formatSubstackDate(pubDate: string): string {
  try {
    return new Date(pubDate).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    })
  } catch {
    return ''
  }
}
