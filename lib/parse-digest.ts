const SECTION_HEADERS = [
  'PHILOSOPHY',
  'BUSINESS & SYSTEMS',
  'REFLECTIONS',
  'NEW THOUGHTS & QUESTIONS',
]

export function parseBodyToHtml(body: string): string {
  let html = ''

  SECTION_HEADERS.forEach((header, i) => {
    const patterns = [`**${header}**`, `## ${header}`, `# ${header}`, header]
    let start = -1
    let headerLen = 0

    for (const p of patterns) {
      const idx = body.indexOf(p)
      if (idx !== -1) {
        start = idx
        headerLen = p.length
        break
      }
    }

    if (start === -1) return

    let end = body.length
    for (let j = i + 1; j < SECTION_HEADERS.length; j++) {
      for (const p of [
        `**${SECTION_HEADERS[j]}**`,
        `## ${SECTION_HEADERS[j]}`,
        SECTION_HEADERS[j],
      ]) {
        const idx = body.indexOf(p)
        if (idx !== -1 && idx < end) {
          end = idx
          break
        }
      }
    }

    const content = body.slice(start + headerLen, end).trim()
    const paragraphs = content
      .split(/\n\n+/)
      .filter(p => p.trim())
      .map(
        p =>
          `<p style="margin:0 0 18px;font-size:16px;line-height:1.9;color:#1a1a2e">${p
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .trim()}</p>`
      )
      .join('')

    html += `
    <div style="margin-bottom:44px">
      <div style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#4a3f8f;margin-bottom:18px;padding-bottom:10px;border-bottom:2px solid #eeedfe">${header}</div>
      ${paragraphs}
    </div>`
  })

  return (
    html ||
    `<p style="font-size:16px;line-height:1.9;color:#1a1a2e">${body}</p>`
  )
}
