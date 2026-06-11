import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "./src/lib/auth/password";
import {
  buildClientOwnershipQuery,
  sanitizeClientUpdateData,
} from "./src/lib/db/queries-mongodb";

async function main() {
  const passwordHash = await hashPassword("correct-password");

  assert.match(passwordHash, /^scrypt:/);
  assert.equal(await verifyPassword("correct-password", passwordHash), true);
  assert.equal(await verifyPassword("wrong-password", passwordHash), false);
  assert.equal(await verifyPassword("anything", null), false);

  assert.deepEqual(buildClientOwnershipQuery("client-id", "user-id"), {
    _id: "client-id",
    userId: "user-id",
  });
  assert.deepEqual(buildClientOwnershipQuery("client-id"), {
    _id: "client-id",
  });

  assert.deepEqual(
    sanitizeClientUpdateData({
      _id: "other-client",
      id: "other-client",
      userId: "other-user",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      name: "Updated Client",
    }),
    { name: "Updated Client" }
  );

  console.log("Security regression checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
