import {
  decode as b32decode,
  encode as b32encode,
} from "https://deno.land/std/encoding/base32.ts";

// check if TOTP token is valid
// returns boolean
async function chkToken(
  secret: string,
  token: string | number,
): Promise<boolean> {
  const key = await getKey(secret);
  // Tolerance checks multiple keys to account for clock skew
  const tolerance = 2;
  // Timestamp divided by 30 seconds to get time step
  const currentTime = Math.floor(Date.now() / 30000);
  for (let i = -tolerance; i <= tolerance; i++) {
    const timestamp = (currentTime + i) & 0xffffffff;
    const generatedToken = await genToken(key, timestamp);
    if (token.toString() === generatedToken.toString()) {
      return true;
    }
  }
  return false;
}

async function genToken(
  key: CryptoKey | string,
  timestamp: number,
): Promise<number> {
  //If inputted with a secret string, convert to HMAC
  if (typeof (key) == "string") {
    key = await getKey(key);
  }
  //Create 8-byte buffer for timestamp and OTP
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  // Set timestamp in buffer
  view.setUint32(4, timestamp);
  // sign buffer with key to generate OTP
  const hm = await crypto.subtle.sign("HMAC", key, buffer);
  // extract 4-byte code from HMAC
  const bytes = new Uint8Array(hm);
  const offset = bytes[bytes.length - 1] & 0xf;
  const code = ((bytes[offset] & 0x7f) << 24) |
    ((bytes[offset + 1] & 0xff) << 16) |
    ((bytes[offset + 2] & 0xff) << 8) |
    (bytes[offset + 3] & 0xff);
  // truncate code 
  const truncatedCode = code % 1000000;
  return truncatedCode;
}

// convert the secret key to a SHA-1 HMAC hash
async function getKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    b32decode(secret),
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign"],
  );
}

function genSecret(length = 20): string {
  const buffer = crypto.getRandomValues(new Uint8Array(length));
  const encoded = b32encode(buffer).replace(/=/g, "");
  return encoded;
}

const sstotp = {
  genSecret,
  genToken,
  chkToken
}

export default sstotp;