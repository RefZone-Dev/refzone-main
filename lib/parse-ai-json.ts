export function parseAIJsonResponse(text: string): unknown {
  let cleaned = text.trim()
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7)
  if (cleaned.startsWith("```")) cleaned = cleaned.slice(3)
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3)
  cleaned = cleaned.trim()

  const jsonStartIndex = cleaned.indexOf("{")
  const jsonEndIndex = cleaned.lastIndexOf("}")

  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    cleaned = cleaned.slice(jsonStartIndex, jsonEndIndex + 1)
  }

  try {
    return JSON.parse(cleaned)
  } catch {
    // Attempt to repair truncated JSON by closing open arrays/objects
    let repaired = cleaned
    const openBrackets = (repaired.match(/\[/g) || []).length - (repaired.match(/\]/g) || []).length
    const openBraces = (repaired.match(/\{/g) || []).length - (repaired.match(/\}/g) || []).length

    // Remove trailing partial entries (e.g. truncated mid-object)
    repaired = repaired.replace(/,\s*\{[^}]*$/, '')
    repaired = repaired.replace(/,\s*"[^"]*$/, '')
    repaired = repaired.replace(/,\s*$/, '')

    // Close remaining open brackets
    const newOpenBrackets = (repaired.match(/\[/g) || []).length - (repaired.match(/\]/g) || []).length
    const newOpenBraces = (repaired.match(/\{/g) || []).length - (repaired.match(/\}/g) || []).length
    for (let i = 0; i < newOpenBrackets; i++) repaired += ']'
    for (let i = 0; i < newOpenBraces; i++) repaired += '}'

    return JSON.parse(repaired)
  }
}

export function parseAIJsonArrayResponse(text: string): unknown {
  let cleaned = text.trim()
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7)
  if (cleaned.startsWith("```")) cleaned = cleaned.slice(3)
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3)
  cleaned = cleaned.trim()

  const jsonStartIndex = cleaned.indexOf("[")
  const jsonEndIndex = cleaned.lastIndexOf("]")

  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    cleaned = cleaned.slice(jsonStartIndex, jsonEndIndex + 1)
  }

  return JSON.parse(cleaned)
}
