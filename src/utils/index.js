export function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16).substring(2);

  return `id-${timestamp}-${hexadecimalString}`;
}

export const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 10000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  //console.log("FETCH ", response.headers.get('X-Custom-Usage'));
  return response;
};

export function encode(value) {
  // Encode value as UTF-8 bytes
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(value);

  // Convert bytes to base64 string
  const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

  // Build RFC 2047 encoded string
  return `=?utf-8?b?${base64Encoded}?=`;
}
