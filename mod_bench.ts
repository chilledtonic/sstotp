import { chkToken, genSecret, genToken } from "./mod.ts";

Deno.bench(async function benchCheckToken() {
  await chkToken("7KI7EWAFOZPI4VK23IO6Y7SEV4E55P5Z", "838455")
});

Deno.bench(function benchSecret() {
  genSecret()
});

Deno.bench(async function benchToken() {
  const tstamp = 56006746
  await genToken("7KI7EWAFOZPI4VK23IO6Y7SEV4E55P5Z", 56006746)
});
