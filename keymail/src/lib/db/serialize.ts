type MongoObject = Record<string, unknown> & {
  toObject?: () => Record<string, unknown>;
};

function stringifyMongoId(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "toString" in value) {
    return String(value);
  }

  return undefined;
}

export function serializeMongoDocument<T extends Record<string, unknown> = Record<string, unknown>>(
  document: unknown
) {
  if (!document) {
    return document as null | undefined;
  }

  const source = document as MongoObject;
  const object = typeof source.toObject === "function" ? source.toObject() : source;
  if (!object || typeof object !== "object") {
    return object;
  }

  const id = stringifyMongoId(object._id) ?? stringifyMongoId(object.id);

  return {
    ...object,
    _id: stringifyMongoId(object._id) ?? object._id,
    id,
  } as T & { _id?: unknown; id?: string };
}
