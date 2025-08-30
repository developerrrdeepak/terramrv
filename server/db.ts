import type { Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;
let db: any | null = null;

function createMemoryDb(): Db {
  const store: Record<string, any[]> = {
    users: [],
    otps: [],
  };
  function match(doc: any, query: any): boolean {
    return Object.entries(query || {}).every(([k, v]: any) => {
      if (v && typeof v === "object" && "$gt" in v) {
        return doc[k] > v.$gt;
      }
      return doc[k] === v;
    });
  }
  function collection(name: string) {
    (store as any)[name] ||= [];
    const arr = (store as any)[name] as any[];
    return {
      async findOne<T = any>(query: any): Promise<T | null> {
        return (arr.find((d) => match(d, query)) as any) ?? null;
      },
      async insertOne(doc: any) {
        const _id = doc._id || String(Date.now()) + Math.random().toString(16).slice(2);
        const toInsert = { ...doc, _id };
        arr.push(toInsert);
        return { insertedId: _id } as any;
      },
      async updateOne(filter: any, update: any) {
        const idx = arr.findIndex((d) => match(d, filter));
        if (idx >= 0 && update && update.$set) {
          arr[idx] = { ...arr[idx], ...update.$set };
          return { matchedCount: 1, modifiedCount: 1 } as any;
        }
        return { matchedCount: 0, modifiedCount: 0 } as any;
      },
      async countDocuments() {
        return arr.length;
      },
      async deleteOne(filter: any) {
        const idx = arr.findIndex((d) => match(d, filter));
        if (idx >= 0) {
          arr.splice(idx, 1);
          return { deletedCount: 1 } as any;
        }
        return { deletedCount: 0 } as any;
      },
      async find(query: any) {
        const results = arr.filter((d) => match(d, query));
        return { toArray: async () => results } as any;
      },
    } as any;
  }
  return { collection } as any;
}

export async function getDb(): Promise<Db> {
  if (db) return db as Db;
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "app";
  if (!uri) {
    console.warn("MONGODB_URI not set. Using in-memory DB.");
    db = createMemoryDb();
    return db as Db;
  }
  try {
    const { MongoClient } = await import("mongodb");
    client = new MongoClient(uri);
    await client.connect();
    db = (client as any).db(dbName);
    return db as Db;
  } catch (e) {
    console.warn("Mongo connection failed. Falling back to in-memory DB:", (e as any)?.message || e);
    db = createMemoryDb();
    return db as Db;
  }
}

export async function closeDb() {
  await (client as any)?.close?.();
  client = null;
  db = null;
}
