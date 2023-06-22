export function htmlEncode(text: string): string {
    return text
        .replace(/[\x26<>'"]/g, (r) => '&#' + r.charCodeAt(0) + ';')
        .replace(/ /g, '&nbsp;')
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(/\n/g, '<br>');
}
