export function parseEnvText(text: string) {
    const results: { key: string; value: string }[] = []
  
    // First, try to split by newlines for standard .env format
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
  
    if (lines.length > 0) {
      // Standard multi-line format
      for (const line of lines) {
        const parsed = parseEnvLine(line)
        results.push(...parsed)
      }
    } else {
      // Single line or concatenated format - use regex to find all env vars
      const parsed = parseEnvLine(text)
      results.push(...parsed)
    }
  
    return results.filter(({ key, value }) => key && value)
  }


  function parseEnvLine(text: string) {
    const results: { key: string; value: string }[] = []
  
    // Regex to match environment variables: KEY=value or KEY="value" or KEY='value'
    // This handles concatenated env vars without newlines
    const envRegex =
      /([A-Z_][A-Z0-9_]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^"\s][^\s]*(?:\s+[^\s]+)*?)(?=\s+[A-Z_][A-Z0-9_]*\s*=|$))/g
  
    let match
    while ((match = envRegex.exec(text)) !== null) {
      const key = match[1].trim()
      // Value can be in match[2] (double quotes), match[3] (single quotes), or match[4] (unquoted)
      const value = (match[2] || match[3] || match[4] || "").trim()
  
      if (key && value) {
        results.push({ key, value })
      }
    }
  
    // Fallback: if regex didn't find anything, try simple split approach
    if (results.length === 0 && text.includes("=")) {
      const parts = text.split("=")
      if (parts.length >= 2) {
        const key = parts[0].trim()
        const value = parts.slice(1).join("=").trim()
  
        // Remove surrounding quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, "")
  
        if (key && cleanValue) {
          results.push({ key, value: cleanValue })
        }
      }
    }
  
    return results
  }