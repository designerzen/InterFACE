export const hexToRgba = (hex: string): [number, number, number, number] => {
    const normalized = hex.replace('#', '')
    const value = normalized.length === 3
        ? normalized.split('').map((character) => character + character).join('')
        : normalized

    const numberValue = parseInt(value, 16)
    return [
        (numberValue >> 16) & 255,
        (numberValue >> 8) & 255,
        numberValue & 255,
        255
    ]
}
