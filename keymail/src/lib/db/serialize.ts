export function serializeMongoDocument(document: any) {
  if (!document) {
    return document;
  }

  const object = typeof document.toObject === "function" ? document.toObject() : document;
  if (!object || typeof object !== "object") {
    return object;
  }

  const id = object._id?.toString?.() ?? object.id;

  return {
    ...object,
    _id: object._id?.toString?.() ?? object._id,
    id,
  };
}
