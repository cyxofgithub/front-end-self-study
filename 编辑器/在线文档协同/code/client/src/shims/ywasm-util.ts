const encoder = globalThis.TextEncoder;
const decoder = globalThis.TextDecoder;

export const TextEncoder = encoder;
export const TextDecoder = decoder;

export default {
    TextEncoder,
    TextDecoder,
};
