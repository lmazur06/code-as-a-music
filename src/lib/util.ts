export function htmlEncode(text: string): string {
    return text
        .replace(/[\x26<>'"]/g, (r) => '&#' + r.charCodeAt(0) + ';')
        .replace(/ /g, '&nbsp;')
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(/\n/g, '<br>');
}

export function textToArray(text: string): Array<number> {
    const result = [];
    for (let i = 0; i < text.length; i++) {
        result.push(text.charCodeAt(i));
    }
    return result;
}

/**
 * Unsigned 32-bit little endian to Uint8Array
 */
export function u32leTou8a(value: number): Uint8Array {
    const result = new Uint8Array(4);
    result[0] = value & 0xff;
    result[1] = (value >> 8) & 0xff;
    result[2] = (value >> 16) & 0xff;
    result[3] = (value >> 24) & 0xff;
    return result;
}

/**
 * Unsigned 16-bit little endian to Uint8Array
 */
export function u16leTou8a(value: number): Uint8Array {
    const result = new Uint8Array(2);
    result[0] = value & 0xff;
    result[1] = (value >> 8) & 0xff;
    return result;
}
