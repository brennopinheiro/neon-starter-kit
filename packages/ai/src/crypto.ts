// AES-256-GCM encryption for per-org API keys
// Requires AI_ENCRYPTION_KEY env var: openssl rand -base64 32

export async function encryptApiKey(
  plaintext: string,
  encryptionKey: string
): Promise<{ encrypted: string; iv: string }> {
  const keyBuffer = Buffer.from(encryptionKey, "base64")
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  )

  const encodedText = new TextEncoder().encode(plaintext)
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encodedText
  )

  return {
    encrypted: Buffer.from(encryptedBuffer).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  }
}

export async function decryptApiKey(
  encrypted: string,
  iv: string,
  encryptionKey: string
): Promise<string> {
  const keyBuffer = Buffer.from(encryptionKey, "base64")
  const ivBuffer = Buffer.from(iv, "base64")
  const encryptedBuffer = Buffer.from(encrypted, "base64")

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  )

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    cryptoKey,
    encryptedBuffer
  )

  return new TextDecoder().decode(decryptedBuffer)
}
