export function groupTheoryBlocks(theory = []) {
  const sections = []
  let current = null

  for (const block of theory) {
    const text = (block?.text || '').trim()
    if (!text) continue

    const isHeading = /^\d+\.\d+\./.test(text)

    if (isHeading) {
      if (current) sections.push(current)
      current = {
        title: text,
        paragraphs: []
      }
      continue
    }

    if (!current) {
      current = {
        title: 'Основний матеріал',
        paragraphs: []
      }
    }

    current.paragraphs.push(text)
  }

  if (current) sections.push(current)

  return sections.map((section) => ({
    ...section,
    text: section.paragraphs.join('\n\n')
  }))
}
