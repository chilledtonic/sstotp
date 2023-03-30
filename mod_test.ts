import { assertEquals, assertExists } from "https://deno.land/std/testing/asserts.ts";
import { checkToken, generateSecret, generateToken } from "./mod.ts";

Deno.test("generateSecret returns successfully", () => {
    const secret = generateSecret();
    assertExists(secret)
})

Deno.test("generateToken returns successfully", () => {
    const secret = generateSecret();
    const token = generateToken(secret);
    assertExists(token)
})

Deno.test("checkToken validates OTPs successfully", async () => {
    const secret = generateSecret();
    const token = await generateToken(secret);
    const result = await checkToken(secret, token);
    assertEquals(result, true);
});