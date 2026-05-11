export function parseBodyToHtml(body: string): string {
  // Match any **BOLD HEADER** on its own line — works for any section names Claude generates
  const headerRegex = /^\*\*([^*\n]+)\*\*\s*$/gm

  const sections: Array<{ header: string; index: number; fullMatchLen: number }> = []
  let match

  while ((match = headerRegex.exec(body)) !== null) {
    sections.push({
      header: match[1].trim(),
      index: match.index,
      fullMatchLen: match[0].length,
    })
  }

  let html = ''

  // Render any text before the first section header (e.g. first-digest welcome paragraph)
  if (sections.length > 0 && sections[0].index > 0) {
    const preamble = body.slice(0, sections[0].index).trim()
    if (preamble) {
      html += preamble
        .split(/\n\n+/)
        .filter(p => p.trim())
        .map(
          p =>
            `<p style="margin:0 0 24px;font-size:16px;line-height:1.9;color:#1a1a2e;font-style:italic">${p
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br>')
              .trim()}</p>`
        )
        .join('')
    }
  }

  sections.forEach((section, i) => {
    const contentStart = section.index + section.fullMatchLen
    const contentEnd = i + 1 < sections.length ? sections[i + 1].index : body.length
    const content = body.slice(contentStart, contentEnd).trim()

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
      <div style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#4a3f8f;margin-bottom:18px;padding-bottom:10px;border-bottom:2px solid #eeedfe">${section.header}</div>
      ${paragraphs}
    </div>`
  })

  return (
    html ||
    `<p style="font-size:16px;line-height:1.9;color:#1a1a2e">${body}</p>`
  )
}
