# Super Simple TOTP 🦕

SSTOTP is as simple as it gets for a TOTP implementation. The libary can do the following:

1. Generate TOTP Secrets
2. Generate TOTP Tokens
3. Validate TOTP Tokens

Tokens are valid for 30 seconds, and a step tolerance of two is implemented to account for clock skew.

It has a single standard library dependency, which is [base32](https://deno.land/std@0.181.0/encoding/base32.ts).

At this time, it is considered feature complete. Generating [otpauth://](https://github.com/google/google-authenticator/wiki/Key-Uri-Format) QR codes is left as an exercise to the reader.

# Usage
```javascript
import sstotp from "https://deno.land/x/sstotp/mod.ts";

// Generate a Base32 Secret Key
const secret = sstotp.genSecret();

// Generate a OTP for a given secret
const token = await sstotp.genToken(secret)

// Check Validity of Tokens
const isValid = await sstotp.chkToken(secret, token)
```