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
