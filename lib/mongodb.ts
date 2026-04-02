import { MongoClient } from "mongodb";

const options = {};

let clientPromise: Promise<MongoClient> | undefined;

declare global {
  var _eiMongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise() {
  if (clientPromise) {
    return clientPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Please define MONGODB_URI in your environment variables.");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._eiMongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._eiMongoClientPromise = client.connect();
    }

    clientPromise = global._eiMongoClientPromise;
    return clientPromise;
  }

  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
  return clientPromise;
}
