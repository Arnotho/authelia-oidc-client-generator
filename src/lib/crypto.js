// All cryptographic material is generated locally in the browser via the Web Crypto API.
// Nothing is ever transmitted to a server.

const BASE64_URL_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function toHex(bytes) {
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Generates a random, filesystem/URL-safe client identifier. */
export function generateClientId(length = 24) {
  const bytes = randomBytes(length);
  let out = '';
  for (const byte of bytes) out += BASE64_URL_ALPHABET[byte % BASE64_URL_ALPHABET.length];
  return out;
}

/** Generates a cryptographically random client secret (plaintext, shown once). */
export function generateSecret(length = 48) {
  return toBase64Url(randomBytes(length));
}

/** Generates a random HMAC secret suitable for `identity_providers.oidc.hmac_secret`. */
export function generateHmacSecret(length = 64) {
  return toBase64Url(randomBytes(length));
}

/**
 * Hashes a plaintext client secret the way Authelia expects it in its configuration
 * (PBKDF2-SHA512, per the Authelia `authelia crypto hash generate` default digest).
 * See: https://www.authelia.com/reference/guides/generating-secure-values/
 */
export async function hashAutheliaSecret(secret, iterations = 310000) {
  const salt = randomBytes(16);

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits']);

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-512'
    },
    key,
    512
  );

  // Authelia uses the Modular Crypt Format: $pbkdf2-sha512$<iterations>$<salt-b64>$<hash-b64>
  return `$pbkdf2-sha512$${iterations}$${toBase64Url(salt)}$${toBase64Url(new Uint8Array(bits))}`;
}

/** Generates a UUIDv4, useful as a client_id alternative. */
export function generateUuid() {
  return crypto.randomUUID();
}

function arrayBufferToPem(buffer, label) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const lines = base64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

/**
 * Generates an RSA-2048 keypair for use as the OIDC provider's `jwks` signing key,
 * returning both PKCS8 private key PEM and SPKI public key PEM.
 */
export async function generateRsaKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['sign', 'verify']
  );

  const [privateKeyBuffer, publicKeyBuffer] = await Promise.all([
    crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
    crypto.subtle.exportKey('spki', keyPair.publicKey)
  ]);

  return {
    privateKeyPem: arrayBufferToPem(privateKeyBuffer, 'PRIVATE KEY'),
    publicKeyPem: arrayBufferToPem(publicKeyBuffer, 'PUBLIC KEY')
  };
}

export { toHex };
