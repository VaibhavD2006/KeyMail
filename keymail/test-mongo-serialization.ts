import assert from "node:assert/strict";
import { Client, Listing, PropertyMatch, Showing } from "./src/lib/db/models";

// Run with: npx tsx test-mongo-serialization.ts

function assertSerializedId(modelName: string, document: any) {
  const expectedId = document._id.toString();
  const objectValue = document.toObject();
  const jsonValue = document.toJSON();

  assert.equal(
    objectValue.id,
    expectedId,
    `${modelName}.toObject() should expose id for dashboard actions`
  );
  assert.equal(
    jsonValue.id,
    expectedId,
    `${modelName}.toJSON() should expose id for API responses`
  );
}

assertSerializedId(
  "Client",
  new Client({
    userId: "user-1",
    name: "Test Client",
    email: "client@example.com",
  })
);

assertSerializedId(
  "Listing",
  new Listing({
    userId: "user-1",
    mlsId: "MLS-123",
    address: "123 Main St",
    city: "Townsville",
    state: "CA",
    zipCode: "90210",
    price: 500000,
  })
);

assertSerializedId(
  "PropertyMatch",
  new PropertyMatch({
    userId: "user-1",
    clientId: "client-1",
    listingId: "listing-1",
    matchScore: 95,
    reasons: ["Great fit"],
  })
);

assertSerializedId(
  "Showing",
  new Showing({
    userId: "user-1",
    clientId: "client-1",
    listingId: "listing-1",
    scheduledAt: new Date("2026-01-01T12:00:00.000Z"),
  })
);

console.log("Mongo model serialization exposes dashboard id fields.");
