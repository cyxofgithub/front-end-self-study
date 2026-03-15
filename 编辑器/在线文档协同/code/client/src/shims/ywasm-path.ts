function normalize(part: string): string {
    return part.replace(/^\/+|\/+$/g, '');
}

export function join(...parts: string[]): string {
    const cleaned = parts.map(normalize).filter(Boolean);
    if (cleaned.length === 0) {
        return '';
    }
    return cleaned.join('/');
}

export default {
    join,
};
