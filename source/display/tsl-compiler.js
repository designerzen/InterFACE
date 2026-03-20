export function compileTSL(tslText){
  // Very small TSL "compiler" that splits the TSL file into vertex and fragment
  // sections using markers: // ---VERTEX--- and // ---FRAGMENT--- (or // ---FRAGMENT---)
  // This adapter intentionally keeps syntax identical to GLSL inside each block.

  const vertexMarker = /---VERTEX---/i
  const fragmentMarker = /---FRAGMENT---/i

  // Split by the markers
  const parts = tslText.split(/---(VERTEX|FRAGMENT)---/i)
  // parts might be [prefix, 'VERTEX', vertexCode, 'FRAGMENT', fragmentCode, ...]
  let vertex = ''
  let fragment = ''
  if (parts.length >= 3){
    // find the vertex block
    for (let i = 0; i < parts.length; i++){
      const part = parts[i]
      if (/VERTEX/i.test(part)){
        vertex = parts[i+1] || ''
      }
      if (/FRAGMENT/i.test(part)){
        fragment = parts[i+1] || ''
      }
    }
  } else {
    // fallback: try to split by comment markers
    const vMatch = tslText.match(/\/\/\s*---VERTEX---([\s\S]*)\/\/\s*---FRAGMENT---/i)
    if (vMatch){
      vertex = vMatch[1]
      const fMatch = tslText.match(/\/\/\s*---FRAGMENT---([\s\S]*)/i)
      if (fMatch) fragment = fMatch[1]
    } else {
      // If we can't parse, return the whole text as fragment for safety
      fragment = tslText
    }
  }

  // Trim leading/trailing whitespace
  vertex = vertex.trim()
  fragment = fragment.trim()

  return { vertexShader: vertex, fragmentShader: fragment }
}
