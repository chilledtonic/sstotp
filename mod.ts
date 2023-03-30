import {decode as  b32decode, encode as b32encode} from "https://deno.land/std/encoding/base32.ts";

export async function checkToken(secret: string, token: string | number): Promise<boolean> {
  const tm = Math.floor(Date.now() / 30000); // Timestamp divided by 30 seconds to get time step
  const key = await crypto.subtle.importKey(
    "raw",
    b32decode(secret),
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign"],
  ); // convert the secret key to a SHA-1 HMAC hash

  //Create 8-byte buffer for timestamp and OTP
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  // generate OTPs for current, previous, and following 2 time steps
  // tolerance is for potential clock skew
  // adjust ix to generate different time steps
  for (let ix = -2; ix <= 2; ix++) {
    const i = (tm + ix) & 0xffffffff;
    view.setUint32(4, i); // Set timestamp in buffer
    // sign buffer with key to generate OTP
    const hm = await crypto.subtle.sign(
      "HMAC",
      key,
      buffer,
    );
    // extract 4-byte code from HMAC
    const bytes = new Uint8Array(hm);
    const offset = bytes[bytes.length - 1] & 0xf;
    const code = ((bytes[offset] & 0x7f) << 24) |
      ((bytes[offset + 1] & 0xff) << 16) |
      ((bytes[offset + 2] & 0xff) << 8) |
      (bytes[offset + 3] & 0xff);
    // truncate code and compare
    const truncatedCode = code % 1000000;
    if (token.toString() === truncatedCode.toString()) {
      return true;
    }
  }
  return false;
}

export async function generateToken(secret: string): Promise<number> {
  const tm = Math.floor(Date.now() / 30000); // Divide the current Unix timestamp by 30
  const key = await crypto.subtle.importKey(
    "raw",
    b32decode(secret),
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign"],
  );
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(4, tm);

  const hm = await crypto.subtle.sign("HMAC", key, buffer);
  const bytes = new Uint8Array(hm);
  const offset = bytes[bytes.length - 1] & 0xf;
  const code = ((bytes[offset] & 0x7f) << 24) |
    ((bytes[offset + 1] & 0xff) << 16) |
    ((bytes[offset + 2] & 0xff) << 8) |
    (bytes[offset + 3] & 0xff);
  const truncatedCode = code % 1000000;
  return truncatedCode;
}

export function generateSecret(length = 20): string {
  const buffer = crypto.getRandomValues(new Uint8Array(length));
  const encoded = b32encode(buffer);
  return encoded
}