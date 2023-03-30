import { assertEquals, assertExists } from "https://deno.land/std/testing/asserts.ts";
import sstotp from "./mod.ts";

Deno.test("genSecret returns successfully", () => {
    const secret = sstotp.genSecret();
    assertExists(secret)
})

Deno.test("genToken returns successfully", async () => {
    const token = await sstotp.genToken("7KI7EWAFOZPI4VK23IO6Y7SEV4E55P5Z", 56006746)
    assertEquals(token, 435356)
})

Deno.test("chckToken validates OTPs successfully", async () => {
    const secret = sstotp.genSecret();
    const tstamp = Math.floor(Date.now() / 30000);
    const token = await sstotp.genToken(secret, tstamp)
    const result = await sstotp.chkToken(secret, token);
    assertEquals(result, true);
});