import { checkToken, generateSecret, generateToken } from "./mod.ts";

Deno.bench(async function benchCheckToken() {
  await checkToken("7KI7EWAFOZPI4VK23IO6Y7SEV4E55P5Z", "838455")
});

Deno.bench(function benchSecret() {
  generateSecret()
});

Deno.bench(async function benchToken() {
  await generateToken("7KI7EWAFOZPI4VK23IO6Y7SEV4E55P5Z")
});
